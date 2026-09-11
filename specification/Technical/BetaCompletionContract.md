# Beta Completion Contract — Campaign One / 1.0

**Status:** CURRENT AUTHORITY — PROVISIONAL 1.0 RELEASE CONTRACT  
**Parent:** `../GameCompletionDefinition.md`  
**Requires:** `AlphaCompletionContract.md` + Content Alpha  
**Prepared:** 2026-09-11

## Purpose

Beta begins only after the whole intended Campaign One exists. Beta is for **making the complete game understandable, stable, balanced, usable, and presentable**, not for resuming feature invention.

## Beta entry

Beta may begin only when:

- `ALPHA_PASS` has been recorded on an exact qualified candidate;
- every Campaign One unit from Prologue through Epilogue has production content;
- no required chapter/content unit is a placeholder;
- all `CORE_1_0` scope requirements are implemented;
- the feature scope is locked except for release-blocking change control;
- a full fresh-save run can legally reach campaign completion through ordinary UI.

This state is **Content Alpha**.

## Beta doctrine

During Beta, default allowed work is:

```text
comprehension / discoverability
UX and feedback
pacing
balance
bug fixing
save robustness
performance
accessibility
visual consistency
content clarity
release qualification
```

Default prohibited work is:

```text
new progression pillar
new generalized engine
new campaign act
new major system
large new Trait catalog
new autonomous authority
post-1.0 feature pulled forward without release-blocking evidence
```

## Human product evidence

Beta is the first maturity gate that **requires genuine human evidence**.

Issue #109 remains the canonical human-review evidence backlog until superseded by a later explicit playtest record.

### Minimum human evidence floor

Before `BETA_PASS`, record at least:

- **5 fresh-player first-session observations** on a current supported build, focused on discoverability, causal understanding, terminology, and first capability/delegation mental models;
- **3 beginning-to-ending external playthroughs** from fresh saves without developer intervention in required progression;
- participant/build provenance sufficient to identify exact commit/build, browser, fresh-save basis, interventions, and deviations.

The counts are minimum evidence, not statistical claims. A repeated severe failure is more important than merely reaching the count.

### Human evidence acceptance

Beta does not require every participant to like every design choice. It requires that no unresolved repeated issue prevents ordinary players from:

- discovering the next meaningful action;
- understanding major state changes well enough to choose intentionally;
- distinguishing the important Relationship / capability / Knowledge / Faction / World-state concepts when needed;
- understanding personal mastery vs Copy readiness;
- completing the campaign without developer coaching.

## Discoverability / comprehension gates

- [ ] New Game makes the first actionable problem apparent.
- [ ] Fresh players can find NPC/dialogue, quest, travel and core progression surfaces without repository knowledge.
- [ ] Major unlocked options have sufficient player-facing causal explanation.
- [ ] Capability provenance is understandable without raw IDs/tags/debug terminology.
- [ ] Relationship history reads as history rather than invisible checklist progress.
- [ ] Knowledge, Faction and World State distinctions are understandable where the campaign asks the player to reason about them.
- [ ] Copy delegation is understood as learned/mastered repetition rather than arbitrary passive income.
- [ ] Offline return feedback explains what progressed and what did not.
- [ ] Campaign-completion state is unambiguous.

## Pacing gates

Pacing must be evaluated with both instrumentation/repository evidence and human play.

- [ ] Early game reaches the first meaningful consequence without excessive idle wait.
- [ ] First relationship-derived capability arrives after enough history to feel causally grounded, not after opaque grind.
- [ ] First delegation arrives after personal mastery is established, not before the routine has meaning.
- [ ] Midgame does not require repetitive manual work that should already be delegatable.
- [ ] Late game does not collapse into passive waiting between consequential choices.
- [ ] Finale preparation uses prior progression without requiring exhaustive completion of optional content.

No single universal time target is authoritative until actual play data exists. Record accepted duration ranges during Beta rather than inventing them earlier.

## Balance gates

