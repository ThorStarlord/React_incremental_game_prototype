# Fresh-Player Willow Qualification

**Status:** Mechanical routed qualification PASS; workspace causal-legibility qualification PASS; human comprehension study deferred from PR #25 merge claim  
**Scope:** M5 Elder Willow relationship vertical slice  
**Purpose:** Record what has actually been proven about the fresh-player Willow experience without treating automated or analytical evaluation as evidence of human understanding.

> **Scope update:** The original stronger M5 wording required a fresh human participant to complete the slice and explain the causal model. PR #25 now intentionally makes a narrower claim that can be qualified from the workspace: the loop is mechanically traversable through normal player UI and the intended causal model is present and reconstructible from player-facing evidence. See [`WorkspaceCognitiveWalkthrough.md`](WorkspaceCognitiveWalkthrough.md). A real human comprehension study remains useful future product research but is not a merge prerequisite for this PR.

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

The original strongest M5 exit wording also asked whether a real fresh player can **explain why** each transition happened. Automated testing can prove reachability, state causality, and the presence of explanatory UI. It cannot prove that a human actually understood the explanation.

Accordingly qualification is separated into three claims:

1. **Mechanical routed qualification:** can the normal player-facing route complete the causal loop without debug injection? **PASS.**
2. **Workspace causal-legibility qualification:** is the intended causal model present and reconstructible from normal player-facing evidence? **PASS.**
3. **Human comprehension study:** does a genuinely fresh participant actually notice/internalize that model? **Deferred future research; not claimed by PR #25.**

---

## 2. Fresh-route defects found by M5

The routed qualification exposed several defects that lower-level relationship tests could not detect.

### 2.1 NPC detail route overwrote New Game onboarding state

The routed NPC detail screen re-ran full NPC initialization on mount. New Game deliberately seeds Willow alone with reset relationship state; the route-level fetch could silently replace that controlled onboarding state with the complete NPC catalog.

**Correction:** the routed detail screen now uses the already-initialized store instead of fetching the catalog again.

### 2.2 The actual route lacked Dialogue and Relationship surfaces

The live `/game/npcs/:npcId` detail route did not expose the new Dialogue and Relationship surfaces even though other NPC panel code did.

**Correction:** the normal routed tab set now includes:

```text
Overview / Dialogue / Relationship / Quests / Traits / Trade
```

### 2.3 Coarse legacy gates blocked the new causal path

Quest and Trait tabs were still gated by raw Affinity or legacy `connectionDepth`, making a fresh migrated Willow relationship inaccessible from Connection 0.

**Correction:** migrated relationships expose Dialogue, Relationship, Quests, and Traits immediately; authored content and Trait-specific evidence gates determine actual availability.

### 2.4 Overview taught the legacy Affinity-grind mental model

Overview still exposed a generic `Interact` action that granted +10 Affinity and described Dialogue/Quest access through Affinity thresholds.

**Correction:** migrated Overview explicitly states that Affinity is current disposition, not Connection XP, and points the player toward meaningful Dialogue/Quest history.

### 2.5 Relationship causality existed only in Debug

The new model was mechanically real but the normal player could not inspect why Connection or passive Essence changed.

**Correction:** migrated NPCs now have a normal player-facing Relationship summary showing:

- Connection and bond interpretation;
- Affinity, Trust, Understanding, Shared Meaning, Reciprocity;
- progress toward the next Connection level;
- the warning that progress alone is insufficient;
- evidence that qualified the current level;
- landmark Memories;
- recent meaningful Experiences;
- passive Essence contribution and explanation.

### 2.6 New Game did not fully reset onboarding-affecting state

Existing Essence, Inventory, Quest state, selected-NPC state, and Copies could leak into a fresh Willow run.

**Correction:** New Game now clears those in-memory systems and rebuilds canonical quest definitions before Willow seeding.

### 2.7 MUI tab composition made Quests/Traits visually clickable but functionally inert

Disabled-capable tabs had been wrapped as:

```text
Tooltip
  -> span
     -> Tab
```

MUI `Tabs` expects its `Tab` children directly. The wrappers received Tabs-internal props and clicking Quests/Traits could leave Dialogue selected.

**Correction:** `Tab` elements are direct `Tabs` children; lock explanations use accessible labels rather than wrapper structure.

### 2.8 CRA/Jest setup drift blocked routed UI qualification

The repository's Jest-DOM setup existed under `src/tests/setupTests.ts`, while Create React App automatically loads `src/setupTests.ts`. The setup also referenced the removed Jest-DOM v6 `extend-expect` subpath.

