#!/usr/bin/env node

/** Create reproducibility metadata for a locally built release candidate. */
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const buildDir = path.join(root, 'build');
const outputPath = process.env.RELEASE_MANIFEST_OUT ||
  path.join(root, '.release-artifacts', 'release-manifest.json');

function sha256File(filePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

function gitValue(args) {
  try {
    return execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();
  } catch {
    return 'unknown';
  }
}

function commandVersion(command) {
  try {
    return execFileSync(command, ['--version'], { cwd: root, encoding: 'utf8' }).trim();
  } catch {
    return 'unknown';
  }
}

function collectFiles(directory, relative = '') {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const absolute = path.join(directory, entry.name);
    const childRelative = path.join(relative, entry.name);
    if (entry.isDirectory()) return collectFiles(absolute, childRelative);
    return [{ path: childRelative.replaceAll(path.sep, '/'), absolute }];
  });
}

function main() {
  if (!fs.existsSync(buildDir)) throw new Error('build directory does not exist; run npm run build first');

  const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  const files = collectFiles(buildDir).map(file => ({
    path: file.path,
    sha256: sha256File(file.absolute),
    bytes: fs.statSync(file.absolute).size,
  }));
  const manifest = {
    generatedAt: new Date().toISOString(),
    candidate: {
      commitSha: gitValue(['rev-parse', 'HEAD']),
      version: packageJson.version,
      treeState: gitValue(['status', '--porcelain']) === '' ? 'clean' : 'dirty',
    },
    toolchain: {
      node: process.version,
      npm: commandVersion(process.platform === 'win32' ? 'npm.cmd' : 'npm'),
    },
    inputs: {
      packageJsonSha256: sha256File(path.join(root, 'package.json')),
      packageLockSha256: sha256File(path.join(root, 'package-lock.json')),
    },
    build: {
      directory: 'build',
      files,
    },
  };

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`release manifest written to ${path.relative(root, outputPath)}`);
}

try {
  main();
} catch (error) {
  console.error(`release manifest failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
}
