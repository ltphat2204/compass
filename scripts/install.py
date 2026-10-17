#!/usr/bin/env python3
"""Manage project-local Compass skills with verified file ownership."""
import argparse
import hashlib
import json
import os
from pathlib import Path, PurePosixPath
import re
import shutil
import subprocess
import sys
import tempfile

# Resolve the sibling module without depending on a caller's sys.path.
import importlib.util

_portability_spec = importlib.util.spec_from_file_location(
    "compass_portability", Path(__file__).with_name("check_portability.py"))
_portability = importlib.util.module_from_spec(_portability_spec)
_portability_spec.loader.exec_module(_portability)
HOST_PATHS = _portability.HOST_PATHS
SKILL_NAMES = _portability.SKILL_NAMES
validate = _portability.validate

_agents_spec = importlib.util.spec_from_file_location(
    "compass_host_agents", Path(__file__).with_name("host_agents.py"))
_agents = importlib.util.module_from_spec(_agents_spec)
_agents_spec.loader.exec_module(_agents)
render_agents = _agents.render_agents
native_paths = _agents.native_paths


def no_symlinks(path):
    for component in (path,) + tuple(path.parents):
        if component.is_symlink():
            raise ValueError(f"Symlink path is not allowed: {component}")


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def source_files(source):
    no_symlinks(source)
    errors = validate(source)
    if errors:
        raise ValueError("Invalid source package: " + "; ".join(errors))
    files = {}
    for name in SKILL_NAMES:
        for path in sorted((source / name).rglob("*")):
            no_symlinks(path)
            if path.is_file():
                files[path.relative_to(source).as_posix()] = path
            elif not path.is_dir():
                raise ValueError(f"Unsupported source resource: {path}")
    return files


def revision(source):
    try:
        result = subprocess.run(["git", "-C", str(source), "rev-parse", "HEAD"],
                                capture_output=True, text=True, check=True)
        value = result.stdout.strip()
        return value if re.fullmatch(r"[0-9a-f]{40}|[0-9a-f]{64}", value) else None
    except (OSError, subprocess.CalledProcessError):
        return None


def unique_object(pairs):
    result = {}
    for key, value in pairs:
        if key in result:
            raise ValueError(f"Duplicate manifest key: {key}")
        result[key] = value
    return result


def load_manifest(path, agent):
    no_symlinks(path)
    try:
        manifest = json.loads(path.read_text(encoding="utf-8"), object_pairs_hook=unique_object)
    except (OSError, UnicodeError, json.JSONDecodeError) as error:
        raise ValueError(f"Cannot read ownership manifest {path}: {error}; compare/back up legacy installations before installing") from error
    if not isinstance(manifest, dict) or set(manifest) != {"schema_version", "host", "source_revision", "files"}:
        raise ValueError("Invalid ownership manifest schema")
    if type(manifest["schema_version"]) is not int or manifest["schema_version"] != 1 or manifest["host"] != agent:
        raise ValueError("Invalid ownership manifest version or host")
    rev = manifest["source_revision"]
    if rev is not None and (not isinstance(rev, str) or not re.fullmatch(r"[0-9a-fA-F]{40}|[0-9a-fA-F]{64}", rev)):
        raise ValueError("Invalid source revision in ownership manifest")
    files = manifest["files"]
    if not isinstance(files, dict) or not files:
        raise ValueError("Invalid ownership file map")
    prefix = HOST_PATHS[agent] + "/"
    for name, value in files.items():
        if not isinstance(name, str) or not isinstance(value, str) or not re.fullmatch(r"[0-9a-fA-F]{64}", value):
            raise ValueError("Invalid ownership path/hash pair")
        relative = PurePosixPath(name)
        parts = relative.parts
        if (relative.is_absolute() or relative.as_posix() != name or "\\" in name
                or any(part in {"", ".", ".."} for part in name.split("/"))):
            raise ValueError(f"Invalid ownership path: {name}")
        if name in native_paths(agent):
            continue
        if not name.startswith(prefix):
            raise ValueError(f"Out-of-scope ownership path: {name}")
        payload = name[len(prefix):].split("/")
        if len(payload) < 2 or payload[0] not in SKILL_NAMES:
            raise ValueError(f"Out-of-scope ownership path: {name}")
    return manifest


