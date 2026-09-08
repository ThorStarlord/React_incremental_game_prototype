#!/usr/bin/env node

/**
 * UI-only observation/action harness for the post-M25 blind simulated review.
 *
 * Evidence boundary:
 * - Uses a fresh ephemeral Playwright browser context for every invocation.
 * - Reads rendered visible text and ordinary player-facing control metadata.
 * - Executes only ordinary UI actions selected by the participant/controller.
 * - Does not inspect Redux, localStorage, content JSON, source maps, fixtures, or
 *   other hidden implementation state.
 *
 * Interactive example:
 *   npm run simulated-review:observe -- --profile goal-focused --url http://127.0.0.1:3000
 *
 * CI smoke example:
 *   npm run simulated-review:smoke
 */

const fs = require("fs");
const path = require("path");
const readline = require("readline");
const { chromium } = require("playwright");

const REPO_ROOT = path.resolve(__dirname, "..", "..");
const PROFILE_PATH = path.join(__dirname, "profiles.json");
const DEFAULT_URL = "http://127.0.0.1:3000";
const DEFAULT_OUT_ROOT = path.join(REPO_ROOT, ".simulated-review-output");

const INTERACTIVE_SELECTOR = [
  "button:not([disabled])",
  "a[href]",
  "input:not([disabled])",
  "textarea:not([disabled])",
  "select:not([disabled])",
  '[role="button"]:not([aria-disabled="true"])',
  '[role="link"]',
  '[contenteditable="true"]',
].join(",");

