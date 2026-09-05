# Fresh-Player Willow Qualification

**Status:** Mechanical routed qualification PASS; human comprehension qualification pending  
**Scope:** M5 Elder Willow relationship vertical slice  
**Purpose:** Record what has actually been proven about the fresh-player Willow experience without treating automated UI traversal as evidence of human understanding.

---

## 1. Qualification question

The M5 design goal is stronger than "the relationship reducers work."

The target player experience is:

```text
New Game
-> meet Willow at Connection 0
-> choose meaningful dialogue
-> form relationship Experiences
-> qualify Connection without Affinity grinding
-> make the Ancient Seed decision
-> form a landmark Memory
-> continue through disagreement and teaching
-> independently apply Willow's pattern
-> reach Connection II and complete assimilation
-> accumulate enough passive Essence over time
-> understand the Trait gate
-> Resonate Willow's Wisdom permanently
```

The strongest M5 exit wording also asks whether a real fresh player can **explain why** each transition happened. Automated testing can prove reachability, state causality, and the presence of explanatory UI. It cannot prove that a human actually understood the explanation.

Accordingly this qualification separates two claims:

1. **Mechanical routed qualification:** can the normal player-facing route complete the causal loop without debug injection?  
2. **Human comprehension qualification:** after doing so, can an actual fresh player accurately explain Connection, Memories, passive Essence, assimilation, and Resonance?

Claim 1 is now qualified. Claim 2 remains pending.

---

## 2. Fresh-route defects found by M5

The routed qualification exposed several defects that lower-level relationship tests could not detect.

### 2.1 NPC detail route overwrote the New Game seed

The routed NPC detail container re-ran full NPC initialization on mount. New Game deliberately seeds only Elder Willow at:

```text
Affinity: 0
legacy connectionDepth: 0
Bond Connection: 0
```

Opening the detail route could therefore replace the onboarding seed with the full NPC catalog and restore Willow's legacy fixture values.

**Correction:** the detail route no longer reinitializes the NPC catalog. App startup owns global data initialization; New Game is allowed to replace it with the Willow onboarding state.

### 2.2 The live NPC detail route did not expose Dialogue or Relationship

The real `/game/npcs/:npcId` screen previously exposed Overview, Quests, Traits, and Trade, but not the Dialogue and Relationship surfaces required by the Willow causal loop.

**Correction:** the routed screen now exposes:

```text
Overview
Dialogue
Relationship
Quests
Traits
Trade
```

### 2.3 Coarse legacy tab gates made Connection-0 onboarding unreachable

The routed UI initially used raw Affinity / legacy `connectionDepth` thresholds to lock Quests and Traits. A migrated relationship must allow the player to enter the surfaces that explain how evidence is earned.

**Correction:** for NPCs whose `connectionAuthority` is `relationships`, Dialogue, Relationship, Quests, and Traits are available from Connection 0. Their actual content remains gated by authored Experience / Memory / Trait rules.

Legacy NPCs retain the old coarse gates during migration.

### 2.4 Overview taught the wrong progression model

The Overview tab offered a generic `+10 Affinity` interaction and described Dialogue / Quests in Affinity-threshold terms. That implicitly taught players to grind the very scalar that no longer controls Willow Connection.

**Correction:** migrated NPC Overview now explicitly states that:

- Affinity is current disposition;
- deep Connection comes from meaningful Experiences, choices, and landmark Memories;
- filling Affinity does not level the Bond;
- Dialogue and Quests are the places where relationship history is created.

The generic Affinity-grind button remains available only for legacy-authority NPCs.

### 2.5 Relationship explanation existed only in Debug

M4 made the causal state inspectable in developer tools, but normal players still lacked a clear answer to:

- why did Connection deepen?
- what Memory mattered?
- why did passive Essence change?

**Correction:** migrated NPCs now use a player-facing Relationship summary that shows:

- Connection Level;
- Bond interpretation;
- Stability;
- Affinity, Trust, Understanding, Shared Meaning, Reciprocity;
- progress toward the next authored Connection threshold;
- a warning that numeric progress alone is insufficient;
- the evidence that qualified the current Connection level;
- player-visible landmark Memories;
- recent meaningful Experiences;
- current passive Essence contribution and explanation.

This is intentionally less verbose than the Debug panel while preserving causal legibility.

### 2.6 New Game leaked previous in-memory progression

New Game previously reset the player and Willow seed but could leave prior Essence, Inventory, Quest state, selected NPC, and Copies in memory. This could make onboarding appear to work for the wrong reason—for example, old Essence could satisfy a Resonance cost immediately.

**Correction:** New Game now clears the onboarding-affecting state before rebuilding canonical quests and seeding Willow:

- Player;
- Essence;
- Inventory;
- Quest state;
- selected NPC;
- Copies;
- intro state;
- Relationships (through the Willow seed path).

The broader Trait-discovery model remains a separate known limitation.

### 2.7 Wrapped MUI Tabs were visually enabled but did not select

Quests, Traits, and Trade were rendered as:

```text
Tabs
-> Tooltip
   -> span
      -> Tab
```

MUI `Tabs` requires `Tab` components as direct children. The wrapper received cloned tab-control props and the inner button did not participate correctly in tab selection. In practice the Quests control could look available while Dialogue remained selected.

**Correction:** all routed `Tab` components are now direct children of `Tabs`. Legacy lock hints use the native `title` attribute instead of wrapping a Tab.

This was the direct cause of the first genuinely routed Ancient Seed failure.

### 2.8 CRA test setup was not actually loaded

