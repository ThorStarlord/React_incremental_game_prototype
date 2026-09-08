# Blind Simulated Integrated Product Review
## Post-M25 Level-2 Preregistration

**Status:** Preregistration candidate — frozen when merged on an exact qualified commit  
**Authority:** `PostM25SyntheticReviewAuthority.md`  
**Scope:** Level-2 blind synthetic-player product-risk qualification  
**Human product validation:** `DEFERRED / UNPROVEN`  
**M26:** **NOT AUTHORIZED**

---

## 1. Scientific question

> **Can independent blind simulated players, operating only through the ordinary player-facing game surface and without access to implementation or specification knowledge, complete or substantially navigate the integrated M25 chapter, infer a coherent enough causal model to make intentional decisions from player-visible evidence, and expose material product-legibility or integrated-flow risks?**

This question is intentionally weaker than:

> Do real people understand and enjoy the game?

The stronger human question is outside this experiment.

---

## 2. Evidence claim

This experiment attempts only Level-2 synthetic evidence.

Potential supported claims include:

- the integrated chapter is mechanically traversable through the normal UI by several independent synthetic profiles;
- important causal distinctions are or are not recoverable from visible information in the tested path;
- several distinct profiles independently form the same misconception;
- a visible prerequisite, state change, route consequence, or conclusion is difficult to discover or causally reconstruct;
- obvious interaction-density or navigation friction is present.

The experiment does not support claims about real-human comprehension, emotion, enjoyment, pacing satisfaction, accessibility, retention, commercial readiness, or product-market fit.

---

## 3. Candidate provenance

Before each panel execution, record:

```text
Repository:
Branch:
Exact commit SHA:
Exact tree SHA:
Build Validation run:
Production build status:
Browser / runtime:
Fresh browser-context basis:
Debug injection used: NO
Specifications visible to participants: NO
Source code visible to participants: NO
Other participant records visible: NO
```

If the tested candidate changes, freeze a new candidate and do not silently carry forward the previous result.

---

## 4. Experimental roles

Maintain three epistemically separate roles.

### Controller / custodian

May know:

- repository authority;
- intended design;
- test protocol;
- candidate provenance.

Responsibilities:

- freeze candidate identity;
- launch fresh UI sessions;
- relay only player-facing observations to participants;
- execute participant-selected UI actions exactly where feasible;
- record operational interventions;
- freeze participant records before evaluator access.

The controller does not impersonate a participant.

### Blind simulated participant

Receives only:

- one profile packet;
- current player-facing observation packet;
- ordinary operational syntax for choosing a UI action.

Must not receive:

- source code;
- specifications;
- tests;
- fixture/content files;
- Redux state;
- debug state;
- evaluator rubric beyond the participant packet;
- other participants' choices or interpretations;
- route solutions.

Participants provide concise current hypotheses, interpretations, and decision rationales. Do not request or preserve private chain-of-thought.

### Independent evaluator

Receives all frozen participant records only after the panel is complete or after a preregistered early-stop condition fires.

The evaluator may then inspect canonical design and implementation evidence necessary to adjudicate:

- whether participant interpretations were substantially correct;
- whether observed confusion reflects product behavior or simulation limitations;
- finding severity;
- final verdict.

---

## 5. Isolation requirement

Each participant must run in a genuinely isolated context.

A later participant must not know:

- previous routes;
- previous misconceptions;
- previous blocks;
- evaluator findings;
- intended answers.

A single informed context role-playing six personalities is insufficient.

If genuine isolation cannot be established:

```text
INCONCLUSIVE — participant isolation insufficient
```

---

## 6. Player-facing execution boundary

Use the normal game UI.

Permitted observation material:

- screenshots;
- rendered visible text;
- current ordinary URL;
- player-visible controls;
- labels;
- placeholders;
- enabled/disabled state;
- ordinary navigation results.

Forbidden participant evidence channels:

- source inspection;
- direct Redux/store access;
- direct dispatch;
- local-storage inspection or mutation;
- debug-event injection;
- fixture manipulation;
- content-JSON inspection;
- React component inspection;
- source maps;
- hidden network payloads used as game-state oracle;
- test helpers that bypass ordinary player interactions.

Fresh ephemeral browser contexts are required for independent runs unless a profile explicitly tests return behavior and the persistence handoff is itself part of the preregistered scenario.

---

## 7. Synthetic panel

Use at least these six distinct profiles.

### A. Goal-Focused

Bias:

- follows explicit objectives;
- minimizes optional browsing;
- assumes important information will be surfaced when needed.

Primary risk:

> Does the game communicate enough to someone who does not proactively study every system panel?

### B. Explorer

Bias:

- investigates unfamiliar tabs and surfaces;
- revisits characters and locations;
- actively seeks explanations.

Primary risk:

> Is deeper causal information discoverable when actively sought?

### C. RPG Veteran

Bias:

- thinks in terms of stats, skills, quest gates, reputation, and builds;
- imports familiar RPG assumptions unless contradicted by the game.

Plausible wrong model:

```text
Affinity = relationship XP
```

Primary risk:

> Does the relationship model distinguish itself from conventional reputation/progression expectations?

### D. Incremental / Automation Player

Bias:

- prioritizes resource generation, efficiency, automation, and delegation;
- tends to interpret bars and tasks economically.

Plausible wrong models:

```text
Memory = reward item
Assimilation = farmable currency
Essence = generic progression currency
Copy = generic idle worker
```

Primary risk:

> Does the game communicate that automation follows demonstrated mastery rather than replacing meaningful active play?

### E. Narrative-First

Bias:

- primarily tracks characters, motives, dialogue, and story consequences;
- pays less attention to numerical systems until needed.

Primary risk:

> Can authored narrative context communicate enough causal structure without requiring systems-optimization behavior?

Synthetic statements about emotion or enjoyment from this profile remain non-human diagnostics only.

### F. Skeptical Model-Builder

Bias:

- forms multiple competing explanations;
- looks for observations that falsify them;
- prefers the simplest model consistent with visible evidence.

Required plausible wrong models to consider where relevant:

```text
Affinity = Connection XP
Essence causes Connection
Memory = collectible reward
Knowledge = global truth
Faction Reputation = aggregate NPC opinion
World State = what NPCs know or believe
Trait availability = enough currency
Copy tasks = generic idle automation
```

Primary risk:

> Does normal player-facing evidence correct plausible but wrong causal models?

---

## 8. Participant packet protocol

Each profile has a separate immutable packet under:

`specification/Technical/SimulatedProductReviewParticipants/`

At every observation step, the participant should return only a concise structured self-report:

```text
CURRENT INTERPRETATION:
CURRENT HYPOTHESIS:
DECISION:
REASON:
ACTION:
CONFUSION:
```

`ACTION` must be one command supported by the UI harness.

Participants are allowed to be wrong.

The controller must not correct a causal misconception during the run.

If an operational limitation requires intervention, record the intervention and continue only if the intervention did not teach game causality.

---

## 9. Required integrated observations

The panel collectively should exercise enough of the qualified M25 chapter to observe interaction among:

- Relationship history;
- multi-NPC interpretation;
- long-horizon callback;
- Trait capability;
- travel;
- Combat;
- Knowledge divergence;
- explicit Knowledge transfer where naturally encountered;
- Faction consequence;
- objective World State;
- downstream consumers;
- routine familiarity;
- Copy delegation;
- persistence / return behavior where part of the tested path;
- bounded offline return;
- conclusion causality.

Do not force every participant onto the same route.

Route diversity is desirable when it arises naturally.

---

## 10. Required causal probes

At natural checkpoints, without teaching the intended model, ask participants to state their current interpretation of relevant visible concepts.

### Relationship

- What appears to make an important relationship deepen?
- What does Affinity appear to represent?
- What does Connection appear to represent?
- What do Memories appear to mean or do?

