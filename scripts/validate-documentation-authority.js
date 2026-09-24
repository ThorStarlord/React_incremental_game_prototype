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
  'specification/Technical/FeatureCompletionGapAnalysis.md',
  'specification/Technical/CandidateBMasteryCompressionDepthSpecification.md',
  'specification/Technical/AlphaCompletionContract.md',
  'specification/Technical/BetaCompletionContract.md',
  'specification/Technical/ReleaseQualificationContract.md',
];

const requiredAuthorityFiles = [
  'AGENTS.md',
  'CLAUDE.md',
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
  'specification/Technical/GC11AlphaResult.md',
  'specification/Technical/GC12ContentAlphaPreregistration.md',
  'specification/Technical/GC12ContentAlphaResult.md',
  'specification/Technical/GC13BetaTechnicalReadinessPreregistration.md',
  'specification/Technical/GC13BetaTechnicalReadinessResult.md',
  'specification/Technical/GC14ReleaseEligibilityPreregistration.md',
  'specification/Technical/GC14ReleaseEligibilityBlockedResult.md',
  'docs/release/BetaExecutionRunbook.md',
  'docs/release/BetaHumanEvidenceTemplate.md',
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

requireContains('AGENTS.md', [
  'CURRENT AUTHORITY for coding-agent behavior',
  'Missing human evidence limits the claims this repository may make',
  'DETERMINISTIC_FINDING',
  'HEURISTIC_FINDING',
  'SYNTHETIC_FINDING',
  'HUMAN_FINDING',
  'Absence of human evidence alone is not a universal stop condition',
]);

requireContains('CLAUDE.md', [
  'AGENTS.md',
  'thin adapter',
  'missing human evidence limits human-experience claims',
]);

if (exists('docs/CURRENT.md')) {
  requireContains('docs/CURRENT.md', [
    'CURRENT AUTHORITY',
    'REFERENCE',
    'HISTORICAL EVIDENCE',
    'SUPERSEDED',
    'AGENTS.md',
    'CLAUDE.md',
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
    'GC11AlphaResult.md',
    'GC12ContentAlphaResult.md',
    'GC13BetaTechnicalReadinessResult.md',
    'GC14ReleaseEligibilityBlockedResult.md',
    'BetaExecutionRunbook.md',
    'BetaHumanEvidenceTemplate.md',
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
  'CONTENT_ALPHA / HUMAN-UNVALIDATED',
  'TECHNICAL_BETA_READY',
  'BETA_PASS=NO',
  'FEATURE_COMPLETION / PRODUCT_DEPTH',
  'RC_ENTRY_BLOCKED',
  '1.0_PROMOTION_BLOCKED',
  'GameCompletionDefinition.md',
  'FeatureScopeMatrix.md',
  'GameCompletionRoadmap.md',
  'GC-11 Alpha',
  'GC-12 Content Alpha',
  'issue #109',
]);

requireContains('README.md', [
  'Content Alpha / HUMAN-UNVALIDATED',
  'Technical Beta readiness: PASS / HUMAN EVIDENCE BLOCKED',
  'RC entry: BLOCKED',
  '1.0: BLOCKED',
  'GameCompletionDefinition.md',
  'FeatureScopeMatrix.md',
  'GameCompletionRoadmap.md',
  'FEATURE_COMPLETION / PRODUCT_DEPTH',
  'AlphaCompletionContract.md',
  'BetaCompletionContract.md',
  'ReleaseQualificationContract.md',
]);

requireContains('RUNBOOK.md', [
  'AGENTS.md',
  'docs/CURRENT.md',
  'specification/GameCompletionDefinition.md',
  'specification/Features/FeatureScopeMatrix.md',
  'specification/Technical/GameCompletionRoadmap.md',
  'npm run m26:validate',
  'alpha:validate',
  'content-alpha:validate',
  'beta:technical:validate',
  'release:browser',
  'gc14:validate',
  'release:rc:eligibility',
  'release:promotion:eligibility',
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
  'CONTENT_ALPHA / HUMAN-UNVALIDATED',
  '1.0 stop condition',
  'Campaign One',
  'Telluric Echo',
]);

requireContains('specification/Features/FeatureScopeMatrix.md', [
  'CORE_1_0',
  'L1 Vertical Slice',
  'L4 Feature Complete',
  'DEFER_POST_1_0',
  'CUT',
  'Separate Skills',
  'General Crafting',
]);

requireContains('specification/Technical/GameCompletionRoadmap.md', [
  'GC-00',
  'GC-14',
  'Feature Completion Gap Analysis',
  'FeatureCompletionGapAnalysis.md',
  'Alpha qualification',
  'Release Candidate',
  'No automatic M-number continuation',
]);

requireContains('specification/Technical/FeatureCompletionGapAnalysis.md', [
  'FEATURE_COMPLETION / PRODUCT_DEPTH',
  'Candidate B',
  'Candidate A',
  'Candidate C',
  'A vertical slice proves that a feature can work',
]);

requireContains('specification/Technical/CandidateBMasteryCompressionDepthSpecification.md', [
  'FEATURE COMPLETION CANDIDATE B',
  'Forge Assistance',
  'forge_structural_deviation',
  'attention moves upward from repeated procedure to policy and exception judgment',
]);

requireContains('specification/Technical/M26ProvisionalProductDepthResult.md', [
  'COMPLETE / INTEGRATED',
  'Build Validation #340',
  '7f306f3b6a69a27c250c1986df976cc518119821',
]);

requireContains('docs/README.md', ['CURRENT.md', 'HISTORICAL', 'BetaExecutionRunbook.md', 'BetaHumanEvidenceTemplate.md']);
requireContains('package.json', [
  '"docs:authority:validate"',
  '"m26:validate"',
  '"alpha:validate"',
  '"content-alpha:validate"',
  '"beta:technical:validate"',
  '"release:browser"',
  '"gc14:validate"',
  '"release:rc:eligibility"',
  '"release:promotion:eligibility"',
]);
requireContains('.github/workflows/build-validation.yml', [
  'Documentation authority qualification',
  'npm run docs:authority:validate',
  'M26 provisional learn-to-delegate qualification',
  'npm run m26:validate',
  'GC-11 whole-game Alpha qualification',
  'npm run alpha:validate',
  'GC-12 Content Alpha qualification',
  'npm run content-alpha:validate',
  'GC-13 deterministic Beta readiness qualification',
  'npm run beta:technical:validate',
  'GC-13 Chromium and Firefox browser qualification',
  'GC-14 release promotion guard qualification',
  'npm run gc14:validate',
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
