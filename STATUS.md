# Milestone Handoff — Post-M25 Review Boundary

**Handoff date:** 2026-09-09  
**Branch cut from `main`:** `101251f9cf7bf1c843f9bf0d45b62fc5164b8159`  
**Product authority:** `M25 Complete Chapter Vertical Slice = PASS`  
**Human product validation:** `DEFERRED / UNPROVEN`  
**M26:** `NOT AUTHORIZED`

## Purpose

This document is the in-repository handoff for future engineers and future chat sessions after the post-M25 work-package cycle.

The important distinction is that the **session/work queue is closed at a valid evidence boundary**, but that does **not** mean three new implementation packages were merged. Repository authority still ends at M25 plus the qualified post-M25 synthetic-review apparatus and campaign freeze. Do not infer M26 authorization from the administrative statement that the milestone session is complete.

## Current repository state

The automated implementation program through M25 is complete. The strongest qualified product chain includes Relationship, Trait, Combat, Exploration, Knowledge, Faction Reputation, Objective World State, Copy automation, persistence, bounded offline settlement, and two strategically distinct Merchant District chapter routes.

The governing post-M25 question is now product evidence rather than missing system composition:

> Can a fresh player understand the causal model, make meaningful route decisions, use delegation appropriately, experience satisfying pacing, and want to continue?

See:

- `specification/README.md`
- `specification/Technical/M25CompleteChapterVerticalSliceResult.md`
- `specification/Technical/PostM25ProductDirection.md`
- `specification/Technical/PostM25SyntheticReviewAuthority.md`
- `specification/Technical/SimulatedIntegratedProductReview.md`
- `specification/Technical/SimulatedIntegratedProductReviewV2Amendment.md`

## Work-package outcomes

### Package 1 — Fresh isolated V2 participant evidence

**Terminal state:** `VALID PRELAUNCH STOP / EVIDENCE NOT COLLECTED`

Delivered/verified before the stop:

- the post-SIR-V1 measurement apparatus was repaired and qualified;
- observation-bound action IDs and stale/mismatched-action rejection were qualified;
- a fresh six-profile V2 campaign was frozen on `main`;
- the frozen game candidate and V2 apparatus provenance were re-verified before attempting Participant A;
- the repository-side Build Validation for the early-stop candidate passed.

The Package 1 execution attempt could not honestly satisfy the preregistered fresh-context isolation gate. The available controller context already knew the repository, protocol, campaign authority, and isolation rules. Therefore the controller did not impersonate Participant A and did not deliver Observation 001.

As a consequence:

- no Participant A raw record exists;
- no Participant B-F run was started;
- no synthetic product verdict was assigned;
- no game repair or apparatus repair was justified by participant evidence.

The evidence-only early-stop record is currently represented by PR #68 (`work/v2-panel-a-c-evidence-freeze`). At this handoff snapshot, its Build Validation passed, while the separate Gemini AI Code Review workflow did not pass; therefore it was not merged under the all-checks-green merge rule.

### Package 2 — Evidence adjudication / product-direction decision

**Terminal state:** `GATED / NOT EXECUTED`

Package 2 depended on valid Package 1 participant evidence. Because Package 1 stopped before Observation 001, there is no scientifically valid V2 participant corpus to adjudicate. No product-direction decision should be synthesized from the failed execution environment.

### Package 3 — Result-driven mechanics / progression work

**Terminal state:** `NOT AUTHORIZED / NOT EXECUTED`

No mechanics, tick-rate, progression, tutorial, balance, or new-system work should be invented merely to keep the queue moving. The repository's explicit authority still requires product evidence and a product-direction decision before a new M26+ roadmap is authorized.

## Evidence ledger

### Verified

- M25 Complete Chapter Vertical Slice: `PASS`.
- Automated post-M17 implementation program: `COMPLETE`.
- Post-M25 synthetic-review protocol exists and preserves the human-evidence ceiling.
- V2 measurement apparatus is qualified on repository CI.
- V2 campaign is frozen with six profiles, fixed execution order, fresh-context isolation, evidence-freeze rules, and evaluator embargo.
- The failed Participant A launch was correctly treated as an epistemic-isolation stop rather than fabricated participant evidence.
- Build Validation on the Package 1 early-stop candidate passed.

### Still unproven / pending

- human comprehension;
- human pacing;
- emotional impact and enjoyment;
- retention / desire to continue;
- final balance;
- campaign scalability;
- generalized chapter authoring;
- a valid V2 synthetic-panel verdict;
- the post-M25 Product Direction Decision;
- M26 authorization.

## Open operational artifacts

At the handoff snapshot:

- **PR #66 — `Experiment: collect SIR-V2 participant evidence`** remains an evidence-only draft/open collection surface. It must not become a place for game or protocol repair while the evidence corpus is incomplete.
- **PR #68 — `Experiment: freeze V2 prelaunch participant-isolation stop`** records the valid Package 1 prelaunch stop. Do not merge it unless the repository's required checks satisfy the active merge policy.

Future sessions must re-read current PR state rather than assuming these snapshots are still current.

## Recommended next priorities

1. **Establish a valid evidence source.** Prefer an actual fresh human integrated playability/product review. If continuing the synthetic V2 experiment, use a genuinely isolated participant context that cannot access repository/specification knowledge and satisfies the frozen dispatch checklist before Observation 001.
2. **Collect raw evidence without repair.** Preserve the frozen game candidate, participant packet, action-binding contract, observation relay, and raw-record boundary. Freeze each participant record before advancing.
3. **Adjudicate only after valid evidence exists.** Classify discoverability, state legibility, causal explanation, terminology, mechanical contradiction, content/dramatization, pacing, strategic-choice, and system-value failures before proposing fixes.
4. **Make the Product Direction Decision.** Decide what evidence justifies deepening, simplifying, repairing, or abandoning. Record that decision explicitly.
5. **Only then authorize M26+.** Convert validated findings into a bounded roadmap for mechanics, progression, pacing, UX, or content. Do not pre-authorize a subsystem because M25 technically passed.

## Fast re-entry checklist for the next engineer/session

```text
1. Read STATUS.md.
2. Read specification/README.md.
3. Read specification/Technical/PostM25ProductDirection.md.
4. Reconcile latest main + open PRs #66/#68 (or their successors).
5. Verify whether any valid new human/synthetic evidence exists.
6. If no valid evidence exists: do not invent M26 implementation scope.
7. If valid evidence exists: adjudicate first, then authorize the smallest evidence-backed work package.
```

## Validation / tooling entrypoints

The canonical commands are documented in the root `README.md` and `.github/workflows/build-validation.yml`. The most relevant post-M25 commands are:

```bash
npm ci
npm run simulated-review:validate
npm run simulated-review:action-contract
npx playwright install --with-deps chromium
npx tsc --noEmit
npm test -- --watchAll=false --runInBand M25CompleteChapterVerticalSlice.test.tsx
npm run build
```

For the live synthetic-review smoke, start the app on `127.0.0.1:3000` and run:

```bash
npm run simulated-review:smoke
```

## Governing stop condition

If the only remaining blocker is fresh-player evidence or an explicit product decision, report that boundary clearly and stop. Do not convert absent evidence into implementation authority.
