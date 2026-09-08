/**
 * Multi-Repo ChatGPT Looper (Playwright + Node)
 * 
 * Features:
 * - Creates a dedicated browser tab for each repo (No sidebar navigation needed!).
 * - Saves each chat's direct URL (https://chatgpt.com/c/<uuid>) for bookmarking.
 * - Loops through all repos sequentially when you press ENTER.
 */

const path = require("path");
const readline = require("readline");
const { chromium } = require("playwright");

const CHATGPT_URL = "https://chatgpt.com/";
const USER_DATA_DIR = path.join(__dirname, "..", ".chatgpt-profile");

// 1. CONFIGURE YOUR REPOSITORIES HERE
const REPOSITORIES = [
  {
    id: "incremental",
    name: "ThorStarlord/React_incremental_game_prototype",
    type: "React / TypeScript incremental game prototype"
  },
  {
    id: "chess",
    name: "ThorStarlord/Chess-mentor-engine",
    type: "Chess mentor engine and analysis tool"
  }
];

// 2. PROMPT TEMPLATES
function buildInitialPrompt(repo) {
  return `
@github Analyze repository "${repo.name}". It is a ${repo.type}.

PHASE 1: BRAINSTORM & AUDIT
- Review repository architecture, code quality, and missing core systems.
- Identify top opportunities for high-impact improvement.

PHASE 2: 3-FEATURE EXECUTION QUEUE
Distill your analysis into the TOP 3 most impactful, distinct features or refactors.
Format strictly as this Markdown checklist:
### Feature Queue
- [ ] Feature 1: [Short Name] - [Brief explanation and files affected]
- [ ] Feature 2: [Short Name] - [Brief explanation and files affected]
- [ ] Feature 3: [Short Name] - [Brief explanation and files affected]

CRITICAL RULES:
1. DO NOT write code, create branches, or open PRs yet.
2. Confirm you are ready. Stop and wait for my next signal to start Feature 1.
`.trim();
}

const FOLLOWUP_PROMPT = `
ACTION: Implement the NEXT pending [ ] feature from our Feature Queue.

WORKFLOW:
1. SYNC: Fetch/pull 'main' to build on the latest codebase.
2. BRANCH: Create branch "feature/<short-name>".
3. IMPLEMENT: Apply code changes for THIS FEATURE ONLY.
4. VERIFY: Ensure no broken imports or syntax/type errors.
5. COMMIT & PUSH: Commit with a descriptive message and push.
6. PULL REQUEST: Open a PR into 'main'.
7. MERGE:
   - If your tool permits merging, merge immediately.
   - Otherwise, state: "PR open, requires manual merge".
8. STATUS: Output the updated Feature Queue with [x] for completed and [ ] for pending.
9. STOP: Halt execution here. Do NOT start the next feature.
`.trim();

// Timeouts
const STREAM_START_TIMEOUT_MS = 60_000;
const STREAM_END_TIMEOUT_MS = 10 * 60_000;
const SETTLE_DELAY_MS = 5_000;
const LOGIN_TIMEOUT_MS = 10 * 60_000;

let stopRequested = false;
let started = false;
let _startResolve = null;
let readlineInterface = null;
let browserContext = null;

const startPromise = new Promise((resolve) => {
  _startResolve = resolve;
});

function watchEnterKey() {
  console.log("\n========================================================");
  console.log(">>> Log in, then press ENTER to START the initial prompts.");
  console.log(">>> Subsequent ENTER presses will trigger the follow-up loop.");
  console.log("========================================================\n");
  
  readlineInterface = readline.createInterface({ input: process.stdin, output: process.stdout });
  readlineInterface.on("line", () => {
    if (!started) {
      started = true;
      console.log("\n[start] Starting initial prompt initialization...\n");
      if (_startResolve) _startResolve();
    } else {
      stopRequested = true;
      console.log("\n[stop] Exit requested — will stop after completing the current turn.\n");
    }
  });
}

const COMPOSER_SELECTORS = [
  "#prompt-textarea",
  '[data-testid="prompt-textarea"]',
  'div[contenteditable="true"]',
  "textarea"
];

const SEND_SELECTORS = [
  'button[data-testid="send-button"]',
  'button[aria-label*="Send"]'
];

const STOP_SELECTORS = [
  'button[data-testid="stop-button"]',
  'button[aria-label*="Stop"]'
];

async function findFirstVisible(page, selectors, timeout = 30_000) {
  const deadline = Date.now() + timeout;
  let lastError;
  while (Date.now() < deadline) {
    if (stopRequested) throw new Error("Stop requested");
    for (const sel of selectors) {
      try {
        const loc = page.locator(sel).first();
        if ((await loc.count()) > 0 && (await loc.isVisible())) return loc;
      } catch (e) {
        lastError = e;
      }
    }
    await page.waitForTimeout(1000);
  }
  throw new Error(`Element not found. Tried: ${selectors.join(", ")}. Last error: ${lastError}`);
}

