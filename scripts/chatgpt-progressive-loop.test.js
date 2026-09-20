const test = require("node:test");
const assert = require("node:assert/strict");

const {
  parseLoopProtocol,
  validateOutcome,
  isTerminalOutcome,
  outcomeSignature,
  nextControllerAction
} = require("./chatgpt-progressive-loop");

function protocol(overrides = {}) {
  const values = {
    status: "CONTINUE",
    next: "PLAN",
    mode: "OPEN_DISCOVERY",
    lens: "NONE",
    goal: "Ship the committed vertical slice",
    pending: 0,
    active: "NONE",
    packageState: "NONE",
    blocker: "NONE",
    fingerprint: "main@abc123: vertical slice incomplete",
    reason: "Repository evidence supports planning against the committed slice.",
    ...overrides
  };

  return [
    `LOOP_STATUS: ${values.status}`,
    `LOOP_NEXT: ${values.next}`,
    `LOOP_MODE: ${values.mode}`,
    `LOOP_LENS: ${values.lens}`,
    `LOOP_GOAL: ${values.goal}`,
    `LOOP_PENDING_PACKAGES: ${values.pending}`,
    `LOOP_ACTIVE_PACKAGE: ${values.active}`,
    `LOOP_PACKAGE_STATE: ${values.packageState}`,
    `LOOP_BLOCKER: ${values.blocker}`,
    `LOOP_STATE_FINGERPRINT: ${values.fingerprint}`,
    `LOOP_REASON: ${values.reason}`
  ].join("\n");
}

test("parses a valid protocol footer", () => {
  const parsed = parseLoopProtocol(`Analysis text.\n\n${protocol()}`);
  assert.equal(parsed.status, "CONTINUE");
  assert.equal(parsed.next, "PLAN");
  assert.equal(parsed.pendingPackages, 0);
  assert.equal(parsed.goal, "Ship the committed vertical slice");
});

test("accepts markdown-decorated protocol lines", () => {
  const text = protocol({
    status: "COMPLETE",
    next: "STOP",
    mode: "HANDOFF",
    goal: "NONE",
    reason: "No repository-resolvable work remains."
  })
    .split("\n")
    .map(line => `- **${line}**`)
    .join("\n");

  const parsed = parseLoopProtocol(text);
  assert.equal(parsed.status, "COMPLETE");
  assert.equal(parsed.next, "STOP");
  assert.equal(isTerminalOutcome(parsed), true);
});

test("rejects missing protocol fields", () => {
  assert.throws(() => parseLoopProtocol("LOOP_STATUS: CONTINUE"), /omitted protocol field/);
});

test("rejects PACKAGE with zero pending packages", () => {
  assert.throws(
    () => parseLoopProtocol(protocol({
      next: "PACKAGE",
      mode: "EXECUTION",
      pending: 0,
      active: 1,
      packageState: "NOT_STARTED"
    })),
    /requires at least one pending package/
  );
});

test("rejects HANDOFF while packages remain", () => {
  assert.throws(
    () => parseLoopProtocol(protocol({
      next: "HANDOFF",
      mode: "HANDOFF",
      pending: 1,
      active: 1,
      packageState: "IMPLEMENTING"
    })),
    /requires zero pending packages/
  );
});

test("rejects terminal status without STOP", () => {
  assert.throws(
    () => parseLoopProtocol(protocol({ status: "COMPLETE", next: "NEW_CYCLE" })),
    /requires LOOP_NEXT: STOP/
  );
});

test("rejects NEW_CYCLE outside a verified handoff", () => {
  assert.throws(
    () => parseLoopProtocol(protocol({ next: "NEW_CYCLE", mode: "GOAL_CONSTRAINED", pending: 0 })),
    /only valid after a zero-pending HANDOFF turn/
  );
});

test("rejects open discovery that invents packages", () => {
  assert.throws(
    () => parseLoopProtocol(protocol({
      mode: "OPEN_DISCOVERY",
      next: "PACKAGE",
      pending: 1,
      active: 1,
      packageState: "NOT_STARTED"
    })),
    /cannot report pending packages before planning/
  );
});

