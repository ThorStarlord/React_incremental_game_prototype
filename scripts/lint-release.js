#!/usr/bin/env node

/**
 * Release lint scope: production TypeScript/TSX only. Test fixtures are
 * validated by Jest/TypeScript and are intentionally not mixed into the
 * player-facing production lint gate. ESLint warnings are retained as legacy
 * diagnostics, while errors fail this gate; CRA's production build separately
 * verifies the imported player-facing graph.
 */
const { spawnSync } = require('node:child_process');

const result = spawnSync('npx', [
  'eslint',
  'src',
  '--ext', '.ts,.tsx',
  '--ignore-pattern', '**/*.test.ts',
  '--ignore-pattern', '**/*.test.tsx',
  '--ignore-pattern', '**/__tests__/**',
  '--quiet',
], { stdio: 'inherit', shell: true });

process.exit(result.status || 0);