async function waitForLogin(page, timeoutMs = LOGIN_TIMEOUT_MS) {
  console.log("[login] Checking login status...");
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      for (const sel of COMPOSER_SELECTORS) {
        const loc = page.locator(sel).first();
        if ((await loc.count()) > 0 && (await loc.isVisible())) {
          console.log("[login] Logged in successfully.");
          return;
        }
      }
    } catch {}
    await page.waitForTimeout(2000);
  }
  throw new Error("Login timeout. Log in manually and restart.");
}

async function sendPrompt(page, text) {
  if (!text || !text.trim()) throw new Error("Prompt is empty");
  const composer = await findFirstVisible(page, COMPOSER_SELECTORS, 60_000);
  await composer.click();
  await page.keyboard.press("ControlOrMeta+A");
  await page.keyboard.press("Backspace");
  await page.keyboard.type(text, { delay: 5 });

  for (const sel of SEND_SELECTORS) {
    try {
      const btn = page.locator(sel).first();
      if ((await btn.count()) > 0 && (await btn.isVisible()) && (await btn.isEnabled())) {
        await btn.click();
        return;
      }
    } catch {}
  }
  await page.keyboard.press("Enter");
}

async function waitForAnswer(page) {
  let sawStreaming = false;
  for (const sel of STOP_SELECTORS) {
    try {
      await page.locator(sel).first().waitFor({ state: "visible", timeout: STREAM_START_TIMEOUT_MS });
      sawStreaming = true;
      break;
    } catch {}
  }

  if (!sawStreaming) {
    console.log("[wait] No streaming indicator detected. Waiting fallback (20s)...");
    await page.waitForTimeout(20_000);
    return;
  }

  const start = Date.now();
  while (Date.now() - start < STREAM_END_TIMEOUT_MS) {
    let anyVisible = false;
    for (const sel of STOP_SELECTORS) {
      try {
        const btn = page.locator(sel).first();
        if ((await btn.count()) > 0 && (await btn.isVisible())) {
          anyVisible = true;
          break;
        }
      } catch {}
    }
    if (!anyVisible) break;
    await page.waitForTimeout(2000);
  }
  await page.waitForTimeout(SETTLE_DELAY_MS);
}

(async () => {
  watchEnterKey();

  browserContext = await chromium.launchPersistentContext(USER_DATA_DIR, {
    headless: false,
    viewport: { width: 1280, height: 900 }
  });

  const firstPage = browserContext.pages()[0] || (await browserContext.newPage());
  await firstPage.goto(CHATGPT_URL, { waitUntil: "domcontentloaded" });
  await waitForLogin(firstPage);

  console.log("[ready] Logged in. Press ENTER in this terminal to initialize all repo chats.");
  await startPromise;

  // Dictionary mapping repo.id -> { page, directUrl }
  const sessions = {};

  try {
    // -------------------------------------------------------------
    // STEP 1: INITIALIZE REPO SESSIONS (ONE TAB PER REPO)
    // -------------------------------------------------------------
    for (let i = 0; i < REPOSITORIES.length; i++) {
      const repo = REPOSITORIES[i];
      console.log(`\n--- [Init] Setting up Tab for: ${repo.name} ---`);
      
      // Use the existing first page for the first repo; open new tabs for the rest
      const page = (i === 0) ? firstPage : await browserContext.newPage();
      await page.bringToFront();
      
      if (i > 0) {
        await page.goto(CHATGPT_URL, { waitUntil: "domcontentloaded" });
      }

      const prompt = buildInitialPrompt(repo);
      await sendPrompt(page, prompt);
      console.log(`[sent] Initial prompt sent to ${repo.id}`);
      
      await waitForAnswer(page);
      
      // Store the direct URL (e.g., https://chatgpt.com/c/670...)
      const chatUrl = page.url();
      console.log(`[saved] ${repo.id} chat URL: ${chatUrl}`);
      sessions[repo.id] = { page, chatUrl, name: repo.name };
    }

    console.log("\n>>> All repositories initialized! <<<");
    console.log("Press ENTER at any time to send the follow-up step to each repo in turn.\n");

    // -------------------------------------------------------------
    // STEP 2: MULTI-REPO FOLLOW-UP LOOP
    // -------------------------------------------------------------
    let cycle = 1;
    while (!stopRequested) {
      console.log(`\n================== [CYCLE ${cycle}] ==================`);
      for (const repo of REPOSITORIES) {
        if (stopRequested) break;

        const session = sessions[repo.id];
        console.log(`\n[loop] Switching to tab: ${session.name}`);
        await session.page.bringToFront();

        console.log(`[loop] Sending FOLLOWUP_PROMPT...`);
        await sendPrompt(session.page, FOLLOWUP_PROMPT);
        await waitForAnswer(session.page);
        console.log(`[done] Completed iteration for ${session.name}`);
      }

      cycle++;
      if (!stopRequested) {
        console.log("\nCycle complete. Press ENTER to stop or keep running next loop...");
      }
    }
  } catch (err) {
    console.error("[error]", err);
  } finally {
    console.log("\n[exit] Closing browser session.");
    readlineInterface?.close();
    await browserContext?.close();
    process.exit(0);
  }
})();