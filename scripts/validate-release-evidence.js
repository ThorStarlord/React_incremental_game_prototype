#!/usr/bin/env node

/**
 * Validate the shape and honesty of the checked-in 1.0 release record.
 *
 * This deliberately validates evidence metadata, not the evidence itself. A
 * release record may be blocked while external CI or human qualification is
 * pending, but it must say so explicitly and must remain tied to an existing
 * immutable commit.
 */
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const recordPath = path.join(root, 'docs/release/ReleaseCandidateResult.md');
const browserRecordPath = path.join(root, 'docs/release/BrowserQualification.md');
const defectLedgerPath = path.join(root, 'docs/release/KnownDefects.md');

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

  const record = fs.readFileSync(recordPath, 'utf8');
  const browserRecord = fs.readFileSync(browserRecordPath, 'utf8');
  const defectLedger = fs.readFileSync(defectLedgerPath, 'utf8');
  const status = extractRequired(record, 'candidate status', /^\*\*Status:\*\* (.+)$/m);
  const version = extractRequired(record, 'candidate version', /^\| Version \| `([^`]+)`/m);
  const sha = extractRequired(record, 'candidate commit SHA', /^\| Commit SHA \| `([0-9a-f]{40})`/m);

  if (!/^1\.0\.0(?:[-+].*)?$/.test(version)) fail(`expected a 1.0.0 candidate, got ${version}`);
  if (!commitExists(sha)) fail(`candidate commit ${sha} is not present in git history`);
  if (!/DETERMINISTIC CANDIDATE VERIFIED; PROMOTION BLOCKED/.test(status)) {
    fail('the current record must remain blocked until external release evidence is recorded');
  }

  for (const blocker of [
    'Beta human evidence',
    'full production playthrough evidence',
    'Firefox CI evidence',
    'release approval',
  ]) {
    requireText(record, 'candidate result', blocker);
  }

  for (const browser of ['Chromium', 'Firefox']) {
    requireText(browserRecord, 'browser qualification record', browser);
  }
  requireText(browserRecord, 'browser qualification record', 'Human follow-up still required');
  requireText(browserRecord, 'browser qualification record', 'full campaign completion');
  for (const defect of ['KD-001', 'KD-002', 'KD-003', 'KD-004']) {
    requireText(defectLedger, 'known-defect ledger', defect);
  }

  console.log(`release evidence metadata is valid for blocked candidate ${sha}`);
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
