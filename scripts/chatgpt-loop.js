/**
 * Autonomous Milestone Looper (Playwright + Node.js)
 *
 * Configured Repositories:
 *   1. React_incremental_game_prototype
 *   2. Chess-mentor-engine
 *   3. sensemaking-skills
 *   4. ViralFactory
 *
 * Lifecycle per Repository Milestone:
 *   1. Initial Prompt (Audit & 3-Package Queue)
 *   2. Follow-up Prompt 1 (Package 1 -> PR -> Merge)
 *   3. Follow-up Prompt 2 (Package 2 -> PR -> Merge)
 *   4. Follow-up Prompt 3 (Package 3 -> PR -> Merge)
 *   5. Handoff Prompt (STATUS.md / Runbook Consolidation -> PR -> Merge)
 *   6. Click "New Chat" (Fresh session prepared for the next milestone)
 */

const path = require("path");
const readline = require("readline");
const { chromium } = require("playwright");

const CHATGPT_URL = "https://chatgpt.com/";
const USER_DATA_DIR = path.join(__dirname, "..", ".chatgpt-profile");

// -------------------------------------------------------------
// 1. REPOSITORY REGISTRY (Set enabled: false to omit a repo)
// -------------------------------------------------------------
const ALL_REPOSITORIES = [
  {
    id: "incremental",
    name: "ThorStarlord/React_incremental_game_prototype",
    objective: "Advance incremental mechanics, tick rate stability, and player progression.",
    enabled: true
  },
  {
    id: "chess",
    name: "ThorStarlord/Chess-mentor-engine",
    objective: "Improve move analysis, engine-to-UI evaluation accuracy, and mentor feedback.",
    enabled: true
  },
  {
    id: "sensemaking",
    name: "ThorStarlord/sensemaking-skills",
    objective: "Advance campaign state persistence, narrative verification, and qualification evidence.",
    enabled: true
  },
  {
    id: "viralfactory",
    name: "ThorStarlord/ViralFactory",
    objective: "Advance autonomous deal discovery scrapers, AI critique & FFmpeg video rendering engine, and Next.js SaaS dashboard.",
    enabled: true
  },
  {
    id: "auteur",
    name: "ThorStarlord/Auteur",
    objective: "Advance narrative compilation engine, deterministic structure diagnostics, story discovery, and TDD chapter drafting pipelines.",
    enabled: false // 👈 TOGGLE OFF: Set to false to omit from the run!
  }
];

// Automatically filters only active repositories
const REPOSITORIES = ALL_REPOSITORIES.filter(repo => repo.enabled);

const TOTAL_PACKAGES = 3; // Exactly 3 follow-up prompts per milestone

// -------------------------------------------------------------
// 2. PROMPT TEMPLATES
// -------------------------------------------------------------
function buildInitialPrompt(repo) {
  return `
@github Reconcile and audit repository "${repo.name}".
Objective: ${repo.objective}

PHASE 1: RECONCILIATION & AUDIT
1. Read the latest 'main' branch, recent commits, and our handoff document ('STATUS.md' or 'HANDOFF.md') to inspect the current state.
2. Determine the true active bottleneck.
3. If blocked awaiting external human evidence or approval, output "STATUS: AWAITING_HUMAN_EVIDENCE" and STOP.

PHASE 2: WORK PACKAGE QUEUE (UP TO 3 PACKAGES)
Propose UP TO 3 bounded work packages that advance the objective:
### Work Package Queue
- [ ] Package 1: [Short Title] - [Deliverable & Target Checkpoint]
- [ ] Package 2: [Short Title] - [Deliverable & Target Checkpoint]
- [ ] Package 3: [Short Title] - [Deliverable & Target Checkpoint]

CRITICAL: DO NOT write code, create branches, or open PRs yet. Confirm readiness and wait for my signal to start Package 1.
`.trim();
}

