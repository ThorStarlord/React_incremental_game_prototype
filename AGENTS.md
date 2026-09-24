# Agent Operating Policy — Campaign One / 1.0

**Status:** CURRENT AUTHORITY for coding-agent behavior  
**Applies to:** repository analysis, implementation, review, qualification, and handoff work

## Purpose

This file defines how coding agents should turn repository evidence into useful work without inventing scope or confusing evidence classes.

The governing distinction is:

> **Missing human evidence limits the claims this repository may make; it does not by itself prohibit useful repository-answerable work.**

Governance exists to improve the product and preserve justified scope. Governance is not itself the product objective. When a procedural rule blocks useful repository-answerable work without protecting a concrete product, safety, release, or evidence requirement, reconcile the rule instead of treating paralysis as success.

## Current objective

Advance the already-bounded Campaign One from technically integrated vertical slices toward **feature-complete player-facing depth**.

The active sequence is:

```text
feature-completion gap analysis
-> breadth search across CORE_1_0 systems
-> depth analysis of strongest candidates
-> bounded feature development inside existing authorities
-> FEATURE_COMPLETE
-> Beta convergence / hardening
-> RC qualification
```

Historical Alpha, Content Alpha, GC, and deterministic Beta-readiness results remain valid evidence. They do not mean every associated gameplay feature is finished. Human Beta remains required for eventual `BETA_PASS` and RC entry, but it is a downstream maturity gate rather than the current repository-wide optimization target.

## Required reading order

For a new coding-agent session:

1. `AGENTS.md` — agent behavior and evidence-to-authority rules.
2. `STATUS.md` — current repository state, maturity, and active lanes.
3. `docs/CURRENT.md` — documentation classification and conflict resolution.
4. `HANDOFF.md` — current re-entry summary when present.
5. `specification/GameCompletionDefinition.md` — finished Campaign One / 1.0.
6. `specification/Features/FeatureScopeMatrix.md` — core, supporting, deferred, and cut scope.
7. `specification/Progression/GameProgressionArc.md` and `specification/Narrative/CampaignArchitecture.md`.
8. `specification/Technical/GameCompletionRoadmap.md`.
9. the relevant Alpha/Beta/Release contract.
10. `RUNBOOK.md` and the affected current domain contracts/results.

`CLAUDE.md` is a thin Claude adapter to this file. Do not maintain a second Claude-specific policy.

## Evidence classes

Keep evidence provenance explicit.

### DETERMINISTIC_FINDING

Examples: tests, static analysis, reproducible runtime behavior, browser automation, save/recovery checks, performance measurements.

May establish implementation behavior within the evidence actually exercised.

### HEURISTIC_FINDING

Examples: UX inspection, information hierarchy review, terminology inconsistency, pacing analysis, accessibility review, design contradiction, release-surface inspection.

May identify plausible defects or risks and may justify bounded repairs inside the already-authorized 1.0 scope.

### SYNTHETIC_FINDING

Examples: automated or model-assisted playthroughs, state-space exploration, scripted browser journeys, simulated product review.

May expose reproducible friction or risk and may justify bounded repairs. It does **not** become evidence about what real players actually understood, enjoyed, preferred, or retained.

### HUMAN_FINDING

Evidence from genuine external/fresh participants under the current Beta evidence procedure.

May support actual player-experience claims within the limits of the recorded sessions.

## Core evidence-to-authority rule

```text
missing human evidence
!= repository work forbidden

missing human evidence
= human-experience claims remain unproven
```

Evidence type controls the strength of the claim, not whether all useful work stops.

A bounded repair may therefore be justified by deterministic, heuristic, synthetic, accessibility, reliability, presentation, pacing, balance, or human evidence. Preserve the evidence class in the resulting record.

## Repository-answerable work agents may perform

Within the existing Campaign One / 1.0 scope, agents may proactively:

- perform end-to-end heuristic UX/product review;
- run synthetic/browser playthroughs;
- inspect navigation and discoverability;
- inspect state and causal legibility;
- analyze progression pacing, grind, economy pressure, and delegation timing;
- inspect balance contradictions using repository evidence;
- improve accessibility and input behavior;
- improve presentation, terminology, and visual hierarchy;
- improve performance and reliability;
- harden save/load/recovery/import-export behavior;
- remove prototype/debug residue from normal player surfaces;
- repair concrete architecture/integration defects that block the current product;
- perform repository-wide feature-completion gap analysis across `CORE_1_0` systems;
- deepen bounded core features when their current L1/L2 implementation cannot yet sustain the intended player role;
- expand meaningful cross-system use, progression, authored variation, and player choice without inventing generalized engines;
- improve release qualification and deployment readiness;
- repair documentation/governance drift that can misroute future work.

Prefer the smallest **sufficient** intervention that moves the intended feature role toward L4. A tiny repair is not preferred when the demonstrated problem is missing feature depth. Add deterministic regression coverage where the new behavior is testable.

## Scope boundary — not a depth freeze

Do not create work merely to keep an agent busy.

The following remain outside Campaign One / 1.0 unless current authority is explicitly revised:

- separate generic Skills/skill-tree;
- generic Crafting;
- general Inventory/Equipment economy;
- duplicate Saves authority;
- generalized ChapterEngine or narrative DSL;
- autonomous irreversible Copy planning;
- offline narrative/social/world decisions;
- Chapters 8+, interplanetary continuation, New Game+, or endless endgame;
- generalized simulation/live-service infrastructure.

Do not rewrite or invalidate closed M4–M26 or GC-01–GC-12 evidence. However, **historical milestone closure does not freeze the associated gameplay feature**. Deepen the living current product surface directly when maturity analysis shows it remains below finished-game depth, and preserve the old milestone as historical qualification evidence.

## Work-selection rule

Before a package, answer:

1. What intended player-facing role does this `CORE_1_0` system serve?
2. What is its current L0-L6 maturity and what evidence supports that classification?
3. What concrete breadth/depth/progression/cross-system gap keeps it below feature-complete maturity?
4. Why is this gap higher value than the other current feature-completion candidates?
5. What bounded intervention closes the gap without creating unnecessary generalized scope?
6. What positive and rejection evidence will show the intervention works?
7. What claim will be stronger afterward, and what stronger claim remains unproven?
8. What would make further work on this feature reach diminishing returns?

Technical possibility alone is not authorization. Evidence-backed **feature completion inside the authorized product boundary** is.

## Human Beta and release policy

The current human evidence floor remains:

- at least 5 accepted fresh-player first sessions;
- at least 3 accepted external beginning-to-ending fresh-save playthroughs;
- resolution or explicit acceptance of recurring severe findings;
- exact build/browser/session provenance.

Non-human evidence must never be relabeled as satisfying that floor.

Under current authority:

```text
CONTENT_ALPHA + TECHNICAL_BETA_READY
= retained historical integration/readiness evidence

current frontier
= FEATURE_COMPLETION / PRODUCT_DEPTH

BETA_PASS
= downstream; still requires the human evidence contract after FEATURE_COMPLETE

RC entry
= downstream; remains blocked until BETA_PASS under the current release contract
```

Changing those promotion requirements is an owner/product-policy decision. Improving the existing game while they remain open is not.

## Stop conditions

Stop repository work only when at least one is true:

- no bounded repository-answerable feature-development improvement has material expected value;
- the next change would require unauthorized product-scope expansion;
- the next decision is genuinely owner-reserved;
- the next required evidence is genuinely external and there is no independent repository-answerable hardening work worth doing;
- an infrastructure/credential/external blocker cannot be resolved within current authority;
- the relevant requirement is already satisfied and additional work would be polishing beyond meaningful expected value.

**Absence of human evidence alone is not a universal stop condition.**

## Documentation discipline

Do not create another master context or governance truth file. Current truth remains distributed by responsibility:

- `STATUS.md` — current state;
- `docs/CURRENT.md` — document authority;
- `HANDOFF.md` — current re-entry summary;
- `GameCompletionDefinition.md` and maturity/domain contracts — requirements;
- `RUNBOOK.md` — procedure.

If an optional context file is ever introduced for a harness, it must be navigation-only and must not duplicate mutable state, milestone counts, SHAs, or independent policy.
