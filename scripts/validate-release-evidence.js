#!/usr/bin/env node

/**
 * Validate the shape and honesty of the checked-in 1.0 release record.
 *
 * This deliberately validates evidence metadata, not the evidence itself. A
 * record is either DECLARED (a 1.0.0-rc.N cut from a recorded baseline, with
 * qualification pending) or QUALIFIED (tied to the exact candidate commit and
 * its Build Validation run). Either way it must stay tied to existing commits
 * and the release notes must disclose that the game was not externally
 * playtested.
 */
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const recordPath = path.join(root, 'docs/release/ReleaseCandidateResult.md');
const browserRecordPath = path.join(root, 'docs/release/BrowserQualification.md');
const defectLedgerPath = path.join(root, 'docs/release/KnownDefects.md');
const releaseNotesPath = path.join(root, 'docs/release/ReleaseNotes.md');

function fail(message) {
  throw new Error(`release evidence validation failed: ${message}`);
}

function requireText(content, label, text) {
  if (!content.includes(text)) fail(`${label} must contain ${JSON.stringify(text)}`);
}

function extractRequired(content, label, pattern) {
  const match = content.match(pattern);
  if (!match) fail(`${label} is missing or malformed`);
  return match[1];
}

function commitExists(sha) {
  try {
    execFileSync('git', ['cat-file', '-e', `${sha}^{commit}`], {
      cwd: root,
      stdio: 'ignore',
    });
    return true;
  } catch {
    return false;
  }
}

function main() {
  if (!fs.existsSync(recordPath)) fail('candidate result record is missing');
  if (!fs.existsSync(browserRecordPath)) fail('browser qualification record is missing');
  if (!fs.existsSync(defectLedgerPath)) fail('known-defect ledger is missing');
  if (!fs.existsSync(releaseNotesPath)) fail('release notes are missing');

  const record = fs.readFileSync(recordPath, 'utf8');
  const browserRecord = fs.readFileSync(browserRecordPath, 'utf8');
  const defectLedger = fs.readFileSync(defectLedgerPath, 'utf8');
  const releaseNotes = fs.readFileSync(releaseNotesPath, 'utf8');
  const status = extractRequired(record, 'candidate status', /^\*\*Status:\*\* (.+)$/m);
  const version = extractRequired(record, 'candidate version', /^\| Version \| `([^`]+)`/m);

  if (!/^1\.0\.0(?:-rc\.\d+)?$/.test(version)) fail(`expected a 1.0.0 or 1.0.0-rc.N candidate, got ${version}`);
  extractRequired(record, 'promotion basis', /^\*\*Basis:\*\* (.+)$/m);

  let anchor;
  if (/DECLARED/.test(status)) {
    // A declared candidate cannot cite its own SHA yet; it is tied to the
    // baseline it was cut from and must still be a release candidate.
    if (!/-rc\.\d+$/.test(version)) fail('a declared candidate must carry 1.0.0-rc.N metadata');
    anchor = extractRequired(record, 'source baseline', /^\| Source baseline \| `([0-9a-f]{40})`/m);
  } else if (/QUALIFIED/.test(status)) {
    anchor = extractRequired(record, 'candidate commit SHA', /^\| Commit SHA \| `([0-9a-f]{40})`/m);
    requireText(record, 'candidate result', 'Build Validation #');
    requireText(record, 'candidate result', 'full-campaign-release-run');
  } else {
    fail(`unrecognised candidate status: ${status}`);
  }
  if (!commitExists(anchor)) fail(`candidate commit ${anchor} is not present in git history`);

  for (const browser of ['Chromium', 'Firefox']) {
    requireText(browserRecord, 'browser qualification record', browser);
  }
  for (const defect of ['KD-001', 'KD-002', 'KD-003', 'KD-004']) {
    requireText(defectLedger, 'known-defect ledger', defect);
  }
  if (!/not externally playtested/i.test(releaseNotes)) {
    fail('release notes must state that the game was not externally playtested');
  }

  console.log(`release evidence metadata is valid for ${version} (${status})`);
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