const FOLLOWUP_PROMPT = `
ACTION: Implement the NEXT pending [ ] package from our Work Package Queue.

WORKFLOW:
1. PULL: Sync with latest 'main'.
2. BRANCH: Create branch "work/<short-package-name>".
3. IMPLEMENT: Apply changes for THIS PACKAGE ONLY. Run native stack checks AND negative/rejection tests.
4. QUALIFY & MERGE:
   - Commit and push. Open PR into 'main'.
   - MERGE READINESS: Merge immediately ONLY IF all tests/CI pass on the candidate head. Otherwise leave PR open.
5. STATUS: Output the updated Feature Queue with [x] for completed and [ ] for pending/blocked.
6. STOP: Halt execution here. Do NOT start the next package.
`.trim();

const HANDOFF_PROMPT = `
ACTION: Post-Milestone Runbook & In-Repo Handoff Document.

All packages for this milestone are complete. Create the handoff documentation for future engineers (and future chat sessions):

WORKFLOW:
1. SYNC: Pull latest 'main'.
2. BRANCH: Create branch "docs/milestone-handoff".
3. HANDOFF DOCUMENTATION:
   - Update or create 'STATUS.md' (or 'HANDOFF.md') on 'main':
     * Summary of what was delivered across Packages 1, 2, and 3.
     * Evidence verified and any pending human QA / approval gates.
     * The recommended next priorities for the next milestone session.
   - Update 'README.md' or runbooks with CLI commands to run any newly added tools or test suites.
4. COMMIT & MERGE: Commit, open PR, and merge into 'main' once checks pass.
5. STOP: Output a final milestone summary and halt.
`.trim();

// -------------------------------------------------------------
// 3. SELECTORS & TIMEOUTS
// -------------------------------------------------------------
const STREAM_START_TIMEOUT_MS = 45_000;
const STREAM_END_TIMEOUT_MS = 12 * 60_000;
const SETTLE_DELAY_MS = 6_000;
const COOLDOWN_DELAY_MS = 4_000;
const LOGIN_TIMEOUT_MS = 10 * 60_000;

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

const STOP_SELECTOR_COMBINED = 'button[data-testid="stop-button"], button[aria-label*="Stop"]';
const COPY_SELECTOR_COMBINED = 'button[aria-label*="Copy"], [data-testid="copy-turn-action-button"]';
const REQUIRED_IDLE_MS = 6_000;

const NEW_CHAT_SELECTORS = [
  '[data-testid="new-chat-button"]',
  'button:has-text("New chat")',
  'a:has-text("New chat")'
];

// -------------------------------------------------------------
// 4. CONTROL FLOW & EVENT ENGINE
// -------------------------------------------------------------
let stopRequested = false;
let started = false;
let _startResolve = null;
let _startReject = null;
let readlineInterface = null;
let browserContext = null;

const startPromise = new Promise((resolve, reject) => {
  _startResolve = resolve;
  _startReject = reject;
});

function watchEnterKey() {
  console.log("\n========================================================");
  console.log(">>> 1. Log in to ChatGPT in the opened browser.");
  console.log(">>> 2. Press ENTER in this terminal to start autonomous runs.");
  console.log(">>> 3. Press ENTER at any time during execution to gracefully stop.");
  console.log("========================================================\n");

  readlineInterface = readline.createInterface({ input: process.stdin, output: process.stdout });
  readlineInterface.on("line", () => {
    if (!started) {
      started = true;
      console.log("\n🚀 [START] Operator triggered launch. Starting milestone...\n");
      if (_startResolve) _startResolve();
    } else {
      stopRequested = true;
      console.log("\n🛑 [DRAIN] Stop requested. Finishing active turn before exit...\n");
    }
  });
}

async function findFirstVisible(page, selectors, timeout = 30_000) {
  const deadline = Date.now() + timeout;
  let lastError = null;

  while (Date.now() < deadline) {
    if (stopRequested) throw new Error("Stop requested by operator.");

    for (const sel of selectors) {
      try {
        const locator = page.locator(sel);
        const count = await locator.count();
        for (let i = 0; i < count; i++) {
          const candidate = locator.nth(i);
          if (await candidate.isVisible()) {
            return candidate;
          }
        }
      } catch (e) {
        lastError = e;
      }
    }
    await page.waitForTimeout(1000);
  }
  throw new Error(`Element not found for [${selectors.join(", ")}]. Last error: ${lastError?.message}`);
}

