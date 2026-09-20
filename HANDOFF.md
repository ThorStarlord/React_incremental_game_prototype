# Milestone Handoff — GC-03 / Campaign One 1.0 Completion

**Handoff status:** INTEGRATED / CURRENT-MAIN AUTHORITY  
**Prepared:** 2026-09-20  
**Integrated implementation baseline:** `a8f313125b67f5c368033129344092e2e25dd63f`  
**Current maturity:** PLAYABLE PRE-ALPHA  
**Next responsibility:** GC-04 / GC-05 breadth reconciliation

## Repository reality

The opening Campaign One production path is now integrated through Chapter 3.

```text
GC-01 player-surface cleanup       COMPLETE
GC-02 Prologue / onboarding        COMPLETE
GC-03 Chapters 1-3 opening spine   COMPLETE
```

### GC-02 evidence

```text
PR:                  #120
qualified head:      fad589bd439f53f0305a3116a1ac4fd67b4aa566
Build Validation:    #352 / run 34659502966 / PASS
merge commit:        8136fd481532705417fcc9a1f0fac84497d7e5a2
```

GC-02 established the ordinary-UI fresh-save route from the intro through Elder Willow's First Lesson and persisted Relationship evidence.

### GC-03 evidence

```text
PR:                  #121
branch:              work/gc03-opening-campaign-spine
qualified head:      dc0fd39420a618ff9ab74cf90e031bb849bac404
Build Validation:    #353 / run 35523216769 / PASS
merge commit:        a8f313125b67f5c368033129344092e2e25dd63f
```

GC-03 connects that Prologue to Merchant District Crisis, Archive Inquiry, and Enemies in Phase through existing canonical evidence.

## What is now playable structurally

```text
New Game
-> intro
-> find Elder Willow
-> First Lesson
-> Chapter 1 cast / Merchant District Crisis
-> either existing Chapter 1 conclusion
-> Scholar Elara / Archive Inquiry
-> independent verification
-> Lyra / Enemies in Phase
-> GC-03 opening-spine complete
```

The sequence is intentionally derived rather than stored in a new chapter reducer.

## Important GC-03 repair

GC-02 exposed a real reachability gap: New Game correctly seeded only Willow, but the other Campaign One anchors had no production re-entry path after the Prologue.

GC-03 repairs that narrowly:

- later NPCs are merged into current NPC state rather than replacing it;
- Willow and every already-progressed NPC remain untouched;
- Chapter 1 anchors unlock after First Lesson;
- Elara unlocks after either Merchant District conclusion;
- Lyra unlocks after Archive Inquiry's independent-verification evidence;
- existing dialogue catalogs/extensions remain authoritative.

This is content reachability, not a generalized discovery engine.

## Current campaign spine

```text
Prologue                                      integrated
Chapter 1 — Merchant District Crisis          integrated / connected
Chapter 2 — Archive Inquiry                   integrated / connected
Chapter 3 — Enemies in Phase                  integrated / connected
Chapter 4 — Lattice Under Strain              missing
Chapter 5 — The Chrono-Crypt                  missing
Chapter 6 — Network Under Pressure            missing
Chapter 7 — Counterphase                      missing
Finale — The Telluric Echo                    missing
Epilogue — Aftermath / Conditional Reprieve   missing
```

## Current qualification commands

```bash
npm ci
npm run docs:authority:validate
npm run gc01:validate
npm run gc02:validate
npm run gc03:validate
npm run content:intelligence:validate
npm run chapter:validate
npm run m26:validate
npm run simulated-review:validate
npm run simulated-review:action-contract
npx tsc --noEmit
npm run build
```

Use `.github/workflows/build-validation.yml` as exact CI truth.

## Next responsibility — GC-04 / GC-05 reconciliation

Do **not** start by inventing capabilities or Copy systems.

Audit the integrated production evidence against the 1.0 floors:

### GC-04 buildcraft

- 4 durable relationship-derived capability identities;
- at least 3 anchor sources;
- at least 2 capabilities with meaningful cross-domain application;
- at least 2 viable late-game build profiles.

### GC-05 earned delegation

- 3 personally mastered routine identities;
- at least 2 learning contexts;
- meaningful explicit delegation choice;
- current bounded persistence/offline authority preserved.

Count existing qualified evidence first. Let Chapters 4-7 close missing breadth where that creates better player meaning.

## Repository hygiene

Historical timing and experiment PRs that were superseded by current-main authority were closed during this reconciliation. Their evidence remains preserved in GitHub history.

Issue #122 records the remaining repository-setting mismatch: policy requires exact-head Build Validation, while `main` does not yet mechanically require it through GitHub branch protection/rulesets. The current connected automation cannot mutate administration-level branch rules, so the procedural gate remains authoritative until that setting is applied.

## Human evidence boundary

Issue #109 remains **OPEN / UNPROVEN**.

GC-02/GC-03 automated qualification proves reachability, persistence, deterministic composition, and rejection behavior. It does not prove onboarding comprehension, pacing, enjoyment, balance, retention, or market preference. Human evidence becomes mandatory at Beta under the current completion contracts.

## Do not reopen by inertia

Do not restart:

- GameLoop/tick hardening;
- generic Skills;
- generic Crafting;
- general Inventory;
- duplicate Saves;
- generalized narrative engines;
- autonomous Copy planning;
- generalized simulation;
- Chapters 8+ / interplanetary continuation / New Game+.

A future package must close a named 1.0 requirement or a demonstrated blocker.

## Re-entry sequence

```text
latest main
-> STATUS.md
-> HANDOFF.md
-> docs/CURRENT.md
-> specification/GameCompletionDefinition.md
-> specification/Features/FeatureScopeMatrix.md
-> specification/Progression/GameProgressionArc.md
-> specification/Narrative/CampaignArchitecture.md
-> specification/Technical/GameCompletionRoadmap.md
-> specification/Technical/GC03OpeningCampaignSpineResult.md
-> relevant maturity contract
-> RUNBOOK.md
-> fresh repository reconciliation
```

## Governing handoff conclusion

> The repository no longer needs to prove that its first three chapters can exist independently. The next question is how much of the required buildcraft and earned-delegation breadth those chapters already provide before new content is added.
