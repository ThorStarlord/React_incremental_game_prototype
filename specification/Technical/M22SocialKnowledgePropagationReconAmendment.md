# M22 — Social Knowledge Propagation Recon Amendment

**Status:** FROZEN AFTER RECON — before behavior implementation  
**Preregistration:** `M22SocialKnowledgePropagation.md`  
**Preregistration commit:** `492e82afe91a84ac4a2a6efebce049e1408ba2c2`  
**Frozen baseline:** `092b91d947e9ad71b3a79569f8e97ab990c64639`  
**Baseline tree:** `e9193e77bccd55b1186b0f6326e53b2c117615a3`

---

## 1. Recon conclusion

M22 does **not** need a new objective world-fact engine.

The smallest honest production proof can reuse the already-qualified one-time active Forge Assistance practice as objective event truth:

```text
Player.routineFamiliarity.forge_assistance exists
+
source = city_center_forge_assistance
-> objective event: player personally practiced Forge Assistance in City Center
```

That event is already:

- player-driven;
- location-bound to canonical `location_city_center`;
- persisted in Player state;
- one-time/idempotent;
- independent of Relationship state;
- already qualified by the Checkpoint C repair.

M22 will therefore reference this existing objective authority rather than creating `WorldFacts`, a story-boolean registry, or an M24-like world-state substrate.

---

## 2. Direct-witness authority

Qualified M19/Checkpoint-B authority already anchors:

```text
npc_blacksmith_gronk -> location_city_center
```

`practiceForgeAssistanceThunk` already rejects unless the player is canonically in City Center.

Therefore M22 freezes the direct-witness acquisition path as:

```text
successful Forge Assistance practice
+
Gronk canonical world anchor co-present with Player.location
-> Gronk learns FACT_FORGE_ASSISTANCE_PRACTICED
```

The implementation must call the existing canonical presence authority (`isPlayerAtNpcWorldLocation`) rather than hard-code `true` or infer witnessing from Relationship state.

If Gronk is not legitimately co-present according to that authority, no witness knowledge may be granted.

No new NPC anchor is added by M22.

---

## 3. Frozen fact identity

M22 freezes exactly one production fact:

```text
fact_m22_player_practiced_forge_assistance
```

Semantic meaning:

> The player personally completed the qualified City Center Forge Assistance practice event.

Objective truth remains the existing Player routine-familiarity record. The fact ID is the stable **knowledge reference** for NPC awareness of that event; it is not a second source of objective truth.

M22 will not create a generalized fact catalog unless implementation proves one is mechanically necessary. The preferred representation is a constant exported by the Knowledge feature.

---

## 4. Knowledge ownership and minimal state

A first-class `Knowledge` Redux feature will own only per-NPC awareness:

```ts
interface KnowledgeState {
  factIdsByNpcId: Record<string, string[]>;
}
```

Root key:

```text
knowledge
```

Required operations:

```text
learn fact for NPC (idempotent)
query whether NPC knows fact
query fact IDs known by NPC
```

No removal operation is required.

No provenance is stored.

The current production consumer needs only:

```text
knows / does not know
```

and does not need to distinguish `witnessed` from `reported` after acquisition. Acquisition provenance remains demonstrated by the action path and test evidence, not duplicated in persistent state.

---

## 5. Persistence decision

Current save envelopes serialize the full Redux state and schema validation only requires recognizable root Player/Meta state. M22 can therefore persist the new root Knowledge slice without a save-schema version bump.

Frozen policy:

```text
CURRENT_SAVE_SCHEMA_VERSION remains 1
```

For an old/current-schema save whose serialized RootState lacks `knowledge`:

```text
missing knowledge root
-> treated as empty knowledge
-> no fact is reconstructed
```

Selectors and runtime checks must tolerate an absent legacy-like knowledge root until the combined reducer initializes it on ordinary subsequent actions.

Offline elapsed time does not teach facts.

No load-time knowledge reconciliation or inference is introduced.

---

## 6. Explicit communication/report path

