# Faction System Specification

**Status:** Bounded first-class authority qualified by M23  
**Milestone authority:** `M23FactionReputationResult.md`  
**Redux root:** `factions`

---

## 1. Purpose

The Faction system represents **institution-level standing toward the player**.

It answers:

```text
How does this institution regard the player?
```

It does not answer:

```text
What happened?                        -> objective source / future World State where appropriate
Who knows what happened?              -> Knowledge
What does one person's history mean?  -> Relationship
```

The canonical separation after M23 is:

```text
WORLD        -> objective conditions/events
KNOWLEDGE    -> per-NPC awareness
RELATIONSHIP -> personal shared-history meaning
FACTION      -> institutional standing
```

---

## 2. State model

M23 qualifies one intentionally small persisted model:

```ts
interface FactionState {
  reputationByFactionId: Record<string, number>;
}
```

A missing faction entry means neutral standing:

```text
0
```

Current bounded production faction identifiers reuse existing authored NPC faction strings.

M23 directly qualifies:

```text
City Watch
Merchants Guild
```

Other existing faction strings are not automatically part of the M23 Rule-of-Two claim merely because the generic state can represent them.

---

## 3. Runtime authority

The Faction slice owns:

```text
adjustFactionReputation({ factionId, amount })
resetFactionReputation()
```

The canonical query is:

```text
selectFactionReputation(state, factionId)
```

The selector treats a missing `factions` root or missing faction key as neutral rather than deriving standing from another social domain.

Faction state is persisted as ordinary RootState.

---

## 4. Explicit mutation doctrine

Faction standing changes only through explicit authored institutional consequences.

Qualified sources currently include:

### Dialogue

```ts
{
  type: 'FACTION_REPUTATION',
  factionId: string,
  value: number
}
```

### Quest rewards

```ts
{
  type: 'REPUTATION',
  faction: string,
  value: number
}
```

For faction-tagged Quest `REPUTATION`, the `faction` field is authoritative.

M23 corrected the pre-existing conflation where the runtime ignored that field and changed the giver NPC's personal Affinity instead.

A faction consequence does not implicitly mean:

```text
Affinity change
Trust change
Relationship Experience
Memory
Connection change
Knowledge acquisition
World State change
```

If one event legitimately has several consequences, author the relevant effects independently.

---

## 5. Relationship independence

The core M23 invariant is:

```text
personal Relationship != institutional standing
```

Qualified production example:

```text
valerius_m23_public_override
```

One player decision explicitly produces:

```text
Valerius Relationship:
  Trust +6
  Understanding +5
  Reliance +5
  other bounded relational changes

City Watch:
  Reputation -10
```

Therefore the product can represent:

```text
Valerius personally respects/trusts the judgment more
while
City Watch institutionally resents the public breach
```

The systems are not synchronized.

---

## 6. Institutional benefit without personal benefit

M23's second institution proves the opposite shape:

```text
gronk_m23_guild_audit
-> Merchants Guild +12
-> no Gronk Relationship Experience
-> no Affinity delta
```

The event improves institutional confidence while Gronk's personal Relationship remains unchanged.

This prevents Faction from becoming another spelling of the member NPC's social state.

---

## 7. Institutional dialogue gates

Dialogue may declare:

```ts
requiredFactionReputation?: Array<{
  factionId: string;
  min?: number;
  max?: number;
}>;
```

Every listed requirement must pass.

The gate is checked in both:

```text
NPCDialogueTab
+
processNPCInteractionThunk
```

The UI therefore communicates availability, but the authoritative thunk remains the correctness boundary.

A direct invocation that fails the faction requirement is rejected before the protected dialogue consequence occurs.

---

## 8. Qualified institutional consumers

### City Watch

```text
valerius_m23_watch_clearance
```

requires:

```text
valerius_exp_m23_public_override
City Watch >= 0
```

This deliberately demonstrates:

```text
personal evidence exists
but City Watch < 0
-> institutional clearance unavailable
```

Changing only City Watch standing while holding the Relationship evidence constant changes the institutional result.

### Merchants Guild

```text
gronk_m23_guild_priority
```

requires:

```text
Merchants Guild >= 10
```

The Guild audit raises standing to +12 and unlocks the institutional topic without changing Gronk's Relationship.

---

## 9. Interpersonal consumer remains Relationship-owned

M23 deliberately reuses:

```text
gronk_blade_held
```

which requires:

```text
gronk_exp_quality_over_finish
```

Even at Merchants Guild +12, the topic remains unavailable without the required personal Relationship evidence.

