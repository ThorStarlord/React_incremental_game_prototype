# Post-M25 Blind Simulated Product Review V2 — Controller Runbook

**Campaign:** `SIR-2026-09-09-POST-M25-V2`  
**Status:** EXECUTION RUNBOOK — PARTICIPANTS NOT YET RUN  
**Governing manifest:** `CampaignManifest.md`

---

## 1. Role boundary

The controller/custodian may know repository authority, intended design, V1 results, V2 protocol, and exact candidate provenance.

The controller must not impersonate a participant, coach causality, manually reconstruct controls, or adjudicate participant correctness before the evaluator embargo lifts.

---

## 2. Exact preflight

Before each participant, verify:

```text
GAME UNDER TEST
commit = 953b01bec22261e3b84aea59544fd9b75746cf00
tree   = 08427373b98b934a130abd9dc3e59c25258f1c81
Build Validation #252 = PASS

V2 APPARATUS
qualified head = f5ed8b4b51e539a99e5d0ca5695ac2ea98fa05e8
qualified tree = 37b59a5a153aece39c812c5e08aab702d873d625
merge commit   = 0f81551a8bc8c2b23ea3aab3439c250bb10c71e2
Build Validation #258 = PASS
run 34327257634 / job 102387266157
```

Also verify the exact participant packet blob from `CampaignManifest.md`.

Do not launch a participant if either game or apparatus identity differs.

---

## 3. Required two-authority execution model

Preferred setup:

```text
GAME WORKTREE
checkout exact 953b01bec22261e3b84aea59544fd9b75746cf00
npm ci
HOST=127.0.0.1 PORT=3000 BROWSER=none npm start

APPARATUS WORKTREE
checkout exact f5ed8b4b51e539a99e5d0ca5695ac2ea98fa05e8
npm ci
npx playwright install chromium
npm run simulated-review:observe -- \
  --profile <profile-id> \
  --url http://127.0.0.1:3000 \
  --out <participant-output-dir> \
  --screenshot-relay-capable <yes|no|unknown>
```

The apparatus observes the ordinary HTTP/UI surface of the frozen game candidate. Do not serve current `main` as the game-under-test merely because the V2 apparatus is present there.

---

## 4. Fresh participant context

For every A–F profile:

1. create a genuinely new conversation/agent context;
2. do not connect that participant to GitHub or repository tools;
3. do not expose repository files, URLs, source, tests, specifications, V1 evidence, V2 campaign documents, evaluator notes, or controller notes;
4. provide only the exact frozen V2 participant packet;
5. provide the neutral `ParticipantSessionEnvelope.md` instructions;
6. provide the harness-generated current `participant-relay-NNN.md` verbatim;
7. provide the screenshot only when the participant surface supports it.

If genuine isolation cannot be established for a participant being launched, stop rather than role-play in the controller context.

---

## 5. Screenshot capability preflight

Record one of:

```text
SCREENSHOT_RELAY_CAPABLE: YES
SCREENSHOT_RELAY_CAPABLE: NO
SCREENSHOT_RELAY_CAPABLE: UNKNOWN
```

`YES`: relay the matching screenshot with each observation.

`NO`/`UNKNOWN`: relay text + controls and record the limitation. Do not claim screenshot evidence was shown.

---

## 6. Canonical observation relay

For every turn:

```text
HARNESS captures ordinary UI
-> HARNESS writes observation-NNN.*
-> HARNESS writes participant-relay-NNN.md
-> CONTROLLER sends participant-relay-NNN.md verbatim
-> PARTICIPANT responds
-> CONTROLLER submits exact ACTION string to harness
-> HARNESS validates action binding
-> HARNESS executes or rejects before mutation
-> HARNESS captures next observation where required
```

The controller must never manually rewrite the visible-control list or replace the opaque action IDs.

The controller may add only neutral transport framing such as `Here is the next player-facing observation:`.

---

## 7. Participant response contract

Require exactly:

```text
CURRENT INTERPRETATION:
CURRENT HYPOTHESIS:
DECISION:
REASON:
ACTION:
CONFUSION:
```

Allowed actions:

```text
snapshot
click <action-id>
fill <action-id> <text>
press <key>
back
quit
```

Do not ask for private chain-of-thought.

---

## 8. Fail-closed action handling

If the apparatus returns:

```text
INVALID_ACTION_ID
ACTION_REJECTED_STALE_OR_MISMATCHED
```

or another V2 validation rejection:

1. confirm that no click/fill was performed;
2. preserve the rejection in the machine ledger/raw record;
3. capture/use the fresh harness observation;
4. tell the participant only that the previous action no longer matched the currently visible control set and no substitute action was chosen;
5. send the new canonical relay verbatim;
6. let the participant choose again.

This expected fail-closed behavior is not itself contamination.

Never choose the participant's replacement action.

---

## 9. Permitted controller interventions

Permitted:

- explain command syntax without game causality;
- report a harness validation rejection;
- restart a crashed browser only if state can be fairly restored and the intervention is recorded;
- relay a fresh harness-generated observation;
- state that intended mechanics must be inferred from the game.