async function waitForLogin(page, timeoutMs = LOGIN_TIMEOUT_MS) {
  console.log("[login] Checking for active session composer...");
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (stopRequested) throw new Error("Stop requested by operator.");
    try {
      for (const sel of COMPOSER_SELECTORS) {
        const locator = page.locator(sel);
        const count = await locator.count();
        for (let i = 0; i < count; i++) {
          if (await locator.nth(i).isVisible()) {
            console.log("[login] Active session detected.");
            return;
          }
        }
      }
    } catch {}
    await page.waitForTimeout(2000);
  }
  throw new Error("Authentication timeout. Please log in manually and re-run.");
}

async function startFreshChat(page) {
  console.log("[session] Starting fresh chat session (clean context)...");
  let clicked = false;

  for (const sel of NEW_CHAT_SELECTORS) {
    try {
      const btn = page.locator(sel).first();
      if ((await btn.count()) > 0 && (await btn.isVisible())) {
        await btn.click();
        clicked = true;
        break;
      }
    } catch {}
  }

  if (!clicked) {
    await page.goto(CHATGPT_URL, { waitUntil: "domcontentloaded" });
  }

  await findFirstVisible(page, COMPOSER_SELECTORS, 30_000);
  await page.waitForTimeout(1500);
}

async function sendPrompt(page, text) {
  if (!text || !text.trim()) throw new Error("Cannot send empty prompt.");
  const copyButtonsBefore = await page.locator(COPY_SELECTOR_COMBINED).count();
  const composer = await findFirstVisible(page, COMPOSER_SELECTORS, 120_000);
  await composer.click();
  await page.keyboard.press("ControlOrMeta+A");
  await page.keyboard.press("Backspace");
  await page.keyboard.type(text, { delay: 10 });

  for (const sel of SEND_SELECTORS) {
    try {
      const button = page.locator(sel).first();
      if ((await button.count()) > 0 && (await button.isVisible()) && (await button.isEnabled())) {
        await button.click();
        return { copyButtonsBefore };
      }
    } catch {}
  }

  await page.keyboard.press("Enter");
  return { copyButtonsBefore };
}

async function waitForAnswer(page, { copyButtonsBefore = 0 } = {}) {
  const countVisible = async selector => {
    const buttons = page.locator(selector);
    const count = await buttons.count();
    let visible = 0;
    for (let i = 0; i < count; i++) {
      if (await buttons.nth(i).isVisible()) visible++;
    }
    return visible;
  };

  const isStopVisible = async () => (await countVisible(STOP_SELECTOR_COMBINED)) > 0;

  const isComposerIdle = async () => {
    for (const selector of COMPOSER_SELECTORS) {
      const composers = page.locator(selector);
      const count = await composers.count();
      for (let i = 0; i < count; i++) {
        const composer = composers.nth(i);
        if (!(await composer.isVisible())) continue;
        const ariaDisabled = await composer.getAttribute("aria-disabled");
        const contentEditable = await composer.getAttribute("contenteditable");
        if (ariaDisabled === "true" || contentEditable === "false") continue;
        if (await composer.isEnabled()) return true;
      }
    }
    return false;
  };

  const copyButtonsAfter = async () => page.locator(COPY_SELECTOR_COMBINED).count();

  // A response may begin with reasoning or a tool call before visible text.
  // Wait until there is evidence that this prompt actually started processing.
  const startDeadline = Date.now() + STREAM_START_TIMEOUT_MS;
  let started = false;
  while (Date.now() < startDeadline) {
    if (await isStopVisible()) {
      started = true;
      break;
    }
    if ((await copyButtonsAfter()) > copyButtonsBefore) {
      started = true;
      break;
    }
    if (!(await isComposerIdle())) {
      started = true;
      break;
    }
    await page.waitForTimeout(500);
  }

  if (!started) {
    throw new Error(
      "Could not confirm that the prompt started processing. Refusing to send another prompt."
    );
  }

  console.log("[wait] Waiting for the current answer to finish...");
  const deadline = Date.now() + STREAM_END_TIMEOUT_MS;
  let idleSince = null;
  while (Date.now() < deadline) {
    const stopVisible = await isStopVisible();
    const composerIdle = await isComposerIdle();
    const copyAppeared = (await copyButtonsAfter()) > copyButtonsBefore;

    if (!stopVisible && composerIdle) {
      idleSince ??= Date.now();
    } else {
      idleSince = null;
    }

    const idleLongEnough = idleSince !== null && Date.now() - idleSince >= REQUIRED_IDLE_MS;
    const copyEvidenceAvailable = (await countVisible(COPY_SELECTOR_COMBINED)) > 0 || copyButtonsBefore > 0;
    if (idleLongEnough && (copyAppeared || !copyEvidenceAvailable)) break;

    await page.waitForTimeout(1000);
  }

  const finalStopVisible = await isStopVisible();
  const finalComposerIdle = await isComposerIdle();
  const finalCopyAppeared = (await copyButtonsAfter()) > copyButtonsBefore;
  const finalCopyEvidenceAvailable = (await countVisible(COPY_SELECTOR_COMBINED)) > 0 || copyButtonsBefore > 0;
  if (finalStopVisible || !finalComposerIdle || (finalCopyEvidenceAvailable && !finalCopyAppeared)) {
    throw new Error("Answer did not finish before the streaming timeout.");
  }

  await page.waitForTimeout(SETTLE_DELAY_MS);
  console.log("[wait] Answer complete and verified.");
}