### Trait progression

- Why did a capability become available or remain unavailable?
- What does learning/assimilation appear to represent?
- What role does Essence appear to play?

### Knowledge

- Does every NPC appear to know every objective event?
- How does an NPC appear to learn something they did not previously know?

### Faction Reputation

- Does institutional standing appear identical to an individual's Relationship?
- What visible evidence supports the answer?

### World State

- What changed objectively in the world?
- Is that condition the same as what an NPC knows or believes?

### Copies / automation

- Why is a routine delegatable?
- Why are some decisions still player-controlled?
- What appears to have happened while away?

Score causal meaning rather than exact vocabulary.

---

## 11. Raw participant record

For each meaningful observation/action cycle record:

```text
Observation ID
Visible information reference
Current interpretation
Current hypothesis
Decision
Reason
Selected UI action
Observed consequence
Updated interpretation
Confusion
Operational intervention, if any
```

Preserve misconceptions rather than rewriting them into canonical terminology.

Raw participant records must be frozen before evaluator interpretation is appended.

---

## 12. Failure taxonomy

Classify findings before proposing repairs.

1. **Mechanical discoverability** — relevant action/surface is reachable but not found.
2. **State legibility** — participant sees the surface but cannot determine what changed.
3. **Causal legibility** — participant sees the change but infers a materially wrong cause.
4. **Authority legibility** — participant cannot distinguish domains such as Relationship, Knowledge, Faction, World State, Trait ownership, or routine familiarity.
5. **Terminology** — labels systematically obscure an otherwise coherent model.
6. **Mechanical contradiction** — runtime behavior teaches or permits a model inconsistent with canonical authority.
7. **Content / dramatization** — mechanics may be correct but authored events fail to communicate why a consequence matters.
8. **Pacing / interaction density** — traversal exposes obvious structural friction such as excessive repeated navigation or long action chains without meaningful decisions. This is not a human boredom claim.
9. **Strategic-choice weakness** — visible information does not support meaningful reasons to choose among important alternatives.
10. **System-value weakness** — a system technically exists but does not affect reasoning or meaningful choice in the observed slice.
11. **Synthetic-test limitation** — behavior may be caused by model/tool limitations rather than the game.

---

## 13. Severity

### Critical

Prevents meaningful completion or teaches a materially false model of canonical behavior.

### Major

Repeatedly prevents intentional decision-making or obscures an important authority distinction.

### Moderate

Creates recurring confusion but normal interaction permits recovery.

### Minor

Local clarity or friction issue without meaningful downstream misunderstanding.

### Observation

Interesting behavior without sufficient evidence for a defect.

Do not inflate severity merely because the synthetic panel is small.

---

## 14. Cross-player analysis

After raw records are frozen, construct a concept matrix with at least:

| Concept | Goal-Focused | Explorer | RPG Veteran | Incremental | Narrative | Skeptical |
|---|---|---|---|---|---|---|
| Affinity vs Connection | | | | | | |
| Memory meaning | | | | | | |
| Trait gate | | | | | | |
| Knowledge divergence | | | | | | |
| Faction vs Relationship | | | | | | |
| World State | | | | | | |
| Routine familiarity | | | | | | |
| Offline settlement | | | | | | |
| Ending causality | | | | | | |

Use only:

```text
CORRECT
PARTIALLY CORRECT
MISCONCEPTION
NOT OBSERVED
TEST CONTAMINATED
```

Recurring independent patterns carry more weight than one-off behavior.

---

## 15. Repair discipline

Do not automatically repair every synthetic finding.

For each candidate defect:

1. identify the smallest causal layer;
2. determine whether the pattern repeats across independent profiles;
3. determine whether it materially changes reasoning or traversal;
4. separate product behavior from synthetic-test artifacts;
5. propose the smallest bounded repair.

Prefer:

```text
content wording
before
new UI

existing UI clarification
before
new subsystem

causal explanation
before
tutorial framework

bounded repair
before
new abstraction
```

Do not introduce a generalized causal graph, tutorial framework, ChapterEngine, condition DSL, or simulation layer because one synthetic participant became confused.

---

## 16. Verdict semantics

Use exactly one primary verdict.

### `SIMULATED_PRODUCT_REVIEW_PASS`

Meaning:

> No material integrated mechanical, causal-legibility, authority-legibility, or flow defect was identified by the preregistered blind synthetic-player panel at the tested scope.

Required claim footer:

```text
Human comprehension        NOT CLAIMED
Human enjoyment            NOT CLAIMED
Human emotional response   NOT CLAIMED
Human pacing               NOT CLAIMED
Retention                  NOT CLAIMED

Integrated mechanical flow SUPPORTED AT SYNTHETIC SCOPE
Causal legibility           SUPPORTED IN PRINCIPLE AT SYNTHETIC SCOPE
Authority legibility        SUPPORTED IN PRINCIPLE AT SYNTHETIC SCOPE
Product-risk screening      COMPLETED AT SYNTHETIC SCOPE
```

### `SIMULATED_PRODUCT_REVIEW_WEAK`

Meaning:

> The integrated chapter is substantially traversable, but repeated synthetic-player failure patterns expose bounded product risks that should be repaired before product expansion.

### `SIMULATED_PRODUCT_REVIEW_FAIL`

Meaning:

> The panel exposed a material integrated product defect that undermines reliable traversal, intentional decision-making, or basic causal interpretation at the tested scope.

### `INCONCLUSIVE`

Use when:

- participant blindness was compromised;
- contexts were not genuinely independent;
- environment/tool limitations invalidate meaningful UI traversal;
- candidate provenance is uncertain;
- unrelated runtime failure prevents a fair test;
- the campaign cannot distinguish product defect from simulation artifact.

Never convert an inconclusive campaign into PASS merely to continue development.

---

## 17. Early-stop conditions

Freeze evidence and stop panel expansion when:

- a Critical product defect blocks further meaningful traversal;
- participant isolation is discovered to be compromised;
- the tested candidate differs from the frozen provenance;
- the UI harness is found to expose hidden implementation state;
- an environment failure prevents fair ordinary-UI execution.

A strong Major finding may justify early stop if further participants would only repeat a blocked path; document why.

---

## 18. Product-direction boundary

After a completed synthetic verdict:

```text
M25_PASS
    ->
BLIND SIMULATED INTEGRATED PRODUCT REVIEW
    ->
PASS / WEAK / FAIL / INCONCLUSIVE
    ->
bounded repair + rerun where warranted
    ->
POST-M25 PRODUCT DIRECTION DECISION
    ->
only after an explicit decision may a future roadmap / M26+ be considered
```

A synthetic PASS does **not** automatically authorize M26.

Human product validation remains deferred and visibly unproven.

---

## 19. Preregistration freeze rule

Once this preregistration is merged on the infrastructure-qualified exact head:

- do not change scientific question, panel profiles, verdict semantics, failure taxonomy, or evidence ceiling after observing participant outcomes;
- any material protocol change requires a versioned amendment before the affected participant run;
- preserve the original preregistration and explain the reason for amendment.

---

## 20. Infrastructure stop marker

Before the actual blind panel begins, require:

```text
SYNTHETIC_REVIEW_AUTHORITY_RECONCILED
SYNTHETIC_REVIEW_PREREGISTRATION_FROZEN
SYNTHETIC_REVIEW_UI_HARNESS_QUALIFIED
SYNTHETIC_PARTICIPANT_PACKETS_READY

SIMULATED PANEL EXECUTION  READY / NOT YET RUN
HUMAN PRODUCT VALIDATION   DEFERRED
M26                        NOT AUTHORIZED
```

This preregistration authorizes the weaker synthetic evidence layer. It does not manufacture stronger evidence than the experiment can provide.