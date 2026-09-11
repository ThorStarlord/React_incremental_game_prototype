#!/usr/bin/env node
const path = require('path');
const { createModel, formatTrace, traceTarget } = require('./content-graph');
const { applyRepositoryPolicy } = require('./repository-policy');

function parseArgs(argv) {
  const args = { json: false, target: null };
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === '--json') args.json = true;
    else if (value === '--target') args.target = argv[index += 1];
    else if (!args.target && !value.startsWith('--')) args.target = value;
  }
  return args;
}

const args = parseArgs(process.argv.slice(2));
if (!args.target) {
  console.error('Usage: npm run route:trace -- --target <entity-id-or-type:id> [--json]');
  process.exit(2);
}

const root = path.resolve(__dirname, '..', '..');
const model = applyRepositoryPolicy(createModel(root));
if (model.issues.length > 0) {
  for (const issue of model.issues) console.error(`ERROR ${issue.code}: ${issue.message}`);
  process.exit(1);
}

const trace = traceTarget(model, args.target);
if (!trace) {
  console.error(`Unknown content target: ${args.target}`);
  process.exit(2);
}

if (args.json) console.log(JSON.stringify(trace, null, 2));
else console.log(formatTrace(trace));

if (trace.reachable === false) process.exitCode = 3;
