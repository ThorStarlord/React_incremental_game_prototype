# Beta Human-Evidence Execution Runbook — Campaign One / 1.0

**Status:** CURRENT OPERATIONAL PROCEDURE — HUMAN EVIDENCE ONLY  
**Authority:** `specification/Technical/BetaCompletionContract.md`  
**Record template:** `docs/release/BetaHumanEvidenceTemplate.md`  
**Canonical backlog:** issue #109

## Purpose

Operate the recorded `FEATURE_COMPLETE / HUMAN-UNVALIDATED` Campaign One through evidence-driven Beta convergence without reopening speculative feature development.

This runbook governs how to collect, classify, repair, and accept the human evidence required before `BETA_PASS`.

It governs the **human-evidence lane only**. Repository-wide work authorization remains governed by `AGENTS.md`, `STATUS.md`, and the current completion contracts.

## Hard boundary

The following do **not** count toward the human-evidence floor:

- automated tests;
- Playwright or other synthetic browser traversal;
- LLM personas or simulated product reviews;
- repository analysis;
- the repository author/developer acting as a "fresh" participant.

Use those tools to reproduce, diagnose, regression-test, and independently inspect the product. They may justify bounded repository repairs under `AGENTS.md`, but they do not count toward the human-evidence floor.

## Entry state

Before starting a human session, confirm:

```text
CONTENT_ALPHA
FEATURE_COMPLETE
TECHNICAL_BETA_READY
BETA_PASS = NO
feature/content scope locked
normal production UI only
```

Do not start a session on a dirty or unidentified build.

## 1. Pin the exact candidate

For every accepted session record:

1. record the exact commit SHA;
2. record the exact successful Build Validation run for that SHA or the accepted qualified candidate from which the deployed build was produced;
3. record build/deployment identity;
4. record browser + exact version, OS, viewport, and fresh-profile basis;
5. clear or create a genuinely fresh game save;
6. do not expose `/game/debug`, mutate state, seed progression, or use developer-only controls.

If code changes between participants, the next record must name the new exact candidate. Never silently carry qualification provenance forward.

## 2. Run the first-session cohort

Minimum floor: **5 accepted fresh-player first-session observations**.

Give only operational instructions needed to start the game. Do not explain the Relationship/Memory/Connection/Essence/Trait/Copy causal model.

Observe whether the participant can:

- identify the first meaningful problem;
- find NPC/dialogue and Quest surfaces;
- discover travel when required;
- notice and explain important state changes;
- distinguish relationship history/capability, Knowledge, Faction standing, and World State when they matter;
- understand personal mastery versus Copy readiness;
- recover from mistaken navigation without coaching.

Record near-verbatim explanations where practical. An intervention must be logged even when it seems harmless.

## 3. Run the full-playthrough cohort

Minimum floor: **3 accepted external beginning-to-ending fresh-save playthroughs**.

An accepted run must attempt ordinary production UI progression from New Game to the state-responsive Epilogue without developer intervention in required progression.

Record:

- major route/history choices;
- capability/build profile;
- Copy/delegation use;
- save/load/recovery observations;
- finale option reasoning;
- whether the epilogue reflects remembered history;
- approximate elapsed play time;
- every intervention, soft-lock, save problem, or confusing dead end.

The three runs do not need identical choices. Prefer materially different histories when naturally produced; do not coach participants into artificial divergence.

## 4. Classify findings before repairing them

Use exactly one primary class unless the evidence genuinely spans multiple layers:

```text
NAVIGATION_DISCOVERABILITY
STATE_LEGIBILITY
CAUSAL_MODEL
TERMINOLOGY
PACING_GRIND
BALANCE
PRESENTATION_ACCESSIBILITY
MECHANICAL_CONTRADICTION
```

Severity remains independent:

```text
BLOCKER
CRITICAL
HIGH
MEDIUM
LOW
```

A repeated severe finding matters more than merely reaching the participant count.

## 5. Route the smallest repair

For an accepted finding:

```text
human observation
-> preserve evidence
-> classify causal layer
-> reproduce where repository-owned
-> make the smallest repair
-> add deterministic regression coverage where applicable
-> exact-head Build Validation
-> rerun the affected human scenario when severe/repeated
```

Do not automatically add a tutorial, popup, generic framework, new progression pillar, or new campaign content.

A human-observation repair package is authorized when it closes a demonstrated Beta/Release requirement or defect. Separately, deterministic, heuristic, or synthetic findings may justify bounded hardening under `AGENTS.md`; preserve that evidence class rather than relabeling it as human evidence.

## 6. Scope lock while evidence is incomplete

While issue #109 remains below the required evidence floor, **Campaign One feature/content scope stays locked**, but repository work is not universally frozen.

Bounded implementation may continue when justified by:

- defects exposed by accepted human evidence;
- deterministic runtime/test findings;
- heuristic UX, information-hierarchy, terminology, pacing, balance, presentation, or accessibility findings;
- synthetic/browser playthrough findings;
- production-surface integrity defects;
- save/recovery and persistence defects;
- supported-browser/reliability/performance defects;
- documentation/governance drift that could misroute implementation;
- release qualification/deployment-readiness requirements owned by the current contracts.

Every such package must stay inside already-authorized 1.0 scope and preserve its evidence class.

The following remain outside the Campaign One 1.0 critical path unless authority is explicitly revised from evidence:

- generic Skills;
- generic Crafting;
- general Inventory/Equipment;
- duplicate Saves;
- generalized ChapterEngine or narrative DSL;
- autonomous Copy planning;
- offline narrative/world decision execution;
- Chapters 8+, interplanetary continuation, New Game+, or generalized simulation.

## 7. Acceptance accounting

Maintain the participant ledger in `BetaHumanEvidenceTemplate.md` or in dated records that use that template.

A record counts only when provenance, fresh-save basis, interventions, observations, and findings are complete.

Numerical completion alone does not produce `BETA_PASS`.

Before Beta promotion, confirm:

```text
>= 5 accepted first-session observations
AND >= 3 accepted full playthroughs
AND no unresolved BLOCKER/CRITICAL
AND no unresolved repeated severe comprehension/progression failure
AND save/recovery gates pass
AND supported desktop browser gates pass
AND exact-head deterministic CI is green
```

## 8. Promotion sequence after BETA_PASS

Only after a real Beta PASS:

```text
record BETA_PASS
-> intentionally version one immutable 1.0.0-rc.N candidate
-> exact-RC Build Validation
-> ordinary-UI New Game -> Epilogue qualification
-> materially divergent-history qualification
-> save/load/recovery/import-export qualification
-> Chromium + Firefox exact-RC evidence
-> deployment/static-host evidence
-> zero release-blocking Known Defects
-> final promotion eligibility
-> 1.0.0
```

Do not create an RC merely to make progress while human evidence is open.

## Stop condition

For this **human-evidence lane**, if there is no accepted human finding, the next human-evidence task is to collect the next genuine session.

That does not impose a repository-wide stop. Independent bounded hardening may continue under `AGENTS.md` when a deterministic, heuristic, synthetic, accessibility, reliability, presentation, pacing, balance, persistence, or release-readiness finding has material expected value.

Do not invent new product scope merely because the human lane is waiting.
