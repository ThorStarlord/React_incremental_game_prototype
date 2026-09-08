# NPC System Specification

**Status:** Implemented NPC interaction foundation; Relationship semantics reconciled after M14; bounded Knowledge dialogue integration qualified by M22; bounded Faction dialogue integration qualified by M23  
**Authority:** For migrated relationships, `Relationships` owns Connection/Experience/Memory semantics. `Knowledge` owns per-NPC awareness of objective facts. `Factions` owns institutional standing. NPC state retains identity, services, inventory, authored faction membership metadata, dialogue/quest availability, and legacy compatibility fields.

## 1. Purpose

The NPC system represents the game's inhabitants and provides the player-facing interaction surface for:

- identity and location;
- dialogue availability;
- quest availability;
- trade and services;
- Trait sourcing / sharing surfaces;
- inventory and authored faction membership metadata;
- interaction routing;
- presentation/consumption of authored Relationship, Knowledge, and Faction prerequisites.

The NPC system does **not** own the modern meaning of a relationship for NPCs whose `RelationshipProgressionDefinition.connectionAuthority` is `relationships`.

That authority belongs to `Features/RelationshipExperienceSystem.md` and the `Relationships` runtime.

NPC data also does not own canonical per-NPC fact awareness or institutional standing. Those authorities belong to `Features/KnowledgeSystem.md` and `Features/FactionSystem.md`; the NPC dialogue runtime provides generic acquisition/consumption integration.

## 2. Relationship authority

### 2.1 Canonical model for migrated NPCs

For Relationship-authority NPCs:

```text
Dialogue / quest / gameplay event
-> Relationship Experience
-> Bond dimension changes
-> optional Memory
-> Connection Progress
-> semantic Connection qualification
-> later Essence / Trait / story consequences
```

Current registered production Relationship bundles include Elder Willow, Lyra, Elara, Gronk, Silas, and Valerius, plus bounded cross-system milestone bundles.

These characters must not be authored as though Affinity were an XP bar whose threshold automatically grants Connection.

### 2.2 Affinity

Affinity remains useful as a short-horizon NPC signal:

- positive/negative current disposition;
- service pricing or access where existing rules use it;
- dialogue tone;
- temporary conflict;
- legacy compatibility.

**Affinity is not Connection XP and is not Faction Reputation.**

A production relationship may legitimately have low/negative Affinity while high Connection, Understanding, Shared Meaning, or Reliance reflects deep rivalry, conflict, obligation, betrayal, or another durable bond.

### 2.3 Connection

For Relationship-authority NPCs, Connection is read from the Relationship Bond Profile and is qualified by authored evidence.

A Connection increase requires the configured progress/evidence rules. It must not occur solely because `npc.affinity` reaches a threshold.

### 2.4 Legacy `connectionDepth`

`NPC.connectionDepth` remains in the data model and some runtime/UI paths for compatibility with unmigrated NPCs, old saves, legacy Trait gates, Copy calculations that have not yet migrated, debugging, and older UI surfaces.

It is a compatibility field, not product-level authority for new Relationship content.

## 3. NPC-owned state

NPC data may include:

```text
id
name
description
category
location
avatar / sprite
faction
interaction prompt
available dialogues
completed dialogues
available quests
completed quests
available / innate Traits
shared Trait slots
inventory
services
status / discovery / availability
legacy affinity / connectionDepth / loyalty compatibility fields
```

The precise TypeScript shape is defined by runtime types rather than duplicated here as an independent schema authority.

The `faction` string on an NPC is bounded authored **membership/identity metadata**. M23 reuses existing values such as:

```text
Captain Valerius -> City Watch
Blacksmith Gronk -> Merchants Guild
```

but institutional standing is not stored on the NPC object. It lives in the separate `factions` Redux root.

Likewise, per-NPC Knowledge lives in the separate `knowledge` root.

## 4. Dialogue integration

The NPC dialogue surface uses the generic Dialogue system.

Important current effects include:

- `RELATIONSHIP_EXPERIENCE` — records authored personal Relationship evidence;
- `UNLOCK_QUEST` — exposes a quest through ordinary NPC quest availability;
- `GIVE_ITEM` — grants an item where independently justified;
- `KNOWLEDGE_FACT` — records that the current dialogue NPC knows one canonical fact reference;
- `FACTION_REPUTATION` — explicitly changes one named institution's standing;
- service/opening effects supported by the existing dialogue runtime;
- legacy `AFFINITY_DELTA` for compatibility/simple interactions.

### 4.1 Relationship evidence gates

