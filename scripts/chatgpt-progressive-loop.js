/**
 * Progressive-Commitment ChatGPT Repository Loop
 *
 * Experimental successor to scripts/chatgpt-loop.js.
 *
 * Core differences:
 * - starts with minimally framed repository discovery instead of assuming V1/RC;
 * - lets repository evidence choose open, lens-guided, or goal-constrained analysis;
 * - requires a machine-readable protocol footer after every assistant turn;
 * - checks terminal state after every turn;
 * - never assumes a fixed number of packages are required;
 * - only runs handoff after the assistant reports zero pending packages;
 * - anchors answer collection to a newly-created assistant message;
 * - bounds cycles/turns and stops on repeated stagnation.
 */

const path = require("path");
const readline = require("readline");

const CHATGPT_URL = "https://chatgpt.com/";
const USER_DATA_DIR = path.join(__dirname, "..", ".chatgpt-profile");

const ALL_REPOSITORIES = [
  {
    id: "incremental",
    name: "ThorStarlord/React_incremental_game_prototype",
    context: "Incremental mechanics, tick-rate stability, and player progression are established product concerns.",
    enabled: true
  },
  {
    id: "chess",
    name: "ThorStarlord/Chess-mentor-engine",
    context: "Move analysis, engine-to-UI evaluation accuracy, and mentor feedback are established product concerns.",
    enabled: true
  },
  {
    id: "sensemaking",
    name: "ThorStarlord/sensemaking-skills",
    context: "Repository sensemaking, campaign state, evidence, and strategic control loops are established product concerns.",
    enabled: false
  },
  {
    id: "viralfactory",
    name: "ThorStarlord/ViralFactory",
    context: "Deal discovery, AI critique, FFmpeg rendering, and the Next.js SaaS surface are established product concerns.",
    enabled: true
  },
  {
    id: "auteur",
    name: "ThorStarlord/Auteur",
    context: "Narrative compilation, structure diagnostics, story discovery, and chapter-production workflows are established product concerns.",
    enabled: false
  },
  {
    id: "civilizational-superhero",
    name: "ThorStarlord/civilizational-superhero",
    context: "Long-form superhero story development focused on civilizational competence, reproducible capability, institutions, and human flourishing is the established project concern.",
    enabled: false
  },
  {
    id: "dark-factory",
    name: "ThorStarlord/dark-factory",
    context: "Autonomous software-production control loops, Campaign authority, evidence discipline, qualified integration, and human-on-exception operation are established product concerns.",
    enabled: false
  }
];

const REPOSITORIES = ALL_REPOSITORIES.filter(repo => repo.enabled);

const configuredStreamTimeout = Number(process.env.CHATGPT_STREAM_TIMEOUT_MS);
const STREAM_START_TIMEOUT_MS = 45_000;
const STREAM_END_TIMEOUT_MS = Number.isFinite(configuredStreamTimeout) && configuredStreamTimeout > 0
  ? configuredStreamTimeout
  : 30 * 60_000;
const SETTLE_DELAY_MS = 4_000;
const COOLDOWN_DELAY_MS = 3_000;
const CYCLE_COOLDOWN_MS = 15_000;
const LOGIN_TIMEOUT_MS = 10 * 60_000;
const REQUIRED_IDLE_MS = 5_000;

const MAX_PACKAGES_PER_CYCLE = Number(process.env.CHATGPT_MAX_PACKAGES_PER_CYCLE || 3);
const MAX_REASONING_TURNS_PER_CYCLE = Number(process.env.CHATGPT_MAX_REASONING_TURNS_PER_CYCLE || 3);
const MAX_TOTAL_TURNS_PER_CYCLE = Number(process.env.CHATGPT_MAX_TOTAL_TURNS_PER_CYCLE || 8);
const MAX_CYCLES_PER_REPO = Number(process.env.CHATGPT_MAX_CYCLES_PER_REPO || 12);
const MAX_STAGNANT_CYCLES = Number(process.env.CHATGPT_MAX_STAGNANT_CYCLES || 2);

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
const ASSISTANT_MESSAGE_SELECTOR = '[data-message-author-role="assistant"]';

