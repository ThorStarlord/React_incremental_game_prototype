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

const requiredAuthorityFiles = [
  'docs/CURRENT.md',
  'docs/README.md',
  'README.md',
  'STATUS.md',
  'RUNBOOK.md',
  'specification/README.md',
  'specification/Technical/M25CompleteChapterVerticalSliceResult.md',
  'specification/Technical/PostM25ProductDirection.md',
  'specification/Technical/GameLoopAsyncTickBacklogPolicyContract.md',
  'specification/Technical/GameLoopBoundedBacklogControlRepair.md',
  'specification/Technical/GameLoopLifecycleRemainderPolicy.md',
  'specification/Technical/GameLoopUnifiedTimingHardeningCompositionQualification.md',
  'specification/Technical/GameLoopBackpressureCadenceProgressionStressQualification.md',
  'specification/Technical/GameLoopTimedQuestPrecisionResolution.md',
  'specification/Technical/GameLoopQuestTimingIntegrationQualification.md',
  'specification/Technical/M21BoundedOfflineProgressResult.md',
  'specification/Technical/CheckpointBActiveRpgLoopResult.md',
  'specification/Technical/ActiveRpgLoopIntegrationRepairResult.md',
  'specification/Technical/CheckpointBActiveRpgLoopRerunResult.md',
  'specification/Technical/CheckpointCIncrementalIntegrationResult.md',
  'specification/Technical/IncrementalIntegrationRepairResult.md',
  'specification/Technical/CheckpointCIncrementalIntegrationRerunResult.md',
  '.github/workflows/build-validation.yml',
];

for (const requiredFile of requiredAuthorityFiles) {
  if (!exists(requiredFile)) {
    fail(`indexed authority file is missing: ${requiredFile}`);
  }
}

if (exists('docs/CURRENT.md')) {
  requireContains('docs/CURRENT.md', [
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

requireContains('docs/README.md', ['CURRENT.md', 'HISTORICAL']);
requireContains('specification/README.md', ['authority chain', 'current records']);
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
