# Relationship System Migration Plan

**Status:** Implementation plan  
**Target branch:** `feature/relationship-memory-vertical-slice`  
**Scope:** Migrate the current Affinity -> Connection Depth -> Essence -> Trait Resonance pipeline to the Experience -> Memory -> Bond Profile architecture without rewriting unrelated systems.

## 1. Current-state summary

The runtime currently uses a simple but functional relationship pipeline:

```text
Dialogue / quest effects
-> Affinity changes
-> Affinity >= 100
-> connectionDepth +1, Affinity remainder retained
-> Essence generation-rate recalculation
-> Trait Resonance gate uses minimum connectionDepth + Essence balance
```

The relevant implementation is spread across:

- `src/features/NPCs/state/NPCThunks.ts`
- `src/features/NPCs/state/NPCSlice.ts`
- `src/features/NPCs/state/NPCTypes.ts`
- `src/features/Essence/`
- `src/features/Traits/state/TraitThunks.ts`
- `src/constants/gameConstants.ts`
- `public/data/dialogues.json`
- `public/data/quests.json`
- `public/data/traits.json`

The migration should preserve working gameplay while progressively moving authority to the new relationship model.

---

## 2. Target architecture

```text
Narrative action
-> relationshipExperienceRecorded
-> Experience ledger
-> relationship dimensions updated
-> connection qualification evaluated
-> optional Memory formed
-> Bond Profile recalculated
-> Essence contribution recalculated
-> Trait assimilation / Resonance gates recalculated
```

The runtime does not need to become a fully event-sourced architecture. However, Experience records should remain durable evidence and derived state should avoid duplicating contradictory truth.

---

## 3. Migration principles

1. **Do not break the playable onboarding path while migrating.**
2. **Do not rewrite unrelated systems.** Combat, Copy tasks, inventory, trading, and broader quest infrastructure remain out of scope.
3. **Prefer additive state first, replacement second.** Introduce relationship state alongside existing `affinity` / `connectionDepth`, then cut over once validated.
4. **Use Elder Willow as the only required content proof before generalization.**
5. **Use Lyra as the first universality test after Willow.**
6. **Keep save data serializable.**
7. **Every new state transition must be explainable in debug tooling.**
8. **Separate migration compatibility from target semantics.** Temporary shims must be clearly marked and removable.

---

# 4. Phase A — Add domain types and state without changing behavior

## A1. Create relationship feature/domain

Recommended location:

```text
src/features/Relationships/
  state/
    RelationshipTypes.ts
    RelationshipSlice.ts
    RelationshipSelectors.ts
    RelationshipThunks.ts
    RelationshipListeners.ts
  index.ts
```

Do not put new event history directly into the NPC slice unless implementation proves that a separate feature creates unnecessary complexity.

## A2. Add types

Minimum initial types:

```typescript
type RelationshipDimensionKey =
  | 'affinity'
  | 'trust'
  | 'understanding'
  | 'sharedMeaning'
  | 'reliance'
  | 'vulnerability'
  | 'reciprocity';

interface RelationshipExperience {
  id: string;
  uniqueKey?: string;
  title: string;
  timestamp: number;
  primaryTargetId: string;
  participantIds: string[];
  sourceType: 'dialogue' | 'quest' | 'combat' | 'exploration' | 'system' | 'other';
  sourceId?: string;
  significance: 'minor' | 'meaningful' | 'major' | 'defining';
  relationshipEffects: Partial<Record<RelationshipDimensionKey, number>>;
  customEffects?: Record<string, number>;
  connectionProgressDelta?: number;
  resonanceTags: string[];
  memoryCandidate: boolean;
  interpretation?: string;
  consequences?: string[];
}

interface RelationshipMemory {
  id: string;
  originExperienceId: string;
  title: string;
  timestamp: number;
  primaryTargetId: string;
  participantIds: string[];
  memoryType: 'shared' | 'target' | 'protagonist' | 'asymmetric';
  significance: 'meaningful' | 'major' | 'defining';
  playerVisible: boolean;
  summary: string;
  resonanceTags: string[];
  bondContribution?: string;
  traitRelevance?: string[];
  persistence: 'stable' | 'contested' | 'reinterpretable';
  currentInterpretation?: string;
}

interface BondProfile {
  npcId: string;
  dimensions: {
    affinity: number;
    trust: number;
    understanding: number;
    sharedMeaning: number;
    reliance: number;
    vulnerability: number;
    reciprocity: number;
    custom: Record<string, number>;
  };
  connectionLevel: number;
  connectionProgress: number;
  bondArchetypes: string[];
  activeMemoryIds: string[];
  unresolvedTensions: string[];
  recentExperienceIds: string[];
  resonanceQuality: number;
  stability: 'ruptured' | 'contested' | 'strained' | 'stable' | 'reinforced';
}
```