const NEW_CHAT_SELECTORS = [
  '[data-testid="new-chat-button"]',
  'button:has-text("New chat")',
  'a:has-text("New chat")'
];

const VALID_STATUSES = new Set(["CONTINUE", "COMPLETE", "AWAITING_HUMAN"]);
const VALID_NEXT = new Set(["SPECIALIZE", "PLAN", "PACKAGE", "HANDOFF", "NEW_CYCLE", "STOP"]);
const VALID_MODES = new Set([
  "OPEN_DISCOVERY",
  "LENS_GUIDED",
  "GOAL_CONSTRAINED",
  "EXECUTION",
  "HANDOFF"
]);

const REQUIRED_PROTOCOL_KEYS = [
  "LOOP_STATUS",
  "LOOP_NEXT",
  "LOOP_MODE",
  "LOOP_LENS",
  "LOOP_GOAL",
  "LOOP_PENDING_PACKAGES",
  "LOOP_STATE_FINGERPRINT",
  "LOOP_REASON"
];

function protocolInstructions() {
  return `
End your response with exactly one protocol block using these keys, one per line:

LOOP_STATUS: CONTINUE | COMPLETE | AWAITING_HUMAN
LOOP_NEXT: SPECIALIZE | PLAN | PACKAGE | HANDOFF | NEW_CYCLE | STOP
LOOP_MODE: OPEN_DISCOVERY | LENS_GUIDED | GOAL_CONSTRAINED | EXECUTION | HANDOFF
LOOP_LENS: <short lens name or NONE>
LOOP_GOAL: <committed goal or NONE>
LOOP_PENDING_PACKAGES: <integer 0-${MAX_PACKAGES_PER_CYCLE}>
LOOP_STATE_FINGERPRINT: <short stable description of the material repository state>
LOOP_REASON: <one-line reason for the transition>

Protocol rules:
- COMPLETE and AWAITING_HUMAN must use LOOP_NEXT: STOP.
- OPEN_DISCOVERY and LENS_GUIDED must not invent work packages; use LOOP_PENDING_PACKAGES: 0 until a PLAN turn creates a queue.
- Use PLAN only when a concrete goal is genuinely committed by repository authority, explicit user direction, or strong current project evidence. Do not silently convert a hypothesis into a goal.
- Use SPECIALIZE only when a specific additional analytical lens is warranted before planning.
- Use PACKAGE only when a real pending package exists.
- Use HANDOFF only when the current package queue exists and LOOP_PENDING_PACKAGES is 0.
- Use NEW_CYCLE after a verified handoff when more strategic discovery may still be warranted.
- Do not wrap the protocol block in a code fence.
`.trim();
}

function buildDiscoveryPrompt(repo) {
  return `
@github Analyse repository "${repo.name}".

Repository context (context, not a required conclusion):
${repo.context}

Use progressive commitment.

PHASE 1 - MINIMALLY FRAMED DIAGNOSIS
- Inspect current main, authoritative requirements/design documents, current status/handoff material, and recent relevant commits.
- Reconstruct what the repository currently is, what it is trying to accomplish, and what is materially unresolved.
- Ground claims in current repository evidence.
- Do not assume this is a release-candidate, Version 1.0, implementation, refactor, or "more work is required" problem.

PHASE 2 - CANDIDATE INTERPRETATIONS
- Identify the strongest plausible interpretations of the repository's present situation.
- Include "no further repository change is currently warranted" when evidence supports it.
- Distinguish facts, interpretations, and recommendations.

PHASE 3 - CHOOSE THE NEXT ANALYTICAL COMMITMENT
Choose exactly one:
1. SPECIALIZE: a specific lens is needed before a responsible plan can be made.
2. PLAN: a concrete goal is already genuinely committed and repository evidence is sufficient to plan bounded work toward it.
3. STOP with COMPLETE: authoritative requirements appear satisfied and no repository-resolvable change is warranted.
4. STOP with AWAITING_HUMAN: the next necessary step requires unavailable human/external authority or a reserved product decision.

Do not implement code, create branches, open PRs, or create a work-package queue in this turn.

${protocolInstructions()}
`.trim();
}

