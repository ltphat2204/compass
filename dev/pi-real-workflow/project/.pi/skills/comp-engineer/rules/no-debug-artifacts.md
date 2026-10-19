# No Debug Artifacts

Review the change for temporary debugging code introduced by the task, including `debugger` statements, temporary logs, commented-out experiments, and mock code or diagnostics used only during debugging.

Temporary diagnostics may be used during implementation and testing. If they remain in the reviewed change after the cause and fix are established, report them as findings for the implementer to remove. Keep intentional production logging, diagnostics, test mocks, and explanatory comments. Do not expand scope by cleaning unrelated pre-existing code.
