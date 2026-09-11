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

const completionAuthorityFiles = [
  'specification/GameCompletionDefinition.md',
  'specification/Features/FeatureScopeMatrix.md',
  'specification/Progression/GameProgressionArc.md',
  'specification/Narrative/CampaignArchitecture.md',
  'specification/Technical/GameCompletionRoadmap.md',
  'specification/Technical/AlphaCompletionContract.md',
  'specification/Technical/BetaCompletionContract.md',
  'specification/Technical/ReleaseQualificationContract.md',
];

const requiredAuthorityFiles = [
  'docs/CURRENT.md',
  'docs/README.md',
  'README.md',
  'STATUS.md',
  'RUNBOOK.md',
  'specification/README.md',
  ...completionAuthorityFiles,
  'specification/Technical/PostM25ProvisionalGovernanceDecision.md',
  'specification/Technical/PostM25ProvisionalProductDirectionDecision.md',
  'specification/Technical/M26ProvisionalProductDepthResult.md',
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
    'GameCompletionDefinition.md',
    'FeatureScopeMatrix.md',
    'GameProgressionArc.md',
    'CampaignArchitecture.md',
    'GameCompletionRoadmap.md',
    'AlphaCompletionContract.md',
    'BetaCompletionContract.md',
    'ReleaseQualificationContract.md',
    'PostM25ProvisionalProductDirectionDecision.md',
    'M26ProvisionalProductDepthResult.md',
    'GameLoopAsyncTickBacklogPolicyContract.md',
    'GameLoopLifecycleRemainderPolicy.md',
    'M25CompleteChapterVerticalSliceResult.md',
    'PostM25ProductDirection.md',
    'ArchitectureOverview.md',
    'CheckpointBActiveRpgLoopResult.md',
    'CheckpointCIncrementalIntegrationResult.md',
  ]);
}

requireContains('STATUS.md', [
  'PLAYABLE PRE-ALPHA',
  'GameCompletionDefinition.md',
  'FeatureScopeMatrix.md',
  'GameCompletionRoadmap.md',
  'M26',
  'issue #109',
]);

requireContains('README.md', [
  'Playable Pre-Alpha',
  'GameCompletionDefinition.md',
  'FeatureScopeMatrix.md',
  'GameCompletionRoadmap.md',
  'AlphaCompletionContract.md',
  'BetaCompletionContract.md',
  'ReleaseQualificationContract.md',
]);

requireContains('RUNBOOK.md', [
  'docs/CURRENT.md',
  'specification/GameCompletionDefinition.md',
  'specification/Features/FeatureScopeMatrix.md',
  'specification/Technical/GameCompletionRoadmap.md',
  'npm run m26:validate',
  'alpha:validate',
  'release:validate',
]);

requireContains('specification/README.md', [
  'Authority chain',
  'GameCompletionDefinition.md',
  'FeatureScopeMatrix.md',
  'GameProgressionArc.md',
  'CampaignArchitecture.md',
  'GameCompletionRoadmap.md',
  'AlphaCompletionContract.md',
  'BetaCompletionContract.md',
  'ReleaseQualificationContract.md',
  'M26ProvisionalProductDepthResult.md',
]);

requireContains('specification/GameCompletionDefinition.md', [
  'PLAYABLE PRE-ALPHA',
  '1.0 stop condition',
  'Campaign One',
  'Telluric Echo',
]);

requireContains('specification/Features/FeatureScopeMatrix.md', [
  'CORE_1_0',
  'DEFER_POST_1_0',
  'CUT',
  'Separate Skills',
  'General Crafting',
]);

requireContains('specification/Technical/GameCompletionRoadmap.md', [
  'GC-00',
  'GC-14',
  'Alpha qualification',
  'Release Candidate',
  'There is no automatic M27',
]);

requireContains('specification/Technical/M26ProvisionalProductDepthResult.md', [
  'COMPLETE / INTEGRATED',
  'Build Validation #340',
  '7f306f3b6a69a27c250c1986df976cc518119821',
]);

requireContains('docs/README.md', ['CURRENT.md', 'HISTORICAL']);
requireContains('package.json', ['"docs:authority:validate"', '"m26:validate"']);
requireContains('.github/workflows/build-validation.yml', [
  'Documentation authority qualification',
  'npm run docs:authority:validate',
  'M26 provisional learn-to-delegate qualification',
  'npm run m26:validate',
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
