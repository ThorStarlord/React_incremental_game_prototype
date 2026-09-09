# Post-SIR-V1 Recovery Authority

**Status:** FROZEN RECOVERY AUTHORITY  
**Scope:** Post-adjudication recovery from `SIR-2026-09-08-POST-M25-V1`  
**V1 verdict:** `INCONCLUSIVE`

## 1. Authority transition

The first Blind Simulated Integrated Product Review completed with an adjudicated primary verdict of:

```text
SIR-V1: INCONCLUSIVE
```

The stopped V1 corpus established one Major experimental-validity limitation, one Moderate bounded Copy terminology / causal-legibility risk, and no Critical or product-Major finding.

The V1 result does not authorize product expansion and does not authorize a game repair merely to make the experiment pass.

## 2. Authorized next work

```text
Experimental apparatus repair: AUTHORIZED
V2 apparatus qualification:   AUTHORIZED
Fresh six-profile V2 campaign: AUTHORIZED AFTER APPARATUS QUALIFIES
```

The repair must remain bounded to the failure mode exposed by V1:

- controller reconstruction or renumbering of visible controls;
- action execution that is not cryptographically / structurally bound to the observation delivered to the participant;
- stale or mismatched action sets that can target a different control;
- insufficient operational provenance for relay/action integrity;
- screenshot-relay capability not recorded explicitly.

## 3. Game candidate remains frozen

The replacement V2 campaign must, by default, test the same game candidate as V1:

```text
Game commit: 953b01bec22261e3b84aea59544fd9b75746cf00
Game tree:   08427373b98b934a130abd9dc3e59c25258f1c81
```

This isolates the measurement-apparatus change from product behavior.

If game behavior is changed before V2, that requires a separately frozen candidate and the resulting campaign must explicitly say it is not a pure apparatus-only rerun.

## 4. Product repair boundary

```text
Game repair: NOT AUTHORIZED
Copy wording repair: NOT AUTHORIZED FOR PRE-V2 IMPLEMENTATION
ChapterEngine: NOT AUTHORIZED
New chapter implementation: NOT AUTHORIZED
M26: NOT AUTHORIZED
```

The Moderate V1 Copy wording / causal-legibility finding is preserved as a preregistered secondary V2 risk. It must not be taught to participants or used to steer them toward the Copy system.

## 5. Human evidence boundary

```text
Human comprehension:      UNPROVEN
Human enjoyment:          UNPROVEN
Human emotional response: UNPROVEN
Human pacing:             UNPROVEN
Retention:                UNPROVEN
Human product validation: DEFERRED / UNPROVEN
```

V2 remains Level-2 synthetic evidence only.

## 6. Required V2 apparatus properties

Before any V2 participant runs, the qualified apparatus must prove:

1. participant-facing relay artifacts are generated directly from captured observations;
2. the controller does not manually reconstruct control numbering;
3. click/fill commands use observation-bound opaque action IDs;
4. stale, mutated, reordered, or mismatched action sets fail closed before UI mutation;
5. valid actions target the exact element validated for the delivered observation;
6. an append-only operational ledger records observation, relay, action validation, execution, and rejection events;
7. ordinary UI-only evidence boundaries remain intact;
8. screenshot-relay capability is recorded as `YES`, `NO`, or `UNKNOWN` per participant session.

## 7. Qualification gate

The apparatus is not qualified by code inspection alone.

Require, at minimum:

```text
V2 action-binding regression contract PASS
V2 relay-integrity contract            PASS
V2 UI-only boundary                    PASS
V2 live browser smoke                   PASS
TypeScript / repository validation      PASS
Historical milestone stack              PASS
Production build                        PASS
Exact-head Build Validation              PASS
```

## 8. V2 campaign boundary

A new, explicitly versioned campaign must be frozen after apparatus qualification.

Do not silently continue V1.

The new campaign must rerun all six profiles from fresh isolated contexts under one common V2 apparatus and the same frozen game candidate unless a new candidate is explicitly frozen.

V1 Participant A may not be reused as the V2 Goal-Focused result.

## 9. Post-V2 decision boundary

Only after an independently adjudicated V2 verdict may the repository proceed to:

```text
bounded product repair where supported
or
Post-M25 Product Direction Decision
or
explicit escalation to Level-3 human evidence if synthetic evidence remains inconclusive
```

M26 remains unauthorized until an explicit Product Direction Decision says otherwise.

## 10. Current marker

```text
M25                                      PASS
SIR-V1                                   INCONCLUSIVE
SIR-V1 adjudication                      MERGED
Post-SIR-V1 recovery authority           FROZEN
Experimental apparatus repair            AUTHORIZED NEXT
Game repair                              NOT AUTHORIZED
Human product validation                 DEFERRED / UNPROVEN
Product Direction Decision               PENDING
M26                                      NOT AUTHORIZED
```