Dialogue may declare `requiredExperienceIds` and `anyOfExperienceIds`.

Availability is enforced in production UI and checked by the interaction thunk, so Relationship evidence can cause later narrative availability without shadow booleans.

M13 qualified the Story -> Relationship -> later Story loop.

### 4.2 Knowledge and objective-experience gates

M22 added:

```ts
requiredRoutineFamiliarityIds?: RoutineFamiliarityId[];
requiredKnowledgeFactIds?: string[];
forbiddenKnowledgeFactIds?: string[];
```

These are enforced in both:

```text
NPCDialogueTab
+
processNPCInteractionThunk
```

M22's report path demonstrates objective Player familiarity -> explicit Valerius `KNOWLEDGE_FACT` -> later Valerius Knowledge consumer.

### 4.3 Faction gates

M23 adds:

```ts
requiredFactionReputation?: Array<{
  factionId: string;
  min?: number;
  max?: number;
}>;
```

All listed institutional bounds must pass.

The same gate is enforced in both presentation and `processNPCInteractionThunk`, so direct thunk dispatch cannot bypass institutional requirements.

Qualified examples:

```text
valerius_m23_watch_clearance
requires:
  valerius_exp_m23_public_override
  City Watch >= 0
```

and:

```text
gronk_m23_guild_priority
requires:
  Merchants Guild >= 10
```

### 4.4 Authorities do not imply each other

A dialogue effect must be interpreted according to its domain:

```text
RELATIONSHIP_EXPERIENCE -> personal shared-history meaning
KNOWLEDGE_FACT          -> current NPC awareness
FACTION_REPUTATION      -> institutional standing
```

None is generic shorthand for the others.

If one player decision legitimately creates several consequences, author them separately.

M23's Valerius public-override decision is the canonical bounded example:

```text
one response
-> positive/mixed Valerius Relationship Experience
-> City Watch -10
-> Knowledge unchanged
```

### 4.5 Multi-NPC Relationship consequences

One ordinary dialogue response may contain several `RELATIONSHIP_EXPERIENCE` effects targeted at different NPCs.

M14 qualified this behavior in two independent probes. A shared story decision can therefore create distinct, even conflicting, personal interpretations without requiring a generic social-state engine.

M22 does not turn `KNOWLEDGE_FACT` into broadcasting, and M23 does not turn `FACTION_REPUTATION` into ally/rival spillover.

## 5. Quest integration

NPCs expose available quests through the existing Quest system.

The Quest system owns acceptance, objectives, progress, authored resolution choices, turn-in, and reward routing.

The Relationship system owns relational interpretation when an authored Experience is recorded.

The Knowledge system owns per-NPC awareness where explicitly represented.

The Faction system owns institution-level standing for faction-tagged Reputation rewards.

M23 corrects the old behavior where a quest reward authored as `REPUTATION` for `City Watch` changed the giver NPC's personal Affinity. See `QuestSystem.md` and `FactionSystem.md`.

Do not duplicate durable Relationship meaning, Knowledge, or Faction standing as arbitrary NPC quest flags.

## 6. Services and trading

NPC services may include training, information, Trait teaching, crafting, trading, or routing to other feature surfaces.

Existing service/trade behavior may continue using Affinity-based compatibility rules such as minimum Affinity, pricing discounts, and item availability thresholds.

These are short-horizon NPC/service mechanics. They do not imply that Affinity controls Relationship Connection, Knowledge, or institutional Faction standing.

When a future service genuinely needs another authority, query that domain explicitly rather than inflating Affinity into a universal social score.

## 7. Trait integration

NPCs may expose:

- `availableTraits` — Traits that can become permanently Resonated where qualified;
- `innateTraits` — patterns the player may temporarily equip/attune when discovered;
- `sharedTraitSlots` — Traits shared from the player to the NPC where existing slot rules permit.

For Relationship-authority sources, permanent Resonance may require qualified Relationship Connection, assimilation/compatibility thresholds, Memory evidence, Trait prerequisites, enough Essence, and an authored final Resonance Experience.

Willow's Wisdom and Scholarly Insight exercise this model.

Unmigrated NPC-sourced Traits may still use legacy `connectionDepth` gating for compatibility; that is not the target design for new Traits.

## 8. Presentation

The NPC UI should increasingly present Relationship-authority state through the Bond Profile and use authored gates for causal availability.

Some older list/debug components still expose raw `affinity` / `connectionDepth`; those surfaces are migration debt and must not be used as evidence that the legacy model remains canonical.

