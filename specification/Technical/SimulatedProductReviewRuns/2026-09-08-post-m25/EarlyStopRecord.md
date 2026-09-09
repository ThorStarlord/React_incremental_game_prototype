# SIR-2026-09-08-POST-M25-V1 — Early Stop Record

**Status:** PREREGISTERED EARLY STOP FROZEN  
**Record type:** OPERATIONAL — NOT EVALUATED

## 1. Campaign identity

```text
Campaign ID: SIR-2026-09-08-POST-M25-V1
Frozen candidate commit: 953b01bec22261e3b84aea59544fd9b75746cf00
Frozen candidate tree:   08427373b98b934a130abd9dc3e59c25258f1c81
Protocol blob: 39c776271585c5cfb62f06678b17932ef7780823
Harness blob: 563a9c29fc0b965c66858eba0bb470fb863cdc6e
Infrastructure qualification: Build Validation #252
```

## 2. Completed participant evidence

### Participant A — Goal-Focused

```text
Session ID: SIR-V1-A-GOAL
Raw path: specification/Technical/SimulatedProductReviewRuns/2026-09-08-post-m25/ParticipantA-GoalFocused-Raw.md
Initial freeze commit: 8c8f581a68a37c10e4b728d7a0217f58276f4c20
Contamination status: CLEAN
Termination status: PARTICIPANT QUIT
```

### Participant B — Explorer

```text
Session ID: SIR-V1-B-EXPLORER
Raw path: specification/Technical/SimulatedProductReviewRuns/2026-09-08-post-m25/ParticipantB-Explorer-Raw.md
Initial freeze commit: 53ad05a3a25c72f5ec8bf44a80ac12cf2070c0e4
Metadata correction commit: 8fa4309e1636b078c5abb42bbd7e455909049d26
Contamination status: MATERIAL CONTAMINATION — controller relay error
Termination status: ISOLATION STOP
```

## 3. Early-stop trigger

The following operational facts are preserved from Participant B's raw record:

- At Observation 028, topic-control numbering was incorrectly relayed.
- Participant B selected `click 17` based on that relayed observation.
- The controller executed `click 17` literally.
- Actual visible control 17 opened Traits rather than the intended dialogue response.
- The controller detected the relay mismatch.
- The run stopped at the contamination boundary after the resulting Observation 029.
- No causal correction or substitute action was supplied.

## 4. Protocol basis

The campaign protocol requires expansion to stop when a preregistered contamination or experimental-validity boundary fires. Participant B reached that boundary, so no further participants were launched.

## 5. Unrun participants

```text
Participant C — RPG Veteran             NOT RUN
Participant D — Incremental             NOT RUN
Participant E — Narrative-First         NOT RUN
Participant F — Skeptical Model-Builder NOT RUN

Reason: PREREGISTERED EARLY STOP FIRED DURING PARTICIPANT B
```

No synthetic result is fabricated for these profiles, and no replacement Participant B was run within this campaign.

## 6. Candidate integrity

```text
Candidate drift occurred: NO
Hidden-state access occurred inside participant contexts: NO
Debug injection occurred: NO
Repository/source/specification access occurred inside participant contexts: NO
```

## 7. Repair status

```text
Game repair: NOT STARTED
Harness repair: NOT STARTED
Protocol amendment: NOT STARTED
```

The stopped campaign remains observationally frozen pending independent adjudication.

## 8. Evaluator embargo transition

```text
Before this EarlyStopRecord commit:
EVALUATOR EMBARGO: ACTIVE

After this record is committed:
EVALUATOR EMBARGO: LIFTED
```

This transition permits independent adjudication of the frozen stopped corpus. It does not imply a verdict.

## 9. Evidence corpus

```text
Campaign manifest: specification/Technical/SimulatedProductReviewRuns/2026-09-08-post-m25/CampaignManifest.md
Controller runbook: specification/Technical/SimulatedProductReviewRuns/2026-09-08-post-m25/ControllerRunbook.md
Preregistration: specification/Technical/SimulatedIntegratedProductReview.md
Participant A raw path + freeze SHA: recorded above
Participant B raw path + freeze SHA + clerical correction SHA: recorded above
EarlyStopRecord path: specification/Technical/SimulatedProductReviewRuns/2026-09-08-post-m25/EarlyStopRecord.md
EarlyStopRecord initial freeze identity: pending commit
```

## 10. Stop marker

```text
PARTICIPANT_A_RAW_EVIDENCE_FROZEN
PARTICIPANT_B_RAW_EVIDENCE_FROZEN
PREREGISTERED_EARLY_STOP_FIRED

PARTICIPANT_C_NOT_RUN
PARTICIPANT_D_NOT_RUN
PARTICIPANT_E_NOT_RUN
PARTICIPANT_F_NOT_RUN

EARLY_STOP_RECORD_FROZEN

EVALUATOR_EMBARGO_LIFTED
SYNTHETIC_VERDICT_NOT_ASSIGNED

HUMAN_PRODUCT_VALIDATION_DEFERRED
M26_NOT_AUTHORIZED
```
