# M17 — Narrow Combat Vertical Slice Reconnaissance Amendment

**Status:** Frozen after preregistration and before behavioral implementation  
**Preregistration commit:** `d4ed04bae96e85ac6782f8bfa675115d72da90e2`  
**Baseline:** `cc5b6d352edfbd435ee08517fa6c5cf6b95b5688` / tree `bf7dbcc82575b2698fd915f3cc4ae41dc75c0aac`

## 1. Semantic-fit gate — PASS

`WillowsWisdom` fits the intended encounter without becoming an arbitrary Willow-themed combat power.

The qualified capability identity is slow-pattern / systemic-causation recognition. The Telluric Echo is authored as a manifestation sustained by a repeating Essence feedback cycle. Permanent Willow's Wisdom therefore exposes the *possibility of reading and interrupting that cycle*; it does not grant damage, elemental power, or automatic victory.

The semantic mapping is:

```text
Willow's Wisdom
-> recognize a repeating systemic feedback pattern
-> perceive a tactical window
-> choose whether to spend tempo exploiting it
```

not:

```text
Willow taught nature
-> special combat spell
```

## 2. Combat substrate finding

At baseline `CombatSlice.ts` contains no state and only the event action:

```text
targetKilled({ targetId })
```

More importantly, the combat reducer is **not registered in `src/app/store.ts`**. Existing combat is an event-bus surface only.

Registering stateful combat now would change `RootState`, which is serialized wholesale by the current save envelope. Historical/current saves are validated only coarsely as RootState-like and therefore would not automatically gain a new combat key during migration.

### Architecture decision

M17 will **not** register persistent Combat Redux state and will not change the save schema.

The bounded encounter will use a Combat-owned deterministic transient state machine, consumed by a production React component. Permanent Trait ownership still comes from Redux `player.permanentTraits`; victory still dispatches the existing `targetKilled` event into Redux.

Evidence ceiling consequence: M17 does not qualify mid-combat persistence or campaign combat-state persistence.

## 3. Existing downstream bridge — reuse

`GameEventListeners.ts` already consumes `targetKilled` and advances matching active `KILL` objectives. No Combat -> Quest runtime bridge is required.

The M17 quest will use:

```text
KILL target = enemy_m17_telluric_echo_fragment
```

The production encounter victory will emit that target id exactly once.

## 4. Production quest availability

The M17 quest will be authored as a normal Willow SIDE quest with prerequisite:

```text
QUEST_COMPLETED = quest_m16_withering_grove
```

Existing `turnInQuestThunk` already scans all quests after completion and makes any quest whose `QUEST_COMPLETED` prerequisite matches available on its giver NPC.

Therefore M17 needs no new NPC startup quest flag or new quest-unlock runtime semantic.

## 5. Encounter launch surface

M17 needs a player-facing production combat surface, but one case does not justify a new route, combat-navigation subsystem, or quest-action DSL.

The minimal production adapter will:

1. inspect active Quest `KILL` objectives;
2. look up a known Combat encounter definition for the objective target;
3. render the corresponding generic Combat encounter panel on the Dashboard.

The generic launch surface must not contain Willow, M17 quest, or Telluric Echo ids. Those ids belong only to authored encounter/quest definitions and tests.

## 6. Permanent-Trait requirement abstraction

M16 already qualified `requiredPermanentTraitIds` for Quest resolutions through a pure availability helper.

M17 independently needs the same semantic in a second gameplay domain (Combat): all listed required permanent Traits must exist in `player.permanentTraits`.

This justifies a **bounded positive extraction** of the pure permanent-Trait predicate into the Trait domain, reused by Quest and Combat.

It does **not** justify:

- any-of / forbidden Trait logic;
- temporary/equipped capability equivalence;
- stat checks;
- skill checks;
- boolean condition AST;
- generalized ability registry.

## 7. Deterministic encounter arithmetic

M17 freezes encounter-local tactical values rather than making the legacy Player stat model authoritative.

### Initial state

```text
Player encounter HP: 12 / 12
Echo HP:             12 / 12
Enemy phase:         stable
Feedback disrupted:  false
Pattern read:        false
```

### Ordinary action

`Strike`

```text
4 damage to Echo
if Echo reaches 0: victory immediately, before enemy response
```

`Guard`

```text
0 outgoing damage
enemy response damage reduced by 2, minimum 0
```

### Enemy phase cycle

```text
stable
  attack 2
  -> building

building
  attack 3
  -> release

release
  attack 1
  regenerate 4 unless feedback has been permanently disrupted
  -> stable
```

### Trait actions

`Trace the Cycle`

```text
requires permanent WillowsWisdom
requires patternRead = false
no outgoing damage
patternRead = true
enemy responds normally
```

`Disrupt the Feedback`

```text
requires permanent WillowsWisdom
requires patternRead = true
requires current phase = release
no outgoing damage
feedbackDisrupted = true permanently for this encounter
enemy performs the release attack, but no regeneration occurs
phase advances normally
```

The Trait therefore changes the enemy's future tactical behavior only after the player has spent tempo reading the pattern and used the action in the correct phase.

## 8. Precomputed no-Trait control

One valid deterministic control sequence:

```text
start: P12 / E12 / stable

R1 Strike
E8; enemy stable attack 2 -> P10; phase building

R2 Guard
E8; building attack 3 reduced to 1 -> P9; phase release

R3 Strike
E4; release attack 1 -> P8; regenerate 4 -> E8; phase stable

R4 Strike
E4; stable attack 2 -> P6; phase building

R5 Guard
E4; building attack 3 reduced to 1 -> P5; phase release

R6 Strike
E0 -> immediate victory before release response

result: victory in 6 rounds with 5 encounter HP remaining
```

This proves the Trait is not required for victory.

## 9. Precomputed Willow route

One valid Trait sequence:

```text
start: P12 / E12 / stable

R1 Strike
E8; stable attack 2 -> P10; phase building

R2 Trace the Cycle
patternRead = true; building attack 3 -> P7; phase release

R3 Disrupt the Feedback
feedbackDisrupted = true; release attack 1 -> P6; no regeneration; phase stable

R4 Strike
E4; stable attack 2 -> P4; phase building

R5 Strike
E0 -> immediate victory

result: victory in 5 rounds with 4 encounter HP remaining
```

The Trait route is therefore not universally superior:

- it is faster by one round;
- it leaves less HP in this frozen line because tracing the cycle accepts unguarded tempo risk;
- a player who owns Willow's Wisdom may rationally ignore it and use the safer control line.

This is the intended Checkpoint-A tradeoff proof.

## 10. Runtime action authority

Both UI availability and action execution will use the same Combat-owned validation path.

Invalid action attempts must return a rejected result without changing encounter state.

Required invalid cases include:

- Trace without permanent `WillowsWisdom`;
- Trace after the pattern is already read;
- Disrupt without permanent `WillowsWisdom`;
- Disrupt before tracing;
- Disrupt outside the release phase;
- any action after victory/defeat.

## 11. Save/load boundary

Because combat state is transient and not registered in RootState, M17 will test:

```text
permanent WillowsWisdom
-> createSave
-> loadSavedGameWithMigration
-> replaceState
-> begin fresh M17 encounter
-> Trait action available
```

M17 will not save an active encounter.

## 12. Architecture finding to test

Expected finding if M17 passes:

> A stateful combat proof does not yet require persistent Combat Redux state. A transient Combat-owned deterministic state machine can consume authoritative permanent Trait state, emit ordinary combat events, and integrate with Quest while preserving the current save schema.

This is deliberately a bounded finding, not a permanent prohibition on future stored combat state.
