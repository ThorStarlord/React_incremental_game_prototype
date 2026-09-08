# Post-M25 Blind Simulated Product Review — Controller Runbook

**Campaign:** `SIR-2026-09-08-POST-M25-V1`  
**Status:** Execution runbook — participant evidence not yet collected  
**Governing manifest:** `CampaignManifest.md`

---

## 1. Purpose

This runbook operationalizes the already-frozen preregistration without changing it.

The controller is allowed to know repository authority and intended design. The controller must therefore minimize discretionary interpretation during participant execution.

The controller does **not** impersonate a participant and does **not** adjudicate correctness before the evaluator embargo lifts.

---

## 2. Preflight before Participant A

Verify and record:

```text
Candidate commit = 953b01bec22261e3b84aea59544fd9b75746cf00
Candidate tree   = 08427373b98b934a130abd9dc3e59c25258f1c81
Build Validation #252 = PASS
Protocol blob    = 39c776271585c5cfb62f06678b17932ef7780823
Harness blob     = 563a9c29fc0b965c66858eba0bb470fb863cdc6e
```

Then run the repository's normal validation and synthetic-review harness smoke on the campaign branch if the branch introduces only evidence-recording documentation.

Do not launch Participant A if the tested game candidate has changed.

---

## 3. Isolated-context creation

For each profile A through F:

1. create a brand-new conversation / agent context;
2. do not connect that participant context to GitHub;
3. do not expose repository files or URLs;
4. do not preload controller notes or previous conversations;
5. provide only the exact frozen participant-packet content;
6. provide the participant session envelope from `ParticipantSessionEnvelope.md`;
7. provide only the current player-facing observation after the participant accepts the session protocol.

If the execution environment cannot provide a genuinely fresh context, do not substitute role-play in this controller context.

Record:

```text
ISOLATION: PASS
```

or stop with:

```text
INCONCLUSIVE — participant isolation insufficient
```

---

## 4. Game launch for each participant

Start the game from the frozen candidate.

Use a fresh ephemeral Playwright context.

Recommended harness invocation pattern:

```text
npm run simulated-review:observe -- --profile <profile-id> --url http://127.0.0.1:3000 --out <participant-output-dir>
```

The controller may adapt host/port to the actual runtime as long as the game candidate and UI-only boundary remain unchanged.

Do not reuse `.chatgpt-profile/` or any persistent browser profile as player-game state.

---

## 5. Standard observation loop

Repeat this exact high-level loop:

```text
1. HARNESS captures ordinary player-facing observation
2. CONTROLLER relays observation without causal interpretation
3. PARTICIPANT returns structured response
4. CONTROLLER records response verbatim
5. CONTROLLER executes ACTION exactly where mechanically possible
6. HARNESS captures next ordinary observation
7. repeat
```

The participant response contract is:

```text
CURRENT INTERPRETATION:
CURRENT HYPOTHESIS:
DECISION:
REASON:
ACTION:
CONFUSION:
```

Do not ask for hidden chain-of-thought.

---

## 6. Observation relay rules

Relay:

- observation identifier;
- screenshot if the participant context supports image input;
- visible text;
- visible controls;
- current ordinary player-facing URL where useful.

Do not relay:

- source identifiers that were not visible to the player;
- Redux/state snapshots;
- fixture names;
- canonical route names;
- test names;
- hidden quest flags;
- intended interpretation;
- evaluator classification.

If the harness itself includes internal metadata that would not normally be visible, omit that metadata and record the omission as an operational sanitization.

---

## 7. Action execution rules

Execute participant actions literally when valid.

Allowed command families are those supported by the qualified harness, including:

```text
snapshot
click <control-number>
fill <control-number> <text>
press <key>
back
quit
```

If a command cannot execute because the numbered control changed after an asynchronous UI update:

1. capture a fresh observation;
2. tell the participant the command could not be applied because the visible control set changed;
3. do not choose a replacement action for them;
4. ask for a new `ACTION` based on the fresh observation.

That is operational assistance, not causal coaching.

---

## 8. Controller intervention policy

Permitted interventions:

- explain the command syntax;
- report that an action failed mechanically;
- restart a crashed browser if game state can be fairly restored;
- provide a fresh screenshot/visible-text capture;
- clarify that the participant should infer from the game rather than ask the controller for intended mechanics.

Forbidden interventions:

- explain what Affinity, Connection, Memory, Essence, Knowledge, Faction, World State, Trait gates, or Copy familiarity are intended to mean;
- tell the participant which route is correct;
- tell the participant how to unlock a mechanic;
- recommend a strategic choice;
- summarize prior hidden state;
- disclose another participant's behavior.

Every intervention must be recorded in the raw record.

---

## 9. Natural causal probes

At the preregistered natural checkpoints, the controller may ask the already-frozen causal probe questions.

The controller must use neutral wording and must not reveal the intended answer.

