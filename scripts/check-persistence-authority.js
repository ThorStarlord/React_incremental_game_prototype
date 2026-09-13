#!/usr/bin/env node

/** Ensure removed legacy GameLoop persistence cannot quietly return. */
const fs = require('node:fs');
const path = require('node:path');

const srcRoot = path.resolve(__dirname, '..', 'src');
const forbidden = [
  /localStorage\.(?:getItem|setItem|removeItem)\(['"]gameState['"]\)/,
  /localStorage\.(?:getItem|setItem|removeItem)\(['"]gameLoopState['"]\)/,
  /localStorage\.(?:getItem|setItem|removeItem)\(['"]lastSaveTime['"]\)/,
];

function scan(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return scan(fullPath);
    if (!/\.(ts|tsx)$/.test(entry.name) || /\.test\./.test(entry.name)) return [];
    return [fullPath];
  });
}

const violations = [];
for (const file of scan(srcRoot)) {
  const source = fs.readFileSync(file, 'utf8');
  for (const pattern of forbidden) {
    if (pattern.test(source)) violations.push(path.relative(process.cwd(), file));
  }
}

const removedLegacyModule = path.join(srcRoot, 'features', 'GameLoop', 'state', 'GameLoopThunks.ts');
if (fs.existsSync(removedLegacyModule)) violations.push(path.relative(process.cwd(), removedLegacyModule));

if (violations.length > 0) {
  console.error('legacy persistence authority detected:', [...new Set(violations)].join(', '));
  process.exitCode = 1;
} else {
  console.log('persistence authority check passed');
}
