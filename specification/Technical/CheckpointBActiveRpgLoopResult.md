# Checkpoint B — Active RPG Loop Result

**Verdict:** `CHECKPOINT_B_WEAK`  
**Technical composition:** WEAK  
**Player-facing coherence:** WEAK  
**M20 authorization:** **NOT AUTHORIZED**  
**Baseline:** `e73f7ccb08752dfbb9b03749950b8208fd91eefe`  
**Baseline tree:** `e085de1f2efbabf53b401496cd78deb907522829`  
**Evaluation contract:** `CheckpointBActiveRpgLoop.md`

## Evaluation question

> Do the qualified Relationship, Trait, Quest, Combat, Exploration, Tether, and Essence capabilities compose into a coherent active RPG loop in which player decisions have understandable causes, meaningful tradeoffs, and visible consequences?

## Overall result

**Not yet strongly enough to authorize automation.**

The repository now contains a surprisingly coherent set of compatible active-RPG authorities, and several parts of the Willow route are already genuinely production-linked rather than being isolated test fixtures. However, two important world-presence boundaries remain bypassable in normal UI/runtime composition:

1. the M17 combat encounter is globally surfaced from the Dashboard whenever its `KILL` quest is active, regardless of `Player.location`;
2. discovered NPCs remain globally selectable/interactable, while the existing `same_location` NPC filter compares legacy descriptive `NPC.location` strings against canonical M18 Player location IDs.

Those gaps mean M18/M19 space is real for Travel, Quest location objectives, Tether, and Essence, but **space does not yet consistently govern where the player can fight or actively interact with anchored NPCs**.

This is not an architectural collapse. The needed correction appears bounded: active-play availability must consume the canonical world facts that now already exist. But the checkpoint contract says that a missing bounded integration contract is enough to prevent a technical PASS, and the roadmap requires the active RPG loop to pass before M20 automation begins.

Therefore:

```text
CHECKPOINT_B_WEAK
bounded active-loop integration repair required
M20 not authorized
```

## What already composes well

### 1. Relationship -> capability provenance is player-legible

`MigratedRelationshipSummary` explains Connection as evidence-qualified shared history, displays landmark Memories and recent meaningful Experiences, and shows the Relationship-derived Essence contribution with its causal factors.

`NPCTraitsTab` goes further for relationship-mediated Traits. Before discovery it preserves the information boundary; after discovery it explicitly shows:

- Connection requirement/current level;
- assimilation progress;
- compatibility;
- required Memory evidence;
- Essence stabilization cost.

The Resonance confirmation explicitly states that Essence is the final stabilization cost and does not replace relationship/Memory/assimilation evidence.

**Assessment:** strong technical composition; strong player-facing causal explanation.

### 2. `WillowsWisdom` retains coherent capability identity

The same permanent Trait authority is consumed by two independently qualified gameplay domains:

- M16 `The Withering Grove`: identify the deeper Essence-flow imbalance rather than merely cutting visible corrupted roots;
- M17 `The Echo Beneath the Grove`: trace the repeating feedback cycle, then disrupt it during the correct release phase.

Both uses express Willow's authored slow-pattern / systemic-causation method rather than unrelated Willow-themed bonuses.

The ordinary M16 and M17 routes remain available without the permanent Trait.

**Assessment:** strong technical and semantic coherence.

### 3. Production quest sequencing genuinely links M16 -> M17

The Willow active-play content is not only evaluator-stitched fixtures.

`quest_m16_withering_grove`:

- is a Willow SIDE quest;
- requires completion of `quest_willow_ancient_seed`;
- requires reaching `location_whispering_woods`;
- offers an ordinary resolution and an optional permanent-`WillowsWisdom` resolution;
- records different authored Willow Relationship Experiences depending on the chosen resolution.

`quest_m17_telluric_echo`:

- is a Willow SIDE quest;
- requires completion of `quest_m16_withering_grove`;
- uses the ordinary `KILL` objective for the M17 target.

`turnInQuestThunk` scans completed-quest prerequisites and adds newly unlocked quests to their giver NPC. Therefore the M16 -> M17 content sequence is a normal production quest chain.

**Assessment:** strong content continuity.

### 4. Travel -> Quest and Travel -> Tether/Essence are real

M18 player-facing travel writes canonical `Player.location` through the ordinary `setLocation` event.

That one world fact now has two separately qualified downstream consequences:

```text
Player.location
├─> existing REACH_LOCATION Quest progression
└─> M19 effective spatial Tether
    -> Relationship Essence contribution
    -> cached live Essence generation rate
```

M19 further demonstrates spatial opportunity cost between Willow and Gronk:

```text
City Center:
  Willow remote
  Gronk present

City Gate:
  Willow nearby
  Gronk nearby

Whispering Woods:
  Willow present
  Gronk remote
```

Travel does not rewrite Connection, Memories, Bond dimensions, Stability, Resonance Quality, or stored authored Tether.

