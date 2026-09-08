# NPC System Specification

**Status:** Implemented NPC interaction foundation; Relationship semantics reconciled after M14; bounded Knowledge/Faction/World-State dialogue integration qualified by M22/M23/M24  
**Authority:** `Relationships` owns personal Connection/Experience/Memory semantics. `Knowledge` owns per-NPC awareness. `Factions` owns institutional standing. `WorldState` owns bounded objective regional conditions. NPC state retains identity, services, inventory, authored membership metadata, dialogue/quest availability, and legacy compatibility fields.

## 1. Purpose

The NPC system represents the game's inhabitants and provides the player-facing interaction surface for:

- identity and location;
- dialogue availability;
- quest availability;
- trade and services;
- Trait sourcing / sharing surfaces;
- inventory and authored faction membership metadata;
- interaction routing;
- presentation/consumption of authored Relationship, Knowledge, Faction, and bounded World State prerequisites.

The NPC system does **not** own the modern meaning of a relationship for NPCs whose `RelationshipProgressionDefinition.connectionAuthority` is `relationships`.

NPC data likewise does not own canonical per-NPC fact awareness, institutional standing, or regional World State. Those authorities belong to `RelationshipExperienceSystem.md`, `KnowledgeSystem.md`, `FactionSystem.md`, and `WorldStateSystem.md`. The NPC dialogue runtime provides generic integration between authored content and those domains.

## 2. Relationship authority

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

Affinity remains a short-horizon NPC signal for disposition, legacy service rules, dialogue tone, and compatibility. **Affinity is not Connection XP, Faction Reputation, Knowledge, or World State.**

`NPC.connectionDepth` remains a legacy compatibility field; it is not modern Relationship authority.

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

The `faction` string on an NPC is authored **membership/identity metadata**. Institutional standing lives in the separate `factions` root.

Per-NPC awareness lives in `knowledge`.

Objective regional conditions live in `worldState`, not inside NPC objects.

## 4. Dialogue integration

The NPC dialogue surface uses the generic Dialogue system.

Important current effects include:

- `RELATIONSHIP_EXPERIENCE` — records authored personal Relationship evidence;
- `UNLOCK_QUEST` — exposes a quest through ordinary NPC quest availability;
- `GIVE_ITEM` — grants an item where independently justified;
- `KNOWLEDGE_FACT` — records that the current dialogue NPC knows one canonical fact reference;
- `FACTION_REPUTATION` — explicitly changes one named institution's standing;
- `WORLD_STATE_SET` — explicitly changes one of the two M24-qualified objective regional conditions;
- service/opening effects supported by the existing dialogue runtime;
- legacy `AFFINITY_DELTA` for compatibility/simple interactions.

### 4.1 Relationship evidence gates

Dialogue may declare:

```ts
requiredExperienceIds?: string[];
anyOfExperienceIds?: string[];
```

Availability is enforced in production UI and checked by `processNPCInteractionThunk`.

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

All listed institutional bounds must pass in both presentation and the authoritative interaction thunk.

Qualified examples include:

```text
valerius_m23_watch_clearance
-> Relationship evidence + City Watch >= 0
```

and:

```text
gronk_m23_guild_priority
-> Merchants Guild >= 10
```

### 4.4 Objective World State gates after M24

M24 adds exactly one bounded prerequisite family:

```ts
requiredWorldState?: WorldStateRequirement[];
```

The qualified requirement union supports exact equality for:

```text
watchPresence: normal | heavy
tradeFlow: normal | strong
```

The same fail-closed helper is used by:

```text
NPCDialogueTab
+
processNPCInteractionThunk
```

A direct thunk dispatch therefore cannot bypass an objective-world prerequisite, and malformed requirements are rejected rather than treated as permissive.

M24's qualified consumers are:

```text
silas_m24_patrol_pressure
requires Merchant District watchPresence == heavy
```

and:

```text
valerius_m24_freight_corridor
requires Merchant District tradeFlow == strong
```

### 4.5 Authorities do not imply each other

A dialogue effect must be interpreted according to its owning domain:

```text
RELATIONSHIP_EXPERIENCE -> personal shared-history meaning
KNOWLEDGE_FACT          -> current NPC awareness
FACTION_REPUTATION      -> institutional standing
WORLD_STATE_SET         -> objective regional condition
```

None is generic shorthand for the others.

M23's Valerius public-override decision proves one response can have independent personal + institutional consequences.

M24 then proves a social prerequisite can enable an **explicit later operational action** without becoming the objective condition itself:

```text
Merchants Guild >= 10
-> player may explicitly release verified freight
-> tradeFlow changes to strong
-> Guild standing remains unchanged
```

### 4.6 Multi-NPC and cross-NPC consequences

One ordinary dialogue response may contain several `RELATIONSHIP_EXPERIENCE` effects targeted at different NPCs; M14 qualified that behavior.

M22 does not turn `KNOWLEDGE_FACT` into broadcasting.

M23 does not turn `FACTION_REPUTATION` into ally/rival spillover.

M24 does not turn `WORLD_STATE_SET` into automatic social interpretation. Its two downstream consumers are cross-NPC precisely because World State persists independently from the NPC who participated in the mutation scene.

## 5. M24 bounded content extension

M24 production nodes live in:

```text
public/data/m24-world-state-content.json
```

`initializeNPCsThunk` loads the existing `npcs.json` / `dialogues.json`, then merges this bounded extension when present:

```text
extension.dialogues
+
extension.npcDialogueIds
```

The generic runtime does **not** branch on Valerius, Gronk, or Silas IDs to implement M24 semantics.

This bounded extension avoids rewriting the large historical fixtures while keeping the production nodes data-driven.

Its four qualified nodes are:

```text
valerius_m24_redeploy_patrols
silas_m24_patrol_pressure
gronk_m24_release_verified_freight
valerius_m24_freight_corridor
```

## 6. Quest integration

NPCs expose available quests through the existing Quest system.

The Quest system owns acceptance, objectives, progress, authored resolution choices, turn-in, and reward routing.

Relationship owns relational interpretation when an authored Experience is recorded.

Knowledge owns per-NPC awareness where explicitly represented.

Faction owns institution-level standing for faction-tagged Reputation rewards.

World State owns persistent objective regional conditions when a separately authored event mutates them.

M24 does not infer World State from quest completion flags.

## 7. Services and trading

NPC services may include training, information, Trait teaching, crafting, trading, or routing to other feature surfaces.

Existing service/trade behavior may continue using legacy Affinity-based compatibility rules.

M24 intentionally does **not** qualify World-State-gated trade transactions because the current `NPCTradeTab` purchase/sell path lacks a separate below-UI transaction authority suitable for this milestone without an unrelated refactor.

Do not interpret that deferral as evidence that World State may never affect trade. A future milestone may add such consumption with its own correctness boundary.

## 8. Trait integration

NPCs may expose `availableTraits`, `innateTraits`, and `sharedTraitSlots`.

For Relationship-authority sources, permanent Resonance may require qualified Relationship Connection, assimilation/compatibility thresholds, Memory evidence, prerequisites, enough Essence, and an authored final Resonance Experience.

Willow's Wisdom and Scholarly Insight exercise this model.

Unmigrated NPC-sourced Traits may still use legacy `connectionDepth` gating for compatibility; that is not the target design for new Traits.

## 9. Presentation

The NPC UI should increasingly present Relationship-authority state through the Bond Profile and use authored gates for causal availability.

Some older list/debug components still expose raw `affinity` / `connectionDepth`; those surfaces are migration debt.

M22 adds Knowledge-sensitive dialogue availability without a generalized Knowledge inspector.

M23 adds Faction-sensitive dialogue availability without a generalized reputation dashboard.

M24 adds World-State-sensitive dialogue availability without a generalized regional-state dashboard.

Those absent dashboards are UX/product questions, not reasons to collapse authorities into NPC state.

## 10. Faction and World-State composition

M23 qualifies:

```text
Valerius Relationship != City Watch Reputation
Gronk Relationship    != Merchants Guild Reputation
```

M24 extends the composition boundary:

```text
Faction Reputation != Objective World State
```

Qualified example:

```text
Merchants Guild +12
+
tradeFlow normal
```

can persist until the player explicitly chooses to release verified freight, after which:

```text
Merchants Guild +12
+
tradeFlow strong
```

Likewise, City Watch standing does not define Merchant District patrol density.

## 11. State-management boundary

### NPC slice / thunks

Own NPC-specific operational state and interaction routing, including generic enforcement/application of authored dialogue gates/effects.

### Knowledge slice / selectors/listeners

Own per-NPC fact-awareness records and bounded acquisition/query semantics.

### Faction slice / selectors

Own persisted institutional standing and institutional-standing queries.

### World State slice / selectors

Own persisted bounded objective regional conditions and exact-value World State requirements.

### Relationship slice / thunks

Own authored Experiences, Memories, Bond Profiles, Connection authority/progression, and relationship-derived semantic evidence.

### Quest slice / thunks

Own quest lifecycle/objectives and route faction-tagged Reputation rewards to Faction authority.

### Trait / Essence systems

Consume qualified state through their own contracts.

This separation prevents NPC state from becoming a second Relationship, Knowledge, Faction, or World State engine.

## 12. Invariants

1. For migrated NPCs, Affinity is not Connection XP.
2. `connectionDepth` is legacy compatibility, not Relationship authority.
3. Important relationship beats use authored Relationship Experiences.
4. Relationship Memories live in Relationship, not NPC flags.
5. Story availability may query Relationship evidence.
6. Story availability may query Knowledge when the question is NPC awareness.
7. Story availability may query Faction when the question is institutional standing.
8. Story availability may query World State when the question is an objective regional condition.
9. High Relationship does not imply Knowledge, high Faction standing, or a World State value.
10. High Faction standing does not satisfy Relationship-only or World-State-only gates.
11. `KNOWLEDGE_FACT` does not automatically mutate Relationship, Faction, or World State.
12. `FACTION_REPUTATION` does not automatically mutate Relationship, Knowledge, or World State.
13. `WORLD_STATE_SET` does not automatically mutate Relationship, Knowledge, or Faction.
14. World-sensitive dialogue gates are enforced below UI.
15. Malformed World State requirements fail closed.
16. NPC-specific narrative behavior should not require NPC-ID branches in generic runtime without repeated evidence.
17. Legacy fields may remain until migration is safe; do not extend them casually.

## 13. Current gaps

- several UI/debug surfaces still expose the legacy two-number Relationship model;
- unmigrated NPCs and Traits may still use compatibility `connectionDepth` rules;
- Copy creation/inheritance still contains legacy parent-NPC assumptions requiring separate migration evidence;
- NPC schedules are not a production world simulation;
- broader player-facing Relationship, Knowledge, Faction, and World State presentation remains future work;
- reputation tiers/bands and ally/rival spillover are not qualified;
- historical M13/M14/M15 cross-NPC awareness-shaped gates remain explicit Knowledge migration/design debt;
- M24 does not qualify World-State-gated Trade or Combat;
- M25 complete-chapter composition remains future work until M24 merges.

## 14. Canonical references

- `../Technical/PostM14ProductReconciliation.md`
- `RelationshipExperienceSystem.md`
- `MemorySystem.md`
- `KnowledgeSystem.md`
- `FactionSystem.md`
- `WorldStateSystem.md`
- `EssenceResonanceModel.md`
- `TraitSystem.md`
- `QuestSystem.md`
- `../Technical/M22SocialKnowledgePropagationResult.md`
- `../Technical/M23FactionReputationResult.md`
- `../Technical/M24ObjectiveWorldState.md`
- `../Technical/M24ObjectiveWorldStateReconAmendment.md`
- `../Technical/M24ObjectiveWorldStateResult.md`
- milestone qualification documents under `../Technical/`

When older NPC documentation treats Affinity thresholds as modern Connection, faction-tagged Reputation as giver-NPC Affinity, automatic ally/rival spillover as canonical, or social state as shorthand for objective regional conditions, the qualified M14-M24 authority chain supersedes those interpretations.