Forbidden:

- tell the participant what Affinity, Connection, Memory, Essence, Knowledge, Faction, World State, Trait gates, routine familiarity, or Copies are intended to mean;
- recommend a route or strategic choice;
- tell a participant about the V1 Copy finding;
- reveal another participant's route/confusion;
- construct or renumber controls manually;
- map a stale action to what the controller thinks the participant meant.

Record every non-routine intervention.

---

## 10. Natural causal probes

Use only the already-preregistered neutral causal probes at natural checkpoints after a concept is meaningfully visible.

Examples:

```text
What do you currently think Affinity represents?
What do you currently think Connection represents?
Why do you think this capability became available or stayed unavailable?
Do you think every NPC knows this event? What visible evidence led you there?
Does institutional standing appear to be the same as the individual relationship?
What do you think changed objectively in the world?
Why do you think this routine is now delegatable?
```

Do not reveal the intended answer through probe wording.

---

## 11. Participant-specific reminders

### A — Goal-Focused
Do not encourage optional exploration. Diagnose explicit-goal communication.

### B — Explorer
Permit ordinary investigation/revisits. Do not suggest which surface to inspect.

### C — RPG Veteran
Do not correct familiar RPG assumptions unless the game itself does.

### D — Incremental / Automation
Permit automation-seeking behavior. Diagnose mastery-before-delegation legibility.

### E — Narrative-First
Do not force systems-panel study. Diagnose whether story context carries causal structure.

### F — Skeptical Model-Builder
Permit competing hypotheses and legal falsification attempts. Do not supply canonical models.

---

## 12. V1 Copy-risk firewall

The controller knows V1 identified a bounded Moderate Copy terminology/causal-legibility risk.

Participants do not.

Do not steer any V2 participant toward Copy creation, Charisma, Seduction wording, or the prior V1 route merely to reproduce this finding.

If a participant reaches it naturally, relay only the ordinary visible game behavior and preserve the participant's independent interpretation.

---

## 13. Raw-record assembly

Use `RawParticipantRecordTemplate.md`.

For each meaningful exchange preserve:

```text
Observation ID
Observation artifact + digest
Control-set digest
Participant relay artifact + digest
Screenshot reference / relay status
Participant response verbatim
Exact ACTION
Harness validation result
Execution result or rejection
Next observation ID
Operational intervention, if any
```

Reference the machine `session-ledger.jsonl` as operational provenance.

Do not add evaluator labels such as `MISCONCEPTION` to raw evidence.

---

## 14. Freeze procedure after each participant

Immediately after a participant ends:

1. finalize raw metadata;
2. verify no hidden-state material was exposed;
3. preserve any contamination rather than deleting it;
4. commit the raw record as its own evidence-bearing commit;
5. push it and verify remote reachability;
6. add only append-only clerical correction for self-referential freeze SHA if needed;
7. do not edit participant interpretation text;
8. only then start the next participant.

---

## 15. No interim adjudication

After A–E do not create:

- cross-player scores;
- provisional PASS/WEAK/FAIL/INCONCLUSIVE;
- recurrence claims;
- repair proposals;
- Product Direction Decision.

Only operational-integrity checks are allowed.

---

## 16. Early stop

Stop launching new participants if a preregistered V2 early-stop condition fires.

Then:

1. freeze current participant evidence;
2. create `EarlyStopRecord.md` with trigger/provenance/operational facts only;
3. commit/push it;
4. lift evaluator embargo only after the record is frozen;
5. do not repair game/apparatus on the campaign branch before adjudication.

A correctly rejected stale action is not an early stop.

---

## 17. Evaluator handoff

After all six raw records or a frozen early stop, prepare a corpus inventory containing:

```text
V2 campaign manifest commit
Game candidate SHA/tree
V2 apparatus SHA/tree + Build Validation #258
Participant A raw commit/path
Participant B raw commit/path
Participant C raw commit/path
Participant D raw commit/path
Participant E raw commit/path
Participant F raw commit/path
EarlyStopRecord if applicable
Operational limitations
```

Only then may an independent evaluator inspect frozen participant evidence plus canonical specifications/implementation.

---

## 18. Stop marker before Participant A

```text
SIR-V2_CAMPAIGN_MANIFEST_FROZEN
SIR-V2_CONTROLLER_RUNBOOK_FROZEN
SIR-V2_RAW_RECORD_TEMPLATE_FROZEN
SIR-V2_SESSION_ENVELOPE_FROZEN

V2 GAME CANDIDATE            FROZEN
V2 APPARATUS                 QUALIFIED
PARTICIPANT A-F              READY FOR ISOLATED EXECUTION
PARTICIPANT A-F              NOT YET RUN
V2 SYNTHETIC VERDICT         NOT ASSIGNED
HUMAN PRODUCT VALIDATION     DEFERRED / UNPROVEN
M26                          NOT AUTHORIZED
```
