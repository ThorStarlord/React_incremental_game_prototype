# Knowledge System Specification

**Status:** M22 bounded production authority qualified and merged; M23/M24 preserve Knowledge as a distinct authority  
**Scope:** per-NPC awareness of objective facts; not objective truth, Relationship meaning, Faction standing, or generalized epistemic simulation

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

without forcing that distinction into Relationship state, Faction standing, World State, or ad-hoc story booleans.

The core authority separation after M24 is:

```text
WORLD STATE        -> what objectively exists now
OBJECTIVE SOURCE   -> other domains may own objective events/facts
KNOWLEDGE          -> which NPC knows that fact
RELATIONSHIP       -> what shared history means between people
FACTION REPUTATION -> how an institution regards the player
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

M24 adds a separate World State authority for persistent regional conditions; it does not move this existing Player-owned objective event into World State.

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

The generic dialogue contract supports:

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

The same gates are checked in:

```text
NPCDialogueTab
+
processNPCInteractionThunk
```

so direct thunk dispatch cannot bypass an authored Knowledge prerequisite.

M22 production examples remain:

```text
valerius_m22_forge_report
-> explicit Knowledge acquisition

valerius_m22_forge_logistics
-> downstream Knowledge consumer
```

M23 adds Faction gates/effects and M24 adds World State gates/effects alongside these. Neither changes Knowledge semantics.

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

Knowledge is ordinary campaign state inside persisted Redux RootState.

M22 keeps:

```text
CURRENT_SAVE_SCHEMA_VERSION = 1
```

because the existing save envelope can carry the root without an incompatible representation change.

A current-schema save lacking the `knowledge` root is interpreted as:

```text
no recorded Knowledge facts
```

Selectors tolerate the missing root. No startup migration or Relationship/Faction/World-State reconciliation infers facts.

M21 offline settlement does not consume or mutate Knowledge. Elapsed time alone cannot teach an NPC a fact.

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

M22 qualifies:

```text
Gronk learns fact
-> no automatic Gronk Relationship change

Valerius learns fact through report
-> no automatic Valerius Relationship change

Valerius consumes known fact in later dialogue
-> no automatic Relationship change
```

A future authored event may legitimately create both Knowledge and Relationship consequences, but they must remain independently authored and authoritative.

Never use generic rules such as:

```text
high Trust -> magically knows fact
learned fact -> automatic Trust increase
```

---

## 10. Objective World State boundary after M24

Knowledge records awareness; World State records persistent objective regional conditions.

M24 now qualifies a separate root:

```text
worldState
```

with exactly two bounded Merchant District conditions:

```text
watchPresence: normal | heavy
tradeFlow: normal | strong
```

M24 proves that explicit World State mutations do not automatically grant Knowledge. Conversely, the historical M22 qualification now explicitly snapshots World State before Forge-practice Knowledge acquisition and verifies that it remains unchanged afterward.

Therefore:

```text
NPC knows fact
!=
objective regional condition changes
```

and:

```text
objective regional condition changes
!=
NPC automatically knows it changed
```

A future story may legitimately author Knowledge about a World State condition, but awareness acquisition must remain explicit and independently qualified.

M24 does **not** create a generalized WorldFacts registry, and M22's first objective Forge event remains Player-owned rather than being mechanically migrated into World State.

See `WorldStateSystem.md` and `../Technical/M24ObjectiveWorldStateResult.md`.

---

## 11. Faction boundary after M23

Knowledge does not represent institutional regard.

M23 provides first-class Faction authority.

The product can represent combinations such as:

```text
Valerius knows the player worked the forge: YES
Valerius personal Trust: high
City Watch Standing: negative
Merchant District watchPresence: independently normal or heavy
```

without deriving any value from the others.

M23's focused probes verify:

```text
Faction Reputation changes
-> Knowledge state unchanged
```

and add no generic bridge such as:

```text
Valerius knows favorable fact
-> City Watch Reputation +X
```

If a future authored event legitimately has both Knowledge and institutional consequences, they must be separate explicit effects.

See `FactionSystem.md` and `../Technical/M23FactionReputationResult.md`.

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

If future production content needs different behavior for firsthand witnessing versus reported information, that requirement should be separately preregistered and qualified before extending the schema.

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
= outside M22-M24 qualified scope
```

Do not silently reinterpret those old gates as canonical Knowledge state.

---

## 14. Current invariants

1. Objective truth and NPC awareness are different authorities.
2. One NPC knowing a fact does not cause all NPCs to know it.
3. Relationship dimensions do not imply Knowledge.
4. Knowledge acquisition does not automatically mutate Relationship state.
5. Knowledge does not represent Faction standing.
6. Faction standing does not automatically mutate Knowledge.
7. Knowledge does not represent objective World State.
8. Knowledge acquisition does not mutate M24 World State automatically.
9. World State mutation does not grant Knowledge automatically.
10. The same NPC/fact pair is stored at most once.
11. Missing legacy Knowledge state means no recorded facts, not inferred facts.
12. Offline elapsed time does not create Knowledge.
13. New-game reset clears Knowledge.
14. Generic dialogue Knowledge gates are enforced below UI as well as in presentation.
15. M22 does not introduce automatic propagation between NPCs.
16. M23 does not reinterpret Knowledge as institutional consensus.
17. M24 does not reinterpret Knowledge as objective regional state.

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
- institutional Knowledge/consensus;
- automatic Knowledge-to-Faction conversion;
- automatic Knowledge-to-World-State conversion;
- objective world simulation.

Faction Reputation and Objective World State are separate M23/M24-qualified domains rather than Knowledge features to be implemented here.

---

## 16. Qualified production path

The M22-qualified path remains:

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

M23 independently proves institutional standing can diverge from Knowledge and Relationship.

M24 independently proves objective regional conditions can diverge from all three social authorities.

See:

- `../Technical/M22SocialKnowledgePropagation.md`
- `../Technical/M22SocialKnowledgePropagationReconAmendment.md`
- `../Technical/M22SocialKnowledgePropagationResult.md`
- `FactionSystem.md`
- `../Technical/M23FactionReputationResult.md`
- `WorldStateSystem.md`
- `../Technical/M24ObjectiveWorldStateResult.md`

---

## 17. Next boundary

After the documentation-complete M24 PASS is requalified and merged, the next candidate is:

```text
M25 — Complete Chapter Vertical Slice
```

M25 must compose the already-distinct authorities rather than collapsing them:

```text
Objective World condition
!=
NPC Knowledge
!=
Personal Relationship
!=
Institutional Standing
```

M24 itself does not authorize chapter-scale implementation before merge.