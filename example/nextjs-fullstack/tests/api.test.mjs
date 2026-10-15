import {test} from 'node:test';
import {cases,transport} from './contract.mjs';
const api = transport(process.env.TEST_BASE_URL || 'http://127.0.0.1:3102');
for (const [name,run] of Object.entries(cases)) test(name, () => run(api));
