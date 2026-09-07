# NPC System Specification

**Status:** Implemented NPC interaction foundation; Relationship semantics reconciled after M14  
**Authority:** For migrated relationships, `Relationships` owns Connection/Experience/Memory semantics. NPC state retains identity, services, inventory, dialogue/quest availability, and legacy compatibility fields.

## 1. Purpose

The NPC system represents the game's inhabitants and provides the player-facing interaction surface for:

- identity and location;
- dialogue availability;
- quest availability;
- trade and services;
- Trait sourcing / sharing surfaces;
- inventory and faction metadata;
- interaction routing.

The NPC system does **not** own the modern meaning of a relationship for NPCs whose `RelationshipProgressionDefinition.connectionAuthority` is `relationships`.

That authority belongs to `Features/RelationshipExperienceSystem.md` and the `Relationships` runtime.

## 2. Post-M14 relationship authority

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

Current registered production Relationship bundles include:

- Elder Willow;
- Lyra;
- Elara;
- Gronk;
- Silas;
- Valerius.

These characters must not be authored as though Affinity were an XP bar whose threshold automatically grants Connection.

### 2.2 Affinity

Affinity remains useful as a short-horizon NPC signal:

- positive/negative current disposition;
- service pricing or access where existing rules use it;
- dialogue tone;
- temporary conflict;
- legacy compatibility.

**Affinity is not Connection XP.**

A production relationship may legitimately have low/negative Affinity while high Connection, Understanding, Shared Meaning, or Reliance reflects deep rivalry, conflict, obligation, betrayal, or another durable bond.

### 2.3 Connection

For Relationship-authority NPCs, Connection is read from the Relationship Bond Profile and is qualified by authored evidence.

A Connection increase requires the configured progress/evidence rules. It must not occur solely because `npc.affinity` reaches a threshold.

### 2.4 Legacy `connectionDepth`

`NPC.connectionDepth` remains in the data model and some runtime/UI paths for compatibility with:

- unmigrated NPCs;
- old saves;
- legacy Trait gates;
- Copy calculations that have not yet migrated;
- debugging and older UI surfaces.

It is a compatibility field, not the product-level authority for new Relationship content.

Do not add new `connectionDepth` dependencies when the required concept belongs to Relationship Connection.

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

The precise TypeScript shape is defined by the runtime types rather than duplicated here as an independent schema authority.

## 4. Dialogue integration

The NPC dialogue surface uses the generic Dialogue system.

Important current effects include:

- `RELATIONSHIP_EXPERIENCE` — records an authored Relationship Experience;
- `UNLOCK_QUEST` — exposes a quest through ordinary NPC quest availability;
- `GIVE_ITEM` — grants an item where independently justified;
- service/opening effects supported by the existing dialogue runtime;
- legacy `AFFINITY_DELTA` for compatibility/simple interactions.

### 4.1 Relationship evidence gates

Dialogue may declare `requiredExperienceIds`.

Availability is enforced in production UI and checked by the interaction thunk, so Relationship evidence can cause later narrative availability without shadow booleans such as:

```text
silasTrustsPlayer
valeriusWillDelegate
gronkSupportsPlan
```

M13 qualified this Story -> Relationship -> later Story loop.

### 4.2 Multi-NPC consequences

One ordinary dialogue response may contain several `RELATIONSHIP_EXPERIENCE` effects targeted at different NPCs.

M14 qualified this behavior in two independent probes. A shared story decision can therefore create distinct, even conflicting, Relationship interpretations without a separate social-state engine.

## 5. Quest integration

NPCs expose available quests through the existing Quest system.

The Quest system owns:

- acceptance;
- objectives;
- progress;
- authored resolution choices;
- turn-in;
- ordinary rewards.

The Relationship system owns the relational interpretation of quest events when an authored Experience is recorded.

Do not duplicate durable relationship meaning as NPC quest flags.

## 6. Services and trading

NPC services may include training, information, Trait teaching, crafting, trading, or routing to other feature surfaces.

Existing service/trade behavior may continue using Affinity-based compatibility rules such as:

- minimum Affinity;
- pricing discounts;
- item availability thresholds.