The exact TypeScript shape may evolve; semantic fields are more important than naming.

## A3. Add RelationshipState

Recommended normalized structure:

```typescript
interface RelationshipState {
  experiencesById: Record<string, RelationshipExperience>;
  experienceIdsByNpc: Record<string, string[]>;
  memoriesById: Record<string, RelationshipMemory>;
  memoryIdsByNpc: Record<string, string[]>;
  bondProfilesByNpc: Record<string, BondProfile>;
  appliedUniqueKeys: Record<string, true>;
}
```

## A4. Register reducer in `src/app/store.ts`

No existing behavior changes in Phase A.

### Phase A acceptance

- app compiles;
- save serialization includes the new slice;
- old gameplay behaves identically;
- selectors can return an empty/default Bond Profile for Willow.

---

# 5. Phase B — Record Experiences in shadow mode

## B1. Introduce `recordRelationshipExperience`

Create a single authoritative action/thunk for authored relationship events.

It must:

1. enforce idempotency for `uniqueKey`;
2. append the Experience;
3. apply dimension deltas;
4. update Connection Progress;
5. recalculate derived Bond data;
6. optionally request Memory qualification;
7. trigger Essence-rate recalculation when relationship-derived inputs change.

## B2. Keep old Affinity logic temporarily

During shadow mode, important Willow dialogue can still dispatch existing `AFFINITY_DELTA` behavior while also recording new Experiences.

The temporary compatibility rule should be explicit:

```text
old Affinity change = legacy gameplay
new Experience = shadow evidence
```

Do not derive the new Bond Profile by rereading old RelationshipChangeEntry history; authored Experiences should be explicit.

## B3. Add new dialogue effect

Recommended data effect:

```json
{
  "type": "RELATIONSHIP_EXPERIENCE",
  "experienceId": "willow_exp_first_question_admit"
}
```

The actual Experience definitions may live in a dedicated data file rather than embedding large payloads in dialogue JSON.

Suggested location:

```text
public/data/relationships/elder-willow.json
```

### Phase B acceptance

- Willow dialogue creates Experience records;
- duplicate authored choices do not double-apply unique Experiences;
- existing Affinity flow still works;
- debug output can show old and new states side-by-side.

---

# 6. Phase C — Add Memory formation

## C1. Explicit authored Memories first

For the first vertical slice, avoid building a generic automatic Memory-ranking algorithm.

Experience definitions should be able to declare:

```text
memoryCandidate: true
memoryDefinitionId: willow_memory_seed_preserved
```

The runtime validates qualification and creates the Memory when conditions are met.

## C2. First two required Memories

- `willow_memory_seed_preserved`
- `willow_memory_lesson_made_yours`

`Beneath the Old Tree` remains optional.

## C3. Add Memory selectors

Required selectors:

- visible Memories by NPC;
- Memory by id;
- Memories matching a resonance tag;
- Trait-relevant Memories.

### Phase C acceptance

- every Memory references an existing Experience;
- replay/reload does not duplicate Memories;
- Memories survive later negative relationship changes;
- player-visible and hidden Memories can coexist.

---

# 7. Phase D — Cut Connection progression over from Affinity XP

This is the first intentional gameplay behavior change.

## D1. Stop automatic Connection level-up in `updateNPCRelationshipThunk`

Remove or gate the behavior:

```text
affinity >= 100 -> connectionDepth +1
```

Affinity remains clamped to its valid range and remains useful for short-term disposition/service gating.

## D2. Move Connection into Bond Profile authority

During migration, options are:

### Preferred

`BondProfile.connectionLevel` becomes authoritative and NPC `connectionDepth` becomes a compatibility projection until consumers migrate.

### Transitional

Keep `connectionDepth` on NPC but allow only the Relationship feature to update it after qualification.

The preferred long-term model is the first option.

## D3. Add qualification selector/thunk

A Connection level-up requires:

- progress threshold;
- qualifying Experience/Memory evidence;
- state coherence;
- optional content-specific condition.

For Willow v1, authored qualification rules are acceptable. Do not hardcode `if npcId === 'npc_elder_willow'` inside generic reducers; put Willow conditions in data/configuration.

### Phase D acceptance