def prune_empty(path, boundary):
    while path != boundary and boundary in path.parents:
        try:
            path.rmdir()
        except OSError:
            break
        path = path.parent


def manage(agent, project, source, operation="install", dry_run=False):
    project = Path(project).expanduser().resolve(strict=True)
    if not project.is_dir():
        raise ValueError("Project must be an existing directory")
    source = Path(source).expanduser().resolve(strict=False)
    if operation != "uninstall" and not source.is_dir():
        raise ValueError(f"Source must be an existing directory: {source}")
    destination = project / HOST_PATHS[agent]
    manifest_path = project / ".compass" / f"install-{agent}.json"
    no_symlinks(destination)
    no_symlinks(manifest_path)
    if manifest_path.parent.exists() and not manifest_path.parent.is_dir():
        raise ValueError(f"Manifest parent is not a directory: {manifest_path.parent}")
    # Snapshot source bytes before mutation, so the ownership hashes describe the copy.
    sources = {} if operation == "uninstall" else source_files(source)
    desired = {(Path(HOST_PATHS[agent]) / name).as_posix(): path.read_bytes()
               for name, path in sources.items()}
    roles = {} if operation == "uninstall" else render_agents(source, agent)
    desired.update(roles)
    hashes = {name: hashlib.sha256(data).hexdigest() for name, data in desired.items()}
    old = {}
    if operation == "install":
        if manifest_path.exists():
            raise FileExistsError(f"Ownership manifest already exists: {manifest_path}")
        collisions = [destination / name for name in SKILL_NAMES
                      if (destination / name).exists() or (destination / name).is_symlink()]
        if collisions:
            raise FileExistsError("Skill already exists (compare/back up legacy installations): " + ", ".join(map(str, collisions)))
    else:
        old = load_manifest(manifest_path, agent)["files"]
        for name, expected in old.items():
            path = project / name
            no_symlinks(path)
            if not path.is_file() or digest(path).lower() != expected.lower():
                raise ValueError(f"Owned file missing or modified: {path}")
        # A redirected extra resource is unsafe even if absent from the file map.
        for name in SKILL_NAMES:
            root = destination / name
            no_symlinks(root)
            if root.exists():
                for path in root.rglob("*"):
                    no_symlinks(path)
    for name in desired:
        path = project / name
        no_symlinks(path)
        if name not in old and path.exists():
            raise FileExistsError(f"Untracked file collision: {path}")
        for parent in path.parents:
            if parent == project:
                break
            if parent.exists() and not parent.is_dir():
                raise FileExistsError(f"Destination parent is not a directory: {parent}")
    if operation == "check":
        if {key: value.lower() for key, value in old.items()} != hashes:
            raise ValueError("Installation is stale: tracked files differ from current source; run --update")
        errors = validate(destination)
        if errors:
            raise ValueError("Invalid installed resources: " + "; ".join(errors))
        print(f"Compass installation is current: {destination}")
        return destination
    removed = sorted(set(old) - set(desired))
    changed = sorted(name for name in desired if old.get(name, "").lower() != hashes[name])
    for name in removed:
        print(f"DELETE {project / name}")
    for name in changed:
        print(f"{'UPDATE' if name in old else 'CREATE'} {project / name}")
    if dry_run:
        print(f"{'DELETE' if operation == 'uninstall' else 'WRITE'} {manifest_path}")
        return destination
    if operation == "install":
        created = []
        created_roles = []
        manifest_created = False
        try:
            destination.mkdir(parents=True, exist_ok=True)
            for name in SKILL_NAMES:
                target = destination / name
                target.mkdir()  # Claim each root without adopting a concurrent installation.
                created.append(target)
            for name in SKILL_NAMES:
                shutil.copytree(source / name, destination / name, dirs_exist_ok=True)
            for name, data in roles.items():
                target = project / name
                target.parent.mkdir(parents=True, exist_ok=True)
                with target.open("xb") as stream:
                    created_roles.append(target)
                    stream.write(data)
            installed_hashes = {name: digest(project / name) for name in desired}
            if installed_hashes != hashes or render_agents(source, agent) != roles:
                raise ValueError("Source changed while copying; installation rolled back")
            manifest_path.parent.mkdir(parents=True, exist_ok=True)
            manifest = {"schema_version": 1, "host": agent,
                        "source_revision": revision(source), "files": hashes}
            with manifest_path.open("x", encoding="utf-8") as stream:
                manifest_created = True
                json.dump(manifest, stream, indent=2)
                stream.write("\n")
        except Exception:
            if manifest_created:
                manifest_path.unlink()
            for target in reversed(created_roles):
                target.unlink()
            for target in reversed(created):
                shutil.rmtree(target)
            raise
    else:
        backup = Path(tempfile.mkdtemp(prefix=".compass-recovery-", dir=project))
        mutated = []
        created_dirs = []
        retain_backup = False
        try:
            # Keep independent original bytes until ownership commits successfully.
            originals = removed + [name for name in changed if name in old]
            for name in originals:
                saved = backup / "original" / name
                saved.parent.mkdir(parents=True, exist_ok=True)
                shutil.copyfile(project / name, saved)
            shutil.copyfile(manifest_path, backup / "manifest-original")
            for name in changed:
                staged = backup / "staged" / name
                staged.parent.mkdir(parents=True, exist_ok=True)
                staged.write_bytes(desired[name])
            if operation != "uninstall":
                manifest = {"schema_version": 1, "host": agent,
                            "source_revision": revision(source), "files": hashes}
                (backup / "manifest-staged").write_text(
                    json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
            try:
                for name in removed:
                    (project / name).unlink()
                    mutated.append(name)
                for name in changed:
                    path = project / name
                    missing = []
                    parent = path.parent
                    while not parent.exists():
                        missing.append(parent)
                        parent = parent.parent
                    for parent in reversed(missing):
                        parent.mkdir()
                        created_dirs.append(parent)
                    os.replace(backup / "staged" / name, path)
                    mutated.append(name)
                if operation == "uninstall":
                    manifest_path.unlink()
                else:
                    os.replace(backup / "manifest-staged", manifest_path)
            except (OSError, ValueError) as error:
                recovery_errors = []
                for name in reversed(mutated):
                    try:
                        if name in old:
                            saved = backup / "restore"
                            shutil.copyfile(backup / "original" / name, saved)
                            os.replace(saved, project / name)
                        else:
                            (project / name).unlink()
                    except (OSError, ValueError) as recovery_error:
                        recovery_errors.append(str(recovery_error))
                try:
                    saved = backup / "restore-manifest"
                    shutil.copyfile(backup / "manifest-original", saved)
                    os.replace(saved, manifest_path)
                except (OSError, ValueError) as recovery_error:
                    recovery_errors.append(str(recovery_error))
                for parent in reversed(created_dirs):
                    try:
                        parent.rmdir()
                    except OSError:
                        pass
                if recovery_errors:
                    retain_backup = True
                    raise OSError(f"Recovery failed; original backup retained at {backup}: "
                                  + "; ".join(recovery_errors)) from error
                raise
        finally:
            if not retain_backup:
                shutil.rmtree(backup)
        for name in removed:
            boundary = project / PurePosixPath(name).parts[0] if name in native_paths(agent) else destination
            prune_empty((project / name).parent, boundary)
        if operation == "uninstall":
            prune_empty(manifest_path.parent, project)
    return destination


def install(agent, project, source):
    return manage(agent, project, source)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--agent", choices=HOST_PATHS, required=True)
    parser.add_argument("--project", type=Path, required=True,
                        help="Existing project directory; no global installation")
    parser.add_argument("--dry-run", action="store_true")
    actions = parser.add_mutually_exclusive_group()
    for action in ("check", "update", "uninstall"):
        actions.add_argument("--" + action, action="store_const", const=action, dest="operation")
    args = parser.parse_args()
    source = Path(__file__).resolve().parents[1] / ".agents/skills"
    try:
        destination = manage(args.agent, args.project, source, args.operation or "install", args.dry_run)
    except (OSError, ValueError) as error:
        print(f"Installation stopped: {error}", file=sys.stderr)
        return 1
    if not args.dry_run and args.operation != "check":
        print(f"Compass {args.operation or 'install'} completed: {destination}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