M22 will use existing data-driven NPC dialogue as the second acquisition mechanism.

Target NPC:

```text
npc_captain_valerius
```

New one-shot production topic:

```text
valerius_m22_forge_report
```

Availability prerequisite:

```text
Player.routineFamiliarity.forge_assistance
```

This is an objective-event prerequisite, not a Relationship prerequisite and not a claim that Valerius already knows.

Selecting the authored report response will apply one new generic dialogue effect:

```text
KNOWLEDGE_FACT
```

with:

```text
factId = fact_m22_player_practiced_forge_assistance
```

and the current dialogue NPC as target.

Result:

```text
Valerius ignorant
-> player explicitly reports practiced Forge Assistance
-> Valerius knows fact
```

The report node contains no Affinity/Relationship Experience effect.

---

## 7. Downstream canonical knowledge consumer

M22 will add a second Valerius production topic:

```text
valerius_m22_forge_logistics
```

It must be unavailable until:

```text
selectNpcKnowsFact(state, npc_captain_valerius, fact_m22_player_practiced_forge_assistance)
```

is true.

The node will use a generic authored gate:

```text
requiredKnowledgeFactIds
```

where the IDs refer to facts known by the current dialogue NPC.

This is the required downstream consumer.

The consumer should contain ordinary authored dialogue content but no automatic Relationship effect. Its role is to prove that later production content changes because **Valerius knows**, not because the player possesses Forge familiarity or a Relationship Experience.

---

## 8. Dialogue contract additions

`DialogueNode` will gain only the gates required by the two production nodes:

```ts
requiredRoutineFamiliarityIds?: RoutineFamiliarityId[];
requiredKnowledgeFactIds?: string[];
forbiddenKnowledgeFactIds?: string[];
```

Semantics:

- `requiredRoutineFamiliarityIds`: all listed objective Player routine-familiarity records must exist;
- `requiredKnowledgeFactIds`: current NPC must know all listed facts;
- `forbiddenKnowledgeFactIds`: current NPC must know none of the listed facts.

The report node uses:

```text
requiredRoutineFamiliarityIds = [forge_assistance]
forbiddenKnowledgeFactIds = [fact_m22_player_practiced_forge_assistance]
```

so an already-informed Valerius does not offer a redundant report action even if the one-shot completion record is absent in a reconstructed test state.

The downstream logistics node uses:

```text
requiredKnowledgeFactIds = [fact_m22_player_practiced_forge_assistance]
```

These gates must be enforced both:

- in `NPCDialogueTab` presentation availability;
- below UI inside `processNPCInteractionThunk`.

---

## 9. New dialogue effect

`DialogueEffect` gains one bounded effect:

```ts
{
  type: 'KNOWLEDGE_FACT';
  factId: string;
}
```

The target is the current dialogue NPC.

M22 does not introduce arbitrary target NPC IDs, broadcast effects, rumor propagation, or chained dissemination.

The effect dispatches the idempotent Knowledge reducer.

---

## 10. Relationship boundary

The chosen fact has no Relationship consequence.

Required invariant for the direct-witness and report paths:

```text
knowledge changes
-> Relationship state unchanged
```

Existing Forge practice already changes Player Gold and routine familiarity by its previously qualified contract. M22 adds Gronk witness knowledge without adding a Gronk Relationship Experience, Affinity, Trust, Bond, Connection, or Memory mutation.

Valerius report likewise adds only Valerius knowledge plus ordinary dialogue completion/history already owned by the NPC dialogue runtime.

Dialogue history/completion state is not Relationship authority.

---

## 11. Historical M13 seam found during recon

Recon found an important older knowledge-shaped pattern:

```text
silas_exp_watch_leak_traced
-> exposes valerius_leak_rumor
```

and the stronger `valerius_delegated_leak_response` currently consumes both traced Silas evidence and Valerius Relationship evidence.