async function createRepositoryPages(firstPage) {
  const sessions = [];

  for (let index = 0; index < REPOSITORIES.length; index++) {
    const repo = REPOSITORIES[index];
    const page = index === 0 ? firstPage : await browserContext.newPage();
    await page.bringToFront();

    if (index > 0) {
      await page.goto(CHATGPT_URL, { waitUntil: "domcontentloaded" });
      await waitForLogin(page);
    }

    sessions.push({ repo, page });
    console.log(`[tab ${index + 1}/${REPOSITORIES.length}] Ready for ${repo.name}.`);
  }

  return sessions;
}

async function runMilestone(repo, page) {
  await page.bringToFront();
  await startFreshChat(page);
  const initialPrompt = await sendPrompt(page, buildInitialPrompt(repo));
  console.log(`[sent] Initial audit prompt sent to ${repo.id}.`);
  await waitForAnswer(page, initialPrompt);

  for (let packageNumber = 1; packageNumber <= TOTAL_PACKAGES; packageNumber++) {
    if (stopRequested) return;

    console.log(`[package ${packageNumber}/${TOTAL_PACKAGES}] ${repo.name}`);
    const followupPrompt = await sendPrompt(page, FOLLOWUP_PROMPT);
    await waitForAnswer(page, followupPrompt);
    await page.waitForTimeout(COOLDOWN_DELAY_MS);
  }

  if (stopRequested) return;

  console.log(`[handoff] ${repo.name}`);
  const handoffPrompt = await sendPrompt(page, HANDOFF_PROMPT);
  await waitForAnswer(page, handoffPrompt);
  console.log(`[complete] Milestone finished for ${repo.name}. Chat URL: ${page.url()}`);
}

async function runRepositories(firstPage) {
  const sessions = await createRepositoryPages(firstPage);

  for (const { repo, page } of sessions) {
    if (stopRequested) break;
    console.log(`\n=== ${repo.name} ===`);
    await runMilestone(repo, page);
    await page.waitForTimeout(COOLDOWN_DELAY_MS);
  }
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

  console.log("[ready] Logged in. Press ENTER to start the milestone run.");
  await startPromise;

  try {
    await runRepositories(firstPage);
  } catch (error) {
    console.error("[error]", error);
  } finally {
    console.log("\n[exit] Closing browser session.");
    readlineInterface?.close();
    await browserContext?.close();
  }
})();
