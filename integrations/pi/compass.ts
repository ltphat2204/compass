import { execFile } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const dispatcher = fileURLToPath(new URL('../../hooks/compass.py', import.meta.url));

function dispatch(cwd, hook, fields = {}) {
  return new Promise((resolve, reject) => {
    const child = execFile('python3', [dispatcher], { cwd, encoding: 'utf8' }, (error, stdout, stderr) => {
      if (error) reject(new Error(stderr.trim() || error.message));
      else {
        try { resolve(JSON.parse(stdout)); }
        catch { reject(new Error(`Compass ${hook}: dispatcher returned invalid JSON.`)); }
      }
    });
    child.stdin.on('error', reject);
    child.stdin.end(JSON.stringify({ cwd, hook_event_name: hook, ...fields }));
  });
}

function message(result) {
  return [result.systemMessage, result.hookSpecificOutput?.additionalContext].filter(Boolean).join('\n\n');
}

export default function (pi) {
  let completionContinuationUsed = false;

  pi.on('before_agent_start', async (event, ctx) => {
    if (event.messageType !== 'user') return;
    completionContinuationUsed = false;
    try {
      const result = await dispatch(ctx.cwd, 'UserPromptSubmit', { prompt: event.prompt });
      const context = message(result);
      return context ? { message: { customType: 'compass', content: context, display: false } } : undefined;
    } catch (error) {
      console.error(`Compass UserPromptSubmit: ${error.message}`);
    }
  });

  pi.on('tool_call', async (event, ctx) => {
    try {
      const names = { write: 'Write', edit: 'Edit', bash: 'Bash' };
      const result = await dispatch(ctx.cwd, 'PreToolUse', {
        tool_name: names[event.toolName] || event.toolName,
        tool_input: event.input,
      });
      if (result.systemMessage) return { block: true, reason: result.systemMessage };
      const reason = result.hookSpecificOutput?.permissionDecisionReason;
      if (result.hookSpecificOutput?.permissionDecision === 'deny') return { block: true, reason };
    } catch (error) {
      return { block: true, reason: `Compass PreToolUse failed closed: ${error.message}` };
    }
  });

  pi.on('tool_result', async (event, ctx) => {
    try {
      const names = { write: 'Write', edit: 'Edit', bash: 'Bash' };
      const result = await dispatch(ctx.cwd, 'PostToolUse', {
        tool_name: names[event.toolName] || event.toolName,
        tool_input: event.input,
      });
      const context = message(result);
      if (context) return { content: [...event.content, { type: 'text', text: context }], ...(event.structuredContent === undefined ? {} : { structuredContent: event.structuredContent }) };
    } catch (error) {
      console.error(`Compass PostToolUse: ${error.message}`);
    }
  });

  pi.on('agent_before_settle', async (_event, ctx) => {
    let result;
    try {
      result = await dispatch(ctx.cwd, 'Stop', { stop_hook_active: completionContinuationUsed });
    } catch (error) {
      result = { decision: 'block', reason: `Compass Stop failed: ${error.message}` };
    }
    const reason = result.reason || message(result);
    if (result.decision === 'block' && !completionContinuationUsed) {
      completionContinuationUsed = true;
      return { entries: [{ type: 'custom_message', customType: 'compass', content: reason, display: true }], continue: true };
    }
    if (reason) return { entries: [{ type: 'custom_message', customType: 'compass', content: reason, display: true }] };
  });
}