- repeated positive dialogue cannot level Connection by itself;
- WE-05 can reduce Affinity while increasing Connection-related progress;
- Willow reaches the required Connection level through the authored slice;
- other NPCs retain safe legacy/default behavior until their content migrates.

---

# 8. Phase E — Migrate Essence generation

## E1. Preserve global base generation

Keep the current `ESSENCE_GENERATION.BASE_RATE_PER_SECOND` initially.

## E2. Replace NPC contribution calculation

Current:

```text
connectionDepth * NPC_CONTRIBUTION_MULTIPLIER
```

Target:

```text
Connection Base Rate
* Resonance Quality
* Tether Modifier
* Stability Modifier
```

During first implementation, Willow may be the only NPC using the new calculation. Legacy NPCs can use the old contribution behind a compatibility selector.

## E3. Remove relationship-harvest reward from Ancient Seed

Change `quest_willow_ancient_seed` so the relationship milestone no longer directly awards `ESSENCE 100`.

Possible replacement rewards:

- non-Essence item;
- quest completion with no direct material reward;
- unlock of the next Willow interaction;
- a small unrelated resource if pacing requires it.

The relationship value should come from the Experience/Memory and resulting future rate.

## E4. Add explanation selector

The UI/debug layer should be able to show something like:

```text
Willow contribution: 0.13/sec
Reasons:
- Connection II base: 0.10
- Resonance Quality: Strong
- Tether: Present
- Stability: Stable
```

### Phase E acceptance

- a Willow landmark changes future rate, not current balance;
- `generateEssenceThunk` continues to accrue over time normally;
- no double-counting between legacy and new Willow contribution;
- save/load preserves effective rate inputs.

---

# 9. Phase F — Add Trait assimilation and new Resonance gates

## F1. Extend Trait source metadata

For `WillowsWisdom`, add target metadata such as:

```json
{
  "sourceNpc": "npc_elder_willow",
  "minimumConnectionLevel": 2,
  "resonanceTags": ["Wisdom", "Patience", "PatternRecognition", "Application"],
  "requiredMemoryTags": ["Application"],
  "assimilationDifficulty": 1.0
}
```

Preserve `essenceCost: 40` initially.

## F2. Add Trait assimilation state

Recommended state by `(traitId, sourceNpcId)`:

```typescript
interface TraitAssimilationState {
  traitId: string;
  sourceNpcId: string;
  progress: number;
  lastUpdatedAt: number;
  qualifyingMemoryIds: string[];
  compatibility: number;
}
```

## F3. Advance assimilation through tether time

The game loop or bounded interaction sessions can advance assimilation only when the player is in a valid tether state with the source.

Avoid making raw real-time proximity the only mechanism until world-location state is robust. For Willow v1, authored teaching sessions can provide bounded tether intervals.

## F4. Update `acquireTraitWithEssenceThunk`

Target validation order:

1. Trait discovered;
2. source NPC resolved;
3. qualified Connection level met;
4. assimilation complete;
5. required Memory/evidence met;
6. Trait prerequisites met;
7. sufficient Essence;
8. spend Essence;
9. make Trait permanent.

Errors should explain the first unmet requirement clearly.

### Phase F acceptance

- `WillowsWisdom` cannot be Resonated immediately after viewing Willow;
- sufficient Essence alone is not enough;
- `The Lesson Made Yours` or equivalent Application evidence matters;
- final Resonance still spends 40 Essence;
- temporary Trait equipping remains functional.

---

# 10. Phase G — Player-facing UI

Minimum required surfaces:

## G1. Relationship summary

On Willow's NPC view:

- Connection Level;
- qualitative Bond interpretation;
- key dimensions;
- Essence contribution;
- recent/defining Memories.

Do not expose every internal formula by default.

## G2. Memory list

Show only player-visible landmark Memories.

## G3. Resonance panel

Show `WillowsWisdom` with:

- discovery status;
- Connection requirement;
- assimilation progress;
- evidence requirement;
- Essence cost;
- clear reason when locked.

## G4. Rare Memory notification

When `The Seed Preserved` forms, surface a high-salience but non-spammy notification.

### Phase G acceptance

A player can answer:

- Why did my Connection with Willow deepen?
- Why is Willow generating more Essence?
- Why can/can't I Resonate Willow's Wisdom?

without opening debug tools.

---

# 11. Phase H — Debug and validation tooling

Add a relationship debug surface before broad content expansion.

Minimum fields:

```text
NPC
Experience history
Memory history
Dimension state
Connection progress + qualification evidence
Bond archetypes
Resonance Quality calculation
Essence contribution calculation
Trait assimilation state
Resonance gate state
```

Each calculated value should have an explanation path.

---

# 12. Phase I — Save migration

Existing saves may contain only:

```text
affinity
connectionDepth
```

Migration rule:

- preserve existing Affinity;
- map old `connectionDepth` conservatively to compatibility Connection Level;
- initialize unknown dimensions to neutral/default values;
- do not fabricate historical Experiences or Memories;
- mark migrated profiles as legacy-derived if needed for debugging;
- begin recording new Experiences from migration onward.

Do not invent `The Seed Preserved` or other Memories merely because an old save had high Connection Depth.

---

# 13. Automated test requirements

The current prototype has little automated coverage, but this migration introduces enough state coupling that tests are warranted.

Required minimum tests:

### Experience

- stable unique event applies once;
- repeatable event can be explicitly repeated;
- dimension deltas clamp correctly.

### Memory

- Memory cannot reference missing Experience;
- Memory forms once;
- Memory persists after Trust/Affinity loss.

### Connection

- Affinity threshold alone does not level Connection;
- qualifying Experience + progress can level Connection;
- adversarial event can lower Affinity while increasing Connection progress.

### Essence

- Relationship Experience does not directly alter Essence balance;
- Bond change alters passive rate;
- Willow new rate is not double-counted with legacy contribution.

### Trait Resonance

- insufficient assimilation blocks Resonance;
- missing Memory evidence blocks Resonance;
- sufficient evidence + Connection + Essence permits Resonance;
- Essence is deducted exactly once;
- permanent Trait is added exactly once.

### Save/load

- Experiences, Memories, Bond Profile, and assimilation survive serialization;
- legacy save migration produces valid state without fake history.

---

# 14. Scope exclusions for this migration

Do not implement yet:

- procedural/LLM-generated Memories;
- autonomous NPC social-network simulation;
- multiple Essence currencies;
- full dynamic relationship AI;
- Copy redesign;
- broad campaign rewrite;
- dozens of custom relationship dimensions;
- automatic universal Memory scoring;
- advanced remote-bond distance curves;
- post-Lyra authenticity endgame mechanics.

These remain downstream until the Willow + Lyra proofs validate the core model.

---

# 15. Milestones

## M1 — Relationship ontology

**Deliverables:**

- `RelationshipExperienceSystem.md`
- `MemorySystem.md`
- `EssenceResonanceModel.md`

**Exit:** terms, invariants, schemas, and boundaries are coherent.

## M2 — Willow authored proof

**Deliverable:**

- `ElderWillowVerticalSlice.md`

**Exit:** 6–10 Experiences, 2–4 Memory candidates, clear Trait Resonance path, branch tolerance.

## M3 — Runtime foundation

**Exit:** Experiences, Memories, Bond Profile exist in Redux and shadow current gameplay.

## M4 — Essence + Resonance cutover

**Exit:** Willow uses relationship-derived passive generation and assimilation-based Trait Resonance.

## M5 — Playable Willow slice

**Exit:** new player can complete the entire causal loop and explain it.

## M6 — Lyra generalization

**Exit:** adversarial high-Connection/low-Affinity relationship works without generic-system exceptions.

---

# 16. Definition of done for the Willow slice

A fresh player can:

1. start New Game;
2. meet Willow at Connection 0;
3. discover `WillowsWisdom`;
4. generate meaningful Relationship Experiences;
5. form `The Seed Preserved` Memory (on the relevant branch);
6. deepen qualified Connection without Affinity grinding;
7. observe Willow's passive Essence contribution strengthen;
8. spend sustained tether time assimilating the Trait;
9. create Application evidence through `The Lesson Made Yours`;
10. Resonate `WillowsWisdom` permanently for Essence;
11. inspect enough UI evidence to understand why every transition occurred.

The slice fails if its practical player summary is still:

> "I filled the relationship bar and bought the Trait."

The target player summary is:

> "I learned how Willow thinks, demonstrated that understanding, and our relationship became both a stronger source of Essence and the reason her Trait could become part of me."

---

# 17. Cross-references

- `../Features/RelationshipExperienceSystem.md`
- `../Features/MemorySystem.md`
- `../Features/EssenceResonanceModel.md`
- `../Narrative/ElderWillowVerticalSlice.md`
- `../Features/NPCSystem.md`
- `../Features/EssenceSystem.md`
- `../Features/TraitSystem.md`
- `DataModel.md`
- `StateManagement.md`
