#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');

const read = relativePath =>
  fs.readFileSync(path.join(root, relativePath), 'utf8');

const readJson = relativePath =>
  JSON.parse(read(relativePath));

function fail(message) {
  throw new Error(`release eligibility blocked: ${message}`);
}

function statusLine(markdown, label) {
  const match = markdown.match(/^\*\*Status:\*\* (.+)$/m);
  if (!match) fail(`${label} has no Status line`);
  return match[1].trim();
}

function requireBetaPass() {
  const beta = read('docs/release/BetaResult.md');
  const status = statusLine(beta, 'Beta result');
  if (status !== 'BETA_PASS') {
    fail(`BetaCompletionContract is not PASS (current Beta status: ${status})`);
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

  requireBetaPass();
  requireNoOpenReleaseBlockers();
  requireVersion(stage);

  if (stage === 'final') {
    requireRcRecordPass();
    requireBrowserPasses();
  }

  console.log(`release eligibility PASS for ${stage} stage`);
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