Examples:

```text
What do you currently think Affinity represents?
What do you currently think Connection represents?
Why do you think this capability became available or stayed unavailable?
Do you think every NPC knows this event? What visible evidence led you there?
Does this institutional standing appear to be the same as the individual relationship?
What do you think changed objectively in the world?
Why do you think this routine is now delegatable?
```

Do not probe a concept that has not yet become meaningfully visible unless the preregistration specifically requires it at that point.

---

## 10. Completion definition

A participant is `COMPLETE` when either:

- it reaches a valid chapter conclusion through normal play and completes the relevant post-run causal probes; or
- the preregistered protocol defines the participant's substantial-navigation evidence as sufficient and the participant chooses to stop after the meaningful tested scope.

Record route/conclusion descriptively only after the raw record is frozen. Do not feed route labels back to the participant.

---

## 11. Participant-specific execution reminders

### A — Goal-Focused

Do not encourage optional exploration merely because the controller knows useful explanations are elsewhere.

Primary diagnostic: what the game communicates to a player who follows explicit goals.

### B — Explorer

Permit ordinary investigation and revisits. Do not steer which surface to inspect.

Primary diagnostic: whether deeper causal information can actually be found.

### C — RPG Veteran

Do not correct conventional-RPG assumptions.

Primary diagnostic: whether visible evidence differentiates this game's Relationship model from generic reputation/XP thinking.

### D — Incremental / Automation

Do not prevent early automation-seeking behavior unless the UI itself prevents it.

Primary diagnostic: whether mastery-before-delegation is legible.

### E — Narrative-First

Do not force system-panel inspection.

Primary diagnostic: whether authored narrative communicates enough causal structure.

### F — Skeptical Model-Builder

Allow competing hypotheses and falsification attempts through legal UI actions.

Primary diagnostic: whether the player-facing game can correct plausible wrong causal models.

---

## 12. Raw-record assembly

Use `RawParticipantRecordTemplate.md`.

For every meaningful cycle include:

```text
Observation ID
Visible observation reference
Participant response verbatim
Selected UI action
Execution result
Next observation ID
Operational intervention (if any)
```

Do not add evaluator labels such as `MISCONCEPTION` during the raw phase.

A controller note may state a purely operational fact such as:

```text
ACTION FAILED: control was no longer present after UI refresh.
```

It may not state:

```text
PLAYER MISUNDERSTOOD FACTION REPUTATION.
```

---

## 13. Freeze procedure after each run

Immediately after a participant ends:

1. finalize raw record metadata;
2. verify the record contains no hidden implementation material accidentally exposed to the participant;
3. if contamination occurred, preserve the evidence and mark `CONTAMINATED` rather than deleting it;
4. commit the raw record as its own evidence-bearing commit;
5. record the resulting commit SHA in the campaign status table;
6. do not edit the raw interpretation text afterward.

Only clerical appendices may be added later and must be marked append-only.

---

## 14. No interim adjudication

After A, B, C, D, or E:

Do **not** create:

- cross-player scores;
- provisional PASS/FAIL;
- repair backlog;
- causal-legibility redesign;
- product-direction recommendations.

The controller may check only experimental integrity and execution feasibility.

Reason: the preregistration explicitly weights recurring independent patterns; early adjudication risks contaminating later execution and controller behavior.

---

## 15. Early-stop procedure

If an early-stop condition fires:

1. stop launching new participants;
2. freeze the current participant record;
3. create `EarlyStopRecord.md` containing only the trigger, provenance, and operational facts;
4. lift evaluator embargo only after that record is committed;
5. do not repair the game on the same panel branch before adjudication.

---

## 16. Evaluator handoff

After six raw records or an early stop:

Prepare a frozen corpus inventory containing:

```text
Campaign manifest commit
Participant A raw commit/path
Participant B raw commit/path
Participant C raw commit/path
Participant D raw commit/path
Participant E raw commit/path
Participant F raw commit/path
Early-stop record if applicable
Operational limitations
```

Only then provide the evaluator with:

- frozen participant corpus;
- canonical specifications;
- relevant implementation evidence;
- result template.

The evaluator may then classify correctness, recurrence, severity, and verdict.

---

## 17. Stop marker for this runbook phase

Before any participant is actually launched, the repository should reach:

```text
PANEL_CAMPAIGN_MANIFEST_FROZEN
PANEL_CONTROLLER_RUNBOOK_FROZEN
RAW_RECORD_TEMPLATE_FROZEN
PARTICIPANT_SESSION_ENVELOPE_FROZEN

PARTICIPANT A-F  READY FOR ISOLATED EXECUTION
PARTICIPANT A-F  NOT YET RUN
SYNTHETIC VERDICT NOT ASSIGNED
M26               NOT AUTHORIZED
```

This is preparation for evidence collection, not evidence itself.