#!/usr/bin/env python3
"""Build a skills-only ZIP for the OpenAI plugin submission portal."""
import argparse
import json
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile

from check_portability import validate

ROOT = Path(__file__).resolve().parents[1]


def main():
    manifest = json.loads((ROOT / ".codex-plugin/plugin.json").read_text())
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, default=ROOT / "dist" / f"compass-{manifest['version']}.zip")
    args = parser.parse_args()
    errors = validate(ROOT)
    if errors:
        parser.error("\n".join(errors))
    manifest["skills"] = "./skills/"
    args.output.parent.mkdir(parents=True, exist_ok=True)
    with ZipFile(args.output, "x", ZIP_DEFLATED) as archive:
        archive.writestr(".codex-plugin/plugin.json", json.dumps(manifest, indent=2) + "\n")
        for source, destination in ((ROOT / ".agents/skills", "skills"), (ROOT / "assets", "assets")):
            for path in sorted(source.rglob("*")):
                if path.is_file():
                    archive.write(path, str(Path(destination) / path.relative_to(source)))
    print(args.output)


if __name__ == "__main__":
    main()
