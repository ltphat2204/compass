# Mandatory spec archive closeout

Mode: light. Risk: low; workflow documentation and preservation of completed artifacts, no production runtime changes.

User decisions: require every created spec to be archived when complete; remove harness-portability-evidence; archive accepted Pi work; ship these changes. Existing edits and local archive results were accepted before the shipping request. Remote merge and release are not explicitly authorized.

- AC-01: ship executes verified archive in the same workflow; task DONE alone cannot close the lifecycle. Pending/failed/deferred delivery or archival stays explicit.
- AC-02: archive targets the known feature/root, preserves artifacts/links, handles collision and interrupted resume, and leaves unfinished work active.
- AC-03: preserve completed lifecycle-hooks, lifecycle-hooks-opencode and Pi artifacts under the dated archive, delete only the requested local evidence directory, and keep harness-portability pending.
- AC-04: deliver a reviewed, verified commit and PR against main containing the workflow corrections and archive moves. No release or production changes.
