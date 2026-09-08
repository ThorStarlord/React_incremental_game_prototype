# Knowledge System Specification

**Status:** M22 bounded production authority qualified behaviorally; documentation-complete exact-head qualification pending  
**Scope:** per-NPC awareness of objective facts; not objective truth, Relationship meaning, faction standing, or generalized epistemic simulation

## 1. Purpose

The Knowledge system answers one narrow question:

```text
Which NPC knows which objective fact?
```

It exists so the game can represent:

```text
an event happened
+
Gronk knows it happened
+
Valerius does not know it happened
```

without forcing that distinction into Relationship state or ad-hoc story booleans.

The core authority separation is:

```text
WORLD / source domain -> what objectively happened or exists
KNOWLEDGE             -> which NPC knows that fact
RELATIONSHIP          -> what shared history means between people
FACTION               -> how an institution regards the player
```

Knowledge must not silently absorb the responsibilities reserved for the other domains.

---

## 2. M22-qualified production fact

The first qualified fact identity is:

```text
fact_m22_player_practiced_forge_assistance
```

Meaning:

> The player personally completed the qualified City Center Forge Assistance practice event.

### Objective source

Knowledge does **not** determine whether that event happened.

Objective truth remains:

```text
Player.routineFamiliarity.forge_assistance
source = city_center_forge_assistance
```

The fact ID is therefore a stable reference for **NPC awareness of an event owned elsewhere**.

This distinction is load-bearing:

```text
fact is objectively true
!=
NPC knows fact
```

---

## 3. Runtime state

The current minimal state is:

```ts
interface KnowledgeState {
  factIdsByNpcId: Record<string, string[]>;
}
```

Root Redux key:

```text
knowledge
```

The feature supports:

- idempotently recording that one NPC knows one fact;
- querying the facts known by one NPC;
- querying whether one NPC knows one fact;
- ordinary persistence through RootState save/load;
- reset on new-game Player reset;
- one bounded direct-witness acquisition bridge.

It does not currently support fact removal.

---

## 4. Knowledge acquisition

M22 qualifies two materially different acquisition paths.

### 4.1 Direct witnessing

The existing Forge Assistance event is canonically restricted to City Center.

Gronk already has a qualified canonical anchor at City Center.

The M22 listener reacts only after:

```text
practiceForgeAssistanceThunk.fulfilled
```

and confirms:

```text
Player Forge familiarity exists
+
isPlayerAtNpcWorldLocation(Gronk, Player.location)
```

before recording:

```text
Gronk knows fact_m22_player_practiced_forge_assistance
```

The event becoming true does not broadcast it to unrelated NPCs.

### 4.2 Explicit communication/report

Valerius learns through ordinary authored dialogue:

```text
valerius_m22_forge_report
```

The report requires the objective Player Forge-familiarity event and is hidden/rejected once Valerius already knows the fact.

Its only M22 semantic effect is:

```text
KNOWLEDGE_FACT
```

for the current dialogue NPC.

Thus direct witnessing and explicit reporting share the same canonical knowledge storage while remaining distinct acquisition mechanisms.

---

## 5. Dialogue integration

The generic dialogue contract now supports:

```ts
requiredRoutineFamiliarityIds?: RoutineFamiliarityId[];
requiredKnowledgeFactIds?: string[];
forbiddenKnowledgeFactIds?: string[];
```

and the effect:

```ts
{
  type: 'KNOWLEDGE_FACT';
  factId: string;
}
```

### Availability authority

The same gates are checked in:

```text
NPCDialogueTab
+
processNPCInteractionThunk
```

This prevents presentation-only enforcement.

A direct thunk dispatch cannot bypass an authored knowledge prerequisite.

### M22 report topic

```text
valerius_m22_forge_report
```

requires:

```text
Player routine familiarity: forge_assistance
```

and forbids:

```text
Valerius already knows fact_m22_player_practiced_forge_assistance
```

### M22 downstream consumer

```text
valerius_m22_forge_logistics
```

requires:

```text
Valerius knows fact_m22_player_practiced_forge_assistance
```

It is the first qualified production example of later content reading Knowledge authority directly.

---

## 6. Idempotence

Knowledge acquisition is idempotent.

For one NPC/fact pair:

```text
learn fact
learn same fact again
-> one stored fact ID
```

The reducer remains safe even if called repeatedly.

Authored report content may additionally use one-shot dialogue/completion rules and `forbiddenKnowledgeFactIds` for player-facing clarity, but storage correctness does not depend on those UI/content guards.

---

## 7. Persistence

Knowledge is ordinary campaign state inside the persisted Redux RootState.

M22 keeps:

```text
CURRENT_SAVE_SCHEMA_VERSION = 1
```

because the existing save envelope can carry the new root without an incompatible representation change.

### Legacy-like state

A current-schema save lacking the `knowledge` root is interpreted as:

```text
no recorded Knowledge facts
```

Selectors are tolerant of the missing root.

