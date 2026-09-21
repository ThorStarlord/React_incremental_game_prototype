#!/usr/bin/env node

/**
 * Player-facing browser qualification for the release contract.
 *
 * This runner intentionally uses only visible DOM interactions. It creates a
 * fresh browser context for each browser family, so prior storage cannot make a
 * New Game check pass accidentally.
 */

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { chromium, firefox } = require('playwright');

const REPO_ROOT = path.resolve(__dirname, '..');
const DEFAULT_URL = process.env.RELEASE_APP_URL || 'http://127.0.0.1:3000';
const DEFAULT_OUT = path.join(REPO_ROOT, '.release-artifacts', 'browser-qualification');
const VIEWPORT = { width: 1280, height: 720 };

function candidateMetadata() {
  let commitSha = process.env.RELEASE_CANDIDATE_SHA || 'unknown';
  try {
    commitSha = execFileSync('git', ['rev-parse', 'HEAD'], {
      cwd: REPO_ROOT,
      encoding: 'utf8',
    }).trim();
  } catch (error) {
    // Artifact generation remains useful in source archives without Git.
  }

  let version = process.env.RELEASE_VERSION || 'unknown';
  try {
    version = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, 'package.json'), 'utf8')).version;
  } catch (error) {
    // Keep the explicit unknown marker rather than inventing release identity.
  }

  return { commitSha, version };
}

function parseArgs(argv) {
  const options = {
    browser: 'all',
    url: DEFAULT_URL,
    out: DEFAULT_OUT,
    headless: process.env.CI === 'true' || process.env.RELEASE_HEADLESS !== 'false',
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--browser') options.browser = argv[++index];
    else if (arg === '--url') options.url = argv[++index];
    else if (arg === '--out') options.out = argv[++index];
    else if (arg === '--headed') options.headless = false;
    else if (arg === '--headless') options.headless = true;
    else if (arg === '--help' || arg === '-h') options.help = true;
    else throw new Error(`Unknown argument: ${arg}`);
  }

  if (!['all', 'chromium', 'firefox'].includes(options.browser)) {
    throw new Error('--browser must be all, chromium, or firefox');
  }
  return options;
}

function printHelp() {
  console.log(`Release browser qualification\n\n` +
    `Usage: node scripts/release-browser-qualification.js [options]\n\n` +
    `Options:\n` +
    `  --browser all|chromium|firefox\n` +
    `  --url <running application URL>\n` +
    `  --out <artifact directory>\n` +
    `  --headed | --headless\n`);
}

function browserEntries(selection) {
  const entries = [
    ['chromium', chromium],
    ['firefox', firefox],
  ];
  return entries.filter(([name]) => selection === 'all' || selection === name);
}

function ensureOutputDirectory(outDir) {
  fs.mkdirSync(outDir, { recursive: true });
}

function withTimeout(promise, timeoutMs, description) {
  let timeout;
  const deadline = new Promise((_, reject) => {
    timeout = setTimeout(() => reject(new Error(`${description} timed out after ${timeoutMs}ms`)), timeoutMs);
  });
  return Promise.race([promise, deadline]).finally(() => clearTimeout(timeout));
}

async function assertVisible(locator, description) {
  await locator.waitFor({ state: 'visible', timeout: 15000 });
  if (!(await locator.isVisible())) {
    throw new Error(`${description} is not visible`);
  }
}

