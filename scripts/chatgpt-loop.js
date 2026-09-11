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
    enabled: false
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
3. Classify pending work into these zones:
   - REPOSITORY_ONLY: pure code, tests, refactors, fixtures, documentation, and local tooling.
   - HERMETIC_VALIDATION: mocks, dry-run integrations, synthetic data/assets, local runners, and failure simulations.
   - EXTERNAL_AUTHORITY: real credentials, paid services, live external calls, deployments, destructive migrations, subjective approval, or production QA.

PHASE 2: WORK PACKAGE QUEUE (UP TO 3 PACKAGES)
Propose UP TO 3 bounded work packages that advance the objective.
If external work is blocked, choose REPOSITORY_ONLY or HERMETIC_VALIDATION work instead. Do not attempt the external action.
Only output "STATUS: AWAITING_HUMAN_EVIDENCE: [reason]" if no meaningful bounded repository-only or hermetic validation work remains.
Every package must state what changes locally, how it will be verified without external credentials, and what external step remains deferred, if any.

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
   - Keep the work REPOSITORY_ONLY or HERMETIC_VALIDATION.
   - Do not use production credentials, call live external services, deploy infrastructure, perform destructive migrations, or make subjective production claims.
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
1. RECONCILE BASE & INTEGRATION CANDIDATE:
   - Pull the latest 'main' and inspect the implementation PR created during this session.
   - Confirm the candidate PR number, branch name, head commit SHA, merge status, and CI checks using GitHub.
   - If the implementation PR is merged, document the milestone as "INTEGRATED / CURRENT-MAIN AUTHORITY".
   - If it is unmerged, do not claim that the implementation is on 'main'. Record the candidate as "REPOSITORY-QUALIFIED / AWAITING_INTEGRATION".

2. CI FAILURE TRIAGE:
   - Inspect the workflow file, failure log, trigger, required-check status, and relationship to the implementation.
   - Classify each failure as IMPLEMENTATION_FAILURE, RELEVANT_ENVIRONMENT_FAILURE, OBSOLETE_CI_CONFIGURATION, NON_REQUIRED_AUXILIARY_FAILURE, or HUMAN_PRODUCT_DECISION.
   - Treat implementation failures and relevant environment failures as blocking.
   - Treat obsolete or non-required CI as non-blocking for product scope, but determine whether branch protection still prevents merging.
   - Never classify a failure as obsolete solely because it mentions an API key. Verify that the workflow is retired, experimental, unrelated, or otherwise no longer intentional.
   - If obsolete CI blocks merging, prepare a repository-only cleanup or replacement rather than ignoring the check.

3. SYNC & BRANCH:
   - If the implementation is merged, pull the latest 'main' and branch from it as "docs/milestone-handoff".
   - If the implementation is unmerged because of blocking implementation or relevant environment CI, do not create a separate documentation PR.

4. HANDOFF DOCUMENTATION:
   - Update or create 'STATUS.md' (or 'HANDOFF.md') on 'main':
     * Summary of what was delivered across Packages 1, 2, and 3.
     * Evidence verified and any pending human QA / approval gates.
     * The recommended next priorities for the next milestone session.
   - Update 'README.md' or runbooks with CLI commands to run any newly added tools or test suites.

5. COMMIT & PR:
   - Commit, push, and open the documentation PR only when the implementation is already merged or when the change is a repository-only cleanup for obsolete CI.
   - Never merge a documentation PR unless the implementation is confirmed on 'main' and all checks pass on the exact documentation head.
   - If the implementation is unmerged because of a blocking failure, stop and report:
     "STATUS: MILESTONE_BLOCKED_ON_IMPLEMENTATION_CI"
   - If the implementation is unmerged only because of obsolete or non-required CI, continue safe cleanup work but do not claim the implementation is integrated until it reaches 'main'.

