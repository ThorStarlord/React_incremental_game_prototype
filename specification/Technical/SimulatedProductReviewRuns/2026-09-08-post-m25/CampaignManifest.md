# Post-M25 Blind Simulated Product Review — Campaign Manifest

**Campaign ID:** `SIR-2026-09-08-POST-M25-V1`  
**Status:** `FROZEN CANDIDATE — PANEL NOT YET RUN`  
**Authority:** `../../PostM25SyntheticReviewAuthority.md`  
**Preregistration:** `../../SimulatedIntegratedProductReview.md`  
**Human product validation:** `DEFERRED / UNPROVEN`  
**M26:** **NOT AUTHORIZED**

---

## 1. Purpose

This manifest freezes the concrete execution campaign for the preregistered post-M25 Blind Simulated Integrated Product Review.

It does not change the scientific question, panel definitions, evidence ceiling, failure taxonomy, verdict semantics, or early-stop rules in `SimulatedIntegratedProductReview.md`.

It binds those already-frozen rules to one exact game candidate and one exact set of participant packets.

No participant result exists at manifest freeze time.

---

## 2. Frozen game candidate

```text
Repository:      ThorStarlord/React_incremental_game_prototype
Candidate ref:   main at campaign freeze
Exact commit:    953b01bec22261e3b84aea59544fd9b75746cf00
Exact tree:      08427373b98b934a130abd9dc3e59c25258f1c81
Merge authority: PR #60
Infrastructure qualification:
                 Build Validation #252
Workflow run ID: 34226643617
Production build: PASS in Build Validation #252
```

The tested game candidate is the exact commit above.

The campaign branch and later raw-evidence commits are evidence-recording surfaces only. They must not alter game behavior and then silently continue claiming this candidate.

If any participant is run against a different game commit or tree, that run is outside this campaign unless a versioned campaign amendment is frozen first.

---

## 3. Frozen protocol artifacts

| Artifact | Path | Blob SHA |
|---|---|---|
| Synthetic-review authority | `specification/Technical/PostM25SyntheticReviewAuthority.md` | `0744ff0ecf39f4db490a02d93d1b3f3fc90a7958` |
| Level-2 preregistration | `specification/Technical/SimulatedIntegratedProductReview.md` | `39c776271585c5cfb62f06678b17932ef7780823` |
| Result template | `specification/Technical/SimulatedIntegratedProductReviewResultTemplate.md` | `dc72135d61cf95f0fef303b1b32c7463044b71ed` |
| Profile manifest | `scripts/simulated-product-review/profiles.json` | `83700c75b6adb9da67d0e523c525e76eb6d18260` |
| UI-only harness | `scripts/simulated-product-review/ui-observer.js` | `563a9c29fc0b965c66858eba0bb470fb863cdc6e` |

These identities are part of campaign provenance.

A later change to any of them does not retroactively change this campaign.

---

## 4. Frozen participant packet identities

Run at least the six preregistered participants below.

| Order | Participant | Profile ID | Packet | Blob SHA | Initial status |
|---:|---|---|---|---|---|
| A | Goal-Focused | `goal-focused` | `ParticipantA-GoalFocused.md` | `243772c5d739a2035d84aef360dc958a5334a3a2` | `PENDING` |
| B | Explorer | `explorer` | `ParticipantB-Explorer.md` | `5ab84ab9b576481d50a690e39e7bec17f63e22fa` | `PENDING` |
| C | RPG Veteran | `rpg-veteran` | `ParticipantC-RpgVeteran.md` | `efbc383edecbe7b305c8c6db09380b0aa2270d47` | `PENDING` |
| D | Incremental / Automation | `incremental` | `ParticipantD-Incremental.md` | `375da29d24ce06bf336b9c49debb0e52a510361d` | `PENDING` |
| E | Narrative-First | `narrative` | `ParticipantE-Narrative.md` | `eb666add7dadab0e9357e2b903b269998f2d6fb0` | `PENDING` |
| F | Skeptical Model-Builder | `skeptical` | `ParticipantF-Skeptical.md` | `0ea5a005380e56a3e786e020abe84f5c400c0222` | `PENDING` |

Packet directory:

`specification/Technical/SimulatedProductReviewParticipants/`

The participant receives the **content** of its frozen packet, not a GitHub/repository link that could expose adjacent specifications.

---

## 5. Execution order

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

Do not reorder after observing participant outcomes.

A preregistered early-stop condition may end the campaign before F. If that occurs, record the exact trigger and do not invent results for unrun participants.

---

## 6. Participant isolation requirement

Each participant must be a genuinely fresh, independently isolated context.

Every participant context must satisfy all of the following before its first observation is delivered:

```text
Has not read repository source               YES
Has not read specifications                  YES
Has not read tests                           YES
Has not read M25 result                      YES
Has not read this campaign manifest          YES
Has not read another participant record      YES
Has not read evaluator notes                 YES
Has not been taught intended causal answers  YES
```

One informed controller context role-playing multiple participants is invalid.

If credible isolation cannot be established, stop with:

```text
INCONCLUSIVE — participant isolation insufficient
```

---

## 7. Participant session IDs

Assign immutable session IDs before dispatch:

```text
SIR-V1-A-GOAL
SIR-V1-B-EXPLORER
SIR-V1-C-RPG
SIR-V1-D-INCREMENTAL
SIR-V1-E-NARRATIVE
SIR-V1-F-SKEPTICAL
```

The external conversation/provider identifier, if one exists, may be stored in controller-only provenance but must not be exposed to other participants.

Do not reuse one participant conversation for another profile.

---

## 8. Fresh game-state policy

Each ordinary participant begins from a fresh ephemeral browser context and fresh game state.

Required at launch:

```text
Fresh Playwright browser context: YES
Persistent ChatGPT profile reused: NO
Direct local-storage inspection: NO
Direct local-storage mutation: NO
Debug/event injection: NO
Redux/store access: NO
Fixture manipulation: NO
Source/content JSON oracle: NO
```

If persistence/return behavior is naturally reached as part of a participant's own run, preserve that participant's own session according to the preregistered path. Do not import another participant's state.

---

## 9. Player-facing observation contract

The controller may relay only ordinary player-facing information produced by the qualified UI-only harness:

- rendered visible text;
- screenshot;
- current ordinary URL;
- visible control metadata;
- labels/placeholders;
- enabled player-facing controls;
- ordinary consequences of the participant's selected UI action.

The controller must not add an explanation such as:

> This happened because your Faction Reputation changed.

unless the game itself visibly says that.

Controller paraphrase is allowed only for operational syntax and must not add game causality.

---

## 10. Participant response contract

At each meaningful observation, require only:

```text
CURRENT INTERPRETATION:
CURRENT HYPOTHESIS:
DECISION:
REASON:
ACTION:
CONFUSION:
```

The participant may be wrong.

Do not request private chain-of-thought.

`ACTION` must be executable through the ordinary UI harness unless the participant explicitly chooses `quit`.

---

## 11. Raw-evidence freeze policy

For each participant:

1. complete the run or hit a preregistered stop condition;
2. produce the raw participant record using `RawParticipantRecordTemplate.md`;
3. record observation references and operational interventions;
4. preserve participant wording without canonical correction;
5. commit the raw record before the evaluator sees it;
6. never rewrite the frozen raw record to make the participant look more or less correct.

Preferred evidence sequence:

```text
A finished -> raw A commit
B finished -> raw B commit
C finished -> raw C commit
D finished -> raw D commit
E finished -> raw E commit
F finished -> raw F commit
```

Corrections to clerical metadata after freeze must be append-only and clearly labelled.

---

## 12. Planned raw-record paths

```text
specification/Technical/SimulatedProductReviewRuns/2026-09-08-post-m25/
  ParticipantA-GoalFocused-Raw.md
  ParticipantB-Explorer-Raw.md
  ParticipantC-RpgVeteran-Raw.md
  ParticipantD-Incremental-Raw.md
  ParticipantE-Narrative-Raw.md
  ParticipantF-Skeptical-Raw.md
```

Do not pre-fill participant interpretations before execution.

---

## 13. Evaluator embargo

Evaluator adjudication is embargoed until either:

- all six raw participant records are frozen; or
- a preregistered early-stop condition ends the campaign.

Before that boundary, do not create a cross-player concept matrix, severity verdict, or repair proposal based on partial participant outcomes.

Operational integrity checks are permitted during execution, such as confirming that isolation remains intact or that a UI command executed correctly.

---

## 14. Early-stop enforcement

Stop and freeze evidence if any of these occurs:

```text
Critical product defect blocks meaningful traversal
Participant isolation compromised
Candidate provenance differs from frozen candidate
UI harness exposes hidden implementation state
Environment prevents fair ordinary-UI execution
```

A strong Major may justify an early stop only under the preregistered rule that continuing would merely repeat a blocked path. State why.

---

## 15. No-repair-during-panel rule

Do not change the game between participants to address observed confusion.

The campaign is testing one candidate.

If a material defect is found:

```text
freeze original panel evidence
-> assign verdict / stop as required
-> create separately scoped repair
-> exact-head qualification
-> fresh rerun against a new frozen candidate
```

Do not mix pre-repair and post-repair participants into one six-player verdict.

---

## 16. Campaign completion boundary

The panel-execution phase ends when one of the following has been reached:

```text
ALL SIX RAW RECORDS FROZEN
or
PREREGISTERED EARLY STOP FROZEN
```

Only then may the independent evaluator receive the corpus.

The next allowed artifact after that boundary is the adjudicated synthetic result.

---

## 17. Current marker at campaign freeze

```text
M25                                  PASS
Synthetic-review infrastructure       QUALIFIED
Campaign candidate                    FROZEN
Participant packets                   FROZEN
Participant A                         NOT RUN
Participant B                         NOT RUN
Participant C                         NOT RUN
Participant D                         NOT RUN
Participant E                         NOT RUN
Participant F                         NOT RUN
Synthetic verdict                     NOT ASSIGNED
Human product validation              DEFERRED / UNPROVEN
Product Direction Decision            PENDING
M26                                   NOT AUTHORIZED
```

The campaign exists to collect falsifiable Level-2 evidence, not to confirm that the product is already good.