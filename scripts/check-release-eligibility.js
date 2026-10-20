#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

// RELEASE_ELIGIBILITY_ROOT lets the GC-14 regression suite exercise the guard
// against fixture records without touching the real release ledger.
const root = process.env.RELEASE_ELIGIBILITY_ROOT
  ? path.resolve(process.env.RELEASE_ELIGIBILITY_ROOT)
  : path.resolve(__dirname, '..');

const OWNER_DECISION_PATH = 'specification/Technical/OwnerPersonalReleaseDecision.md';
const RELEASE_NOTES_PATH = 'docs/release/ReleaseNotes.md';
const OWNER_DECISION_MARKERS = [
  'OWNER DECISION RECORDED',
  'BETA_PASS = NO',
  'BETA_OWNER_WAIVED / HUMAN-UNVALIDATED',
];

const read = relativePath =>
  fs.readFileSync(path.join(root, relativePath), 'utf8');

const readJson = relativePath =>
  JSON.parse(read(relativePath));

const exists = relativePath =>
  fs.existsSync(path.join(root, relativePath));

function fail(message) {
  throw new Error(`release eligibility blocked: ${message}`);
}

function statusLine(markdown, label) {
  const match = markdown.match(/^\*\*Status:\*\* (.+)$/m);
  if (!match) fail(`${label} has no Status line`);
  return match[1].trim();
}

// Returns 'pass' for a genuine human-evidence BETA_PASS, or 'waived' when the
// owner has explicitly waived the human floor for a personal release. A waiver
// is never treated as BETA_PASS; it only satisfies the RC/1.0 entry condition.
function requireBetaPassOrOwnerWaiver() {
  const beta = read('docs/release/BetaResult.md');
  const status = statusLine(beta, 'Beta result');
  if (status === 'BETA_PASS') return 'pass';

  if (status.startsWith('OWNER_WAIVED')) {
    if (!exists(OWNER_DECISION_PATH)) {
      fail(`Beta result is OWNER_WAIVED but ${OWNER_DECISION_PATH} is missing`);
    }
    const decision = read(OWNER_DECISION_PATH);
    for (const marker of OWNER_DECISION_MARKERS) {
      if (!decision.includes(marker)) {
        fail(`owner waiver record must contain ${JSON.stringify(marker)}`);
      }
    }
    return 'waived';
  }

  fail(`BetaCompletionContract is not PASS and no owner waiver is recorded (current Beta status: ${status})`);
}

function requireWaiverDisclosure() {
  if (!exists(RELEASE_NOTES_PATH)) {
    fail(`owner-waived release requires ${RELEASE_NOTES_PATH}`);
  }
  if (!/not externally playtested/i.test(read(RELEASE_NOTES_PATH))) {
    fail('owner-waived release notes must state that the game was not externally playtested');
  }
}

function requireNoOpenReleaseBlockers() {
  const defects = read('docs/release/KnownDefects.md');
  const rows = defects
    .split(/\r?\n/)
    .filter(line => /^\| KD-\d+ \|/.test(line));

  const openReleaseBlockers = rows.filter(line => {
    const cells = line.split('|').map(cell => cell.trim()).filter(Boolean);
    const severity = cells[1] || '';
    const status = cells[3] || '';
    return /Release blocker|BLOCKER|CRITICAL/i.test(severity) &&
      !/Closed|Resolved|Accepted for release/i.test(status);
  });

  if (openReleaseBlockers.length > 0) {
    fail(`${openReleaseBlockers.length} release-blocking KnownDefects row(s) remain open`);
  }
}

function requireBrowserPasses() {
  const browser = read('docs/release/BrowserQualification.md');
  for (const family of ['Chromium', 'Firefox']) {
    const row = browser
      .split(/\r?\n/)
      .find(line => line.startsWith(`| ${family} |`));
    if (!row || !/\| PASS(?: \([^)]*\))? \|/.test(row)) {
      fail(`${family} release browser evidence is not PASS`);
    }
  }
}

function requireRcRecordPass() {
  const rc = read('docs/release/ReleaseCandidateResult.md');
  const status = statusLine(rc, 'Release Candidate result');
  if (/BLOCKED|NOT RECORDED|PREPARED/i.test(status) || !/PASS|APPROVED/i.test(status)) {
    fail(`Release Candidate record is not promotable (current status: ${status})`);
  }
}

function requireVersion(stage) {
  const packageJson = readJson('package.json');
  const versionSource = read('src/shared/config/releaseVersion.ts');
  const version = packageJson.version;

  if (stage === 'rc') {
    if (!/^1\.0\.0-rc\.\d+$/.test(version)) {
      fail(`RC entry requires explicit 1.0.0-rc.N metadata, got ${version}`);
    }
  } else if (version !== '1.0.0') {
    fail(`final promotion requires version 1.0.0, got ${version}`);
  }

  if (!versionSource.includes(`APP_VERSION = '${version}'`)) {
    fail(`in-app APP_VERSION does not match package version ${version}`);
  }
}

function main() {
  const stageIndex = process.argv.indexOf('--stage');
  const stage = stageIndex >= 0 ? process.argv[stageIndex + 1] : 'final';
  if (!['rc', 'final'].includes(stage)) {
    fail('--stage must be rc or final');
  }

  const beta = requireBetaPassOrOwnerWaiver();
  requireNoOpenReleaseBlockers();
  requireVersion(stage);

  if (stage === 'final') {
    requireRcRecordPass();
    requireBrowserPasses();
    if (beta === 'waived') requireWaiverDisclosure();
  }

  const basis = beta === 'waived' ? 'owner waiver / HUMAN-UNVALIDATED' : 'BETA_PASS';
  console.log(`release eligibility PASS for ${stage} stage (${basis})`);
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