function buildLensPrompt(repo, lens) {
  return `
@github Continue analysing repository "${repo.name}".

The previous open diagnosis found that this additional lens is warranted:
${lens}

Perform a bounded LENS-GUIDED ANALYSIS.
- Investigate this lens deeply enough to resolve the uncertainty that justified it.
- Keep the lens subordinate to repository evidence; do not force evidence to fit it.
- Reconcile against current main and authoritative repository intent.
- Decide whether the result now warrants:
  * PLAN toward a genuinely committed goal,
  * another SPECIALIZE turn with a different precise lens,
  * COMPLETE because no repository change is warranted, or
  * AWAITING_HUMAN because the next decision requires human/external authority.
- Do not implement code or create work packages in this turn.

${protocolInstructions()}
`.trim();
}

function buildPlanPrompt(repo, goal) {
  return `
@github Create a bounded repository plan for "${repo.name}".

COMMITTED GOAL:
${goal}

This is GOAL-CONSTRAINED analysis. The goal is now the execution constraint, but the implementation path is not predetermined.

1. Reconcile the goal against current main and authoritative repository evidence.
2. If the goal is already satisfied, report COMPLETE rather than inventing work.
3. If satisfying the goal requires unavailable human/external authority, report AWAITING_HUMAN rather than inventing substitute work.
4. Otherwise create UP TO ${MAX_PACKAGES_PER_CYCLE} bounded repository-resolvable work packages.
5. Prefer the smallest set of packages that actually closes the committed gap.
6. Each package must state:
   - the concrete gap/transition it closes;
   - files/subsystems likely involved;
   - repository-only or hermetic validation;
   - any external action explicitly deferred.
7. Do not implement the packages in this turn.

Output a queue in this form when packages are warranted:
### Work Package Queue
- [ ] Package 1: ...
- [ ] Package 2: ...
- [ ] Package 3: ...

Omit unused package lines. LOOP_PENDING_PACKAGES must equal the actual number of unchecked packages.

${protocolInstructions()}
`.trim();
}

function buildPackagePrompt(repo, goal) {
  return `
@github Reconcile and process the NEXT genuinely pending package for "${repo.name}".

COMMITTED GOAL:
${goal}

EXECUTION POLICY:
1. Sync/reconcile with latest main before acting.
2. Confirm the next unchecked package is still necessary for the committed goal.
3. If it is already satisfied or obsolete, mark it RECONCILED_NO_CHANGE; do not replace it with speculative work.
4. If implementation is warranted, create/use a bounded work branch and implement THIS PACKAGE ONLY.
5. Run native validation plus relevant negative/rejection tests.
6. Keep execution repository-only or hermetic unless the repository already has explicit authority for something broader.
7. Commit/push/open a PR as appropriate. Merge only when the exact candidate head is repository-qualified and required checks pass.
8. Output the full updated queue with [x] completed/reconciled and [ ] genuinely pending.
9. LOOP_PENDING_PACKAGES must equal the unchecked queue count after this turn.
10. If the same package remains pending because of a repository-resolvable implementation or CI failure, keep LOOP_NEXT: PACKAGE and explain the blocker in LOOP_REASON.
11. If zero packages remain, use LOOP_NEXT: HANDOFF.
12. Stop after this package; never begin another package in the same assistant turn.

${protocolInstructions()}
`.trim();
}

function buildHandoffPrompt(repo, goal) {
  return `
@github Perform a post-work reconciliation and handoff for "${repo.name}".

COMMITTED GOAL:
${goal}

The controller observed LOOP_PENDING_PACKAGES: 0. Treat that as evidence to VERIFY, not as an unquestionable assertion.

1. Reconcile current main, relevant PRs, exact candidate heads, merge state, and CI/check state.
2. If work is not actually integrated or a required package is still unresolved, do not falsely document completion. Return to PLAN or PACKAGE as warranted.
3. If implementation is integrated, update/create STATUS.md or HANDOFF.md with:
   - what changed;
   - current authoritative state;
   - validation evidence;
   - deferred human/external gates;
   - any genuinely warranted next strategic question.
4. Update runbook/README commands only where needed for the delivered capability.
5. Do not invent a new implementation package merely to keep the loop busy.
6. When the handoff is verified:
   - use COMPLETE if authoritative repository requirements/current committed goal are satisfied and no repository-resolvable change is warranted;
   - use AWAITING_HUMAN if only human/external authority remains;
   - otherwise use CONTINUE + NEW_CYCLE so the next fresh chat can rediscover the next strategic situation without inheriting this goal as an automatic lens.

${protocolInstructions()}
`.trim();
}

