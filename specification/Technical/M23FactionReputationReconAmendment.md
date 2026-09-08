# M23 — Faction Reputation Recon Amendment

**Status:** Frozen after repository recon and before behavior changes  
**Preregistration:** `specification/Technical/M23FactionReputation.md`  
**Preregistration commit:** `1d3fa05070c97a9a01ffd16ea5035e18af3b24f3`  
**Frozen baseline:** `6770df0ffd1d59cd3218af91cdcf7e241910c435`  
**Frozen baseline tree:** `2a9378016e6d3a58fec60e8e937ecf6030beb424`

---

## 1. Recon verdict

M23 may proceed as a bounded code-bearing milestone.

The repository does **not** currently have first-class faction reputation authority, but it already contains three partial substrate shapes:

1. NPC definitions carry display/identity faction strings such as `City Watch` and `Merchants Guild`;
2. `QuestReward` already permits `{ type: 'REPUTATION', value, faction }`;
3. old `relationshipConstants.ts` contains reputation bands and faction ally/rival spillover data.

Only the first two are relevant substrate for M23.

The old reputation/spillover constants are dormant and currently unused by production runtime. M23 will **not activate them**. Doing so would exceed the preregistered boundary by introducing allied/rival propagation and a broader faction-simulation model.

---

## 2. Critical semantic defect found

`QuestReward.type === 'REPUTATION'` currently ignores `reward.faction`.

The current quest reward runtime instead executes:

```text
REPUTATION reward
-> updateNPCRelationshipThunk(quest.giver)
-> personal NPC Affinity
```

Therefore a production reward such as:

```json
{ "type": "REPUTATION", "value": 15, "faction": "City Watch" }
```

currently means "change the giver NPC's personal relationship" despite being authored as institutional reputation.

This is the exact authority conflation M23 is intended to resolve.

M23 will normalize **faction-tagged `REPUTATION` rewards** into first-class faction standing rather than preserve this false semantic alias.

---

## 3. Current production `REPUTATION` inventory

`public/data/quests.json` contains exactly two production `REPUTATION` rewards, and both are explicitly faction-tagged:

```text
quest_valerius_patrol_duty
+10 City Watch

quest_m13_break_merchant_leak
+15 City Watch
```

There is also a programmatically-created quest path in `QuestThunks.ts` carrying:

```text
+10 Adventurer's Guild
```

That path will inherit the corrected generic reward routing but is **not** part of the M23 Rule-of-Two production claim.

No production `REPUTATION` reward without a `faction` was found during recon.

---

## 4. Frozen faction identities

For this bounded milestone, the existing NPC `faction` strings are the canonical faction identifiers.

The two qualified institutions will be:

```text
City Watch
Merchants Guild
```

Existing production membership already supplies:

```text
npc_captain_valerius -> City Watch
npc_blacksmith_gronk -> Merchants Guild
```

M23 will not introduce a generalized faction registry or rename these identities.

---

## 5. Frozen state model

Add one root Redux domain:

```ts
FactionState {
  reputationByFactionId: Record<string, number>
}
```

Missing entries mean neutral standing:

```text
0
```

The domain owns only institutional standing.

It will expose:

```text
adjustFactionReputation({ factionId, amount })
resetFactionReputation()
selectFactionReputation(state, factionId)
```

No reputation bands, labels, ally/rival spillover, decay, provenance ledger, diplomacy graph, or faction-to-faction propagation are qualified by M23.

---

## 6. Persistence and new-game semantics

The existing save envelope persists full `RootState`.

M23 will keep save schema v1 unchanged.

A current/legacy-like save missing the new `factions` root must be interpreted by selectors as neutral standing (`0`), not as inferred standing from NPC Relationships.

As with M22 Knowledge, `resetPlayerState` will reset faction standing so institutional state cannot leak across campaigns.

---

## 7. Quest reward normalization

`QuestReward` already has optional `faction?: string`.

The frozen M23 rule is:

```text
REPUTATION + non-empty faction
-> adjust that faction's standing
-> do NOT call updateNPCRelationshipThunk
```

Because recon found no production factionless `REPUTATION` reward, M23 does not need to preserve factionless `REPUTATION` as a new personal-relationship authoring path.

If a factionless value is encountered, the runtime should not silently convert it into personal Relationship state. It should remain a non-applied/unsupported reward rather than perpetuate the conflation.

Relationship consequences must continue to be authored explicitly through Relationship Experience or deliberate legacy Affinity effects.

---

## 8. Generic dialogue integration

M23 will extend the existing data-driven dialogue contract with one effect and one gate.

### Effect

```ts
{
  type: 'FACTION_REPUTATION'
  factionId: string
  value: number
}
```

The effect applies only when its response scope matches, exactly like the existing dialogue effects.

### Gate

Dialogue nodes may declare:

```ts
requiredFactionReputation?: Array<{
  factionId: string
  min?: number
  max?: number
}>
```

Every listed requirement must pass.

The same gate must be enforced:

1. in `NPCDialogueTab` presentation; and
2. below the UI in `processNPCInteractionThunk`.

A direct thunk invocation must not bypass it.

No generalized access-control DSL is introduced.

---

## 9. Production Probe A — personal benefit / institutional harm

Add one new non-repeatable Valerius topic:

```text
valerius_m23_public_override
```

Prerequisite:

```text
valerius_exp_order_questioned
```

Narrative meaning:

The player publicly overrides a Watch checkpoint order to preserve the mission objective. Valerius personally recognizes the same disciplined judgment he previously learned to trust, while the Watch institution reads the visible breach of chain-of-command as institutional damage.

The selected response applies exactly:

```text
RELATIONSHIP_EXPERIENCE
valerius_exp_m23_public_override

FACTION_REPUTATION
City Watch -10
```

