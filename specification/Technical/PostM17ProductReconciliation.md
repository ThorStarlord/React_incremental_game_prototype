# Post-M17 Product Reconciliation

**Status:** Documentation-only reconciliation checkpoint after qualified M17  
**Frozen baseline:** `8f5311d37217732ab5353f8de331541a3ed79975`  
**Baseline tree:** `668d63f4c459b7b91c5b7e48010df9e2ab45db29`  
**Scope:** Product/status canon only; no runtime, content, test, save-schema, or workflow behavior changes

## 1. Purpose

M17 qualified one bounded deterministic player-facing combat encounter in which permanent `WillowsWisdom` exposes an optional tactical route while an ordinary no-Trait victory remains viable. The M17 production result is already captured in `M17NarrowCombatVerticalSliceResult.md` and the current Combat feature specification.

This checkpoint does not add gameplay behavior. It reconciles the repository's product/status documentation so future milestone work starts from the actual post-M17 state rather than the earlier post-M16 planning state.

The execution program after this checkpoint is governed by `PostM17MilestoneRoadmap.md`.

## 2. Audit findings

The audit found documentation drift in three active product/index surfaces:

1. `../GameDesignDocument.md`
   - status still says reconciled after M16;
   - M16 is described as the latest gameplay payoff;
   - Combat is still described as an event-bus-only scaffold;
   - the product maturity section still lists a real combat encounter loop as a future gap;
   - the near-term roadmap still identifies M17 as the next code-bearing milestone.

2. `../README.md`
   - product authority/status language still stops at M16;
   - Combat feature index still calls the feature an event-bus scaffold;
   - implementation status still says `Scaffold only` / no real encounter loop;
   - qualification history stops at M16;
   - near-term direction still describes the post-M16 checkpoint and M17 as future work.

3. `../RelationshipProgressionRedesign.md`
   - status and current-state language still stop at M16;
   - qualification history stops at M16;
   - the current checkpoint/next-unknown section still points to post-M16 reconciliation and future M17 combat;
   - evidence ceiling language still says complete combat is wholly unqualified rather than distinguishing the qualified bounded M17 slice from the larger unqualified combat system.

## 3. Documents intentionally not changed

The following are already accurate for their role and should remain untouched unless a separate contradiction is found:

- `../Features/CombatSystem_MVP.md` — already reconciled during M17 and truthfully describes the bounded transient encounter plus its evidence ceiling;
- `M17NarrowCombatVerticalSliceQualification.md` — frozen preregistration/history;
- `M17NarrowCombatVerticalSliceReconAmendment.md` — frozen pre-implementation recon history;
- `M17NarrowCombatVerticalSliceResult.md` — empirical result record;
- `PostM16TraitGameplayReconciliation.md` — historical Checkpoint-A doctrine; its M17 doctrine remains useful as the design constraint M17 tested;
- `RelationshipSystemMigrationPlan.md` — explicitly historical rather than current roadmap authority.

## 4. Canonical post-M17 combat status

After reconciliation, active product/index documents should distinguish the following.

### Empirically qualified

- one deterministic player-facing production encounter;
- ordinary `Strike` / `Guard` control play;
- permanent-Trait-sensitive `Trace the Cycle` / `Disrupt the Feedback` tactical play;
- viable no-Trait victory;
- Trait ownership as durable capability authority;
- runtime rejection of missing-Trait, wrong-phase, and terminal-state bypass attempts before mutation;
- victory / defeat terminal behavior;
- ordinary Combat `targetKilled` -> existing Quest `KILL` objective integration;
- pre-encounter save/load preserving permanent Trait authority;
- transient Combat-owned encounter state without a new persistent Combat reducer/save schema.

### Still unqualified / incomplete

- generalized combat system completeness;
- persistent or mid-combat save state;
- multi-enemy or party combat;
- broad enemy AI architecture;
- equipment combat integration;
- status-effect / cooldown / ability frameworks;
- generalized Player combat-stat authority;
- campaign-scale combat progression and balance;
- human fun/pacing quality.

## 5. Canonical near-term direction

After this reconciliation, the immediate next code-bearing candidate is:

> **M18 — Narrow Exploration / Travel Vertical Slice:** Can the player intentionally traverse a small authored world graph through a player-facing travel interface, with canonical player location producing ordinary gameplay consequences, without duplicate location flags or a generalized world simulation?

The working execution order is:

```text
M18 Exploration / Travel
-> M19 World-Derived Tether
-> Checkpoint B
-> M20 Copy Task Automation
-> M21 Offline Progress
-> Checkpoint C
-> M22 Social Knowledge Propagation
-> M23 Faction Reputation
-> M24 Objective World State
-> M25 Complete Chapter Vertical Slice
-> Human integrated playability review
```

Individual milestone semantics remain provisional until preregistered against the then-current exact repository state.

## 6. Authority boundaries preserved

This checkpoint does not change the domain model:

```text
Relationship -> qualifies learning/history meaning
Trait        -> owns durable learned capability
Combat       -> owns local tactical applicability and encounter state
Quest        -> owns objective/lifecycle consequence
Player       -> owns the decision to use available capability
World        -> will own spatial/objective facts as later milestones qualify them
```

M17 is additional evidence for the post-M16 rule:

```text
capability != decision
```

## 7. Acceptance criteria

This reconciliation passes only if:

- active product/status documentation accurately reflects M17 as completed and qualified;
- the bounded M17 combat proof is not overstated as a complete combat system;
- M18 is identified as the next code-bearing candidate;
- `PostM17MilestoneRoadmap.md` is linked as the current planned execution program;
- no runtime, content, test, save-schema, or workflow behavior changes are introduced;
- exact-head Build Validation passes after the documentation-complete candidate is frozen.

## 8. Evidence ceiling

A PASS for this checkpoint establishes only:

> Repository product/status canon accurately describes the qualified product maturity through M17 and identifies the planned post-M17 execution sequence.

It does not newly qualify any gameplay behavior, player experience, balance, exploration, Tether, automation, offline progression, knowledge, factions, world state, or chapter integration.