Therefore:

```text
high faction standing
!=
personal relationship prerequisite satisfied
```

---

## 10. Knowledge boundary

M22 Knowledge remains independent.

Qualified M23 probes verify:

```text
Faction change
-> Knowledge unchanged
```

Likewise, there is no generic rule:

```text
NPC knows favorable fact
-> faction reputation rises
```

Knowledge can become an authored prerequisite to a future institutional reaction, but knowledge itself is not reputation.

---

## 11. Quest integration

Faction-tagged quest reputation now means institutional standing.

Existing qualified control:

```text
quest_valerius_patrol_duty
-> +10 City Watch
```

M23 proves that the `REPUTATION` reward:

```text
changes City Watch
does not change Valerius affinity
and does not mutate Relationship/Knowledge implicitly
```

Any relational interpretation of the quest belongs to separately authored Relationship Experiences.

---

## 12. Persistence and reset

Faction standing is stored with full RootState.

M23 keeps save schema v1.

Qualified behavior:

```text
City Watch -10
Merchants Guild +12
+ independent Relationship state
-> save/load
-> all preserved
```

A legacy-like state lacking `factions` is interpreted as neutral standing.

`resetPlayerState` clears faction reputation so institutional state cannot leak into a new campaign.

---

## 13. Legacy reputation/spillover residue

`src/constants/relationshipConstants.ts` predates M23 and contains:

- reputation levels/bands;
- standard reputation deltas;
- relationship bonuses keyed to reputation;
- ally/rival faction mappings;
- `calculateSpillover`.

Recon found that machinery dormant.

M23 deliberately does **not** activate it.

It must not be treated as canonical Faction authority merely because it exists in the repository.

In particular, M23 does not qualify:

```text
City Watch change -> allied faction change
City Watch change -> rival faction change
```

or any reputation-level labels.

---

## 14. World-State boundary

Faction standing is a social/institutional assessment, not objective regional state.

For example:

```text
City Watch reputation = -10
```

does not itself mean:

```text
more guards deployed
merchant district locked down
crime increased
patrol density changed
```

Those are objective world conditions and remain M24 territory.

M23 adds no generalized World State root or simulation.

---

## 15. Invariants

1. Faction standing is independent from personal NPC Relationship state.
2. Faction standing is independent from per-NPC Knowledge.
3. Missing faction state is neutral, not inferred.
4. Faction-tagged `REPUTATION` quest rewards update the named faction, not the quest giver's personal Affinity.
5. `FACTION_REPUTATION` dialogue effects are explicit institutional consequences.
6. Institutional dialogue gates are enforced below the UI.
7. Relationship evidence may coexist with a faction effect but does not mirror automatically.
8. Faction standing does not satisfy Relationship-only gates.
9. Relationship state does not satisfy faction-only gates.
10. Dormant ally/rival spillover is not canonical runtime authority.
11. Faction reputation does not imply objective M24 World State.

---

## 16. Current qualified production examples

### City Watch divergence

```text
valerius_exp_order_questioned
-> valerius_m23_public_override
-> positive personal Valerius evidence
-> City Watch -10
-> Watch clearance blocked
-> restore only institutional standing to 0
-> clearance available with same Relationship evidence
```

### Merchants Guild divergence

```text
gronk_m23_guild_audit
-> Merchants Guild +12
-> Gronk Relationship unchanged
-> Guild priority available

Merchants Guild +12
without gronk_exp_quality_over_finish
-> gronk_blade_held still unavailable
```

---

## 17. Evidence ceiling

M23 does not qualify:

- generalized faction registry semantics;
- reputation labels/tiers/bands;
- final reputation balance;
- diplomacy;
- allied/rival spillover;
- faction-vs-faction matrices;
- reputation decay;
- automatic cross-faction propagation;
- institutional Knowledge or consensus;
- territory control;
- patrol simulation;
- objective regional World State;
- M25 complete chapter integration;
- human pacing, comprehension, or fun.

---

## 18. Canonical references

- `../Technical/M23FactionReputation.md`
- `../Technical/M23FactionReputationReconAmendment.md`
- `../Technical/M23FactionReputationResult.md`
- `NPCSystem.md`
- `QuestSystem.md`
- `KnowledgeSystem.md`
- `RelationshipExperienceSystem.md`
- `../Technical/PostM17MilestoneRoadmap.md`

When older code/docs treat `REPUTATION` as a personal NPC Affinity reward or imply faction spillover from dormant constants, M23's qualified authority supersedes that interpretation.