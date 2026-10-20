import fs from 'fs';
import os from 'os';
import path from 'path';
import { spawnSync } from 'child_process';

const read = (relativePath: string): string =>
  fs.readFileSync(path.join(process.cwd(), relativePath), 'utf8');

const readJson = (relativePath: string): any =>
  JSON.parse(read(relativePath));

const runGuard = (stage: 'rc' | 'final', fixtureRoot?: string) =>
  spawnSync(
    process.execPath,
    ['scripts/check-release-eligibility.js', '--stage', stage],
    {
      cwd: process.cwd(),
      encoding: 'utf8',
      env: fixtureRoot
        ? { ...process.env, RELEASE_ELIGIBILITY_ROOT: fixtureRoot }
        : process.env,
    }
  );

interface FixtureOptions {
  betaStatus: string;
  version: string;
  ownerDecision?: string | null;
  releaseNotes?: string | null;
  openBlocker?: boolean;
}

const OWNER_DECISION = [
  '**Status:** CURRENT AUTHORITY — OWNER DECISION RECORDED 2026-10-20',
  'BETA_PASS = NO',
  'BETA_OWNER_WAIVED / HUMAN-UNVALIDATED',
].join('\n');

const writeFixture = (options: FixtureOptions): string => {
  const fixtureRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'gc14-eligibility-'));
  const write = (relativePath: string, content: string) => {
    const target = path.join(fixtureRoot, relativePath);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, content);
  };

  write('package.json', JSON.stringify({ version: options.version }));
  write('src/shared/config/releaseVersion.ts', `export const APP_VERSION = '${options.version}';\n`);
  write('docs/release/BetaResult.md', `# Beta\n\n**Status:** ${options.betaStatus}\n`);
  write(
    'docs/release/KnownDefects.md',
    [
      '| ID | Severity | Area | Status | Player impact | Disposition |',
      '| --- | --- | --- | --- | --- | --- |',
      '| KD-001 | Release blocker | Beta / human product review | Accepted for release (owner waiver) | x | x |',
      `| KD-002 | Release blocker | Full UI campaign evidence | ${options.openBlocker ? 'Open' : 'Resolved'} | x | x |`,
    ].join('\n')
  );
  write(
    'docs/release/BrowserQualification.md',
    '| Chromium | 1 | Linux | 1280x720 | PASS | ci |\n| Firefox | 1 | Linux | 1280x720 | PASS | ci |\n'
  );
  write('docs/release/ReleaseCandidateResult.md', '**Status:** RC QUALIFIED — PASS\n');
  if (options.ownerDecision !== null) {
    write(
      'specification/Technical/OwnerPersonalReleaseDecision.md',
      options.ownerDecision ?? OWNER_DECISION
    );
  }
  if (options.releaseNotes !== null && options.releaseNotes !== undefined) {
    write('docs/release/ReleaseNotes.md', options.releaseNotes);
  }
  return fixtureRoot;
};

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

  test('eligibility guard encodes Beta-or-waiver, blocker, browser, RC-record, disclosure, and version gates', () => {
    const source = read('scripts/check-release-eligibility.js');

    expect(source).toContain("status === 'BETA_PASS'");
    expect(source).toContain("status.startsWith('OWNER_WAIVED')");
    expect(source).toContain('OwnerPersonalReleaseDecision.md');
    expect(source).toContain('not externally playtested');
    expect(source).toContain('release-blocking KnownDefects');
    expect(source).toContain("for (const family of ['Chromium', 'Firefox'])");
    expect(source).toContain('Release Candidate record is not promotable');
    expect(source).toContain('1.0.0-rc.N');
    expect(source).toContain('final promotion requires version 1.0.0');
  });

  test('neither BETA_PASS nor an owner waiver keeps RC entry closed', () => {
    const result = runGuard('rc', writeFixture({
      betaStatus: 'NOT RECORDED — HUMAN EVIDENCE REQUIRED',
      version: '1.0.0-rc.1',
    }));

    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain('BetaCompletionContract is not PASS and no owner waiver is recorded');
  });

  test('an OWNER_WAIVED status without the owner decision record is rejected', () => {
    const missing = runGuard('rc', writeFixture({
      betaStatus: 'OWNER_WAIVED — HUMAN-UNVALIDATED (BETA_PASS=NO)',
      version: '1.0.0-rc.1',
      ownerDecision: null,
    }));
    expect(missing.status).not.toBe(0);
    expect(missing.stderr).toContain('OwnerPersonalReleaseDecision.md is missing');

    const unmarked = runGuard('rc', writeFixture({
      betaStatus: 'OWNER_WAIVED — HUMAN-UNVALIDATED (BETA_PASS=NO)',
      version: '1.0.0-rc.1',
      ownerDecision: 'an informal note',
    }));
    expect(unmarked.status).not.toBe(0);
    expect(unmarked.stderr).toContain('owner waiver record must contain');
  });

  test('an owner waiver opens RC entry but still requires rc metadata and no open blocker', () => {
    const waivedRc = runGuard('rc', writeFixture({
      betaStatus: 'OWNER_WAIVED — HUMAN-UNVALIDATED (BETA_PASS=NO)',
      version: '1.0.0-rc.1',
    }));
    expect(waivedRc.status).toBe(0);
    expect(waivedRc.stdout).toContain('owner waiver / HUMAN-UNVALIDATED');

    const wrongVersion = runGuard('rc', writeFixture({
      betaStatus: 'OWNER_WAIVED — HUMAN-UNVALIDATED (BETA_PASS=NO)',
      version: '0.9.0-beta.1',
    }));
    expect(wrongVersion.status).not.toBe(0);
    expect(wrongVersion.stderr).toContain('1.0.0-rc.N');

    const blocked = runGuard('rc', writeFixture({
      betaStatus: 'OWNER_WAIVED — HUMAN-UNVALIDATED (BETA_PASS=NO)',
      version: '1.0.0-rc.1',
      openBlocker: true,
    }));
    expect(blocked.status).not.toBe(0);
    expect(blocked.stderr).toContain('release-blocking KnownDefects');
  });

  test('a waived final promotion requires release notes that disclose no external playtesting', () => {
    const undisclosed = runGuard('final', writeFixture({
      betaStatus: 'OWNER_WAIVED — HUMAN-UNVALIDATED (BETA_PASS=NO)',
      version: '1.0.0',
      releaseNotes: '# 1.0.0\n\nCampaign One is complete.\n',
    }));
    expect(undisclosed.status).not.toBe(0);
    expect(undisclosed.stderr).toContain('not externally playtested');

    const disclosed = runGuard('final', writeFixture({
      betaStatus: 'OWNER_WAIVED — HUMAN-UNVALIDATED (BETA_PASS=NO)',
      version: '1.0.0',
      releaseNotes: '# 1.0.0\n\nThis release was not externally playtested.\n',
    }));
    expect(disclosed.status).toBe(0);
  });

  test('current repository guard outcome matches its declared release stage', () => {
    const version: string = readJson('package.json').version;
    const rc = runGuard('rc');
    const final = runGuard('final');

    if (/^1\.0\.0-rc\.\d+$/.test(version)) {
      // A declared release candidate may enter RC but is not yet promotable.
      expect(rc.stderr).toBe('');
      expect(rc.status).toBe(0);
      expect(final.status).not.toBe(0);
    } else if (version === '1.0.0') {
      expect(final.stderr).toBe('');
      expect(final.status).toBe(0);
    } else {
      expect(rc.status).not.toBe(0);
      expect(final.status).not.toBe(0);
    }
  });

  test('current authoritative records keep the waiver distinct from BETA_PASS', () => {
    const beta = read('docs/release/BetaResult.md');
    const decision = read('specification/Technical/OwnerPersonalReleaseDecision.md');

    expect(beta).toContain('**Status:** OWNER_WAIVED — HUMAN-UNVALIDATED (BETA_PASS=NO)');
    expect(beta).not.toContain('**Status:** BETA_PASS');
    expect(decision).toContain('BETA_PASS = NO');
    expect(decision).toContain('BETA_OWNER_WAIVED / HUMAN-UNVALIDATED');
  });
});
