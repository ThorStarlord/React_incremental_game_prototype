# Post-M25 Blind Simulated Product Review V2 — Campaign Manifest

**Campaign ID:** `SIR-2026-09-09-POST-M25-V2`  
**Status:** `FROZEN CANDIDATE — PANEL NOT YET RUN`  
**Recovery authority:** `../../PostSIRV1RecoveryAuthority.md`  
**Base preregistration:** `../../SimulatedIntegratedProductReview.md`  
**V2 amendment:** `../../SimulatedIntegratedProductReviewV2Amendment.md`  
**Human product validation:** `DEFERRED / UNPROVEN`  
**M26:** **NOT AUTHORIZED**

---

## 1. Purpose

This is the clean replacement campaign authorized after `SIR-2026-09-08-POST-M25-V1` ended `INCONCLUSIVE` because of an experimental controller-relay contamination.

V2 preserves the original scientific question, six profiles, evidence ceiling, failure taxonomy, severity semantics, verdict semantics, fresh-context isolation requirement, evaluator independence, and no-repair-during-panel rule.

V2 changes only the qualified observation/action apparatus described by `SimulatedIntegratedProductReviewV2Amendment.md`.

This campaign exists to test the same frozen game candidate with a measurement apparatus that binds every click/fill action to the exact observation delivered to the participant.

---

## 2. Dual provenance — game under test vs measurement apparatus

The game under test and the measurement apparatus are deliberately separate authorities.

### 2.1 Game under test

```text
Repository:      ThorStarlord/React_incremental_game_prototype
Exact commit:    953b01bec22261e3b84aea59544fd9b75746cf00
Exact tree:      08427373b98b934a130abd9dc3e59c25258f1c81
Qualification:   Build Validation #252
Workflow run ID: 34226643617
Production build: PASS
```

No participant may be run against later game behavior while claiming this campaign.

### 2.2 V2 measurement apparatus

```text
Qualified apparatus head:  f5ed8b4b51e539a99e5d0ca5695ac2ea98fa05e8
Qualified apparatus tree:  37b59a5a153aece39c812c5e08aab702d873d625
Merge commit:              0f81551a8bc8c2b23ea3aab3439c250bb10c71e2
Merge tree:                37b59a5a153aece39c812c5e08aab702d873d625
Qualification:             Build Validation #258
Workflow run ID:           34327257634
Job ID:                    102387266157
```

Build Validation #258 passed the synthetic-review contract, V2 action-binding regression contract, Playwright Chromium install, V2 live UI smoke, TypeScript, M25 through the accumulated historical milestone stack, and the production build.

The apparatus merge tree exactly matches the qualified apparatus head tree.

---

## 3. Frozen protocol and apparatus artifacts

| Artifact | Path | Blob SHA |
|---|---|---|
| Base Level-2 preregistration | `specification/Technical/SimulatedIntegratedProductReview.md` | `39c776271585c5cfb62f06678b17932ef7780823` |
| V1/V2 result template authority | `specification/Technical/SimulatedIntegratedProductReviewResultTemplate.md` | `dc72135d61cf95f0fef303b1b32c7463044b71ed` |
| Post-SIR-V1 recovery authority | `specification/Technical/PostSIRV1RecoveryAuthority.md` | `90ac84d02a8a1c88edf1b6ad9cab1b3b13e06820` |
| V2 operational amendment | `specification/Technical/SimulatedIntegratedProductReviewV2Amendment.md` | `c69c8e7cdcb93b8e1ef92b7c285d22ea72aedebc` |
| V2 profile manifest | `scripts/simulated-product-review/profiles-v2.json` | `af9b2bb2a355c4133197b40f8d4ff041994a6552` |
| V2 UI observer | `scripts/simulated-product-review/ui-observer.js` | `464b7755124e6525e540454deb1058e6c1c3b564` |
| V2 action contract | `scripts/simulated-product-review/action-contract.js` | `e47d83587258e4749d07df93303d64900ef83ecc` |
| V2 action regression validator | `scripts/simulated-product-review/validate-action-contract.js` | `a5135f7982bdc496f79e39a5dc588c8265f7610d` |

A later change to any of these files does not retroactively alter this campaign.

---

## 4. Frozen participant packet identities

Run the six profiles below in this exact order.

