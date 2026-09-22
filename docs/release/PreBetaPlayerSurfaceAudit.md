# Pre-Beta Player-Surface Audit — 2026-09-21

**Status:** repository-only release-hygiene evidence; **not human Beta evidence**  
**Baseline:** `main@6a56fbfde6a2007436147e4268ff90153adba845`  
**Authority:** `GameCompletionDefinition.md`, `FeatureScopeMatrix.md`, `BetaCompletionContract.md`

## Purpose

Inspect the currently exposed Campaign One surfaces for concrete contradictions with the locked 1.0 scope and Beta presentation boundary. This audit may remove misleading or state-mutating development residue, but it must not invent new gameplay systems, claim comprehension, or substitute for issue #109 human sessions.

## Findings and disposition

| ID | Finding | Evidence | Disposition |
| --- | --- | --- | --- |
| PB-001 | Unreachable legacy `src/pages/GamePage.tsx` remained exported and contained `localStorage.clear()`, which would clear all origin storage if the page were ever reintroduced. | Code search showed references only from the file itself and `src/pages/index.ts`; production routing uses `GameLayout` + routed pages. | Remove the page and barrel export. |
| PB-002 | Dashboard/Character presentation still advertised deferred or internal concepts: “Stats & Equipment”, generic “skill progression”, “Trait System Integration”, and a raw game-tick counter. | Equipment and separate Skills are outside Campaign One; raw tick count is an implementation detail rather than player state. | Replace with current player-language copy and remove tick presentation. |
| PB-003 | The primary Essence page exposed `ManualEssenceButton` explicitly “for testing and prototyping purposes”, a per-click statistic tied to it, and an “Upcoming Features” panel. | Current Essence authority is passive/relationship-derived plus explicitly authored sources; 1.0 placeholder policy rejects upcoming-feature advertising. | Remove prototype-only controls/stat/promo copy from the production page. Keep underlying development primitives outside normal player UI. |
| PB-004 | The normal NPC Relationship tab exposed `Debug: +10 Affinity` and `Debug: Unlock All Trait Slots`, both state-mutating shortcuts. | The Relationship page is a normal Campaign One surface; debug mutations are not legitimate player progression. | Remove the debug mutations from the normal component. Dedicated development tooling remains separately governed. |
| PB-005 | Settings exposed Import/Export buttons whose callbacks only logged messages, including “coming soon”. | Settings is `MINIMAL_1_0`; no-op controls create false affordances and violate intentional-presentation expectations. | Remove the no-op actions rather than implementing an unnecessary settings portability subsystem. |
| PB-006 | The authoritative Feature Scope Matrix still described first-session onboarding as “incomplete” after GC-02/Alpha closure. | Current Alpha/Content Alpha authority says the normal-UI opening path is implemented; human comprehension remains unvalidated. | Reconcile posture to `implemented / human-unvalidated`. |

## Regression ownership

`src/layout/GC01PlayerSurfaceScopeCleanup.test.ts` now rejects the known residue above in addition to its existing cut/deferred-route checks.

This is deliberately a **negative scope/presentation guard**. It does not assert that the UI is understandable, fun, well paced, balanced, accessible to a particular participant, or visually final.

## Evidence ceiling

After this package, the following remain intentionally open:

```text
fresh-player first-session observations    0 / 5
external beginning-to-ending playthroughs  0 / 3
BETA_PASS                                  NO
immutable 1.0.0-rc.N candidate             NOT CREATED
1.0 promotion                              BLOCKED
GitHub-required Build Validation on main   NOT ADMIN-ENFORCED
```

Those obligations must be satisfied by their own authorities. Repository analysis, CI, LLM review, and synthetic browser evidence cannot be relabeled as human Product Review evidence.
