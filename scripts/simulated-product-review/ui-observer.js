#!/usr/bin/env node

/**
 * UI-only observation/action harness for blind simulated product review.
 *
 * V2 integrity guarantees:
 * - fresh ephemeral Playwright browser context per invocation;
 * - participant controls use observation-bound opaque action IDs;
 * - stale or mismatched control sets fail closed before any click/fill;
 * - participant relay artifacts are generated directly from observations;
 * - append-only session ledger records operational provenance only;
 * - no Redux/localStorage/content JSON/source-map/debug-state access.
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { chromium } = require('playwright');
const { sha256, bindControls, validateBoundAction } = require('./action-contract');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const PROFILE_PATH = path.join(__dirname, 'profiles-v2.json');
const DEFAULT_URL = 'http://127.0.0.1:3000';
const DEFAULT_OUT_ROOT = path.join(REPO_ROOT, '.simulated-review-output');

const INTERACTIVE_SELECTOR = [
  'button:not([disabled])',
  'a[href]',
  'input:not([disabled])',
  'textarea:not([disabled])',
  'select:not([disabled])',
  '[role="button"]:not([aria-disabled="true"])',
  '[role="link"]',
  '[contenteditable="true"]',
].join(',');

function parseArgs(argv) {
  const options = {
    smoke: false,
    headless: process.env.CI === 'true',
    url: DEFAULT_URL,
    out: null,
    profile: null,
    screenshotRelayCapable: 'unknown',
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--smoke') options.smoke = true;
    else if (arg === '--headless') options.headless = true;
    else if (arg === '--headed') options.headless = false;
    else if (arg === '--url') options.url = argv[++index];
    else if (arg === '--out') options.out = argv[++index];
    else if (arg === '--profile') options.profile = argv[++index];
    else if (arg === '--screenshot-relay-capable') options.screenshotRelayCapable = argv[++index];
    else if (arg === '--help' || arg === '-h') options.help = true;
    else throw new Error(`Unknown argument: ${arg}`);
  }

  if (!['yes', 'no', 'unknown'].includes(options.screenshotRelayCapable)) {
    throw new Error('--screenshot-relay-capable must be yes, no, or unknown');
  }
  return options;
}

function loadProfiles() {
  return JSON.parse(fs.readFileSync(PROFILE_PATH, 'utf8')).profiles;
}

function resolveProfile(profileId, smoke) {
  if (smoke && !profileId) return null;
  if (!profileId) throw new Error('Interactive review requires --profile <id>.');
  const profile = loadProfiles().find((candidate) => candidate.id === profileId);
  if (!profile) throw new Error(`Unknown profile '${profileId}'. See ${PROFILE_PATH}.`);
  return profile;
}

function printHelp() {
  console.log(`Blind simulated-review UI observer V2\n\n` +
    `Usage:\n` +
    `  node scripts/simulated-product-review/ui-observer.js --profile <id> [--url <url>] [--out <dir>] [--headed|--headless] [--screenshot-relay-capable yes|no|unknown]\n` +
    `  node scripts/simulated-product-review/ui-observer.js --smoke --headless [--url <url>] [--out <dir>]\n\n` +
    `Interactive commands:\n` +
    `  snapshot\n` +
    `  click <action-id>\n` +
    `  fill <action-id> <text>\n` +
    `  press <key>\n` +
    `  back\n` +
    `  quit\n`);
}

function slugTimestamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

function appendLedger(state, event, data = {}) {
  const record = { at: new Date().toISOString(), event, ...data };
  fs.appendFileSync(path.join(state.outDir, 'session-ledger.jsonl'), `${JSON.stringify(record)}\n`);
}

async function collectControlEntries(page) {
  const locator = page.locator(INTERACTIVE_SELECTOR);
  const count = await locator.count();
  const controls = [];

  for (let sourceIndex = 0; sourceIndex < count; sourceIndex += 1) {
    const candidate = locator.nth(sourceIndex);
    let visible = false;
    try {
      visible = await candidate.isVisible();
    } catch {
      visible = false;
    }
    if (!visible) continue;

    const handle = await candidate.elementHandle();
    if (!handle) continue;
    const tag = await candidate.evaluate((element) => element.tagName.toLowerCase());
    const role = await candidate.getAttribute('role');
    const type = await candidate.getAttribute('type');
    const ariaLabel = await candidate.getAttribute('aria-label');
    const placeholder = await candidate.getAttribute('placeholder');
    const href = await candidate.getAttribute('href');
    const text = ((await candidate.innerText().catch(() => '')) || '').trim().replace(/\s+/g, ' ').slice(0, 240);

    controls.push({
      handle,
      metadata: {
        controlNumber: controls.length + 1,
        tag,
        role,
        type,
        text,
        ariaLabel,
        placeholder,
        href,
      },
    });
  }
  return controls;
}

function labelFor(control) {
  return control.text || control.ariaLabel || control.placeholder || control.href || '(unlabelled)';
}

function observationMarkdown(observation) {
  const controlLines = observation.controls.length
    ? observation.controls.map((control) => `${control.actionId} | ${control.controlNumber}. ${control.tag} | ${JSON.stringify(labelFor(control))}`).join('\n')
    : '(no visible interactive controls detected)';
  return `# Player-Facing Observation ${observation.sequence}\n\n` +
    `- Observation ID: ${observation.observationId}\n` +
    `- Session: ${observation.sessionId}\n` +
    `- Profile: ${observation.profile || 'CI smoke'}\n` +
    `- URL: ${observation.url}\n` +
    `- Title: ${observation.title}\n` +
    `- Captured: ${observation.capturedAt}\n` +
    `- Screenshot: ${observation.screenshot}\n` +
    `- Observation digest: ${observation.observationDigest}\n` +
    `- Control-set digest: ${observation.controlSetDigest}\n\n` +
    `## Visible text\n\n${observation.visibleText || '(no visible text)'}\n\n` +
    `## Bound visible controls\n\n${controlLines}\n`;
}

function participantRelayMarkdown(observation, screenshotRelayCapable) {
  const controlLines = observation.controls.length
    ? observation.controls.map((control) => `${control.actionId} — [${control.tag}] ${labelFor(control)}`).join('\n')
    : '(no visible interactive controls detected)';
  return `OBSERVATION ${String(observation.sequence).padStart(3, '0')}\n\n` +
    `URL: ${observation.url}\n` +
    `TITLE: ${observation.title}\n` +
    `SCREENSHOT_RELAY_CAPABLE: ${screenshotRelayCapable.toUpperCase()}\n\n` +
    `VISIBLE TEXT:\n${observation.visibleText || '(no visible text)'}\n\n` +
    `VISIBLE CONTROLS:\n${controlLines}\n\n` +
    `Use the action ID exactly as shown for click/fill commands.\n`;
}

async function captureObservation(page, state) {
  state.sequence += 1;
  const sequenceText = String(state.sequence).padStart(3, '0');
  const entries = await collectControlEntries(page);
  const binding = bindControls(state.sequence, entries.map((entry) => entry.metadata));
  const visibleText = ((await page.locator('body').innerText()) || '').trim();
  const title = await page.title();
  const screenshotName = `observation-${sequenceText}.png`;
  const jsonName = `observation-${sequenceText}.json`;
  const markdownName = `observation-${sequenceText}.md`;
  const relayName = `participant-relay-${sequenceText}.md`;

  await page.screenshot({ path: path.join(state.outDir, screenshotName), fullPage: true });

  const observation = {
    protocolVersion: 2,
    sessionId: state.sessionId,
    sequence: state.sequence,
    observationId: binding.observationId,
    profile: state.profile ? state.profile.id : null,
    capturedAt: new Date().toISOString(),
    url: page.url(),
    title,
    visibleText,
    controls: binding.controls,
    controlSetDigest: binding.controlSetDigest,
    screenshot: screenshotName,
  };
  observation.observationDigest = sha256({
    protocolVersion: observation.protocolVersion,
    observationId: observation.observationId,
    url: observation.url,
    title: observation.title,
    visibleText: observation.visibleText,
    controls: observation.controls,
    screenshot: observation.screenshot,
  });

  const relay = participantRelayMarkdown(observation, state.screenshotRelayCapable);
  observation.participantRelay = relayName;
  observation.relayDigest = sha256(relay);

  fs.writeFileSync(path.join(state.outDir, jsonName), `${JSON.stringify(observation, null, 2)}\n`);
  fs.writeFileSync(path.join(state.outDir, markdownName), observationMarkdown(observation));
  fs.writeFileSync(path.join(state.outDir, relayName), relay);

  state.lastObservation = observation;
  appendLedger(state, 'OBSERVATION_CAPTURED', {
    observationId: observation.observationId,
    observationDigest: observation.observationDigest,
    controlSetDigest: observation.controlSetDigest,
  });
  appendLedger(state, 'OBSERVATION_RELAY_ARTIFACT_FROZEN', {
    observationId: observation.observationId,
    relay: relayName,
    relayDigest: observation.relayDigest,
    screenshotRelayCapable: state.screenshotRelayCapable,
  });
  return observation;
}

function printObservation(observation, state) {
  const relay = fs.readFileSync(path.join(state.outDir, observation.participantRelay), 'utf8');
  console.log('\n============================================================');
  console.log(relay);
  console.log('============================================================\n');
}

async function validateCurrentBinding(page, actionId, deliveredObservation) {
  const entries = await collectControlEntries(page);
  const validation = validateBoundAction(actionId, deliveredObservation, entries.map((entry) => entry.metadata));
  return { entries, validation };
}

async function executeCommand(page, commandLine, state) {
  const trimmed = commandLine.trim();
  appendLedger(state, 'PARTICIPANT_ACTION_RECEIVED', {
    observationId: state.lastObservation ? state.lastObservation.observationId : null,
    command: trimmed,
  });

  if (!trimmed) return { quit: false, changed: false, message: 'Empty command.' };
  if (trimmed === 'snapshot') return { quit: false, changed: false };
  if (trimmed === 'back') {
    await page.goBack({ waitUntil: 'domcontentloaded' }).catch(() => null);
    appendLedger(state, 'ACTION_EXECUTED', { command: trimmed, observationId: state.lastObservation.observationId });
    return { quit: false, changed: true };
  }
  if (trimmed === 'quit') {
    appendLedger(state, 'SESSION_QUIT', { observationId: state.lastObservation ? state.lastObservation.observationId : null });
    return { quit: true, changed: false };
  }

  const clickMatch = trimmed.match(/^click\s+([A-Z0-9-]+)$/i);
  if (clickMatch) {
    const actionId = clickMatch[1].toUpperCase();
    const { entries, validation } = await validateCurrentBinding(page, actionId, state.lastObservation);
    appendLedger(state, 'ACTION_VALIDATED', { actionId, ...validation });
    if (!validation.ok) {
      appendLedger(state, 'ACTION_REJECTED', { actionId, code: validation.code });
      return { quit: false, changed: false, refreshObservation: true, message: validation.code };
    }
    const entry = entries[validation.controlNumber - 1];
    await entry.handle.click();
    appendLedger(state, 'ACTION_EXECUTED', { actionId, command: 'click', observationId: state.lastObservation.observationId });
    return { quit: false, changed: true };
  }

  const fillMatch = trimmed.match(/^fill\s+([A-Z0-9-]+)\s+([\s\S]+)$/i);
  if (fillMatch) {
    const actionId = fillMatch[1].toUpperCase();
    const { entries, validation } = await validateCurrentBinding(page, actionId, state.lastObservation);
    appendLedger(state, 'ACTION_VALIDATED', { actionId, ...validation });
    if (!validation.ok) {
      appendLedger(state, 'ACTION_REJECTED', { actionId, code: validation.code });
      return { quit: false, changed: false, refreshObservation: true, message: validation.code };
    }
    const entry = entries[validation.controlNumber - 1];
    await entry.handle.fill(fillMatch[2]);
    appendLedger(state, 'ACTION_EXECUTED', { actionId, command: 'fill', observationId: state.lastObservation.observationId });
    return { quit: false, changed: true };
  }

  const pressMatch = trimmed.match(/^press\s+(.+)$/i);
  if (pressMatch) {
    await page.keyboard.press(pressMatch[1]);
    appendLedger(state, 'ACTION_EXECUTED', { command: trimmed, observationId: state.lastObservation.observationId });
    return { quit: false, changed: true };
  }

  throw new Error(`Unsupported command: ${trimmed}`);
}

function createPrompt() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return {
    ask(question) { return new Promise((resolve) => rl.question(question, resolve)); },
    close() { rl.close(); },
  };
}

async function runSmoke(page, state) {
  const first = await captureObservation(page, state);
  if (!first.visibleText.length) throw new Error('Smoke failure: no rendered visible text.');
  if (!first.controls.length) throw new Error('Smoke failure: no ordinary visible controls.');
  if (!fs.existsSync(path.join(state.outDir, first.screenshot))) throw new Error('Smoke failure: screenshot missing.');
  if (!fs.existsSync(path.join(state.outDir, first.participantRelay))) throw new Error('Smoke failure: participant relay missing.');

  const validAction = first.controls[0].actionId;
  const invalidAction = `${validAction.slice(0, -1)}${validAction.endsWith('0') ? '1' : '0'}`;
  const currentBefore = await collectControlEntries(page);
  const invalid = validateBoundAction(invalidAction, first, currentBefore.map((entry) => entry.metadata));
  if (invalid.ok || invalid.code !== 'INVALID_ACTION_ID') throw new Error('Smoke failure: invalid action ID was not rejected.');

  const result = await executeCommand(page, `click ${validAction}`, state);
  if (!result.changed) throw new Error('Smoke failure: valid action did not execute.');
  await page.waitForTimeout(400);

  const afterEntries = await collectControlEntries(page);
  const stale = validateBoundAction(validAction, first, afterEntries.map((entry) => entry.metadata));
  if (stale.ok) throw new Error('Smoke failure: stale action remained valid after UI transition.');

  const second = await captureObservation(page, state);
  console.log(`SIMULATED_REVIEW_V2_LIVE_SMOKE_PASS observations=${second.sequence} firstControls=${first.controls.length} staleCode=${stale.code}`);
}

async function runInteractive(page, state) {
  const prompt = createPrompt();
  try {
    let observation = await captureObservation(page, state);
    printObservation(observation, state);
    while (true) {
      const command = await prompt.ask('review-action> ');
      try {
        const result = await executeCommand(page, command, state);
        if (result.quit) break;
        if (result.message) console.log(result.message);
        if (result.changed) {
          await page.waitForLoadState('domcontentloaded', { timeout: 5000 }).catch(() => null);
          await page.waitForTimeout(400);
        }
        if (result.changed || result.refreshObservation || command.trim() === 'snapshot') {
          observation = await captureObservation(page, state);
          printObservation(observation, state);
        }
      } catch (error) {
        console.error(`[command-error] ${error.message}`);
        appendLedger(state, 'ACTION_ERROR', { message: error.message });
      }
    }
  } finally {
    prompt.close();
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) return printHelp();
  const profile = resolveProfile(options.profile, options.smoke);
  const sessionId = `${profile ? profile.id : 'smoke'}-${slugTimestamp()}`;
  const outDir = path.resolve(options.out || path.join(DEFAULT_OUT_ROOT, sessionId));
  fs.mkdirSync(outDir, { recursive: true });

  const sessionMetadata = {
    protocolVersion: 2,
    sessionId,
    profile: profile ? profile.id : null,
    profilePacket: profile ? profile.packet : null,
    startedAt: new Date().toISOString(),
    targetUrl: options.url,
    freshEphemeralBrowserContext: true,
    hiddenStateInspection: false,
    debugInjection: false,
    screenshotRelayCapable: options.screenshotRelayCapable,
    participantRelayGeneratedByHarness: true,
    observationBoundActionIds: true,
    staleActionsFailClosed: true,
  };
  fs.writeFileSync(path.join(outDir, 'session.json'), `${JSON.stringify(sessionMetadata, null, 2)}\n`);

  const browser = await chromium.launch({ headless: options.headless });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  const state = {
    sessionId,
    profile,
    outDir,
    sequence: 0,
    lastObservation: null,
    screenshotRelayCapable: options.screenshotRelayCapable,
  };
  appendLedger(state, 'SESSION_STARTED', { ...sessionMetadata });

  try {
    await page.goto(options.url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    if (options.smoke) await runSmoke(page, state);
    else {
      console.log(`Profile: ${profile.name}`);
      console.log(`Packet: ${profile.packet}`);
      console.log(`Output: ${outDir}`);
      console.log('Relay participant-relay-NNN.md verbatim; do not reconstruct control numbering.\n');
      await runInteractive(page, state);
    }
  } finally {
    appendLedger(state, 'SESSION_CLOSED');
    await context.close();
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error.stack || error.message || String(error));
  process.exitCode = 1;
});