| Order | Participant | Profile ID | Packet | Blob SHA | Initial status |
|---:|---|---|---|---|---|
| A | Goal-Focused | `goal-focused` | `ParticipantA-GoalFocused.md` | `f8a27a2fde64292cb441086164aafc8c2cb68685` | `PENDING` |
| B | Explorer | `explorer` | `ParticipantB-Explorer.md` | `eb8864b65937788c968358514bfeecd272a38647` | `PENDING` |
| C | RPG Veteran | `rpg-veteran` | `ParticipantC-RpgVeteran.md` | `1a01447be26215e00be0b2c12aaebfd6d96eb60c` | `PENDING` |
| D | Incremental / Automation | `incremental` | `ParticipantD-Incremental.md` | `0176731a989437c87ed1aee6d7fd94fb10d81044` | `PENDING` |
| E | Narrative-First | `narrative` | `ParticipantE-Narrative.md` | `39a176868fbf26ea5075e32fc94ca9e301899bba` | `PENDING` |
| F | Skeptical Model-Builder | `skeptical` | `ParticipantF-Skeptical.md` | `57f2a92635a4102cbb74b00bd476dd66bc022611` | `PENDING` |

Packet directory:

`specification/Technical/SimulatedProductReviewParticipantsV2/`

The participant receives the frozen packet content, never a repository URL that would expose adjacent artifacts.

---

## 5. Immutable participant session IDs

```text
SIR-V2-A-GOAL
SIR-V2-B-EXPLORER
SIR-V2-C-RPG
SIR-V2-D-INCREMENTAL
SIR-V2-E-NARRATIVE
SIR-V2-F-SKEPTICAL
```

Do not reuse a V1 participant conversation or one V2 participant context for another profile.

---

## 6. Execution order and evidence freeze

Use the fixed order:

```text
A Goal-Focused
-> freeze A raw record
B Explorer
-> freeze B raw record
C RPG Veteran
-> freeze C raw record
D Incremental / Automation
-> freeze D raw record
E Narrative-First
-> freeze E raw record
F Skeptical Model-Builder
-> freeze F raw record
```

Do not reorder after observing outcomes.

Every raw record must be committed and remotely reachable before the next participant begins.

A preregistered early-stop condition may end the campaign before F. If that occurs, freeze the exact trigger and do not invent evidence for unrun participants.

---

## 7. Required dual-worktree execution model

Preferred execution uses two independent checkouts/worktrees:

```text
GAME RUNTIME WORKTREE
pinned to 953b01bec22261e3b84aea59544fd9b75746cf00
serves ordinary UI on http://127.0.0.1:3000

V2 APPARATUS WORKTREE
pinned to f5ed8b4b51e539a99e5d0ca5695ac2ea98fa05e8
runs scripts/simulated-product-review/ui-observer.js
against http://127.0.0.1:3000
```

Equivalent isolation is acceptable only if the controller proves both exact identities and does not silently run current-main game behavior.

---

## 8. Participant isolation requirement

Every participant must be a genuinely fresh, independently isolated context.

Before Observation 001 is delivered, attest:

```text
Has not read repository source               YES
Has not read specifications                  YES
Has not read tests                           YES
Has not read M25 result                      YES
Has not read V1 participant records          YES
Has not read V1 adjudication/result          YES
Has not read this V2 campaign manifest       YES
Has not read another V2 participant record   YES
Has not read evaluator notes                 YES
Has not been taught intended causal answers  YES
```

One informed controller context role-playing six profiles is invalid.

If credible isolation cannot be established for a participant that is being launched, stop with:

```text
INCONCLUSIVE — participant isolation insufficient
```

Do not use that verdict merely because panel execution has not yet begun.

---

## 9. Fresh game-state policy

Each ordinary participant begins from a fresh ephemeral browser context and fresh game state.

Required at launch:

```text
Fresh Playwright browser context: YES
Persistent participant browser profile reused: NO
Direct local-storage inspection: NO
Direct local-storage mutation: NO
Debug/event injection: NO
Redux/store access: NO
Fixture manipulation: NO
Source/content JSON oracle: NO
```

Do not import another participant's game state.

---

## 10. V2 canonical relay requirement

For each observation, the qualified harness creates:

```text
observation-NNN.json
observation-NNN.md
observation-NNN.png
participant-relay-NNN.md
session-ledger.jsonl
```

The controller must send `participant-relay-NNN.md` verbatim, plus the corresponding screenshot only when the participant surface supports it.

The controller must not manually reconstruct, renumber, reorder, summarize, or paraphrase the visible controls.

For every participant record:

```text
SCREENSHOT_RELAY_CAPABLE: YES | NO | UNKNOWN
```

Screenshot unavailability is recorded but is not automatically a validity failure.

---

## 11. Observation-bound action execution

Participant `click` and `fill` commands must use the exact action ID emitted by the current relay, for example:

```text
click O028-C017-A91F20BC
fill O021-C019-12345678 What can you tell me?
```

Before UI mutation, the harness validates the action against the last delivered observation and the current visible-control-set digest.

If validation fails, the apparatus must perform no click/fill and return a fail-closed rejection such as:

```text
ACTION_REJECTED_STALE_OR_MISMATCHED
```

Then capture a fresh observation and let the participant choose again.

The controller must never choose a substitute action.

---

## 12. Player-facing evidence boundary

Relay only ordinary player-facing information generated by the qualified observer:

- rendered visible text;
- current ordinary URL/title;
- visible controls and labels/placeholders;
- enabled player-facing controls;
- screenshot when the participant surface supports it;
- ordinary visible consequences of participant actions.

Do not relay:

- Redux/store state;
- local/session storage contents;
- fixture/content JSON;
- hidden quest flags;
- canonical route labels;
- source-derived explanations;
- intended causal answers;
- evaluator findings;
- another participant's behavior.

Operational IDs and digests used solely to bind actions to delivered observations are permitted.

---

## 13. Participant response contract

At each meaningful observation require only:

```text
CURRENT INTERPRETATION:
CURRENT HYPOTHESIS:
DECISION:
REASON:
ACTION:
CONFUSION:
```

Participants may be wrong.

Do not request or preserve private chain-of-thought.

---

## 14. Secondary Copy-risk preregistration

V1 surfaced one bounded Moderate risk: Copy creation can present `Create`, spend the visible Essence cost, and then surface a Charisma-based `Seduction attempt` failure.

V2 preserves this as a secondary evaluator question:

> Does Copy creation's player-facing action identity, risk model, and failure consequence independently produce causal confusion in clean participants?

No participant packet teaches this finding.

The controller must not steer a participant toward Copies merely to collect evidence for it.

---

## 15. Raw-evidence freeze policy

For each participant:

1. complete the run or hit a preregistered stop condition;
2. use `RawParticipantRecordTemplate.md`;
3. preserve observation IDs, observation digests, control-set digests, relay references/digests, screenshots, exact participant wording, exact actions, and machine execution results;
4. record operational interventions and action rejections;
5. preserve misconceptions without canonical correction;
6. commit the raw record before evaluator access;
7. make the commit remotely reachable before starting the next participant;
8. never rewrite frozen participant interpretation text.

Clerical metadata corrections after a freeze must be append-only.

---

## 16. Planned raw-record paths

```text
specification/Technical/SimulatedProductReviewRuns/2026-09-09-post-m25-v2/
  ParticipantA-GoalFocused-Raw.md
  ParticipantB-Explorer-Raw.md
  ParticipantC-RpgVeteran-Raw.md
  ParticipantD-Incremental-Raw.md
  ParticipantE-Narrative-Raw.md
  ParticipantF-Skeptical-Raw.md
```

---

## 17. Evaluator embargo

Independent evaluator adjudication is embargoed until either:

- all six V2 raw records are frozen; or
- a preregistered early-stop condition ends V2.

Before that boundary, do not create:

- cross-player concept scores;
- provisional campaign verdicts;
- recurrence claims;
- repair backlogs based on partial V2 outcomes;
- Product Direction Decision artifacts.

Operational integrity checks are permitted.

---

## 18. Early-stop enforcement

Stop panel expansion and freeze the trigger if any of these occurs:

```text
Critical product defect blocks meaningful traversal
Participant isolation compromised
Game candidate provenance differs from frozen candidate
Apparatus provenance differs from qualified V2 apparatus
UI harness exposes hidden implementation state
Environment prevents fair ordinary-UI execution
```

A strong Major may justify early stop only under the original preregistered rule that further participants would merely repeat a blocked path.

A fail-closed stale-action rejection that correctly prevents UI mutation is not itself contamination; it is expected apparatus behavior. Record it and continue from the fresh observation.

---

## 19. No-repair-during-panel rule

Do not modify the game, apparatus, participant packets, or protocol after A begins.

If a material problem is found:

```text
freeze V2 evidence
-> adjudicate / stop as required
-> define separately scoped repair
-> exact-head qualification
-> new versioned campaign if new evidence is needed
```

Do not mix pre-repair and post-repair participants into one V2 verdict.

---

## 20. Campaign completion boundary

Panel execution ends only at:

```text
ALL SIX V2 RAW RECORDS FROZEN
```

or:

```text
PREREGISTERED V2 EARLY STOP FROZEN
```

Only then may an independent evaluator receive the corpus.

---

## 21. Current marker at V2 campaign freeze

```text
M25                                      PASS
SIR-V1                                   INCONCLUSIVE
V2 measurement apparatus                 QUALIFIED
V2 apparatus Build Validation            #258 PASS
V2 game candidate                        SAME FROZEN M25 CANDIDATE
V2 campaign                              FROZEN
Participant A — Goal-Focused             NOT RUN
Participant B — Explorer                 NOT RUN
Participant C — RPG Veteran              NOT RUN
Participant D — Incremental              NOT RUN
Participant E — Narrative                NOT RUN
Participant F — Skeptical                NOT RUN
V2 synthetic verdict                     NOT ASSIGNED
Human product validation                 DEFERRED / UNPROVEN
Product Direction Decision               PENDING
M26                                      NOT AUTHORIZED
```

This campaign is a measurement exercise, not an authorization to make the game pass.