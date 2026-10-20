import fs from 'fs';
import path from 'path';

const read = (relativePath: string): string =>
  fs.readFileSync(path.join(process.cwd(), relativePath), 'utf8');

const readJson = (relativePath: string): any =>
  JSON.parse(read(relativePath));

describe('GC-13 deterministic Beta technical readiness', () => {
  test('candidate identity is consistent across package, lockfile, and app', () => {
    const packageJson = readJson('package.json');
    const packageLock = readJson('package-lock.json');
    const versionSource = read('src/shared/config/releaseVersion.ts');

    expect(packageJson.version).toMatch(/^1\.0\.0(-rc\.\d+)?$/);
    expect(packageLock.version).toBe(packageJson.version);
    expect(packageLock.packages[''].version).toBe(packageJson.version);
    expect(versionSource).toContain(`APP_VERSION = '${packageJson.version}'`);
  });

  test('release-hardening utilities are wired to one package command surface', () => {
    const scripts = readJson('package.json').scripts;

    const requiredScripts = [
      'architecture:cycles',
      'architecture:persistence',
      'lint:release',
      'security:release',
      'release:evidence:validate',
      'release:manifest',
      'release:browser',
      'release:validate',
      'release:1.0',
      'beta:technical:validate',
    ];

    for (const script of requiredScripts) {
      expect(typeof scripts[script]).toBe('string');
      expect(scripts[script].trim().length).toBeGreaterThan(0);
    }

    expect(scripts['beta:technical:validate']).toContain('architecture:cycles');
    expect(scripts['beta:technical:validate']).toContain('architecture:persistence');
    expect(scripts['beta:technical:validate']).toContain('content-alpha:validate');
    expect(scripts['beta:technical:validate']).toContain('saveUtils.test.ts');
    expect(scripts['beta:technical:validate']).toContain('GameLoopM21OfflineProgress.test.ts');
  });

  test('browser qualification covers both supported browser families and visible input/recovery behavior', () => {
    const source = read('scripts/release-browser-qualification.js');

    expect(source).toContain("['chromium', chromium]");
    expect(source).toContain("['firefox', firefox]");
    expect(source).toContain('const VIEWPORT = { width: 1280, height: 720 }');
    expect(source).toContain("'keyboard-focus-visible'");
    expect(source).toContain("'new-game-keyboard-activation'");
    expect(source).toContain("'invalid-route-recovers'");
    expect(source).toContain("'invalid-import-stays-in-import-flow'");
    expect(source).toContain("getByRole('alert')");
    expect(source).toContain('Invalid or incompatible save code');
    expect(source).not.toContain('page.evaluate(');
  });

  test('invalid import recovery is visible and remains non-destructive', () => {
    const hook = read('src/hooks/useGameImportExport.ts');
    const dialog = read('src/pages/MainMenu/dialogs/ImportDialog.tsx');

    expect(hook).toContain(
      "setImportError('Invalid or incompatible save code. Check the code and try again.')"
    );
    expect(hook).toContain('return false');
    expect(dialog).toContain('role="alert"');
    expect(dialog).toContain('aria-describedby');
  });

  test('Beta record keeps the owner waiver distinct from human evidence and the RC record stays honest', () => {
    const beta = read('docs/release/BetaResult.md');
    const rc = read('docs/release/ReleaseCandidateResult.md');
    const defects = read('docs/release/KnownDefects.md');

    expect(beta).toContain('**Status:** OWNER_WAIVED — HUMAN-UNVALIDATED (BETA_PASS=NO)');
    expect(beta).toContain('| Five fresh-player first-session observations | NOT RECORDED |');
    expect(beta).toContain('| Three beginning-to-ending external playthroughs | NOT RECORDED |');
    expect(beta).toContain('Five fresh-player first-session observations');
    expect(beta).toContain('Three beginning-to-ending external playthroughs');
    expect(beta).not.toContain('**Status:** BETA_PASS');

    // The RC record is either a declared candidate awaiting its exact-head
    // run or a qualified one tied to that run; it never claims human evidence.
    expect(rc).toMatch(/\*\*Status:\*\* (RC-\d+ DECLARED — QUALIFICATION PENDING|RC-\d+ QUALIFIED\b.*)/);
    expect(rc).toContain('BETA_PASS = NO / HUMAN-UNVALIDATED');
    expect(rc).toContain('full-campaign-release-run');
    expect(rc).not.toMatch(/human evidence (recorded|accepted)/i);

    for (const defect of ['KD-001', 'KD-002', 'KD-003', 'KD-004']) {
      expect(defects).toContain(defect);
    }
  });

  test('deterministic release runner does not convert its own success into promotion authority', () => {
    const source = read('scripts/release-one-point-zero.js');

    expect(source).toContain('promotion still requires the release guard and an exact-candidate RC record');
    expect(source).not.toMatch(/git\s+tag|npm\s+publish|gh\s+release/);
  });
});