The repository stored Jest setup under `src/tests/setupTests.ts`, while Create React App automatically loads `src/setupTests.ts`. The existing setup also referenced the removed Jest-DOM v6 subpath `@testing-library/jest-dom/extend-expect`.

**Correction:**

- `src/setupTests.ts` now delegates to the existing setup file;
- Jest-DOM uses the installed v6 root import `@testing-library/jest-dom`;
- TypeScript sees the same matcher augmentation.

This is test infrastructure, but fixing it was required before the routed test could become trustworthy.

---

## 3. Routed M5 test

`src/features/Relationships/state/RelationshipFreshGame.test.tsx` exercises the actual routed NPC player surface with a real Redux store and real relationship / quest / Essence / Trait thunks.

It does **not** inject WE-01 through WE-08 directly from the Debug panel.

The qualified path is:

1. seed fresh Willow-only New Game state;
2. verify Willow starts at Affinity 0 / legacy depth 0 / Connection 0;
3. open `/game/npcs/npc_elder_willow`;
4. verify Dialogue, Relationship, Quests, and Traits are reachable at Connection 0;
5. choose the first authored Dialogue response;
6. complete `The First Lesson` and reach Connection I;
7. accept the Seed challenge and receive the tutorial Sunstone;
8. open the actual Quests tab;
9. accept `The Ancient Seed`;
10. resolve it with `Awaken the Seed`;
11. verify Sunstone consumption and `The Seed Preserved` Memory;
12. turn in the quest;
13. continue through `Willow Disagrees`;
14. complete `Three Nights of Teaching`;
15. report `The Lesson Made Yours` independent application;
16. verify Connection II, 100% assimilation, and sufficient compatibility;
17. open the normal Relationship tab and verify causal evidence, landmark Memory, and passive Essence explanation are present;
18. simulate passive game time rather than granting Essence directly;
19. verify the resulting balance can fund the 40-Essence Resonance cost;
20. open the actual Traits tab;
21. select `Resonate` and confirm the real confirmation dialog;
22. verify `WillowsWisdom` becomes permanent and WE-08 is recorded.

This gives stronger evidence than the M4 domain suite because it traverses the same route/tab/component boundaries a player uses.

---

## 4. What the automated M5 result proves

The routed qualification proves that, on the tested preserve branch:

- the Willow-only New Game state survives navigation into the NPC detail route;
- a player does not need debug tooling to generate the relationship evidence;
- authored Dialogue choices cause the expected Experiences;
- the Ancient Seed quest is reachable and resolvable through normal UI;
- the landmark Memory forms through the player decision;
- Connection I / II are reachable through authored evidence rather than Affinity grinding;
- Trait assimilation reaches its requirement through teaching/application beats;
- the normal Relationship UI exposes causal evidence and passive Essence information;
- Essence required for Resonance can be accumulated passively from the resulting game rate rather than injected as relationship loot;
- the actual Trait UI can complete permanent `WillowsWisdom` Resonance;
- M4 Willow runtime invariants and M6 Lyra universality continue to pass alongside this routed path.

---

## 5. What it does not prove

The routed test does **not** prove that a human player:

- noticed the explanatory Relationship tab at the right time;
- understood the distinction between Affinity and Connection;
- understood why a Memory, rather than raw progress alone, mattered;
- connected the passive Essence-rate increase to the changed Bond;
- understood assimilation as learning/internalization rather than another bar;
- could explain why `WillowsWisdom` became Resonance-eligible;
- found the pacing, prose, choices, or feedback emotionally convincing.

Those are comprehension / UX / narrative-experience claims and require a real fresh-player session.

The correct status is therefore:

> **M5 mechanical routed qualification: PASS.**  
> **M5 human comprehension qualification: PENDING.**

---

## 6. Automated qualification record

The first candidate that completed the full routed sequence was:

```text
Head: 1e3fefdea69f8a120724909fb497ce9c51731ffa
Build Validation: #85
```

That run passed:

```text
npm ci
npx tsc --noEmit
RelationshipRuntime.test.ts
RelationshipLyraUniversality.test.ts
RelationshipFreshGame.test.tsx
npm run build
```

Any later documentation or code commit must receive its own exact-head Build Validation before being called qualified.

---

## 7. Remaining human test

A human M5 session should start from New Game with no design explanation from the facilitator.

After the player permanently Resonates `WillowsWisdom`, ask them to explain in their own words:

1. **Why did your Connection with Willow increase?**
2. **How is Affinity different from Connection?**
3. **What did `The Seed Preserved` Memory do or represent?**
4. **Why did Willow start contributing more passive Essence?**
5. **Why couldn't you permanently Resonate `WillowsWisdom` at the beginning?**
6. **What did teaching / independent application change?**
7. **What role did Essence play in final Resonance?**

Do not lead the player toward the canonical terminology before collecting their answers.

### Pass standard

The human qualification does not require the player to reproduce implementation formulas. It should pass if they accurately express the causal model approximately as:

> Meaningful interactions changed the relationship; important shared events became evidence; deeper Connection changed ongoing Essence production; practicing and applying Willow's pattern completed assimilation; Essence then stabilized a Trait that had already been relationally earned.

It should fail if their practical model remains approximately:

> I raised the friendship bar, waited for currency, and bought the Trait.

---

## 8. Cross-references

- `../RelationshipProgressionRedesign.md`
- `RelationshipSystemMigrationPlan.md`
- `../Narrative/ElderWillowVerticalSlice.md`
- `../Features/RelationshipExperienceSystem.md`
- `../Features/MemorySystem.md`
- `../Features/EssenceResonanceModel.md`