M22 added Knowledge-sensitive dialogue availability but no generalized Knowledge inspector.

M23 adds Faction-sensitive dialogue availability but no generalized reputation dashboard. Player-facing institutional presentation beyond dialogue consequences remains future UX work.

## 9. Faction authority after M23

Faction metadata is no longer merely a future placeholder: M23 qualifies first-class institutional standing for two production institutions.

Canonical distinction:

```text
Valerius personal Relationship
!=
City Watch Reputation
```

and:

```text
Gronk personal Relationship
!=
Merchants Guild Reputation
```

The runtime supports states such as:

```text
Valerius personally deepens trust in the player's judgment
while
City Watch standing falls because the player broke a public order
```

and:

```text
Merchants Guild standing rises from a verified audit
while
Gronk Relationship remains unchanged
```

Do not derive faction scores by averaging personal NPC Relationships, known facts, or member Affinity.

The dormant legacy ally/rival spillover constants remain unqualified prototype residue.

## 10. State-management boundary

### NPC slice / thunks

Own NPC-specific operational state and interaction routing, including generic enforcement/application of authored dialogue gates/effects.

### Knowledge slice / selectors/listeners

Own per-NPC fact-awareness records and bounded qualified acquisition/query semantics.

### Faction slice / selectors

Own persisted institutional standing and institutional-standing queries.

### Relationship slice / thunks

Own authored Experiences, Memories, Bond Profiles, Connection authority/progression, and relationship-derived semantic evidence.

### Quest slice / thunks

Own quest lifecycle/objectives and route faction-tagged Reputation rewards to Faction authority.

### Trait / Essence systems

Consume qualified state through their own contracts.

This separation prevents NPC state from becoming a second Relationship, Knowledge, or Faction engine.

## 11. Invariants

1. For migrated NPCs, Affinity is not Connection XP.
2. For migrated NPCs, `connectionDepth` is not Relationship authority.
3. Important relationship beats should use authored Relationship Experiences rather than only `AFFINITY_DELTA`.
4. Relationship Memories live in the Relationship domain, not NPC flags.
5. Story availability may query generic Relationship evidence.
6. Story availability may query Knowledge when the relevant question is whether this NPC knows a fact.
7. Story availability may query Faction when the relevant question is institutional standing.
8. High Relationship does not imply an NPC knows a fact they never acquired.
9. High Relationship does not imply high Faction standing.
10. High Faction standing does not satisfy Relationship-only evidence gates.
11. `KNOWLEDGE_FACT` does not automatically mutate Relationship or Faction state.
12. `FACTION_REPUTATION` does not automatically mutate Relationship or Knowledge state.
13. NPC-specific narrative behavior must not require NPC-ID branches in generic runtime unless repeated evidence proves a missing generic capability.
14. Service Affinity rules do not define deeper Relationship, Knowledge, or Faction authority.
15. Legacy fields may remain until migration is safe; do not extend them casually.

## 12. Current gaps

- several UI/debug surfaces still expose the legacy two-number Relationship model;
- unmigrated NPCs and Traits may still use compatibility `connectionDepth` rules;
- Copy creation/inheritance still contains legacy parent-NPC assumptions that need separate migration evidence;
- NPC schedules and world-derived presence are not yet a production world system;
- broader player-facing Relationship and Knowledge presentation remains future work;
- broader player-facing Faction/reputation presentation is not yet qualified;
- reputation tiers/bands and ally/rival spillover are not qualified;
- historical M13/M14/M15 cross-NPC awareness-shaped gates remain explicit Knowledge migration/design debt;
- objective regional World State remains M24.

## 13. Canonical references

- `../Technical/PostM14ProductReconciliation.md`
- `RelationshipExperienceSystem.md`
- `MemorySystem.md`
- `KnowledgeSystem.md`
- `FactionSystem.md`
- `EssenceResonanceModel.md`
- `TraitSystem.md`
- `QuestSystem.md`
- `../Technical/M22SocialKnowledgePropagationResult.md`
- `../Technical/M23FactionReputation.md`
- `../Technical/M23FactionReputationReconAmendment.md`
- `../Technical/M23FactionReputationResult.md`
- milestone qualification documents under `../Technical/`

When older NPC documentation or code comments describe `affinity >= 100 -> connectionDepth + 1`, treat that as legacy behavior to migrate or isolate, not the design rule for Relationship-authority content.

When older code treats faction-tagged `REPUTATION` as personal giver-NPC Affinity or suggests automatic ally/rival spillover, M23's qualified Faction authority supersedes that interpretation.