**Assessment:** strong state-authority composition.

### 5. Tether/Essence explanation exists in production UI

`MigratedRelationshipSummary` renders each enabled Relationship's effective Essence rate and the selector's explanation lines, including effective Tether and whether it came from `spatial` or `authored` authority.

The Dashboard also renders aggregate live Essence generation rate.

**Assessment:** causal explanation exists, but it is split across screens; see player-facing gaps below.

### 6. Gameplay -> Relationship closure exists in bounded production slices

M16 quest resolutions record different authored Relationship Experiences. Earlier M13-M15 narrative slices also prove later story consequences consuming Relationship evidence and producing new evidence.

The active architecture therefore supports the intended feedback shape:

```text
Relationship
-> capability
-> gameplay choice
-> consequence
-> Relationship interpretation
```

Not every gameplay event must itself create Relationship evidence, and M17 appropriately feeds Quest through the ordinary Combat event bridge rather than inventing a Combat->Relationship bridge.

## Evaluation matrix

| Transition | Existing production proof | Technically integrated now? | Player-visible / understandable? | Gap class |
|---|---|---|---|---|
| Story/gameplay -> Relationship | M13-M16 production experiences | Yes | Yes in migrated Relationship summaries / quest outcomes | no material gap |
| Relationship -> permanent Trait | Willow/Elara lifecycle | Yes | Yes; Connection/assimilation/Memory/Essence blockers are shown | no material gap |
| Trait -> Quest capability | M16 | Yes | Yes when owned; unavailable Trait route is hidden | minor discoverability/presentation debt |
| Trait -> Combat capability | M17 | Yes | Yes; optional tactical actions are presented in encounter | no material capability gap |
| Travel -> Quest consequence | M18 | Yes | Yes; destination/objective state is visible | no material gap |
| Travel -> spatial Tether | M19 | Yes | Indirect; detailed cause is on Relationship screen, not Travel screen | UI/feedback gap |
| Tether -> live Essence rate | M19 | Yes | Yes in Relationship breakdown + aggregate Dashboard rate, but split across screens | UI/explainability gap |
| Combat -> Quest consequence | M17 | Yes | Yes; combat-complete panel tells player to return to giver | no material event-bridge gap |
| Gameplay consequence -> later Relationship interpretation | M13-M16 bounded slices | Yes | Bounded production content exposes it | no material architecture gap |
| World location -> Combat availability | **Missing** | **No** | Encounter can appear globally once KILL quest is active | **missing bounded integration contract** |
| World location -> anchored NPC active interaction | **Missing / legacy-conflicted** | **No** | All discovered NPCs remain globally selectable; same-location filter uses incompatible location representations | **missing bounded integration contract + legacy UI debt** |

## Structured Willow cognitive walkthrough

### Step 1 — understand the Relationship

**PASS.**

The migrated Relationship summary explains Connection, evidence, Memories, Bond dimensions, and passive Essence as consequences of the bond rather than generic approval XP.

### Step 2 — understand why `WillowsWisdom` can become permanent

**PASS.**

The NPC Trait UI explicitly exposes relationship-mediated requirements after discovery and preserves the discovery information boundary beforehand.

### Step 3 — use the capability in M16

**PASS, with minor discoverability debt.**

`The Withering Grove` requires travel to Whispering Woods. A permanent `WillowsWisdom` owner sees the alternate `Restore the Underlying Flow` resolution; a non-owner sees only the ordinary route because unavailable resolution options are filtered from the UI.

The owned-Trait route is semantically clear. The non-owner is not told that a learned capability could have created another solution, which is defensible as an information-boundary choice but weakens build-comparison legibility.

### Step 4 — see travel matter

**PASS technically; WEAK as immediate feedback.**

Travel changes canonical location, advances location objectives, and changes Willow/Gronk spatial Tether plus live Essence rate. `TravelPanel`, however, only shows current location, description, and legal direct destinations. It does not preview or summarize Tether/Essence consequences.

A player can discover the cause by opening the NPC Relationship summary, which displays the full Essence/Tether explanation, while the Dashboard shows the aggregate rate. The causal information exists but is not presented at the moment of spatial choice.

### Step 5 — proceed from M16 to M17

**PASS as quest sequencing.**

Turning in M16 unlocks the M17 Willow quest through the generic completed-quest prerequisite mechanism.

### Step 6 — fight the Echo in world context

**WEAK / integration defect.**

The fiction places the Echo near the recovering grove, but `quest_m17_telluric_echo` contains only a `KILL` objective. `ActiveQuestCombatPanel` scans active `KILL` objectives and renders any matching encounter definition from the global Dashboard. It does not consume `Player.location`.

Therefore the player may accept the Willow quest and fight the Echo while still at City Center or another authored location.

This bypasses the spatial authority that M18/M19 just established.

