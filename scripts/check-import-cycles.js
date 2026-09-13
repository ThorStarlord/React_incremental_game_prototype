#!/usr/bin/env node

/**
 * Dependency qualification for the local TypeScript graph.
 * This intentionally checks only relative imports: package imports are
 * external dependencies, while relative cycles are architectural cycles we
 * own and can remove.
 */
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..', 'src');
const sourceExtensions = ['.ts', '.tsx', '.js', '.jsx'];

function filesUnder(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return filesUnder(fullPath);
    return sourceExtensions.includes(path.extname(entry.name)) ? [fullPath] : [];
  });
}

function resolveImport(fromFile, specifier) {
  if (!specifier.startsWith('.')) return null;
  const base = path.resolve(path.dirname(fromFile), specifier);
  const candidates = [base, ...sourceExtensions.map(extension => `${base}${extension}`)];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) return candidate;
  }
  for (const extension of sourceExtensions) {
    const indexFile = path.join(base, `index${extension}`);
    if (fs.existsSync(indexFile)) return indexFile;
  }
  return null;
}

const graph = new Map(filesUnder(root).map(file => [file, []]));
for (const file of graph.keys()) {
  const source = fs.readFileSync(file, 'utf8');
  const imports = source.matchAll(/(?:import(?!\s+type)|export(?!\s+type))\s+(?:[^'";]+?\s+from\s+)?['"](\.\.?\/[^'"]+)['"]/g);
  for (const match of imports) {
    const target = resolveImport(file, match[1]);
    if (target && graph.has(target)) graph.get(file).push(target);
  }
}

const visiting = new Set();
const visited = new Set();
const stack = [];
const cycles = [];

function visit(file) {
  if (visiting.has(file)) {
    const start = stack.indexOf(file);
    cycles.push([...stack.slice(start), file]);
    return;
  }
  if (visited.has(file)) return;
  visiting.add(file);
  stack.push(file);
  for (const dependency of graph.get(file)) visit(dependency);
  stack.pop();
  visiting.delete(file);
  visited.add(file);
}

for (const file of graph.keys()) visit(file);

if (cycles.length > 0) {
  console.error('Relative import cycles detected:');
  for (const cycle of cycles) console.error(`- ${cycle.map(file => path.relative(process.cwd(), file)).join(' -> ')}`);
  process.exitCode = 1;
} else {
  console.log(`relative import cycle check passed (${graph.size} source files)`);
}
