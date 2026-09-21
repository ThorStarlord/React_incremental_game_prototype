import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';

const read = (relativePath: string): string =>
  fs.readFileSync(path.join(process.cwd(), relativePath), 'utf8');

const readJson = (relativePath: string): any =>
  JSON.parse(read(relativePath));

describe('GC-14 release promotion eligibility guard', () => {
  test('package exposes deterministic validation separately from promotion authority', () => {
    const scripts = readJson('package.json').scripts;

    expect(scripts['release:validate']).toBe('node scripts/release-validate.js');
    expect(scripts['release:rc:eligibility']).toContain('--stage rc');
    expect(scripts['release:promotion:eligibility']).toContain('--stage final');
    expect(scripts['release:rc:validate']).toContain('release:rc:eligibility');
    expect(scripts['release:rc:validate']).toContain('release:validate');
    expect(scripts['release:promote:validate']).toContain('release:promotion:eligibility');
    expect(scripts['release:promote:validate']).toContain('release:validate');
  });

  test('eligibility guard encodes Beta, blocker, browser, RC-record, and version gates', () => {
    const source = read('scripts/check-release-eligibility.js');

    expect(source).toContain("status !== 'BETA_PASS'");
    expect(source).toContain('release-blocking KnownDefects');
    expect(source).toContain("for (const family of ['Chromium', 'Firefox'])");
    expect(source).toContain('Release Candidate record is not promotable');
    expect(source).toContain("1.0.0-rc.N");
    expect(source).toContain("final promotion requires version 1.0.0");
  });

  test('current repository fails RC entry closed because Beta human evidence is absent', () => {
    const result = spawnSync(
      process.execPath,
      ['scripts/check-release-eligibility.js', '--stage', 'rc'],
      { cwd: process.cwd(), encoding: 'utf8' }
    );

    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain('BetaCompletionContract is not PASS');
  });

  test('current repository fails final promotion closed rather than interpreting deterministic health as approval', () => {
    const result = spawnSync(
      process.execPath,
      ['scripts/check-release-eligibility.js', '--stage', 'final'],
      { cwd: process.cwd(), encoding: 'utf8' }
    );

    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain('BetaCompletionContract is not PASS');
  });

  test('current authoritative records remain explicitly non-promoted', () => {
    const beta = read('docs/release/BetaResult.md');
    const rc = read('docs/release/ReleaseCandidateResult.md');

    expect(beta).toContain('NOT RECORDED — HUMAN EVIDENCE REQUIRED');
    expect(rc).toContain('PROMOTION BLOCKED');
    expect(beta).not.toContain('**Status:** BETA_PASS');
  });
});
