#!/usr/bin/env node
const path = require('path');
const { createModel } = require('./content-graph');

const root = path.resolve(__dirname, '..', '..');
const model = createModel(root);

console.log('Content Integrity Audit');
console.log(`JSON files: ${model.files.length}`);
console.log(`Entities: ${model.nodes.size}`);
console.log(`Dependency edges: ${model.edges.length}`);
console.log(`Warnings: ${model.warnings.length}`);
console.log(`Errors: ${model.issues.length}`);

for (const warning of model.warnings) {
  console.log(`WARN ${warning.code}: ${warning.message}`);
}
for (const issue of model.issues) {
  console.error(`ERROR ${issue.code}: ${issue.message}`);
}

if (model.issues.length > 0) process.exitCode = 1;