**Correction:** CRA now loads the setup and the package is imported through `@testing-library/jest-dom`.

---

## 3. Automated routed qualification

`src/features/Relationships/state/RelationshipFreshGame.test.tsx` renders the real routed `NPCPanelContainer` with the real Redux root reducer.

It does not inject authored relationship events directly.

The test traverses normal player-facing controls:

1. initialize canonical Traits/Quests;
2. execute New Game reset + Willow seed;
3. enter Willow's actual NPC route at Connection 0;
4. select **Dialogue**;
5. answer `She Saw Through the Question`;
6. receive `The First Lesson`;
7. verify Connection I derives from authored evidence;
8. accept `A Seed of Potential`;
9. select **Quests**;
10. accept `The Ancient Seed`;
11. choose **Awaken the Seed**;
12. verify `The Seed Preserved` Memory;
13. continue through `Willow Disagrees`;
14. continue through `Three Nights of Teaching`;
15. complete `The Lesson Made Yours` through the explanatory response;
16. verify Connection II + 100% assimilation + application Memory evidence;
17. select **Relationship** and verify causal/passive-Essence explanation is rendered;
18. simulate ordinary passive game time until enough Essence exists;
19. select **Traits**;
20. open the normal `WillowsWisdom` Resonate confirmation;
21. confirm permanent Resonance;
22. verify permanent Trait state and WE-08 authored Experience.

### Qualified assertion

The normal player route can therefore complete:

```text
meaningful choice
-> Experience
-> evidence-qualified Connection
-> Memory
-> passive relationship Essence
-> assimilation through teaching/application
-> final Essence-funded Resonance
```

without Debug/event injection.

---

## 4. Workspace causal-legibility qualification

The separate [`WorkspaceCognitiveWalkthrough.md`](WorkspaceCognitiveWalkthrough.md) reviews only player-facing Overview, Dialogue, Quest, Relationship, Memory, Experience, Trait, and Resonance-confirmation evidence.

It concludes **PASS** for the narrower claim that the intended causal model is present, coherent, non-contradictory, and reconstructible from the game itself.

Key player-facing evidence includes:

- explicit text that Affinity does not level Connection;
- explicit text that Connection progress alone is insufficient and requires meaningful Experience/Memory evidence;
- explicit description of Memories as defining relationship evidence;
- explicit description of passive Essence as an ongoing bond consequence, not scene loot;
- visible independent Connection / Assimilation / Compatibility / Memory / Essence Trait gates;
- authored teaching and independent-application scenes that give assimilation a learning referent;
- explicit final confirmation that Essence stabilizes an already-assimilated pattern rather than replacing prior evidence.

This is an analytical/cognitive-walkthrough result, not a human-subject result.

---

## 5. Human-comprehension evidence ceiling

PR #25 does **not** claim:

- that a fresh player definitely notices the explanatory surfaces;
- that onboarding is empirically intuitive;
- that terminology is optimal;
- that human comprehension has been measured.

A future human session can still reveal discoverability, salience, terminology, or mental-model failures that repository inspection cannot establish.

The permitted merge claim is:

> **The causal loop is mechanically traversable through normal UI, and the intended causal model is present and reconstructible from normal player-facing evidence.**

A future human playtest should be treated as product/usability research rather than as evidence already supplied by this PR.

---

## 6. Human-study protocol retained for future research

If a human study is later run, use a participant who:

- has not read the relationship-system design/specification;
- has not been told the Affinity/Connection/Memory/Essence/assimilation ontology in advance;
- has not watched another person complete this Willow slice.

Give only this instruction:

> Start a new game and play through Elder Willow's available content. Explore the interface however you naturally would. Please say what you think is happening when something seems important or confusing.

Do not explain the model during play.

Afterward ask, without coaching:

1. What made your relationship with Willow deepen?
2. What is the difference between Affinity and Connection?
3. What did `The Seed Preserved` Memory mean or do?
4. Why did passive Essence generation change?
5. Why wasn't `WillowsWisdom` available to permanently Resonate at the beginning?
6. What did teaching and independent application contribute?
7. What role did Essence play in final Resonance?
8. Did the game ever contradict the explanation you had formed?
9. If a rival disliked you but became deeply important, what would you expect Affinity and Connection to do?

The future study should judge the participant's causal model, not exact vocabulary.

---

## 7. M5 conclusion

### Workspace-qualified

- **Routed mechanical playability:** PASS.
- **Player-facing causal legibility:** PASS.
- **Human-subject comprehension:** not claimed / deferred.

This boundary is intentional. Weakening the claim makes the evidence honest while allowing engineering to proceed without pretending the workspace can manufacture an independent human participant.