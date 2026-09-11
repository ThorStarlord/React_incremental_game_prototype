#!/usr/bin/env node
const path = require('path');
const { createModel, findReachabilityProblems } = require('./content-graph');

const root = path.resolve(__dirname, '..', '..');
const model = createModel(root);
const problems = findReachabilityProblems(model);

console.log('Content Reachability Qualification');
console.log(`Entrypoint dialogues: ${model.entrypointDialogues.size}`);
console.log(`Reachability problems: ${problems.length}`);

for (const warning of model.warnings) {
  console.log(`WARN ${warning.code}: ${warning.message}`);
}
for (const issue of model.issues) {
  console.error(`ERROR ${issue.code}: ${issue.message}`);
}
for (const problem of problems) {
  console.error(`ERROR ${problem.code}: ${problem.message}`);
}

if (model.issues.length > 0 || problems.length > 0) process.exitCode = 1;
