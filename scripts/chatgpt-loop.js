/**
 * ChatGPT "plan -> proceed" looper (Playwright + Node).
 *
 * Flow:
 *  1. Opens chatgpt.com in a persistent Chromium profile (so you log in once manually).
 *  2. Sends INITIAL_PROMPT once, waits for the answer to finish streaming.
 *  3. Sends FOLLOWUP_PROMPT ("proceed") in a loop, waiting after each one.
 *  4. Loop ends when you press ENTER in this terminal (after current answer finishes).
 *
 * Setup:
 *   npm i -D playwright
 *   npx playwright install chromium
 *
 * Run:
 *   node scripts/chatgpt-loop.js
 *
 * Notes:
 *  - Keep the browser headed (headless:false) so login / Cloudflare / 2FA can be
 *    solved manually. Do NOT try to bypass CAPTCHAs programmatically.
 *  - UI automation of chatgpt.com is brittle (selectors change) and may violate
 *    OpenAI's Terms for automated access. For durable use prefer the API.
 */

const path = require("path");
const readline = require("readline");
const { chromium } = require("playwright");

const CHATGPT_URL = "https://chatgpt.com/";
const USER_DATA_DIR = path.join(__dirname, "..", ".chatgpt-profile");

const INITIAL_PROMPT =
  "@github I am building React incremental repository, what are the next steps? please create a detailed plan.";
const FOLLOWUP_PROMPT = "proceed";

// How long to wait for streaming to start / finish.
const STREAM_START_TIMEOUT_MS = 60_000;
const STREAM_END_TIMEOUT_MS = 10 * 60_000;
const SETTLE_DELAY_MS = 5_000;

let stopRequested = false;
let started = false;
let _startResolve = null;
const startPromise = new Promise((resolve) => {
  _startResolve = resolve;
});

function watchEnterKey() {
  console.log("\n>>> Log in in the browser, then press ENTER here to START. Next ENTER stops. <<<\n");
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  rl.on("line", () => {
    if (!started) {
      started = true;
      console.log("\n[start] ENTER pressed — starting prompt loop. Next ENTER will stop.\n");
      if (_startResolve) _startResolve();
    } else {
      stopRequested = true;
      console.log("\n[stop] ENTER pressed — finishing current answer, then exiting loop…\n");
    }
  });
}

async function waitForUserStart() {
  if (started) return;
  console.log("[ready] Browser open. Log in to ChatGPT, then press ENTER in this terminal to start.");
  await startPromise;
  if (stopRequested) throw new Error("Stop requested");
}

const COMPOSER_SELECTORS = [
  "#prompt-textarea",
  '[data-testid="prompt-textarea"]',
  'div[contenteditable="true"]',
  "textarea",
];

const SEND_SELECTORS = [
  'button[data-testid="send-button"]',
  'button[aria-label*="Send"]',
];

const STOP_SELECTORS = [
  'button[data-testid="stop-button"]',
  'button[aria-label*="Stop"]',
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
  throw new Error(`Composer/input not found. Tried: ${selectors.join(", ")}. Last error: ${lastError}`);
}

async function waitForLogin(page, timeoutMs = 10 * 60_000) {
  console.log("[login] If not logged in, log in manually in the opened browser. Waiting for login…");
  const deadline = Date.now() + timeoutMs;
  let announced = false;
  while (Date.now() < deadline) {
    if (stopRequested) throw new Error("Stop requested");
    try {
      const url = page.url();
      const onAuthPage = /auth|login/i.test(url);

      // Logged-out indicators (landing page shows Log in / Sign up).
      let loggedOutVisible = false;
      for (const sel of ['a[href*="auth/login"]', 'button:has-text("Log in")', 'button:has-text("Sign up")']) {
        try {
          const loc = page.locator(sel).first();
          if ((await loc.count()) > 0 && (await loc.isVisible())) {
            loggedOutVisible = true;
            break;
          }
        } catch {
          // ignore per-selector errors
        }
      }

      // Logged-in indicator: composer box visible.
      let composerVisible = false;
      for (const sel of COMPOSER_SELECTORS) {
        try {
          const loc = page.locator(sel).first();
          if ((await loc.count()) > 0 && (await loc.isVisible())) {
            composerVisible = true;
            break;
          }
        } catch {
          // ignore
        }
      }

      if (composerVisible && !onAuthPage && !loggedOutVisible) {
        console.log("[login] Logged in — continuing.");
        return;
      }

      if (!announced) {
        console.log("[login] Not logged in yet — complete login in the browser, then the script continues automatically.");
        announced = true;
      }
    } catch (e) {
      if (String(e && e.message).includes("Stop requested")) throw e;
      // ignore transient errors, keep waiting
    }
    await page.waitForTimeout(2000);
  }
  throw new Error("Login timeout (10 min). Log in manually and re-run.");
}

