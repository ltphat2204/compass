import { execFile } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const dispatcher = fileURLToPath(new URL('../../hooks/compass.py', import.meta.url));
const internal = 'compass.completionContinuation';

async function dispatch(cwd, hook, fields = {}) {
  let output;
  try {
    output = await new Promise((resolve, reject) => {
      const child = execFile('python3', [dispatcher], { cwd, encoding: 'utf8' }, (error, stdout, stderr) => {
        if (error) reject(new Error(stderr.trim() || error.message));
        else resolve(stdout);
      });
      child.stdin.on('error', reject);
      child.stdin.end(JSON.stringify({ cwd, hook_event_name: hook, ...fields }));
    });
  } catch (error) {
    throw new Error(`Compass ${hook}: Python dispatcher failed; check python3 and hooks/compass.py. ${error.message}`);
  }
  let result;
  try { result = JSON.parse(output); } catch {
    throw new Error(`Compass ${hook}: dispatcher returned invalid JSON.`);
  }
  const object = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
  const details = result?.hookSpecificOutput;
  if (!object(result) || (result.systemMessage !== undefined && typeof result.systemMessage !== 'string') ||
      (result.decision !== undefined && result.decision !== 'block') ||
      (result.decision === 'block' && typeof result.reason !== 'string') ||
      (details !== undefined && (!object(details) ||
        (details.additionalContext !== undefined && typeof details.additionalContext !== 'string') ||
        (details.permissionDecision !== undefined && details.permissionDecision !== 'deny') ||
        (details.permissionDecision === 'deny' && typeof details.permissionDecisionReason !== 'string')))) {
    throw new Error(`Compass ${hook}: dispatcher returned an invalid response schema.`);
  }
  return result;
}

export default {
  id: 'compass',
  async setup(ctx) {
    const cwd = ctx.location.directory;
    const sessions = new Map();
    const controller = new AbortController();
    const registrations = [];
    const observe = (event) => {
      if (typeof event.sessionID !== 'string' || !event.sessionID) throw new Error('Compass: lifecycle event is missing its session ID.');
      if (!sessions.has(event.sessionID)) sessions.set(event.sessionID, false);
    };
    const message = (result) => [result.systemMessage, result.hookSpecificOutput?.additionalContext].filter(Boolean).join('\n\n');
    const report = (error) => console.error(error instanceof Error ? error.message : 'Compass: lifecycle operation failed.');
    try {
      registrations.push(await ctx.session.hook('prompt', async (event) => {
        observe(event);
        if (event.metadata?.[internal] !== true) sessions.set(event.sessionID, false);
        const context = message(await dispatch(cwd, 'UserPromptSubmit', { session_id: event.sessionID, prompt: event.prompt.text }));
        if (context) event.prompt.text += '\n\n' + context;
      }));
      registrations.push(await ctx.tool.hook('execute.before', async (event) => {
        observe(event);
        const names = { write: 'Write', edit: 'Edit', patch: 'apply_patch', shell: 'Bash' };
        const input = event.tool === 'patch' ? { patch: event.input.patchText } : event.input;
        const result = await dispatch(cwd, 'PreToolUse', { session_id: event.sessionID, tool_name: names[event.tool] || event.tool, tool_input: input });
        if (result.systemMessage) throw new Error(result.systemMessage);
        if (result.hookSpecificOutput?.permissionDecision === 'deny') throw new Error(result.hookSpecificOutput.permissionDecisionReason);
      }));
      registrations.push(await ctx.tool.hook('execute.after', async (event) => {
        observe(event);
        const context = message(await dispatch(cwd, 'PostToolUse', { session_id: event.sessionID }));
        if (!context) return;
        if (event.status === 'completed' && typeof event.result?.content === 'string') event.result.content += '\n\n' + context;
        else if (event.status === 'completed' && Array.isArray(event.result?.content)) event.result.content.push({ type: 'text', text: context });
        else report(new Error(context));
      }));
    } catch (error) {
      await Promise.all(registrations.map((registration) => registration.dispose()));
      throw error;
    }
    const stream = (async () => {
      try {
        for await (const event of ctx.event.subscribe({ signal: controller.signal })) {
          const sessionID = event.data?.sessionID;
          if (controller.signal.aborted) break;
          if (event.type !== 'session.execution.succeeded' || !sessions.has(sessionID)) continue;
          try {
            const result = await dispatch(cwd, 'Stop', { session_id: sessionID, stop_hook_active: sessions.get(sessionID) });
            if (controller.signal.aborted) break;
            if (result.decision === 'block' && !sessions.get(sessionID)) {
              sessions.set(sessionID, true);
              await ctx.session.prompt({ sessionID, text: result.reason, metadata: { [internal]: true } });
            } else if (message(result)) report(new Error(message(result)));
          } catch (error) { report(error); }
        }
      } catch (error) {
        if (!controller.signal.aborted || error?.name !== 'AbortError') report(error);
      }
    })();
    return async () => {
      controller.abort();
      await Promise.all(registrations.map((registration) => registration.dispose()));
      await stream;
    };
  },
};