function parseArgs(argv) {
  const options = {
    smoke: false,
    headless: process.env.CI === "true",
    url: DEFAULT_URL,
    out: null,
    profile: null,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--smoke") {
      options.smoke = true;
    } else if (arg === "--headless") {
      options.headless = true;
    } else if (arg === "--headed") {
      options.headless = false;
    } else if (arg === "--url") {
      options.url = argv[++index];
    } else if (arg === "--out") {
      options.out = argv[++index];
    } else if (arg === "--profile") {
      options.profile = argv[++index];
    } else if (arg === "--help" || arg === "-h") {
      options.help = true;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return options;
}

function loadProfiles() {
  const manifest = JSON.parse(fs.readFileSync(PROFILE_PATH, "utf8"));
  return manifest.profiles;
}

function resolveProfile(profileId, smoke) {
  if (smoke && !profileId) return null;
  if (!profileId) {
    throw new Error("Interactive review requires --profile <id>.");
  }

  const profile = loadProfiles().find((candidate) => candidate.id === profileId);
  if (!profile) {
    throw new Error(`Unknown profile '${profileId}'. See ${PROFILE_PATH}.`);
  }
  return profile;
}

function printHelp() {
  console.log(`Blind simulated-review UI observer\n\n` +
    `Usage:\n` +
    `  node scripts/simulated-product-review/ui-observer.js --profile <id> [--url <url>] [--out <dir>] [--headed|--headless]\n` +
    `  node scripts/simulated-product-review/ui-observer.js --smoke --headless [--url <url>] [--out <dir>]\n\n` +
    `Interactive commands:\n` +
    `  snapshot\n` +
    `  click <control-number>\n` +
    `  fill <control-number> <text>\n` +
    `  press <key>\n` +
    `  back\n` +
    `  quit\n`);
}

function slugTimestamp() {
  return new Date().toISOString().replace(/[:.]/g, "-");
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

    const tag = await candidate.evaluate((element) => element.tagName.toLowerCase());
    const role = await candidate.getAttribute("role");
    const type = await candidate.getAttribute("type");
    const ariaLabel = await candidate.getAttribute("aria-label");
    const placeholder = await candidate.getAttribute("placeholder");
    const href = await candidate.getAttribute("href");
    const text = ((await candidate.innerText().catch(() => "")) || "").trim().replace(/\s+/g, " ").slice(0, 240);

    controls.push({
      locator: candidate,
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

function observationMarkdown(observation) {
  const controlLines = observation.controls.length
    ? observation.controls.map((control) => {
        const descriptors = [
          control.tag,
          control.role ? `role=${control.role}` : null,
          control.type ? `type=${control.type}` : null,
          control.text ? `text=${JSON.stringify(control.text)}` : null,
          control.ariaLabel ? `aria=${JSON.stringify(control.ariaLabel)}` : null,
          control.placeholder ? `placeholder=${JSON.stringify(control.placeholder)}` : null,
          control.href ? `href=${JSON.stringify(control.href)}` : null,
        ].filter(Boolean);
        return `${control.controlNumber}. ${descriptors.join(" | ")}`;
      }).join("\n")
    : "(no visible interactive controls detected)";

  return `# Player-Facing Observation ${observation.sequence}\n\n` +
    `- Session: ${observation.sessionId}\n` +
    `- Profile: ${observation.profile || "CI smoke"}\n` +
    `- URL: ${observation.url}\n` +
    `- Title: ${observation.title}\n` +
    `- Captured: ${observation.capturedAt}\n` +
    `- Screenshot: ${observation.screenshot}\n\n` +
    `## Visible text\n\n${observation.visibleText || "(no visible text)"}\n\n` +
    `## Visible controls\n\n${controlLines}\n`;
}

async function captureObservation(page, state) {
  state.sequence += 1;
  const sequence = String(state.sequence).padStart(3, "0");
  const controls = await collectControlEntries(page);
  const visibleText = ((await page.locator("body").innerText()) || "").trim();
  const screenshotName = `observation-${sequence}.png`;
  const jsonName = `observation-${sequence}.json`;
  const markdownName = `observation-${sequence}.md`;

  await page.screenshot({
    path: path.join(state.outDir, screenshotName),
    fullPage: true,
  });

  const observation = {
    protocolVersion: 1,
    sessionId: state.sessionId,
    sequence: state.sequence,
    profile: state.profile ? state.profile.id : null,
    capturedAt: new Date().toISOString(),
    url: page.url(),
    title: await page.title(),
    visibleText,
    controls: controls.map((entry) => entry.metadata),
    screenshot: screenshotName,
  };

  fs.writeFileSync(path.join(state.outDir, jsonName), `${JSON.stringify(observation, null, 2)}\n`);
  fs.writeFileSync(path.join(state.outDir, markdownName), observationMarkdown(observation));

  state.lastObservation = observation;
  return observation;
}

function printObservation(observation) {
  console.log("\n============================================================");
  console.log(`Observation ${observation.sequence} | ${observation.url}`);
  console.log("============================================================\n");
  console.log(observation.visibleText || "(no visible text)");
  console.log("\n--- Visible controls ---");
  if (!observation.controls.length) {
    console.log("(none)");
  } else {
    for (const control of observation.controls) {
      const label = control.text || control.ariaLabel || control.placeholder || control.href || "(unlabelled)";
      console.log(`${control.controlNumber}. [${control.tag}] ${label}`);
    }
  }
  console.log("\n============================================================\n");
}

async function executeCommand(page, commandLine) {
  const trimmed = commandLine.trim();
  if (!trimmed) return { quit: false, changed: false, message: "Empty command." };

  if (trimmed === "snapshot") {
    return { quit: false, changed: false };
  }
  if (trimmed === "back") {
    await page.goBack({ waitUntil: "domcontentloaded" }).catch(() => null);
    return { quit: false, changed: true };
  }
  if (trimmed === "quit") {
    return { quit: true, changed: false };
  }

  const clickMatch = trimmed.match(/^click\s+(\d+)$/i);
  if (clickMatch) {
    const entries = await collectControlEntries(page);
    const index = Number(clickMatch[1]) - 1;
    if (!entries[index]) throw new Error(`Visible control ${clickMatch[1]} does not exist.`);
    await entries[index].locator.click();
    return { quit: false, changed: true };
  }

  const fillMatch = trimmed.match(/^fill\s+(\d+)\s+([\s\S]+)$/i);
  if (fillMatch) {
    const entries = await collectControlEntries(page);
    const index = Number(fillMatch[1]) - 1;
    if (!entries[index]) throw new Error(`Visible control ${fillMatch[1]} does not exist.`);
    await entries[index].locator.fill(fillMatch[2]);
    return { quit: false, changed: true };
  }

  const pressMatch = trimmed.match(/^press\s+(.+)$/i);
  if (pressMatch) {
    await page.keyboard.press(pressMatch[1]);
    return { quit: false, changed: true };
  }

  throw new Error(`Unsupported command: ${trimmed}`);
}

function createPrompt() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return {
    async ask(question) {
      return new Promise((resolve) => rl.question(question, resolve));
    },
    close() {
      rl.close();
    },
  };
}

async function runSmoke(page, state) {
  const observation = await captureObservation(page, state);
  if (observation.visibleText.length < 1) {
    throw new Error("Smoke failure: ordinary game page exposed no rendered visible text.");
  }
  if (!fs.existsSync(path.join(state.outDir, observation.screenshot))) {
    throw new Error("Smoke failure: screenshot was not produced.");
  }
  console.log(`SIMULATED_REVIEW_UI_SMOKE_PASS observation=${observation.sequence} controls=${observation.controls.length}`);
}

async function runInteractive(page, state) {
  const prompt = createPrompt();
  try {
    let observation = await captureObservation(page, state);
    printObservation(observation);

    while (true) {
      const command = await prompt.ask("review-action> ");
      try {
        const result = await executeCommand(page, command);
        if (result.quit) break;
        if (result.message) console.log(result.message);
        if (result.changed) {
          await page.waitForLoadState("domcontentloaded", { timeout: 5000 }).catch(() => null);
          await page.waitForTimeout(400);
        }
        observation = await captureObservation(page, state);
        printObservation(observation);
      } catch (error) {
        console.error(`[command-error] ${error.message}`);
      }
    }
  } finally {
    prompt.close();
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    printHelp();
    return;
  }

  const profile = resolveProfile(options.profile, options.smoke);
  const sessionId = `${profile ? profile.id : "smoke"}-${slugTimestamp()}`;
  const outDir = path.resolve(options.out || path.join(DEFAULT_OUT_ROOT, sessionId));
  fs.mkdirSync(outDir, { recursive: true });

  const sessionMetadata = {
    protocolVersion: 1,
    sessionId,
    profile: profile ? profile.id : null,
    profilePacket: profile ? profile.packet : null,
    startedAt: new Date().toISOString(),
    targetUrl: options.url,
    freshEphemeralBrowserContext: true,
    hiddenStateInspection: false,
    debugInjection: false,
  };
  fs.writeFileSync(path.join(outDir, "session.json"), `${JSON.stringify(sessionMetadata, null, 2)}\n`);

  const browser = await chromium.launch({ headless: options.headless });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  });
  const page = await context.newPage();

  const state = {
    sessionId,
    profile,
    outDir,
    sequence: 0,
    lastObservation: null,
  };

  try {
    await page.goto(options.url, { waitUntil: "domcontentloaded", timeout: 60000 });
    if (options.smoke) {
      await runSmoke(page, state);
    } else {
      console.log(`Profile: ${profile.name}`);
      console.log(`Packet: ${profile.packet}`);
      console.log(`Output: ${outDir}`);
      console.log("Only ordinary player-facing observations/actions are permitted.\n");
      await runInteractive(page, state);
    }
  } finally {
    await context.close();
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error.stack || error.message || String(error));
  process.exitCode = 1;
});
