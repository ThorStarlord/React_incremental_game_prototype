#!/usr/bin/env node
const path = require('path');
const { createModel } = require('./content-graph');
const { applyRepositoryPolicy } = require('./repository-policy');
const { checkStructuralConsistency } = require('./structural-checks');

const root = path.resolve(__dirname, '..', '..');
const model = applyRepositoryPolicy(createModel(root));
const structuralIssues = checkStructuralConsistency(model);
model.issues.push(...structuralIssues);

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