test("SPECIALIZE requires a concrete lens", () => {
  assert.throws(
    () => parseLoopProtocol(protocol({ next: "SPECIALIZE", lens: "NONE" })),
    /requires a concrete LOOP_LENS/
  );
});

test("controller maps terminal outcomes to TERMINAL", () => {
  const parsed = parseLoopProtocol(protocol({
    status: "AWAITING_HUMAN",
    next: "STOP",
    mode: "GOAL_CONSTRAINED",
    reason: "Owner-reserved product decision is required."
  }));
  assert.equal(nextControllerAction(parsed), "TERMINAL");
});

test("outcome signatures ignore prose-only reason changes", () => {
  const first = parseLoopProtocol(protocol());
  const second = parseLoopProtocol(protocol({ reason: "Different prose reason." }));
  assert.equal(outcomeSignature(first), outcomeSignature(second));
});

test("validateOutcome accepts a normal execution continuation", () => {
  assert.doesNotThrow(() => validateOutcome({
    status: "CONTINUE",
    next: "PACKAGE",
    mode: "EXECUTION",
    lens: "NONE",
    goal: "Close the committed serialization gap",
    pendingPackages: 2,
    activePackage: 2,
    packageState: "NOT_STARTED",
    blocker: "NONE",
    fingerprint: "main@def456: two serialization packages pending",
    reason: "Package 1 completed; two remain."
  }));
});


test("parses qualification-blocked RECHECK state", () => {
  const parsed = parseLoopProtocol(protocol({
    next: "RECHECK",
    mode: "EXECUTION",
    pending: 3,
    active: 1,
    packageState: "QUALIFICATION_BLOCKED",
    blocker: "CI_INFRASTRUCTURE",
    fingerprint: "pr26@abc: implementation candidate; CI job allocated no steps",
    reason: "Implementation exists but native qualification did not execute."
  }));

  assert.equal(parsed.activePackage, 1);
  assert.equal(parsed.packageState, "QUALIFICATION_BLOCKED");
  assert.equal(parsed.blocker, "CI_INFRASTRUCTURE");
  assert.equal(nextControllerAction(parsed), "RECHECK");
});

test("RECHECK rejects repository-resolvable defects", () => {
  assert.throws(
    () => parseLoopProtocol(protocol({
      next: "RECHECK",
      mode: "EXECUTION",
      pending: 1,
      active: 1,
      packageState: "IMPLEMENTING",
      blocker: "REPOSITORY"
    })),
    /qualification-pending or qualification-blocked package/
  );
});

test("RECHECK requires an external qualification blocker", () => {
  assert.throws(
    () => parseLoopProtocol(protocol({
      next: "RECHECK",
      mode: "EXECUTION",
      pending: 1,
      active: 1,
      packageState: "QUALIFICATION_BLOCKED",
      blocker: "REPOSITORY"
    })),
    /requires CI_INFRASTRUCTURE or EXTERNAL blocker/
  );
});

test("package state cannot exist without an active package", () => {
  assert.throws(
    () => parseLoopProtocol(protocol({
      packageState: "QUALIFICATION_BLOCKED",
      blocker: "CI_INFRASTRUCTURE"
    })),
    /No active package requires/
  );
});

test("outcome signatures distinguish package lifecycle state", () => {
  const pending = parseLoopProtocol(protocol({
    next: "RECHECK",
    mode: "EXECUTION",
    pending: 1,
    active: 1,
    packageState: "QUALIFICATION_PENDING",
    blocker: "EXTERNAL"
  }));
  const blocked = parseLoopProtocol(protocol({
    next: "RECHECK",
    mode: "EXECUTION",
    pending: 1,
    active: 1,
    packageState: "QUALIFICATION_BLOCKED",
    blocker: "CI_INFRASTRUCTURE"
  }));
  assert.notEqual(outcomeSignature(pending), outcomeSignature(blocked));
});

test("HANDOFF requires no active package lifecycle state", () => {
  assert.throws(
    () => parseLoopProtocol(protocol({
      next: "HANDOFF",
      mode: "HANDOFF",
      pending: 0,
      active: 1,
      packageState: "QUALIFIED"
    })),
    /requires zero pending packages and no active package/
  );
});
