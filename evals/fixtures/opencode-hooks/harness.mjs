import { pathToFileURL } from 'node:url';

const hooks = new Map(), prompts = [], diagnostics = [];
let disposed = 0, subscriptionSignal, waiting, queue = [], ended = false;
const register = async (name, fn) => {
  hooks.set(name, fn);
  return { async dispose() { disposed++; hooks.delete(name); } };
};
const ctx = {
  location: { directory: process.env.PROJECT },
  session: {
    hook: register,
    prompt: async request => {
      prompts.push(request);
      await hooks.get('prompt')({ sessionID: request.sessionID, prompt: { text: request.text }, metadata: request.metadata });
    },
  },
  tool: { hook: register },
  event: { subscribe({ signal }) {
    subscriptionSignal = signal;
    signal.addEventListener('abort', () => { ended = true; waiting?.({ done: true }); });
    return { [Symbol.asyncIterator]() { return this; }, next() {
      if (queue.length) return Promise.resolve({ value: queue.shift(), done: false });
      if (ended) return Promise.resolve({ done: true });
      return new Promise(resolve => { waiting = resolve; });
    } };
  } },
};
console.error = (...args) => diagnostics.push(args.join(' '));
const plugin = (await import(pathToFileURL(process.env.ADAPTER))).default;
if (plugin.id !== 'compass') throw Error('incorrect plugin identity');
const cleanup = await plugin.setup(ctx);
const call = async (name, data) => {
  try { return { value: await hooks.get(name)(data), data }; }
  catch (error) { return { error: String(error), data }; }
};
const pause = () => new Promise(resolve => setTimeout(resolve, 180));
const emit = async (type, sessionID) => {
  const value = { type, data: { sessionID } };
  if (waiting) { const resolve = waiting; waiting = undefined; resolve({ value, done: false }); }
  else queue.push(value);
  await pause();
};
let output;
switch (process.env.SCENARIO) {
  case 'mapping': {
    output = [];
    for (const [tool, input] of [
      ['write', { path: 'test.txt', content: 'replacement' }],
      ['edit', { path: 'test.txt', oldString: 'frozen', newString: 'replacement' }],
      ['patch', { patchText: '*** Begin Patch\n*** Update File: test.txt\n@@\n-frozen\n+replacement\n*** End Patch' }],
      ['write', { path: 'other.txt', content: 'allowed' }],
      ['shell', { command: 'echo harmless' }],
    ]) output.push(await call('execute.before', { tool, input, sessionID: 'one' }));
    break;
  }
  case 'prompt':
    output = await call('prompt', { sessionID: 'one', prompt: { text: 'Keep my exact request.' }, marker: 7 });
    break;
  case 'after': {
    output = [];
    for (const content of ['original output', [{ type: 'text', text: 'original output' }, { type: 'image', url: 'keep-image' }]]) {
      output.push(await call('execute.after', { tool: 'edit', sessionID: 'one', input: { path: 'src.txt' }, status: 'completed', result: { content, marker: 9 } }));
    }
    output.push(await call('execute.after', { tool: 'edit', sessionID: 'one', input: { path: 'src.txt' }, status: 'error', error: { message: 'actual failure', code: 3 }, result: { content: 'failure detail', marker: 9 } }));
    break;
  }
  case 'events': {
    await emit('session.execution.succeeded', 'unknown');
    await call('prompt', { sessionID: 'one', prompt: { text: 'external request' } });
    await emit('session.execution.failed', 'one');
    const initial = prompts.length;
    await emit('session.execution.succeeded', 'one');
    const first = prompts.length;
    await emit('session.execution.succeeded', 'one');
    const repeated = prompts.length;
    await call('prompt', { sessionID: 'two', prompt: { text: 'another session' } });
    await emit('session.execution.succeeded', 'two');
    const secondSession = prompts.length;
    await call('prompt', { sessionID: 'one', prompt: { text: 'new external request' } });
    await emit('session.execution.succeeded', 'one');
    await call('execute.before', { tool: 'shell', sessionID: 'before-only', input: { command: 'echo harmless' } });
    await emit('session.execution.succeeded', 'before-only');
    await call('execute.after', { tool: 'edit', sessionID: 'after-only', input: { path: 'src.txt' }, status: 'completed', result: { content: 'done' } });
    await emit('session.execution.succeeded', 'after-only');
    output = { initial, first, repeated, secondSession, prompts };
    break;
  }
  default: throw Error('unknown scenario');
}
await cleanup();
await pause();
process.stdout.write(JSON.stringify({ output, disposed, aborted: subscriptionSignal?.aborted, diagnostics }));
