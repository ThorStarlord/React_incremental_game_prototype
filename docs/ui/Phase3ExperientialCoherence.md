# UX3 — Experiential Coherence implementation and qualification

## Integrated result — October 24, 2026

PR [#184](https://github.com/ThorStarlord/React_incremental_game_prototype/pull/184) merged into main at commit **96f6c595**, after exact-head **11fb23fd** passed [Build Validation #40103050524](https://github.com/ThorStarlord/React_incremental_game_prototype/actions/runs/40103050524). The earlier candidate-only wording below is historical. UX3 source and automated evidence are integrated, not a pending package; genuine player evaluation (UX3-07) remains an external dependency. The original v1.0.0 tag and human-evidence ceiling are unchanged.

**Scope:** Existing post-1.0 Campaign One UI. **Branch baseline:** `87f99628a8fbf901234b2d6ec7d5da75c8e60469` (2026-10-24). **Owner instruction:** implement the bounded Phase 3 plan autonomously. This document is a candidate work record, not evidence of a qualified merge.

## Product objective

Connect the currently authored situation, legal action, recorded consequence, capability, and deliberate delegation without adding new story authority or expanding the five-node travel graph. Preserve canonical Redux selectors and thunks, save-schema compatibility, version 1.0 tag identity, and independent v1.1 universal Traits PRs (#178/#180/#182).

## Changes selected for the bounded candidate

| ID | Responsibility | Source of authority | Acceptance |
| --- | --- | --- | --- |
| UX3-00 | Baseline and source-specific regression register | `STATUS.md`, `PlayerExperienceContract.md`, UI2/3 qualified Build Validation #40090580707 | Actual source changes and screenshots remain traceable |
| UX3-01 | Theme-safe NPC dialogue, readable quest status labels, autosave names; focus and touch access | Existing design and save/quest enums | No raw quest status or periodic save-ID in main menu, no fixed light surface for dark NPC dialogue |
| UX3-02 | Legal one-step Willow route guidance; preserve authored travel and optional forge practice | `LocationDefinitions.ts`, `CurrentMomentSelectors.ts` | City Center -> City Gate -> Whispering Woods, no automatic route traversal or future NPC leak |
| UX3-03 | Confirmed-nearby filter only uses qualified world anchors | `NPCWorldLocationDefinitions.ts` | Unanchored story contacts not represented as physically nearby; story dialogue stays available |
| UX3-04 | Mobile session chrome compact; urgent statuses remain visible | Existing GameLayout and status authority | No mobile horizontal overflow; critical Copy exception/timer remains visible |
| UX3-05 | Reversible journal/location/consequence/character treatment | Theme tokens, authored location description, existing offline NPC initials | No assets or new gameplay authority; preserve theme and accessibility |
| UX3-06 | Candidate exact-head Build Validation (both release browser families and both campaign routes) | `RUNBOOK.md` and CI | Green on exact candidate SHA before any merge; failures repaired on same branch |
| UX3-07 | Genuine fresh-player and external campaign sessions | `Phase2HumanEvaluation.md` | External recruitment, consent, five accepted first sessions and three accepted external campaigns **remain pending** until actually performed |

## Evidence baseline and current ceiling

- Prior UI2/UI3 source qualified at PR #181 head `e1f32ca70d231b0f415032bc50c0ac29d5a08fcf`, Build Validation run [40090580707](https://github.com/ThorStarlord/React_incremental_game_prototype/actions/runs/40090580707); merged to main, then reconciled in PR #183.
- Prior browser artifacts include desktop and narrow/mobile screenshots for both browser families (run 40090580707). Preserve before/after artifact linkage; not an independent user study.
- No human research was conducted by this coding agent. The maturity ceiling remains **FEATURE_COMPLETE / HUMAN-UNVALIDATED**, `BETA_PASS=NO`. The 1.0 personal-release waiver remains historical, not a Beta pass.

## Prohibited expansion

Do not invent physical world positions for Elara, Lyra, or other unanchored story contacts; create generic world simulation; invent unlocks, outcomes, memories, or NPC dialogue; replace the travel graph; alter persistence; retag `v1.0.0`; merge version 1.1 Traits migration; generate a whole portrait/environment library. Do not claim human delight or comprehension from automated screenshots.

## Proposed visual treatment

An **explorer's journal** uses the existing typography and semantic theme colors, a subtly framed location description, offline-safe NPC portraits, and a distinct border for recorded consequences. This is retained as a bounded, reversible presentation treatment. Real player preferences remain unevaluated.

## Verification and merge gate

Run focused UI3/UX3 tests, React TypeScript and production build, docs/architecture/content and release gates, live Chromium/Firefox browser checks, and complete both ordinary-UI routes with save/Continue and import/export. Merge only after the repository's exact-head Build Validation PASS. Preserve current documentation authority without rewriting historic milestone evidence.

## Human evidence handoff

Use [Phase2HumanEvaluation.md](Phase2HumanEvaluation.md) with genuine consented participants. Do not substitute an agent simulation or claim completion of this external dependency. Capture anonymized session IDs, exact build, independent navigation outcomes, mistaken spatial beliefs, accessibility issues and subjective world identity feedback. Escalate genuine blocking defects to further bounded UI repairs.