6. STOP: Output a concise status summary and halt.
`.trim();

// -------------------------------------------------------------
// 3. SELECTORS & TIMEOUTS
// -------------------------------------------------------------
const STREAM_START_TIMEOUT_MS = 45_000;
const configuredStreamTimeout = Number(process.env.CHATGPT_STREAM_TIMEOUT_MS);
const STREAM_END_TIMEOUT_MS = Number.isFinite(configuredStreamTimeout) && configuredStreamTimeout > 0
  ? configuredStreamTimeout
  : 30 * 60_000;
const SETTLE_DELAY_MS = 6_000;
const COOLDOWN_DELAY_MS = 4_000;
const CYCLE_COOLDOWN_MS = 15_000;
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
  if (page.isClosed()) throw new Error("Cannot start a chat on a closed page.");
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

  await clearComposer(page, 30_000);
  await page.waitForTimeout(1500);
}

async function clearComposer(page, timeoutMs = 30_000) {
  const composer = await fillComposer(page, "", timeoutMs);
  await waitForComposerCleared(page, composer);
}

async function fillComposer(page, text, timeoutMs = 30_000) {
  const deadline = Date.now() + timeoutMs;
  let lastError = null;

  while (Date.now() < deadline) {
    if (page.isClosed()) throw new Error("Cannot fill a composer on a closed page.");
    try {
      const composer = await findFirstVisible(page, COMPOSER_SELECTORS, 2_000);
      await composer.fill(text);
      return composer;
    } catch (error) {
      lastError = error;
      await page.waitForTimeout(250);
    }
  }

  throw new Error(`Could not fill the visible composer. Last error: ${lastError?.message}`);
}

async function readComposerText(composer) {
  const tagName = await composer.evaluate(element => element.tagName.toLowerCase());
  if (tagName === "textarea" || tagName === "input") return composer.inputValue();
  return (await composer.textContent()) || "";
}

function normalizePromptText(text) {
  // ChatGPT's contenteditable composer may collapse line breaks and repeated
  // whitespace while preserving the actual prompt content.
  return text.replace(/\r\n/g, "\n").replace(/\s+/g, " ").trim();
}

async function waitForComposerCleared(page, composer, timeoutMs = 10_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if ((await readComposerText(composer)).trim() === "") return;
    await page.waitForTimeout(250);
  }
  throw new Error("Prompt was not cleared after submission; refusing to continue.");
}

async function sendPrompt(page, text) {
  if (page.isClosed()) throw new Error("Cannot send a prompt on a closed page.");
  if (!text || !text.trim()) throw new Error("Cannot send empty prompt.");
  // ChatGPT's contenteditable composer can drop newline separators. Flatten
  // them explicitly so adjacent words never become concatenated.
  const promptForComposer = text.replace(/\r\n/g, "\n").replace(/\n/g, " ");
  const composer = await fillComposer(page, promptForComposer, 120_000);

  const composerText = await readComposerText(composer);
  if (normalizePromptText(composerText) !== normalizePromptText(promptForComposer)) {
    throw new Error(
      `Prompt verification failed: expected ${promptForComposer.length} characters, received ${composerText.length}.`
    );
  }

  console.log(`[send] Prompt loaded (${text.length} characters).`);

  let sent = false;
  for (const sel of SEND_SELECTORS) {
    try {
      const button = page.locator(sel).first();
      if ((await button.count()) > 0 && (await button.isVisible()) && (await button.isEnabled())) {
        await button.click();
        sent = true;
        break;
      }
    } catch {}
  }

  if (!sent) {
    throw new Error("Send button was not found or was not enabled; prompt was not submitted.");
  }

  await waitForComposerCleared(page, composer);
}

async function waitForAnswer(page) {
  if (page.isClosed()) throw new Error("Cannot wait for an answer on a closed page.");

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

  // A response may begin with reasoning or a tool call before visible text.
  // Wait until there is evidence that this prompt actually started processing.
  const startDeadline = Date.now() + STREAM_START_TIMEOUT_MS;
  let started = false;
  while (Date.now() < startDeadline) {
    if (await isStopVisible()) {
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

    if (!stopVisible && composerIdle) {
      idleSince ??= Date.now();
    } else {
      idleSince = null;
    }

    const idleLongEnough = idleSince !== null && Date.now() - idleSince >= REQUIRED_IDLE_MS;
    // Copy controls are useful diagnostics, but ChatGPT may reuse or omit
    // them on later turns. Completion is therefore based on the debounced
    // Stop-absent + idle-composer state instead of requiring a new Copy node.
    if (idleLongEnough) break;

    await page.waitForTimeout(1000);
  }

  const finalStopVisible = await isStopVisible();
  const finalComposerIdle = await isComposerIdle();
  if (finalStopVisible || !finalComposerIdle) {
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

async function initializeRepository({ repo, page }) {
  await startFreshChat(page);
  await sendPrompt(page, buildInitialPrompt(repo));
  console.log(`[sent] Initial audit prompt sent to ${repo.id}.`);
  await waitForAnswer(page);
  await page.waitForTimeout(COOLDOWN_DELAY_MS);
}

async function runPackage({ repo, page }, packageNumber) {
  if (stopRequested) return;

  console.log(`[package ${packageNumber}/${TOTAL_PACKAGES}] ${repo.name}`);
  await sendPrompt(page, FOLLOWUP_PROMPT);
  await waitForAnswer(page);
  await page.waitForTimeout(COOLDOWN_DELAY_MS);
}

async function runHandoff({ repo, page }) {
  if (stopRequested) return;

  console.log(`[handoff] ${repo.name}`);
  await sendPrompt(page, HANDOFF_PROMPT);
  await waitForAnswer(page);
  console.log(`[complete] Milestone finished for ${repo.name}. Chat URL: ${page.url()}`);
}

async function runParallelStage(label, sessions, worker) {
  const activeSessions = sessions.filter(session => !session.failed);
  console.log(`\n=== ${label} (${activeSessions.length} tabs in parallel) ===`);
  const results = await Promise.allSettled(activeSessions.map(worker));
  const failures = [];

  results.forEach((result, index) => {
    if (result.status === "rejected") {
      const session = activeSessions[index];
      session.failed = true;
      failures.push(`${session.repo.name}: ${result.reason?.message || String(result.reason)}`);
    }
  });

  if (failures.length > 0) {
    console.error(`[stage] ${label} quarantined ${failures.length} tab(s):`);
    failures.forEach(message => console.error(`  - ${message}`));
  }
}

async function runMilestoneCycle(sessions, cycleNumber) {
  sessions.forEach(session => {
    session.failed = false;
  });

  console.log(`\n################## MILESTONE CYCLE ${cycleNumber} ##################`);
  await runParallelStage("Initial audits", sessions, async session => {
    if (session.page.isClosed()) throw new Error(`The browser tab for ${session.repo.name} was closed.`);
    await initializeRepository(session);
  });

  for (let packageNumber = 1; packageNumber <= TOTAL_PACKAGES && !stopRequested; packageNumber++) {
    await runParallelStage(`Package ${packageNumber}`, sessions, session => runPackage(session, packageNumber));
  }

  if (!stopRequested) {
    await runParallelStage("Milestone handoffs", sessions, session => runHandoff(session));
  }

  const failedSessions = sessions.filter(session => session.failed);
  if (failedSessions.length > 0) {
    console.error("\n[summary] Some tabs were quarantined and did not receive later prompts:");
    failedSessions.forEach(session => console.error(`  - ${session.repo.name}`));
  }
}

async function runRepositories(firstPage) {
  const sessions = await createRepositoryPages(firstPage);
  let cycleNumber = 1;

  while (!stopRequested) {
    await runMilestoneCycle(sessions, cycleNumber);
    cycleNumber++;

    if (!stopRequested) {
      console.log(`\n[cycle] Cycle complete. Starting the next milestone in ${CYCLE_COOLDOWN_MS / 1000}s.`);
      await firstPage.waitForTimeout(CYCLE_COOLDOWN_MS);
    }
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
  await clearComposer(firstPage);

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