- [ ] Every required encounter has at least one legal baseline or intended build route.
- [ ] No optional Trait becomes a de facto universal mandatory answer across the campaign.
- [ ] Essence costs permit the minimum 1.0 capability floor in a normal run without debug grants.
- [ ] Gold/reward pressure supports choices without forcing unrelated inventory/crafting systems.
- [ ] Routine rewards are useful but do not trivialize active progression.
- [ ] Copy requirements create meaningful readiness differences without opaque deadlocks.
- [ ] Offline progress cannot dominate ordinary active progression.
- [ ] Finale remains achievable across the intended late-game build profiles.

## Save and recovery gates

- [ ] Autosave does not corrupt or unexpectedly roll back campaign state.
- [ ] Manual/explicit save/load behavior remains understandable.
- [ ] Import/export round-trips representative early, mid, pre-finale and completed states.
- [ ] Invalid or incompatible save data fails safely with player-facing feedback.
- [ ] Version/migration paths are tested for supported pre-1.0 saves if compatibility is promised.
- [ ] Repeated load/reload does not duplicate one-time rewards, dialogues, routines, or offline settlement.

## Reliability gates

`BETA_PASS` requires:

- zero known **BLOCKER** defects;
- zero known **CRITICAL** defects;
- no known reproducible save-corruption defect;
- no known soft-lock on the required campaign path;
- no known exploit that bypasses core irreversible-choice authority in a way that invalidates campaign progression;
- all exact-head deterministic CI gates green.

High/medium issues may remain only if explicitly triaged as non-release-blocking with rationale.

## Performance gates

For the desktop-web 1.0 target:

- [ ] normal interaction remains responsive through representative late-game state;
- [ ] GameLoop timing/backpressure contracts remain green under current stress qualification;
- [ ] no unbounded per-tick queue/growth is introduced;
- [ ] route/page transitions do not exhibit repeatable user-blocking stalls on the supported environment;
- [ ] save/load of representative late-game state completes without user-visible failure;
- [ ] production bundle starts successfully in the release-like environment.

Precise performance budgets should be recorded only when measured on supported hardware/browser, not guessed in this contract.

## Accessibility / usability baseline

Before Beta exit:

- [ ] all critical actions are keyboard reachable on desktop;
- [ ] focus is visible on critical controls;
- [ ] form/dialog actions have understandable labels;
- [ ] important status is not communicated solely through color;
- [ ] text remains readable at supported viewport/zoom targets;
- [ ] blocking accessibility failures discovered in the primary flow are fixed or explicitly classified before RC.

A formal compliance certification is not implied.

## Presentation gates

- [ ] no required player-facing surface is visibly marked `planned`, `TODO`, or placeholder.
- [ ] terminology is consistent across Dashboard, NPC, Quest, Trait, Copy and consequence surfaces.
- [ ] important success/failure/locked states have visible feedback.
- [ ] chapter transitions and campaign completion have intentional presentation.
- [ ] temporary/debug prose is removed from normal player UI.
- [ ] visual hierarchy is coherent enough that core actions are distinguishable from diagnostics/support information.

Final art/audio scope may be modest, but presentation must be intentional rather than obviously incomplete.

## Supported environment for Beta

Primary 1.0 target:

```text
desktop web
Chromium-class current stable
Firefox current stable
minimum viewport 1280x720
reference viewport 1920x1080
```

Mobile is not a primary 1.0 qualification target. Do not intentionally regress responsive behavior, but mobile-specific polish does not block Beta unless separately promoted.

## Beta qualification record

Create a bounded Beta result document recording:

- exact candidate SHA;
- Build Validation run;
- full-game automated qualification result;
- browser/environment matrix;
- known-defect inventory and severity;
- human-session provenance and recurring findings;
- explicit accepted risks;
- evidence that feature/content scope is locked.

## Beta exit

Declare `BETA_PASS` only when:

```text
Content Alpha complete
AND required human evidence exists
AND repeated blocking comprehension/progression failures are resolved
AND no blocker/critical defects remain
AND save/recovery gates pass
AND supported desktop environment passes
AND exact-head Build Validation passes
```

After Beta, the only ordinary work is release qualification and release-blocking repair.