The new Valerius Relationship Experience must be meaningfully positive in personal trust/understanding/reliance while the City Watch axis moves negative.

This is the direct same-member/same-institution divergence proof:

```text
Valerius personal Relationship improves
while
City Watch standing worsens
```

No Knowledge or World-State mutation accompanies the choice.

---

## 10. Production Probe B — institutional benefit / no personal improvement

Add one new non-repeatable Gronk topic:

```text
gronk_m23_guild_audit
```

Narrative meaning:

The player verifies a Merchants Guild weights-and-receipts audit that improves institutional confidence/compliance but is deliberately not a meaningful Gronk Relationship beat.

The selected response applies exactly:

```text
FACTION_REPUTATION
Merchants Guild +12
```

It applies **no**:

```text
RELATIONSHIP_EXPERIENCE
AFFINITY_DELTA
KNOWLEDGE_FACT
```

Therefore:

```text
Merchants Guild standing improves
while
Gronk personal Relationship remains unchanged
```

---

## 11. Production institutional consumers

### City Watch consumer

Add:

```text
valerius_m23_watch_clearance
```

Requirements:

```text
valerius_exp_m23_public_override
City Watch reputation >= 0
```

This structure is deliberate: the Relationship evidence can be held constant while City Watch standing alone determines whether institutional clearance is available.

### Merchants Guild consumer

Add:

```text
gronk_m23_guild_priority
```

Requirement:

```text
Merchants Guild reputation >= 10
```

The Guild audit's +12 standing therefore unlocks actual later production dialogue while Gronk Relationship state remains unchanged.

These consumers are bounded content availability consequences. They do not create M24 world state.

---

## 12. Interpersonal independence control

M23 will reuse the already-qualified Gronk Relationship consumer:

```text
gronk_blade_held
requiredExperienceIds:
  gronk_exp_quality_over_finish
```

Control shape:

```text
same Merchants Guild standing
+ missing gronk_exp_quality_over_finish
-> interpersonal topic unavailable

same Merchants Guild standing
+ recorded gronk_exp_quality_over_finish
-> interpersonal topic available
```

Faction standing therefore cannot substitute for Relationship evidence.

M23 will not rewrite this existing consumer.

---

## 13. Existing City Watch quest rewards become real faction rewards

The existing faction-tagged production quest rewards are not new Rule-of-Two probes, but they must now route correctly:

```text
quest_valerius_patrol_duty turn-in
-> +10 City Watch
-> no implicit NPC Affinity update from the REPUTATION reward

quest_m13_break_merchant_leak turn-in
-> +15 City Watch
-> no implicit NPC Affinity update from the REPUTATION reward
```

Any personal Valerius Relationship change from these quests remains owned by their separately authored Relationship Experiences.

This normalization is necessary to remove the pre-M23 semantic lie.

---

## 14. Dormant legacy faction constants

`src/constants/relationshipConstants.ts` currently contains:

- reputation bands;
- standard reputation deltas;
- `RELATIONSHIP_BONUSES` keyed by reputation level;
- `FACTION_MODIFIERS` with allies/rivals;
- `calculateSpillover`.

Recon found no runtime usage outside that file.

M23 will leave them dormant and will **not cite them as qualified authority**.

They are legacy/prototype design residue requiring later cleanup/reconciliation if the product chooses to retain any of those concepts.

In particular, M23 must not call `calculateSpillover`.

---

## 15. Focused qualification requirements

`M23FactionReputation.test.tsx` must prove at least:

1. fresh City Watch and Merchants Guild standing are neutral;
2. Probe A records positive Valerius Relationship evidence and `City Watch = -10`;
3. Probe A does not mutate Knowledge;
4. Probe A does not mutate Merchants Guild standing;
5. direct access to `valerius_m23_watch_clearance` rejects while City Watch is below threshold;
6. with the same Valerius Relationship evidence and corrected City Watch standing, the Watch consumer becomes available;
7. Probe B sets `Merchants Guild = +12` while Gronk Relationship state is byte-for-byte/semantically unchanged;
8. the Guild consumer becomes available after Probe B;
9. direct thunk bypass of the Guild consumer rejects before threshold;
10. with equal Merchants Guild standing, existing `gronk_blade_held` still depends on its Relationship Experience and not faction standing;
11. ordinary save/load preserves both faction values and their divergence from Relationship state;
12. missing `factions` in a legacy-like state reads neutral rather than inferring from Relationships;
13. new-game player reset clears faction standing;
14. existing faction-tagged City Watch quest reward changes City Watch rather than giver NPC affinity;
15. no automatic Knowledge mutation occurs from faction changes;
16. the old faction spillover helper is not imported/used by the new runtime.

---

## 16. Build Validation

Add an M23 gate ahead of the existing M22 gate while preserving all accumulated gates:

```text
TypeScript
M23 faction reputation qualification
M22 social knowledge propagation qualification
Checkpoint C incremental integration repair qualification
M21 bounded offline progress qualification
M20 Copy production automation qualification
Active-loop repair qualification
modified historical qualification
accumulated M4-M19 baseline qualification
production build
```

---

## 17. Evidence ceiling remains unchanged

Even if all probes pass, M23 does not qualify:

- faction diplomacy;
- ally/rival spillover;
- reputation bands/tiers;
- automatic institutional consensus from NPC Knowledge;
- institution-wide Knowledge;
- faction decay;
- faction-vs-faction simulation;
- territory/patrol simulation;
- generalized political consequences;
- M24 objective World State;
- M25 chapter integration;
- human balance, pacing, comprehension, or fun.

M24 remains blocked until M23 is qualified, documentation-complete, merged, and used as a fresh baseline.