async function sendPrompt(page, text) {
  const composer = await findFirstVisible(page, COMPOSER_SELECTORS, 120_000);
  await composer.click();
  // ProseMirror editor (#prompt-textarea) is a contenteditable div — keyboard.type is most reliable.
  await page.keyboard.press("ControlOrMeta+A");
  await page.keyboard.press("Backspace");
  await page.keyboard.type(text, { delay: 10 });

  // Prefer clicking Send; fall back to Enter.
  for (const sel of SEND_SELECTORS) {
    try {
      const btn = page.locator(sel).first();
      if ((await btn.count()) > 0 && (await btn.isVisible()) && (await btn.isEnabled())) {
        await btn.click();
        return;
      }
    } catch {
      // try next selector / fallback below
    }
  }
  await page.keyboard.press("Enter");
}

async function waitForAnswer(page) {
  // 1. Wait for streaming to start (Stop button appears).
  let sawStreaming = false;
  for (const sel of STOP_SELECTORS) {
    try {
      await page.locator(sel).first().waitFor({ state: "visible", timeout: STREAM_START_TIMEOUT_MS });
      sawStreaming = true;
      break;
    } catch {
      // try next selector
    }
  }

  if (!sawStreaming) {
    console.log("[wait] No Stop button seen — page may have changed. Waiting 30s fallback…");
    await page.waitForTimeout(30_000);
    return;
  }

  // 2. Wait for streaming to finish (Stop button detaches).
  console.log("[wait] Answer streaming… waiting for it to finish.");
  const start = Date.now();
  while (Date.now() - start < STREAM_END_TIMEOUT_MS) {
    if (stopRequested) {
      // Still wait a bit so we don't cut mid-sentence, but check often.
    }
    let anyVisible = false;
    for (const sel of STOP_SELECTORS) {
      try {
        const btn = page.locator(sel).first();
        if ((await btn.count()) > 0 && (await btn.isVisible())) {
          anyVisible = true;
          break;
        }
      } catch {
        // ignore
      }
    }
    if (!anyVisible) break;
    await page.waitForTimeout(2000);
  }
  await page.waitForTimeout(SETTLE_DELAY_MS);
  console.log("[wait] Answer looks done.");
}

(async () => {
  watchEnterKey();

  const context = await chromium.launchPersistentContext(USER_DATA_DIR, {
    headless: false,
    viewport: { width: 1280, height: 900 },
    args: ["--disable-blink-features=AutomationControlled"],
  });
  const page = context.pages()[0] || (await context.newPage());

  console.log(`[open] ${CHATGPT_URL}`);
  await page.goto(CHATGPT_URL, { waitUntil: "domcontentloaded" });

  try {
    await waitForUserStart();
    // Initial prompt (sent once)
    await sendPrompt(page, INITIAL_PROMPT);
    console.log(`[sent] initial prompt (${INITIAL_PROMPT.length} chars)`);
    await waitForAnswer(page);

    // Follow-up loop
    let i = 1;
    while (!stopRequested) {
      console.log(`\n[loop ${i}] Sending: "${FOLLOWUP_PROMPT}" (press ENTER to stop after this answer)`);
      await sendPrompt(page, FOLLOWUP_PROMPT);
      console.log(`[sent] follow-up #${i}`);
      await waitForAnswer(page);
      i += 1;
    }
  } catch (e) {
    if (String(e && e.message).includes("Stop requested")) {
      console.log("[stop] Requested during input wait.");
    } else {
      console.error("[error]", e);
      console.error(
        "\nTip: ChatGPT's DOM changes often. Inspect the composer / send / stop buttons " +
          "in DevTools and update COMPOSER_SELECTORS / SEND_SELECTORS / STOP_SELECTORS at the top of this file."
      );
    }
  } finally {
    console.log("[done] Closing browser. Profile kept in .chatgpt-profile/ so login persists.");
    await context.close();
    process.exit(0);
  }
})();

process.on("SIGINT", () => {
  console.log("\n[stop] Ctrl+C — exiting after current step…");
  stopRequested = true;
  if (!started && _startResolve) _startResolve();
});
