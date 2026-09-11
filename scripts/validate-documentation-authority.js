const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function exists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function fail(message) {
  console.error(`documentation-authority validation failed: ${message}`);
  process.exitCode = 1;
}

function requireContains(relativePath, needles) {
  const content = read(relativePath);
  for (const needle of needles) {
    if (!content.includes(needle)) {
      fail(`${relativePath} must contain ${JSON.stringify(needle)}`);
    }
  }
}

const authorityPath = 'docs/CURRENT.md';

if (!exists(authorityPath)) {
  fail(`${authorityPath} is missing`);
} else {
  requireContains(authorityPath, [
    'CURRENT AUTHORITY',
    'REFERENCE',
    'HISTORICAL EVIDENCE',
    'SUPERSEDED',
    'STATUS.md',
    'RUNBOOK.md',
    'specification/README.md',
    'GameLoopAsyncTickBacklogPolicyContract.md',
    'GameLoopLifecycleRemainderPolicy.md',
    'M25CompleteChapterVerticalSliceResult.md',
    'PostM25ProductDirection.md',
    'ArchitectureOverview.md',
    'CheckpointBActiveRpgLoopResult.md',
    'CheckpointCIncrementalIntegrationResult.md',
  ]);
}

for (const entrypoint of ['README.md', 'STATUS.md', 'RUNBOOK.md']) {
  requireContains(entrypoint, ['docs/CURRENT.md']);
}

requireContains('package.json', ['"docs:authority:validate"']);
requireContains('.github/workflows/build-validation.yml', [
  'Documentation authority qualification',
  'npm run docs:authority:validate',
]);

if (exists('.github/workflows/gemini-review.yml')) {
  fail('retired .github/workflows/gemini-review.yml must not be restored implicitly');
}

if (exists('gemini.md')) {
  fail('retired gemini.md must not be restored implicitly');
}

if (!process.exitCode) {
  console.log('documentation-authority validation passed');
}
