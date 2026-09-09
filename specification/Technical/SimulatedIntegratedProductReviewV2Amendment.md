# Blind Simulated Integrated Product Review — V2 Amendment

**Status:** FROZEN BEFORE V2 APPARATUS IMPLEMENTATION  
**Supersedes:** operational execution details only for a new V2 campaign  
**Does not rewrite:** `SimulatedIntegratedProductReview.md` or any V1 evidence

## 1. Purpose

`SIR-2026-09-08-POST-M25-V1` ended `INCONCLUSIVE` after a controller relay error caused a participant-selected control number to execute a different visible control than the participant intended.

This amendment changes only the operational observation/action contract required for a replacement six-profile campaign.

The scientific question, evidence ceiling, six behavioral profiles, failure taxonomy, severity semantics, verdict semantics, human-validation boundary, evaluator independence, fresh-context isolation requirement, and no-repair-during-panel rule remain unchanged.

## 2. Same frozen game candidate

Unless a later candidate amendment explicitly says otherwise, V2 tests the same frozen game candidate:

```text
Game commit: 953b01bec22261e3b84aea59544fd9b75746cf00
Game tree:   08427373b98b934a130abd9dc3e59c25258f1c81
```

This is an apparatus-only replacement campaign.

## 3. Canonical participant relay

Every player-facing observation must produce a harness-generated participant relay artifact.

The controller must relay that artifact without reconstructing, renumbering, reordering, or paraphrasing the visible controls.

Operational sanitation remains permitted only when necessary to remove non-player-visible metadata, and any sanitation must be recorded.

## 4. Observation-bound action IDs

V2 replaces free controller-relayed control numbers for `click` and `fill` with observation-bound opaque action IDs.

Representative form:

```text
O028-C017-A91F20BC
```

The identifier may encode only operational identity:

- observation sequence;
- visible-control position;
- a digest derived from the delivered visible-control set.

It must not expose hidden game state or developer intent.

Participant commands become:

```text
snapshot
click <action-id>
fill <action-id> <text>
press <key>
back
quit
```

## 5. Fail-closed action execution

Before executing any `click` or `fill`, the apparatus must verify that:

1. the action ID belongs to the last delivered observation;
2. the current visible-control set has the same canonical digest as that delivered observation;
3. the bound visible control still matches the action ID;
4. the exact validated element is the element acted upon.

If any check fails, the apparatus must perform no click/fill and return:

```text
ACTION_REJECTED_STALE_OR_MISMATCHED
```

or an equally specific invalid-action rejection.

It must then capture a fresh observation and require the participant to choose again.

The controller may not infer or choose a replacement action.

## 6. Relay and evidence digests

For every observation, preserve at least:

```text
observation ID
observation digest
visible-control-set digest
participant relay artifact
participant relay digest
screenshot artifact
```

The raw participant record may reference these identities without exposing hidden game state.

## 7. Append-only operational ledger

Each V2 session must preserve a machine-generated append-only operational ledger recording, at minimum:

```text
SESSION_STARTED
OBSERVATION_CAPTURED
OBSERVATION_RELAY_ARTIFACT_FROZEN
PARTICIPANT_ACTION_RECEIVED
ACTION_VALIDATED
ACTION_EXECUTED or ACTION_REJECTED
SESSION_QUIT / SESSION_CLOSED
```

The ledger must contain operational provenance only.

It must not inspect or serialize Redux/store state, local storage, session storage, source-derived flags, content JSON, fixtures, source maps, or debug state.

## 8. Screenshot capability preflight

Before each participant run, record:

```text
SCREENSHOT_RELAY_CAPABLE: YES | NO | UNKNOWN
```

If `YES`, relay the screenshot through the ordinary participant surface.

If `NO` or `UNKNOWN`, the run may continue with visible text and visible controls unless the V2 campaign manifest explicitly requires otherwise. The limitation must be recorded.

Screenshots are not made a validity requirement by this amendment because V1 adjudicated their absence only as an Observation-level synthetic limitation.

## 9. Required regression qualification

Before V2 campaign freeze, the apparatus must prove at least:

### Valid exact action
A valid action ID against the unchanged visible-control set resolves to the intended control.

### Mutated action ID
A modified or fabricated action ID is rejected without UI mutation.

### Stale observation
An action ID from an older observation is rejected after the visible-control set changes.

### Reordered/mismatched controls
A relayed action ID is rejected if the control set or order no longer matches the delivered observation.

### Canonical relay
The visible controls in the participant relay are generated from the same canonical captured observation used for action binding.

### UI-only boundary
The repaired apparatus continues to avoid hidden implementation state.

### Live browser smoke
Against the ordinary game UI, the apparatus must capture an observation, prove an invalid action is rejected, execute one valid ordinary action, and prove an old action cannot be reused after the transition.

## 10. V2 panel identity

V2 is a replacement campaign, not a continuation of V1.

It must rerun all six profiles under one common qualified apparatus:

```text
A Goal-Focused
B Explorer
C RPG Veteran
D Incremental / Automation
E Narrative-First
F Skeptical Model-Builder
```

Every participant context must be fresh and isolated. No V1 participant context or V1 result may be shown to a V2 participant.

## 11. Preserved V1 secondary risk

The adjudicated V1 result found a bounded Moderate risk in the Copy creation flow: a player-facing `Create` action can spend the visible Essence cost and then surface a Charisma-based `Seduction attempt` failure message.

V2 preregisters the following secondary risk question without teaching it to participants:

> Does Copy creation's player-facing action identity, risk model, and failure consequence independently produce causal confusion in clean participants?

No controller may steer a participant toward Copy creation merely to obtain evidence for this question.

## 12. Campaign-level interpretation

Recurring independent patterns remain more important than one-off behavior.

V2 must not combine V1 A with V2 B-F into a single six-profile result. All six V2 profiles must share the V2 apparatus and campaign provenance.

## 13. Verdict and human-evidence boundary

The primary verdict set remains exactly:

```text
SIMULATED_PRODUCT_REVIEW_PASS
SIMULATED_PRODUCT_REVIEW_WEAK
SIMULATED_PRODUCT_REVIEW_FAIL
INCONCLUSIVE
```

Human comprehension, enjoyment, emotional response, pacing satisfaction, accessibility, retention, commercial readiness, and product-market fit remain outside Level-2 synthetic claims.

## 14. Stop marker before implementation

```text
SIR-V1 verdict                        INCONCLUSIVE
V2 operational amendment              FROZEN
Same frozen game candidate             REQUIRED
Observation-bound action IDs           REQUIRED
Stale/mismatched actions fail closed   REQUIRED
Fresh six-profile V2 campaign          AFTER APPARATUS QUALIFICATION
Game repair                            NOT AUTHORIZED
M26                                    NOT AUTHORIZED
```