These rules are short-horizon NPC/service mechanics. They do not imply that Affinity controls Relationship Connection.

When a future service genuinely needs deep relational evidence, prefer an explicit Relationship query or authored Experience/Memory requirement rather than inflating an Affinity threshold to stand in for Connection.

## 7. Trait integration

NPCs may expose:

- `availableTraits` — Traits that can become permanently Resonated where qualified;
- `innateTraits` — patterns the player may temporarily equip/attune when discovered;
- `sharedTraitSlots` — Traits shared from the player to the NPC where existing slot rules permit.

### 7.1 Migrated relationship-mediated Traits

For a Trait whose source NPC uses Relationship authority, permanent Resonance may require:

```text
Trait discovered
+ qualified Relationship Connection
+ assimilation threshold
+ compatibility threshold
+ required Memory evidence
+ Trait prerequisites
+ enough Essence
+ authored final Resonance Experience
-> permanent Trait
```

Willow's Wisdom and Scholarly Insight already exercise this model.

### 7.2 Legacy Traits

Unmigrated NPC-sourced Traits may still use legacy `connectionDepth` gating for compatibility.

That behavior must be described as legacy compatibility, not as the target design for new Traits.

## 8. Relationship presentation

The NPC UI should increasingly present Relationship-authority state through the Bond Profile:

- Connection level/progress;
- relevant universal dimensions;
- landmark Memories;
- recent Experiences;
- explanations for important gates;
- relationship-derived Essence/Resonance information where useful.

Some existing list/debug components still expose raw legacy `affinity` / `connectionDepth` fields. Those surfaces are migration debt and should be updated deliberately rather than used as evidence that the legacy model remains canonical.

## 9. Factions

NPCs already carry faction identifiers.

Faction metadata is not the same thing as personal Relationship state.

Future faction reputation should preserve cases such as:

```text
Valerius personally trusts the player
while the City Watch institution distrusts them.
```

Do not derive a faction score by simply averaging personal NPC Relationships unless a future explicit design proves that rule.

## 10. State-management boundary

### NPC slice / thunks

Own NPC-specific operational state and interaction routing.

### Relationship slice / thunks

Own:

- authored Experience definitions/ledger;
- Memories;
- Bond Profile;
- Connection authority/progression;
- relationship-derived semantic evidence.

### Quest slice / thunks

Own quest lifecycle and objectives.

### Trait / Essence systems

Consume qualified relationship state through their own domain contracts.

This separation prevents NPC state from becoming a second Relationship engine.

## 11. Invariants

1. For migrated NPCs, Affinity is not Connection XP.
2. For migrated NPCs, `connectionDepth` is not Relationship authority.
3. Important relationship beats should use authored Relationship Experiences rather than only `AFFINITY_DELTA`.
4. Relationship Memories live in the Relationship domain, not NPC flags.
5. Story availability may query generic Relationship evidence.
6. NPC-specific narrative behavior must not require NPC-ID branches in generic runtime unless repeated evidence proves a missing generic capability.
7. Service pricing/access rules may use Affinity without defining deep Relationship progression.
8. Personal Relationship state and future faction reputation must remain distinct domains.
9. Legacy fields may remain until migration is safe; do not extend them casually.

## 12. Current gaps

- several UI/debug surfaces still expose the legacy two-number model;
- unmigrated NPCs and Traits may still use compatibility `connectionDepth` rules;
- Copy creation/inheritance still contains legacy parent-NPC assumptions that need separate migration evidence;
- NPC schedules and world-derived presence are not yet a production world system;
- faction reputation is not yet a dedicated authority;
- broader player-facing Relationship timeline/history presentation remains future work.

## 13. Canonical references

- `../Technical/PostM14ProductReconciliation.md`
- `RelationshipExperienceSystem.md`
- `MemorySystem.md`
- `EssenceResonanceModel.md`
- `TraitSystem.md`
- `QuestSystem.md`
- milestone qualification documents under `../Technical/`

When older NPC documentation or code comments describe `affinity >= 100 -> connectionDepth + 1`, treat that as legacy behavior to be migrated or isolated, not as the design rule for new Relationship-authority content.