No startup migration or Relationship reconciliation infers facts.

### Offline progress

M21 offline settlement does not consume or mutate Knowledge.

Elapsed time alone cannot teach an NPC a fact.

---

## 8. New-game reset

Knowledge belongs to a playthrough.

The Knowledge reducer clears its state when the existing Player reset runs for new-game initialization.

This preserves:

```text
new campaign
-> no knowledge inherited from previous campaign
```

---

## 9. Relationship boundary

Knowledge is not Relationship state.

M22 qualifies all of the following:

```text
Gronk learns fact
-> no automatic Gronk Relationship change

Valerius learns fact through report
-> no automatic Valerius Relationship change

Valerius consumes known fact in later dialogue
-> no automatic Relationship change
```

A future authored event may legitimately create both:

```text
Knowledge consequence
+
Relationship Experience
```

when the story supports both.

If so, they must remain independently authored and independently authoritative.

Never use:

```text
high Trust -> magically knows fact
```

or:

```text
learned fact -> automatic Trust increase
```

as generic rules.

---

## 10. Objective-world boundary

Knowledge records awareness, not reality.

The first qualified fact references an objective event already owned by Player routine familiarity.

M22 does not introduce:

- a generalized WorldFacts registry;
- trade-flow state;
- watch-presence state;
- infrastructure state;
- regional simulation;
- encounter-condition storage.

M24 remains responsible for proving persistent objective regional World State.

---

## 11. Faction boundary

Knowledge does not represent institutional regard.

M22 adds no faction-standing authority.

The model must be able to support future combinations such as:

```text
Valerius knows the player worked the forge: YES
Valerius Trust: +60
City Watch Standing: -20
```

without forcing any value to derive from the others.

M23 remains responsible for first-class Faction Reputation.

---

## 12. No provenance in persistent state yet

M22 exercises two acquisition mechanisms:

```text
witnessed
reported
```

but does not persist that provenance.

Current downstream content needs only:

```text
knows / does not know
```

Adding persistent provenance now would be speculative.

If future production content needs different behavior for:

```text
Valerius saw it himself
```

versus:

```text
Valerius was told
```

that requirement should be separately preregistered and qualified before extending the schema.

---

## 13. Historical pre-M22 knowledge-shaped content

Older content contains causal ordering that resembles knowledge but predates a Knowledge domain.

Notable M13 example:

```text
silas_exp_watch_leak_traced
-> valerius_leak_rumor
```

Those Relationship Experiences also encode legitimate interpersonal history, so they cannot safely be replaced mechanically with Knowledge flags.

Current status:

```text
historical M13/M14/M15 awareness normalization
= explicit migration/design debt
= outside M22 qualified scope
```

Do not treat those old gates as proof that Knowledge is unnecessary, and do not silently reinterpret them as canonical M22 fact state.

---

## 14. Current invariants

1. Objective truth and NPC awareness are different authorities.
2. One NPC knowing a fact does not cause all NPCs to know it.
3. Relationship dimensions do not imply Knowledge.
4. Knowledge acquisition does not automatically mutate Relationship state.
5. Knowledge does not represent Faction standing.
6. Knowledge does not represent objective regional World State.
7. The same NPC/fact pair is stored at most once.
8. Missing legacy Knowledge state means no recorded facts, not inferred facts.
9. Offline elapsed time does not create Knowledge.
10. New-game reset clears Knowledge.
11. Generic dialogue knowledge gates must be enforced below UI as well as in presentation.
12. M22 does not introduce automatic propagation between NPCs.

---

## 15. Explicit non-goals

The current Knowledge system does not provide:

- rumor graphs;
- global gossip;
- automatic NPC-to-NPC propagation;
- misinformation;
- lies/deception simulation;
- belief confidence;
- truth confidence;
- forgetting;
- knowledge decay;
- inference rules;
- theory-of-mind;
- recursive knowledge;
- player Knowledge as a separate modeled domain;
- generalized fact catalogs;
- faction reputation;
- objective world-state simulation.

These are not missing implementation details required to complete M22. They are intentionally outside its evidence ceiling.

---

## 16. Qualified production path

The currently qualified path is:

```text
City Center Forge practice
-> Player objective familiarity
-> Gronk direct witness Knowledge
-> Valerius remains ignorant
-> save/load preserves divergence
-> explicit Valerius report
-> Valerius Knowledge
-> Valerius knowledge-gated logistics dialogue
```

See:

- `../Technical/M22SocialKnowledgePropagation.md`
- `../Technical/M22SocialKnowledgePropagationReconAmendment.md`
- `../Technical/M22SocialKnowledgePropagationResult.md`

---

## 17. Next domain boundary

A qualified merged M22 PASS enables the next candidate:

```text
M23 — Faction Reputation
```

M23 must preserve:

```text
Personal Relationship
!=
NPC Knowledge
!=
Institutional Standing
```

and must receive its own preregistration/recon before implementation.