This is historical pre-M22 content in which Relationship evidence controls access to a cross-NPC report sequence. It is useful evidence for why a Knowledge domain is needed, but M22 will **not** rewrite M13 semantics opportunistically inside the first Knowledge proof.

Reason:

- `silas_exp_watch_leak_traced` also carries legitimate relational interpretation with Silas;
- converting the whole M13/M14/M15 chain would widen M22 into historical narrative migration;
- the preregistered milestone requires one bounded Rule-of-Two production proof, not whole-campaign knowledge normalization.

M22 therefore makes a narrower claim:

> the new Forge fact has one canonical Knowledge authority and no parallel shadow flag.

The M13 seam remains explicit migration/design debt for later content reconciliation and is outside the M22 PASS claim. M22 must not cite historical M13 Relationship gates as evidence that Valerius knows the new Forge fact.

---

## 12. Faction/M23 boundary

Quest data currently contains legacy `REPUTATION` reward labels, but the current Quest reward adapter maps them into NPC Relationship updates rather than a first-class faction-standing authority.

M22 does not modify or normalize that legacy behavior.

No new faction slice, standing value, City Watch institutional reputation, or M23 gate is introduced.

---

## 13. World-State/M24 boundary

M22 adds no regional condition state.

It does not add:

- trade flow;
- watch presence;
- infrastructure condition;
- merchant availability state;
- encounter-state simulation;
- generalized `WorldFacts` or `WorldState` registry.

Objective event truth for the chosen fact remains Player Forge routine familiarity.

---

## 14. Production authoring

Valerius will advertise two additional authored dialogue IDs in ordinary NPC data:

```text
valerius_m22_forge_report
valerius_m22_forge_logistics
```

The nodes live in ordinary dialogue data.

No M22-specific screen or debug-only interaction is permitted as qualification evidence.

---

## 15. Dedicated qualification

The focused M22 suite will prove at least:

1. before Forge practice, objective familiarity absent and both Gronk/Valerius ignorant;
2. Forge practice outside City Center rejects and teaches nobody;
3. successful City Center Forge practice establishes existing objective familiarity;
4. canonical Gronk co-presence causes Gronk to learn the M22 fact;
5. Valerius remains ignorant;
6. Relationship state is unchanged by the new witness acquisition;
7. repeated fact grant is idempotent;
8. save/load preserves Gronk-known / Valerius-ignorant divergence;
9. legacy-like state missing `knowledge` remains empty and gains no fact from offline time;
10. Valerius report node is unavailable before objective Forge familiarity;
11. below-UI dispatch of report before prerequisite rejects;
12. after Forge familiarity, report becomes available;
13. selecting report teaches Valerius exactly once;
14. report itself does not mutate Relationship authority;
15. downstream logistics topic is unavailable while Valerius ignorant;
16. same downstream topic becomes available after Valerius knowledge changes;
17. below-UI downstream interaction rejects while ignorant and succeeds while informed;
18. Knowledge does not create Faction or World-State authority;
19. Gronk witness knowledge alone does not globally propagate to Valerius;
20. ordinary existing M20/Checkpoint-C Forge behavior remains intact.

---

## 16. Build Validation

Add an additive gate:

```text
M22 social knowledge propagation qualification
```

Preserve all current gates:

```text
TypeScript
Checkpoint C repair qualification
M21
M20
Active-loop repair
modified historical qualification
accumulated M4-M19 baseline qualification
production build
```

No historical gate may be removed to make M22 pass.

---

## 17. Evidence ceiling if implementation qualifies

The maximum M22 claim will be:

> The existing objective City Center Forge-practice event can make canonically co-present Gronk know a stable fact while Valerius remains ignorant; ordinary save/load preserves that divergence; an explicit one-shot Valerius report transfers the same fact; and a later data-driven Valerius topic consumes canonical Knowledge rather than Relationship state, with no automatic Relationship, Faction, or World-State mutation.

This does not qualify historical M13 knowledge migration, rumor propagation, misinformation, confidence, forgetting, epistemic inference, player knowledge, faction standing, objective regional world state, or complete chapter integration.
