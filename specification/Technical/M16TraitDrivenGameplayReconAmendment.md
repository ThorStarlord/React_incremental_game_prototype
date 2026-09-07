# M16 — Trait-Driven Gameplay Reconnaissance Amendment

**Status:** frozen before behavioral implementation  
**Parent preregistration:** `M16TraitDrivenGameplayQualification.md`  
**Baseline:** `337231772cfb1f0cd63ae7378a38219227499134`  
**Preregistration commit:** `ca5663ef430eb4f8b7a6c35bb3e9e8a20c04a7a7`

## Recon finding

Existing quest resolution authoring/runtime does **not** consume Trait ownership:

- `QuestResolutionOption` has authored Relationship consequence, item cost, rewards, and log text, but no Trait requirement;
- `resolveQuestOutcomeThunk` validates quest readiness, single-choice exclusivity, option identity, and item costs before consequence application, but does not inspect player Traits;
- `NPCQuestsTab` renders every authored resolution option when the quest is ready;
- permanent learned capabilities are authoritatively stored in `player.permanentTraits`.

Probe A alone — **The Withering Grove** using permanent `WillowsWisdom` — therefore exposes a real missing authoring semantic, but one case is insufficient to justify generic infrastructure.

## Rule-of-Two Probe B — The Impossible Inventory

A second independent production case uses permanent `ScholarlyInsight` from Scholar Elara.

Story problem: an archive inventory appears internally consistent if read linearly, but two independent entries imply mutually impossible provenance. The player may always complete the investigation through a conservative ordinary interpretation. A player who permanently owns `ScholarlyInsight` can choose to reopen the model around the contradiction instead.

Planned quest:

`quest_m16_impossible_inventory`

Ordinary resolution:

`accept_plausible_inventory`

- valid without `ScholarlyInsight`;
- records `elara_exp_inventory_plausible_model`.

Trait-enabled resolution:

`reopen_inventory_model`

- requires permanent `ScholarlyInsight`;
- records `elara_exp_insight_reopens_inventory`.

Frozen ordinary Elara vector:

- Trust `+1`
- Understanding `+2`
- Shared Meaning `+1`
- Reciprocity `+1`
- Connection Progress `+2`

Frozen Scholarly Insight vector:

- Trust `+2`
- Understanding `+5`
- Shared Meaning `+5`
- Reciprocity `+4`
- Connection Progress `+5`

Probe B is a corroborating architecture probe, not a claim that M16 qualifies broad multi-Trait gameplay balance.

## Bounded generic contract now warranted

Two independent production cases require the same missing semantic:

1. `WillowsWisdom` must gate an optional Withering Grove resolution;
2. `ScholarlyInsight` must gate an optional Impossible Inventory resolution.

The smallest justified contract is:

```ts
requiredPermanentTraitIds?: string[];
```

on `QuestResolutionOption`.

Semantics:

- omitted/empty: existing behavior unchanged;
- when present: **all** listed Trait IDs must exist in `state.player.permanentTraits`;
- the authoritative thunk rejects an unmet option before recording Relationship evidence, consuming items, applying rewards, or locking the resolution;
- the production NPC Quest UI must not offer an unmet option;
- no Trait-specific runtime branch is permitted.

This contract deliberately does **not** answer whether temporarily equipped Traits should satisfy gameplay capability gates. That is deferred.

## Implementation boundary

The justified generic behavioral surface is limited to:

- `QuestResolutionOption.requiredPermanentTraitIds?`;
- generic availability evaluation against `player.permanentTraits`;
- authoritative enforcement in `resolveQuestOutcomeThunk`;
- matching option visibility in `NPCQuestsTab`.

Do not add:

- negative Trait conditions;
- any-of Trait conditions;
- stat/attribute checks;
- equipped-Trait semantics;
- general ability predicates;
- arbitrary boolean condition expressions;
- NPC/Trait-specific branches.

The principal M16 product claim remains Probe A: a Relationship-derived permanent Trait materially changes the solution space of a bounded gameplay problem. Probe B exists to justify and qualify the repeated generic gate.