function normalizeStatusLine(line) {
  return String(line || "")
    .trim()
    .replace(/^[-#>*`\s]+/, "")
    .replace(/^(?:\*\*|__)+/, "")
    .replace(/(?:\*\*|__|`)+$/, "")
    .trim();
}

function parseLoopProtocol(answerText) {
  const values = {};
  for (const rawLine of String(answerText || "").split(/\r?\n/)) {
    const line = normalizeStatusLine(rawLine);
    for (const key of REQUIRED_PROTOCOL_KEYS) {
      const prefix = `${key}:`;
      if (line.startsWith(prefix)) values[key] = line.slice(prefix.length).trim();
    }
  }

  const missing = REQUIRED_PROTOCOL_KEYS.filter(key => values[key] === undefined);
  if (missing.length > 0) {
    throw new Error(`Assistant response omitted protocol field(s): ${missing.join(", ")}`);
  }

  const outcome = {
    status: values.LOOP_STATUS,
    next: values.LOOP_NEXT,
    mode: values.LOOP_MODE,
    lens: values.LOOP_LENS,
    goal: values.LOOP_GOAL,
    pendingPackages: Number(values.LOOP_PENDING_PACKAGES),
    fingerprint: values.LOOP_STATE_FINGERPRINT,
    reason: values.LOOP_REASON
  };

  validateOutcome(outcome);
  return outcome;
}

function validateOutcome(outcome) {
  if (!VALID_STATUSES.has(outcome.status)) throw new Error(`Invalid LOOP_STATUS: ${outcome.status}`);
  if (!VALID_NEXT.has(outcome.next)) throw new Error(`Invalid LOOP_NEXT: ${outcome.next}`);
  if (!VALID_MODES.has(outcome.mode)) throw new Error(`Invalid LOOP_MODE: ${outcome.mode}`);
  if (!Number.isInteger(outcome.pendingPackages) || outcome.pendingPackages < 0 || outcome.pendingPackages > MAX_PACKAGES_PER_CYCLE) {
    throw new Error(`Invalid LOOP_PENDING_PACKAGES: ${outcome.pendingPackages}`);
  }
  if (!outcome.fingerprint) throw new Error("LOOP_STATE_FINGERPRINT must not be empty.");
  if (!outcome.reason) throw new Error("LOOP_REASON must not be empty.");

  const terminal = outcome.status === "COMPLETE" || outcome.status === "AWAITING_HUMAN";
  if (terminal && outcome.next !== "STOP") throw new Error(`${outcome.status} requires LOOP_NEXT: STOP.`);
  if (!terminal && outcome.next === "STOP") throw new Error("LOOP_NEXT: STOP requires COMPLETE or AWAITING_HUMAN.");
  if ((outcome.mode === "OPEN_DISCOVERY" || outcome.mode === "LENS_GUIDED") && outcome.pendingPackages !== 0) {
    throw new Error(`${outcome.mode} cannot report pending packages before planning.`);
  }
  if (outcome.next === "SPECIALIZE" && (!outcome.lens || outcome.lens === "NONE")) {
    throw new Error("LOOP_NEXT: SPECIALIZE requires a concrete LOOP_LENS.");
  }
  if ((outcome.next === "PLAN" || outcome.next === "PACKAGE" || outcome.next === "HANDOFF") &&
      (!outcome.goal || outcome.goal === "NONE")) {
    throw new Error(`LOOP_NEXT: ${outcome.next} requires a concrete LOOP_GOAL.`);
  }
  if (outcome.next === "PACKAGE" && outcome.pendingPackages < 1) {
    throw new Error("LOOP_NEXT: PACKAGE requires at least one pending package.");
  }
  if (outcome.next === "HANDOFF" && outcome.pendingPackages !== 0) {
    throw new Error("LOOP_NEXT: HANDOFF requires zero pending packages.");
  }
  if (outcome.next === "NEW_CYCLE" && (outcome.mode !== "HANDOFF" || outcome.pendingPackages !== 0)) {
    throw new Error("LOOP_NEXT: NEW_CYCLE is only valid after a zero-pending HANDOFF turn.");
  }
}

function isTerminalOutcome(outcome) {
  return outcome.status === "COMPLETE" || outcome.status === "AWAITING_HUMAN";
}

function outcomeSignature(outcome) {
  return [
    outcome.status,
    outcome.next,
    outcome.mode,
    outcome.lens,
    outcome.goal,
    outcome.pendingPackages,
    outcome.fingerprint
  ].join("|");
}

function nextControllerAction(outcome) {
  return isTerminalOutcome(outcome) ? "TERMINAL" : outcome.next;
}

let stopRequested = false;
let started = false;
let startResolve = null;
let readlineInterface = null;
let browserContext = null;

const startPromise = new Promise(resolve => {
  startResolve = resolve;
});

function watchEnterKey() {
  console.log("\n========================================================");
  console.log("1. Log in to ChatGPT in the opened browser.");
  console.log("2. Press ENTER here to start progressive repository runs.");
  console.log("3. Press ENTER again at any time to drain the active turn and stop.");
  console.log("========================================================\n");

  readlineInterface = readline.createInterface({ input: process.stdin, output: process.stdout });
  readlineInterface.on("line", () => {
    if (!started) {
      started = true;
      console.log("\n[start] Operator triggered launch.\n");
      if (startResolve) startResolve();
    } else {
      stopRequested = true;
      console.log("\n[drain] Stop requested. No new turns will start after the active turn.\n");
    }
  });
}

async function findFirstVisible(page, selectors, timeout = 30_000) {
  const deadline = Date.now() + timeout;
  let lastError = null;

  while (Date.now() < deadline) {
    if (stopRequested) throw new Error("Stop requested by operator.");

    for (const selector of selectors) {
      try {
        const locator = page.locator(selector);
        const count = await locator.count();
        for (let i = 0; i < count; i++) {
          const candidate = locator.nth(i);
          if (await candidate.isVisible()) return candidate;
        }
      } catch (error) {
        lastError = error;
      }
    }

    await page.waitForTimeout(500);
  }

  throw new Error(`Element not found for [${selectors.join(", ")}]. Last error: ${lastError ? lastError.message : "none"}`);
}

async function waitForLogin(page, timeoutMs = LOGIN_TIMEOUT_MS) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    for (const selector of COMPOSER_SELECTORS) {
      const locator = page.locator(selector);
      const count = await locator.count();
      for (let i = 0; i < count; i++) {
        if (await locator.nth(i).isVisible()) return;
      }
    }
    await page.waitForTimeout(1500);
  }
  throw new Error("Authentication timeout. Log in manually and re-run.");
}

async function countAssistantMessages(page) {
  return page.locator(ASSISTANT_MESSAGE_SELECTOR).count();
}

async function clearComposer(page, timeoutMs = 30_000) {
  const composer = await fillComposer(page, "", timeoutMs);
  await waitForComposerCleared(page, composer);
}

async function startFreshChat(page) {
  if (page.isClosed()) throw new Error("Cannot start a chat on a closed page.");

  let clicked = false;
  for (const selector of NEW_CHAT_SELECTORS) {
    try {
      const button = page.locator(selector).first();
      if ((await button.count()) > 0 && (await button.isVisible())) {
        await button.click();
        clicked = true;
        break;
      }
    } catch {}
  }

  if (!clicked) await page.goto(CHATGPT_URL, { waitUntil: "domcontentloaded" });

  await clearComposer(page, 30_000);

  const deadline = Date.now() + 10_000;
  while (Date.now() < deadline) {
    if ((await countAssistantMessages(page)) === 0) {
      await page.waitForTimeout(750);
      console.log("[session] Fresh context verified.");
      return;
    }
    await page.waitForTimeout(250);
  }

  await page.goto(CHATGPT_URL, { waitUntil: "domcontentloaded" });
  await clearComposer(page, 30_000);
  if ((await countAssistantMessages(page)) !== 0) {
    throw new Error("Could not verify a fresh ChatGPT conversation context.");
  }
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

  throw new Error(`Could not fill the visible composer. Last error: ${lastError ? lastError.message : "none"}`);
}

async function readComposerText(composer) {
  const tagName = await composer.evaluate(element => element.tagName.toLowerCase());
  if (tagName === "textarea" || tagName === "input") return composer.inputValue();
  return (await composer.textContent()) || "";
}

function normalizePromptText(text) {
  return String(text || "").replace(/\r\n/g, "\n").replace(/\s+/g, " ").trim();
}

async function waitForComposerCleared(page, composer, timeoutMs = 10_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if ((await readComposerText(composer)).trim() === "") return;
    await page.waitForTimeout(250);
  }
  throw new Error("Prompt was not cleared after submission; refusing to continue.");
}

async function isStopVisible(page) {
  const buttons = page.locator(STOP_SELECTOR_COMBINED);
  const count = await buttons.count();
  for (let i = 0; i < count; i++) {
    if (await buttons.nth(i).isVisible()) return true;
  }
  return false;
}

async function isComposerIdle(page) {
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
}

async function sendPrompt(page, text) {
  if (page.isClosed()) throw new Error("Cannot send a prompt on a closed page.");
  if (!text || !text.trim()) throw new Error("Cannot send an empty prompt.");

  const baselineAssistantCount = await countAssistantMessages(page);
  const promptForComposer = text.replace(/\r\n/g, "\n").replace(/\n/g, " ");
  const composer = await fillComposer(page, promptForComposer, 120_000);

  const composerText = await readComposerText(composer);
  if (normalizePromptText(composerText) !== normalizePromptText(promptForComposer)) {
    throw new Error(
      `Prompt verification failed: expected ${promptForComposer.length} characters, received ${composerText.length}.`
    );
  }

  let sent = false;
  for (const selector of SEND_SELECTORS) {
    try {
      const button = page.locator(selector).first();
      if ((await button.count()) > 0 && (await button.isVisible()) && (await button.isEnabled())) {
        await button.click();
        sent = true;
        break;
      }
    } catch {}
  }

  if (!sent) throw new Error("Send button was not found or enabled; prompt was not submitted.");
  await waitForComposerCleared(page, composer);

  return baselineAssistantCount;
}

async function waitForNewAssistantAnswer(page, baselineAssistantCount) {
  const startDeadline = Date.now() + STREAM_START_TIMEOUT_MS;
  let turnStarted = false;

  while (Date.now() < startDeadline) {
    if ((await countAssistantMessages(page)) > baselineAssistantCount || (await isStopVisible(page))) {
      turnStarted = true;
      break;
    }
    await page.waitForTimeout(300);
  }

  if (!turnStarted) throw new Error("Could not confirm a new assistant turn started.");

  const deadline = Date.now() + STREAM_END_TIMEOUT_MS;
  let idleSince = null;

  while (Date.now() < deadline) {
    const stopVisible = await isStopVisible(page);
    const composerIdle = await isComposerIdle(page);
    const assistantCount = await countAssistantMessages(page);
    const hasNewAssistantMessage = assistantCount > baselineAssistantCount;

    if (!stopVisible && composerIdle && hasNewAssistantMessage) idleSince = idleSince || Date.now();
    else idleSince = null;

    if (idleSince !== null && Date.now() - idleSince >= REQUIRED_IDLE_MS) break;
    await page.waitForTimeout(750);
  }

  if (await isStopVisible(page) || !(await isComposerIdle(page))) {
    throw new Error("Assistant turn did not finish before the streaming timeout.");
  }

  const finalCount = await countAssistantMessages(page);
  if (finalCount <= baselineAssistantCount) {
    throw new Error("Assistant turn finished without a newly identifiable assistant message.");
  }

  await page.waitForTimeout(SETTLE_DELAY_MS);

  const messages = page.locator(ASSISTANT_MESSAGE_SELECTOR);
  for (let index = finalCount - 1; index >= baselineAssistantCount; index--) {
    const text = (await messages.nth(index).innerText()).trim();
    if (text) return text;
  }

  throw new Error("Could not read text from the new assistant turn.");
}

async function runTurn(session, label, prompt) {
  if (stopRequested) return null;

  console.log(`[${session.repo.id}] ${label}`);
  const baseline = await sendPrompt(session.page, prompt);
  const answerText = await waitForNewAssistantAnswer(session.page, baseline);
  const outcome = parseLoopProtocol(answerText);

  console.log(
    `[${session.repo.id}] -> status=${outcome.status} next=${outcome.next} ` +
    `mode=${outcome.mode} pending=${outcome.pendingPackages}`
  );
  console.log(`[${session.repo.id}] reason: ${outcome.reason}`);

  session.lastOutcome = outcome;
  await session.page.waitForTimeout(COOLDOWN_DELAY_MS);
  return outcome;
}

function applyTerminalOutcome(session, outcome) {
  if (!isTerminalOutcome(outcome)) return false;

  session.terminalStatus = outcome.status === "COMPLETE"
    ? "STATUS: REPOSITORY_COMPLETE"
    : `STATUS: AWAITING_HUMAN: ${outcome.reason}`;

  console.log(`[terminal] ${session.repo.name}: ${session.terminalStatus}`);
  return true;
}

function updateStagnation(session, outcome) {
  const signature = outcomeSignature(outcome);
  if (signature === session.previousCycleSignature) session.stagnantCycles += 1;
  else session.stagnantCycles = 0;

  session.previousCycleSignature = signature;

  if (session.stagnantCycles >= MAX_STAGNANT_CYCLES) {
    session.terminalStatus = `STATUS: LOOP_STALLED: repeated state ${signature}`;
    console.error(`[stalled] ${session.repo.name}: ${session.terminalStatus}`);
    return true;
  }

  return false;
}

async function runRepositoryCycle(session, cycleNumber) {
  if (session.terminalStatus || stopRequested) return;

  if (cycleNumber > MAX_CYCLES_PER_REPO) {
    session.terminalStatus = `STATUS: LOOP_STALLED: exceeded ${MAX_CYCLES_PER_REPO} cycles`;
    return;
  }

  session.failed = false;
  await startFreshChat(session.page);

  let outcome = await runTurn(session, "open discovery", buildDiscoveryPrompt(session.repo));
  if (!outcome || applyTerminalOutcome(session, outcome)) return;

  let reasoningTurns = 1;
  let packageTurns = 0;
  let totalTurns = 1;

  while (!stopRequested && totalTurns < MAX_TOTAL_TURNS_PER_CYCLE) {
    const action = nextControllerAction(outcome);

    if (action === "TERMINAL") {
      applyTerminalOutcome(session, outcome);
      return;
    }

    if (action === "SPECIALIZE") {
      if (reasoningTurns >= MAX_REASONING_TURNS_PER_CYCLE) {
        session.terminalStatus = "STATUS: LOOP_STALLED: analysis did not converge to a plan or terminal state";
        return;
      }
      outcome = await runTurn(
        session,
        `lens-guided analysis (${outcome.lens})`,
        buildLensPrompt(session.repo, outcome.lens)
      );
      reasoningTurns += 1;
      totalTurns += 1;
      if (!outcome || applyTerminalOutcome(session, outcome)) return;
      continue;
    }

    if (action === "PLAN") {
      if (reasoningTurns >= MAX_REASONING_TURNS_PER_CYCLE) {
        session.terminalStatus = "STATUS: LOOP_STALLED: planning threshold reached without convergence";
        return;
      }
      outcome = await runTurn(
        session,
        `goal-constrained planning (${outcome.goal})`,
        buildPlanPrompt(session.repo, outcome.goal)
      );
      reasoningTurns += 1;
      totalTurns += 1;
      if (!outcome || applyTerminalOutcome(session, outcome)) return;
      continue;
    }

    if (action === "PACKAGE") {
      if (packageTurns >= MAX_PACKAGES_PER_CYCLE) {
        console.log(
          `[${session.repo.id}] Package-turn budget exhausted with ${outcome.pendingPackages} pending; ` +
          "ending this cycle without a false handoff."
        );
        break;
      }
      outcome = await runTurn(
        session,
        `package turn ${packageTurns + 1}/${MAX_PACKAGES_PER_CYCLE}`,
        buildPackagePrompt(session.repo, outcome.goal)
      );
      packageTurns += 1;
      totalTurns += 1;
      if (!outcome || applyTerminalOutcome(session, outcome)) return;
      continue;
    }

    if (action === "HANDOFF") {
      outcome = await runTurn(session, "verified handoff", buildHandoffPrompt(session.repo, outcome.goal));
      totalTurns += 1;
      if (!outcome || applyTerminalOutcome(session, outcome)) return;
      if (outcome.next === "NEW_CYCLE") break;
      continue;
    }

    if (action === "NEW_CYCLE") break;

    throw new Error(`Unhandled controller action: ${action}`);
  }

  if (outcome && !session.terminalStatus) updateStagnation(session, outcome);
}

async function createRepositoryPages(firstPage) {
  const sessions = [];

  for (let index = 0; index < REPOSITORIES.length; index++) {
    const repo = REPOSITORIES[index];
    const page = index === 0 ? firstPage : await browserContext.newPage();

    if (index > 0) {
      await page.goto(CHATGPT_URL, { waitUntil: "domcontentloaded" });
      await waitForLogin(page);
    }

    sessions.push({
      repo,
      page,
      failed: false,
      terminalStatus: null,
      lastOutcome: null,
      previousCycleSignature: null,
      stagnantCycles: 0
    });

    console.log(`[tab ${index + 1}/${REPOSITORIES.length}] Ready for ${repo.name}.`);
  }

  return sessions;
}

async function runRepositories(firstPage) {
  const sessions = await createRepositoryPages(firstPage);
  let cycleNumber = 1;

  while (!stopRequested) {
    const activeSessions = sessions.filter(session => !session.terminalStatus);
    if (activeSessions.length === 0) {
      console.log("\n[complete] Every enabled repository reached a controller terminal state.");
      break;
    }

    console.log(`\n################ PROGRESSIVE CYCLE ${cycleNumber} ################`);
    const results = await Promise.allSettled(
      activeSessions.map(session => runRepositoryCycle(session, cycleNumber))
    );

    results.forEach((result, index) => {
      if (result.status === "rejected") {
        const session = activeSessions[index];
        session.failed = true;
        session.terminalStatus = `STATUS: LOOP_ERROR: ${result.reason ? result.reason.message : String(result.reason)}`;
        console.error(`[quarantine] ${session.repo.name}: ${session.terminalStatus}`);
      }
    });

    cycleNumber += 1;

    if (!stopRequested && sessions.some(session => !session.terminalStatus)) {
      console.log(`[cycle] Fresh rediscovery begins in ${CYCLE_COOLDOWN_MS / 1000}s.`);
      await firstPage.waitForTimeout(CYCLE_COOLDOWN_MS);
    }
  }

  console.log("\n[summary]");
  for (const session of sessions) {
    console.log(`- ${session.repo.name}: ${session.terminalStatus || "stopped by operator"}`);
  }
}

async function main() {
  const { chromium } = require("playwright");

  watchEnterKey();

  browserContext = await chromium.launchPersistentContext(USER_DATA_DIR, {
    headless: false,
    viewport: { width: 1280, height: 900 }
  });

  const firstPage = browserContext.pages()[0] || (await browserContext.newPage());
  await firstPage.goto(CHATGPT_URL, { waitUntil: "domcontentloaded" });
  await waitForLogin(firstPage);
  await clearComposer(firstPage);

  console.log("[ready] Logged in. Press ENTER to start.");
  await startPromise;

  try {
    await runRepositories(firstPage);
  } catch (error) {
    console.error("[error]", error);
    process.exitCode = 1;
  } finally {
    if (readlineInterface) readlineInterface.close();
    if (browserContext) await browserContext.close();
  }
}

module.exports = {
  buildDiscoveryPrompt,
  buildLensPrompt,
  buildPlanPrompt,
  buildPackagePrompt,
  buildHandoffPrompt,
  parseLoopProtocol,
  validateOutcome,
  isTerminalOutcome,
  outcomeSignature,
  nextControllerAction
};

if (require.main === module) {
  main();
}