### Step 7 — interact with Willow as a spatial person

**WEAK / integration defect.**

`NPCListView` displays all discovered NPCs and allows selection regardless of current player location. It has an optional `same_location` filter, but that filter compares legacy descriptive `NPC.location` strings (for example `Whispering Woods - Elder Tree`) directly against canonical Player location IDs (for example `location_whispering_woods`).

M19's canonical NPC world anchors are not consumed by this UI.

Thus a player can be spatially `remote` from Willow for Tether/Essence while still opening Willow's active interaction surface as if physically present.

Browsing a known character record remotely is not itself a problem. The missing distinction is between **remote inspection of known relationship information** and **active in-person dialogue/quest/Trait interaction**.

### Step 8 — close the loop

**PASS in bounded content, not yet as one fully spatialized route.**

M16 resolutions create new Relationship Experiences, and existing Relationship/story slices establish later causal consumption. The architecture can close the social loop. What remains weak is that the active physical route can currently skip world-presence constraints during Combat and NPC interaction.

## Axis verdicts

### Technical composition — WEAK

Most domain authorities compose correctly, and there is no evidence that the active RPG architecture needs redesign. However the checkpoint contract defines WEAK when a coherent loop still requires manual stitching or a missing bounded integration contract.

Two such contracts are missing:

```text
canonical world presence -> encounter availability
canonical world presence -> anchored NPC active interaction availability
```

The presence of these bypasses prevents a technical PASS even though all underlying state authorities are compatible.

### Player-facing coherence — WEAK

The player-facing learning/capability story is strong. Quest sequencing is stronger than expected. Relationship and Essence explanations are also substantial.

But the world layer is not yet authoritative enough in the player's lived loop:

- the Echo can be fought from the wrong location;
- anchored NPCs can be actively approached from anywhere through the global NPC browser;
- the NPC `same_location` filter uses incompatible legacy/canonical representations;
- Travel does not immediately expose the relationship/Essence opportunity cost it is causing.

That is too large to call ordinary polish debt because it changes the meaning of objective space.

## Required bounded repair before re-running Checkpoint B

Checkpoint B does **not** implement this repair. It authorizes a separate bounded integration-repair milestone.

The repair should recon and qualify the smallest solution to these observed problems, without expanding into a generalized world simulation.

### Required outcome A — spatially situated encounter

The M17 Echo encounter must only become actively playable when the player is at the authored world location appropriate to the encounter.

The repair should determine the smallest generic/content contract after recon. Do not pre-commit to a generalized encounter-condition DSL.

### Required outcome B — anchored NPC active-presence boundary

For NPCs with a qualified canonical world anchor, current world presence should govern **active in-person interaction availability**.

Remote browsing of known Relationship history may remain available, but Dialogue/Quest/Trait interactions that fictionally require presence should not silently ignore the player's location unless an explicit remote-contact mechanic is later authored.

The existing `same_location` UI behavior must stop comparing incompatible descriptive/canonical location values for anchored NPCs.

### Required outcome C — bounded spatial consequence feedback

When player movement changes effective spatial Tether / Essence, the player should receive a bounded, understandable indication close enough to the travel decision that the opportunity cost is discoverable without manually auditing multiple NPC pages.

This need not become a generalized prediction engine. A small arrival/presence summary or other bounded presentation is sufficient if recon supports it.

### Required regression proof

The repair should preserve:

- M18 legal-travel authority;
- M19 derived-not-stored Tether;
- Relationship history isolation from travel;
- existing quest/combat event bridges;
- authored/static Tether fallback for unanchored Relationships;
- remote information access if deliberately distinguished from active presence;
- all accumulated M4-M19 qualification.

## Explicit non-goals for the repair

Do not use this checkpoint as justification for:

- coordinates or continuous distance;
- NPC schedules or autonomous movement;
- remote-contact simulation;
- travel time;
- pathfinding;
- generalized encounter conditions;
- world-state engine;
- new Relationship dimensions;
- Copy travel/automation;
- offline progression;
- faction or social-knowledge systems.

## Authorization marker

```text
CHECKPOINT_B_WEAK
bounded active-loop integration repair required
M20 not authorized
```

M20 may only be preregistered after the repair is separately qualified and Checkpoint B is re-run from the corrected baseline.

## Evidence ceiling

Checkpoint B establishes that the current repository has **substantial technical coherence** across Relationship, Trait, Quest, Combat, Travel, Tether, and Essence, including a real Willow M16 -> M17 content chain and strong player-facing Relationship/Trait explanation.

It also establishes, from repository-backed cognitive walkthrough evidence, that the active world loop is not yet coherent enough to authorize automation because Combat and anchored-NPC active interaction can bypass canonical world presence, while spatial opportunity-cost feedback remains split across screens.

This is not human playtesting. The checkpoint does not establish enjoyment, long-session pacing, accessibility, retention, balance quality, or external-player comprehension.