async function runBrowserQualification(name, browserType, options, outDir) {
  const startedAt = new Date().toISOString();
  let browser;
  try {
    browser = await browserType.launch({ headless: options.headless, timeout: 30000 });
  } catch (error) {
    return {
      browser: name,
      browserVersion: 'unavailable',
      os: `${os.platform()} ${os.release()} ${os.arch()}`,
      viewport: VIEWPORT,
      url: options.url,
      startedAt,
      completedAt: new Date().toISOString(),
      status: 'FAIL',
      checks: [],
      error: `browser launch failed: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
  let context;
  let page;
  try {
    context = await withTimeout(browser.newContext({
      viewport: VIEWPORT,
      colorScheme: 'dark',
    }), 15000, `${name} context creation`);
    page = await withTimeout(context.newPage(), 15000, `${name} page creation`);
  } catch (error) {
    await withTimeout(browser.close(), 5000, `${name} browser close`).catch(() => undefined);
    return {
      browser: name,
      browserVersion: browser.version(),
      os: `${os.platform()} ${os.release()} ${os.arch()}`,
      viewport: VIEWPORT,
      url: options.url,
      startedAt,
      completedAt: new Date().toISOString(),
      status: 'FAIL',
      checks: [],
      error: `browser context/page setup failed: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
  const checks = [];

  const check = async (id, operation) => {
    try {
      await operation();
      checks.push({ id, status: 'PASS' });
    } catch (error) {
      checks.push({ id, status: 'FAIL', error: error instanceof Error ? error.message : String(error) });
      throw error;
    }
  };

  try {
    await check('root-route-loads', async () => {
      // Chromium reliably emits DOMContentLoaded for CRA's dev server. Firefox
      // can keep the development connection open before that event, so its
      // execution uses commit and relies on the visible landmark assertion.
      await page.goto(options.url, {
        waitUntil: name === 'firefox' ? 'commit' : 'domcontentloaded',
        timeout: 30000,
      });
      await assertVisible(page.getByRole('heading', { name: 'Incremental RPG' }), 'main heading');
    });

    await check('primary-actions-visible', async () => {
      await assertVisible(page.getByRole('button', { name: /^New Game$/ }), 'New Game button');
      await assertVisible(page.getByRole('button', { name: /^Load Game$/ }), 'Load Game button');
      await assertVisible(page.getByRole('button', { name: /^About$/ }), 'About button');
    });

    await check('keyboard-focus-visible', async () => {
      await page.keyboard.press('Tab');
      const focused = page.locator(':focus-visible');
      await assertVisible(focused, 'first keyboard-focused control');
      const box = await focused.boundingBox();
      if (!box || box.width <= 0 || box.height <= 0) {
        throw new Error('keyboard-focused control has no visible bounds');
      }
    });

    await check('new-game-keyboard-activation', async () => {
      const newGame = page.getByRole('button', { name: /^New Game$/ });
      await newGame.focus();
      await page.keyboard.press('Enter');
      await page.waitForURL(/\/game(?:\/|$)/, { timeout: 30000 });
      await assertVisible(page.getByRole('main').first(), 'game main landmark');
    });

    await check('game-navigation-visible', async () => {
      const navigation = page.getByRole('button', { name: /^Navigate to / }).first();
      await assertVisible(navigation, 'game navigation control');
    });

    await check('invalid-route-recovers', async () => {
      await page.goto(new URL('/route-that-does-not-exist', options.url).toString(), {
        waitUntil: name === 'firefox' ? 'commit' : 'domcontentloaded',
        timeout: 30000,
      });
      await page.waitForURL(/\/$|\/menu$/, { timeout: 15000 });
      await assertVisible(page.getByRole('heading', { name: 'Incremental RPG' }), 'recovered main heading');
    });

    await check('invalid-import-stays-in-import-flow', async () => {
      await page.getByRole('button', { name: /^Import$/ }).click();
      await assertVisible(page.getByRole('heading', { name: 'Import Save' }), 'import dialog');
      await page.locator('textarea').fill('not-a-valid-save-code');
      await page.getByRole('button', { name: /^Import$/ }).last().click();
      await assertVisible(page.getByRole('heading', { name: 'Import Save' }), 'rejected import dialog');
      await assertVisible(
        page.getByRole('alert').filter({ hasText: 'Invalid or incompatible save code' }),
        'invalid import error feedback'
      );
      await page.getByRole('button', { name: /^Cancel$/ }).click();
    });

    await check('empty-load-state-is-explicit', async () => {
      await page.getByRole('button', { name: /^Load Game$/ }).click();
      await assertVisible(page.getByText('No saved games found.'), 'empty load state');
      await page.getByRole('button', { name: /^Cancel$/ }).click();
    });

    return {
      browser: name,
      browserVersion: browser.version(),
      os: `${os.platform()} ${os.release()} ${os.arch()}`,
      viewport: VIEWPORT,
      url: options.url,
      startedAt,
      completedAt: new Date().toISOString(),
      status: 'PASS',
      checks,
    };
  } catch (error) {
    return {
      browser: name,
      browserVersion: browser.version(),
      os: `${os.platform()} ${os.release()} ${os.arch()}`,
      viewport: VIEWPORT,
      url: options.url,
      startedAt,
      completedAt: new Date().toISOString(),
      status: 'FAIL',
      checks,
      error: error instanceof Error ? error.message : String(error),
    };
  } finally {
    await withTimeout(page.screenshot({
      path: path.join(outDir, `${name}-final.png`),
      fullPage: true,
    }), 5000, `${name} final screenshot`).catch(() => undefined);
    await withTimeout(context.close(), 5000, `${name} context close`).catch(() => undefined);
    await withTimeout(browser.close(), 5000, `${name} browser close`).catch(() => undefined);
  }
}

function renderMarkdown(record) {
  const rows = record.results.map(result =>
    `| ${result.browser} | ${result.browserVersion} | ${result.os} | ${result.viewport.width}×${result.viewport.height} | ${result.status} |`
  ).join('\n');
  const details = record.results.map(result => {
    const checks = result.checks.map(check => `- ${check.status}: ${check.id}${check.error ? ` — ${check.error}` : ''}`).join('\n');
    return `## ${result.browser}\n\n${checks}${result.error ? `\n\nError: ${result.error}` : ''}`;
  }).join('\n\n');

  return `# Browser Qualification\n\n` +
    `- Generated: ${record.generatedAt}\n` +
    `- Candidate version: ${record.candidate.version}\n` +
    `- Candidate commit: ${record.candidate.commitSha}\n` +
    `- URL: ${record.url}\n` +
    `- Host: ${record.host}\n` +
    `- Overall result: **${record.status}**\n\n` +
    `| Browser | Version | OS | Viewport | Result |\n| --- | --- | --- | --- | --- |\n${rows}\n\n` +
    details + '\n';
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    printHelp();
    return;
  }

  ensureOutputDirectory(options.out);
  const results = [];
  for (const [name, browserType] of browserEntries(options.browser)) {
    console.log(`[release:browser] ${name}`);
    results.push(await runBrowserQualification(name, browserType, options, options.out));
  }

  const record = {
    generatedAt: new Date().toISOString(),
    candidate: candidateMetadata(),
    host: `${os.platform()} ${os.release()} ${os.arch()}`,
    url: options.url,
    viewport: VIEWPORT,
    status: results.every(result => result.status === 'PASS') ? 'PASS' : 'FAIL',
    results,
  };
  fs.writeFileSync(path.join(options.out, 'browser-qualification.json'), `${JSON.stringify(record, null, 2)}\n`);
  fs.writeFileSync(path.join(options.out, 'browser-qualification.md'), renderMarkdown(record));

  console.log(`[release:browser] artifact: ${path.join(options.out, 'browser-qualification.md')}`);
  if (record.status !== 'PASS') process.exitCode = 1;
}

main().catch(error => {
  console.error(`[release:browser] FAILED: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
