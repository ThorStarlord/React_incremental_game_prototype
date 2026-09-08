# Faction System Specification

**Status:** Bounded first-class authority qualified by M23; M24 preserves Faction as distinct from Objective World State  
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
What objectively exists now?          -> World State
Who knows what happened?               -> Knowledge
What does one person's history mean?   -> Relationship
```

The canonical separation after M24 is:

```text
WORLD STATE        -> objective regional conditions
KNOWLEDGE          -> per-NPC awareness
RELATIONSHIP       -> personal shared-history meaning
FACTION REPUTATION -> institutional standing
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

The selector treats a missing `factions` root or missing faction key as neutral rather than deriving standing from another social or world domain.

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

Faction-tagged quest reputation means institutional standing.

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

M23 deliberately does **not** activate it, and M24 does not revive it.

It must not be treated as canonical Faction authority merely because it exists in the repository.

In particular, current authority does not qualify:

```text
City Watch change -> allied faction change
City Watch change -> rival faction change
```

or any reputation-level labels.

---

## 14. Objective World State boundary after M24

Faction standing is a social/institutional assessment; World State is an objective regional condition.

M24 now qualifies a separate `worldState` root with exactly two Merchant District conditions:

```text
watchPresence: normal | heavy
tradeFlow: normal | strong
```

The distinction is directly exercised by M24.

### Institutional standing is not freight throughput

M24's freight mutation requires:

```text
Merchants Guild >= 10
```

but at that same standing the campaign can still have:

```text
tradeFlow = normal
```

until the player explicitly releases the verified contract caravans.

Only that separate action produces:

```text
tradeFlow = strong
```

while Merchants Guild standing remains unchanged.

Therefore:

```text
institutional permission / regard
!=
objective world condition
```

### Institutional opinion is not patrol density

Likewise:

```text
City Watch reputation
```

does not itself determine:

```text
location_merchant_district.watchPresence
```

M24's qualified patrol-density mutation is an explicit player-authored operational action downstream of prior history, not a score-to-world automatic mapping.

M24 tests also preserve the historical M23 invariant:

```text
Faction mutation
-> World State remains neutral/unmutated
```

See `WorldStateSystem.md` and `../Technical/M24ObjectiveWorldStateResult.md`.

---

## 15. Invariants

1. Faction standing is independent from personal NPC Relationship state.
2. Faction standing is independent from per-NPC Knowledge.
3. Faction standing is independent from objective World State.
4. Missing faction state is neutral, not inferred.
5. Faction-tagged `REPUTATION` quest rewards update the named faction, not the quest giver's personal Affinity.
6. `FACTION_REPUTATION` dialogue effects are explicit institutional consequences.
7. Institutional dialogue gates are enforced below the UI.
8. Relationship evidence may coexist with a faction effect but does not mirror automatically.
9. Faction standing does not satisfy Relationship-only gates.
10. Relationship state does not satisfy faction-only gates.
11. Dormant ally/rival spillover is not canonical runtime authority.
12. Faction Reputation does not automatically mutate M24 World State.
13. World State mutation does not automatically mutate Faction Reputation.

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

### M24 cross-domain control

```text
Merchants Guild +12
-> explicit freight release is available
-> before action tradeFlow still normal
-> after explicit action tradeFlow strong
-> Merchants Guild remains +12
```

This M24 control preserves Faction authority rather than expanding it.

---

## 17. Evidence ceiling

Faction authority still does not qualify:

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
- automatic Faction-to-World-State conversion;
- M25 complete chapter integration;
- human pacing, comprehension, or fun.

Objective World State itself is now separately M24-qualified within its own narrow evidence ceiling rather than a Faction feature.

---

## 18. Canonical references

- `../Technical/M23FactionReputation.md`
- `../Technical/M23FactionReputationReconAmendment.md`
- `../Technical/M23FactionReputationResult.md`
- `WorldStateSystem.md`
- `../Technical/M24ObjectiveWorldStateResult.md`
- `NPCSystem.md`
- `QuestSystem.md`
- `KnowledgeSystem.md`
- `RelationshipExperienceSystem.md`
- `../Technical/PostM17MilestoneRoadmap.md`

When older code/docs treat `REPUTATION` as a personal NPC Affinity reward, imply faction spillover from dormant constants, or use Faction standing as shorthand for objective regional conditions, the qualified M23/M24 authority separation supersedes that interpretation.