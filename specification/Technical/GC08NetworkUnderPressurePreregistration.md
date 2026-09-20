# GC-08 Chapter 6 Preregistration — Network Under Pressure

**Status:** IMPLEMENTATION PREREGISTRATION  
**Program:** Campaign One / 1.0 Game Completion  
**Prepared:** 2026-09-20

## Dramatic function

The counterphase principle exists, but only Lyra initially knows it. Chapter 6 asks the player to decide how much of the local network to inform and prepare before the final counterphase commitment.

## Entry

- `lyra_gc07_exp_counterphase_derived` exists;
- Lyra knows `fact_gc07_counterphase_principle`;
- Merchant District `latticeIntegrity = stabilized`;
- Elara's independent-verification history exists;
- at least one Chapter 1 Merchant District anchor history exists.

## Three-anchor floor

The mandatory network-diagnosis entry consumes:

1. Lyra — the Chapter 5 counterphase derivation;
2. Elara — independent verification / archive method;
3. at least one Chapter 1 network anchor — Gronk or Valerius history.

Later route preparation may consume Gronk and/or Valerius again, but the chapter does not count newly fabricated generic NPC state as anchor history.

## Knowledge asymmetry

At entry:

```text
Lyra knows fact_gc07_counterphase_principle
Elara does not
Gronk does not
Valerius does not
```

The player manually briefs selected anchors through their own dialogue surfaces. Knowledge remains per-NPC; there is no broadcast action.

Elara's first briefing is mandatory because her independent-verification method establishes the network-diagnosis frame. Gronk and Valerius briefings remain consequential optional route enablers.

## Institutional standing

Valerius's Watch-mobilization briefing uses existing `requiredFactionReputation` authority.

Proposed threshold:

```text
City Watch >= 0
```

If the player's accumulated institutional history is below that threshold, the fortified-Watch preparation route is unavailable while non-Watch routes remain legal.

Relationship warmth does not substitute for Faction standing.

## World State

Chapter 6 consumes `latticeIntegrity = stabilized` and introduces one categorical regional outcome:

```text
networkPosture = distributed | fortified | diagnostic
```

This is an authored objective condition for later chapters/epilogue. It is not a readiness score, percentage, or universal campaign currency.

## Personally mastered preparation

Elara's network-diagnosis dialogue requires existing `archive_verification` routine familiarity.

That routine was personally learned through Chapter 2 independent verification. Chapter 6 does not mint a shortcut familiarity record.

## Safe delegation

During preparation, an eligible Copy may run the already-qualified `archive_verification` production task.

Copy execution:

- may produce its existing bounded routine reward;
- may continue through existing offline authority if already running;
- must not teach an NPC the counterphase principle;
- must not set `networkPosture`;
- must not create route-commitment Relationship evidence;
- must not choose which anchor is briefed;
- must not perform the final strategic commitment.

Qualification must prove delegated repetition and strategic state remain separate.

## Preparation routes

### 1. Distributed manual preparation — baseline

Elara briefing unlocks a baseline preparation Quest requiring no optional Trait pair.

### 2. Structural preparation — Structural Steward

Gronk briefing unlocks a preparation Quest whose legal resolution requires:

```text
WillowsWisdom + ConstraintSense
```

### 3. Diagnostic preparation — Countermodeler

Elara briefing also exposes a capability route requiring:

```text
ScholarlyInsight + AdversarialCalibration
```

### 4. Fortified institutional support — optional

Valerius briefing, when Faction standing allows it, produces Watch mobilization evidence that can support a fortified final posture.

## Manual final commitment

Lyra owns separate route-specific commitment dialogues.

Each dialogue requires its corresponding preparation evidence and forbids the shared Lyra fact:

```text
fact_gc08_network_posture_committed
```

The chosen dialogue:

- records the shared commitment fact on Lyra;
- sets exactly one `networkPosture` value;
- records route-specific Relationship evidence.

Because all commitment dialogues are owned by Lyra and forbid the same fact, the first explicit player choice closes the others without adding a chapter reducer.

## Exit

Chapter 6 completes when one legal network-posture commitment exists in canonical Relationship history and the regional `networkPosture` records the matching objective condition.

The resulting Knowledge distribution, Faction state, World State, build route and Copy preparation state remain available for Chapter 7 and the epilogue.

## Non-goals

- no network-readiness meter;
- no autonomous briefing planner;
- no Copy-created Knowledge or strategic commitment;
- no universal preparation DAG;
- no ChapterEngine or narrative DSL;
- no requirement to inform every anchor.
