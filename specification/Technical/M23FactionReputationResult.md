# M23 — Faction Reputation Result

**Verdict:** `M23_PASS`  
**Milestone:** M23 — Faction Reputation  
**Frozen baseline:** `6770df0ffd1d59cd3218af91cdcf7e241910c435`  
**Baseline tree:** `2a9378016e6d3a58fec60e8e937ecf6030beb424`  
**Preregistration:** `specification/Technical/M23FactionReputation.md`  
**Preregistration commit:** `1d3fa05070c97a9a01ffd16ea5035e18af3b24f3`  
**Recon amendment:** `specification/Technical/M23FactionReputationReconAmendment.md`  
**Recon amendment commit:** `0086375741d054dd442ca7855512b260a5a2e5af`  
**First complete behavioral head:** `677b392b739be26405575184d2b6824f5c992d62`  
**Behavioral tree:** `fc4e8be07e1ca29153ccb919f70f0b9a88632e06`

---

## 1. Scientific question

> Can the player's standing with an institution differ materially from their personal Relationship with an NPC belonging to that institution?

**Answer:** Yes, within the bounded M23 evidence.

The production runtime now supports first-class institutional standing that is persisted and consumed separately from personal Relationship state.

The central invariant is executable:

```text
Valerius Relationship != City Watch Reputation
```

M23 also exercises the same institutional contract with the Merchants Guild, preventing the proof from collapsing into one City Watch special case.

---

## 2. Qualified architecture

M23 adds one root authority:

```ts
FactionState {
  reputationByFactionId: Record<string, number>
}
```

Missing entries are neutral:

```text
0
```

The bounded authority chain is now:

```text
WORLD        -> what objectively happened?
KNOWLEDGE    -> who knows it happened?
RELATIONSHIP -> what shared history means between specific people
FACTION      -> how an institution regards the player
```

Faction standing is not reconstructed from Affinity, Trust, Connection, Memories, Relationship Experiences, or Knowledge.

---

## 3. Recon defect resolved

Before M23, faction-tagged Quest rewards were semantically false.

The authoring model already allowed:

```json
{ "type": "REPUTATION", "value": 10, "faction": "City Watch" }
```

but runtime behavior ignored `faction` and converted the reward into a personal relationship/Affinity change on the quest giver.

M23 normalizes the contract:

```text
REPUTATION + faction
-> Faction authority
-> named institution changes
-> giver NPC personal Relationship does not implicitly change
```

The existing production City Watch rewards therefore now mean what their data says.

No factionless `REPUTATION` reward was found in the production data during recon; M23 does not preserve factionless reputation as an implicit personal-relationship alias.

---

## 4. Rule-of-Two institutions

The same runtime contract is exercised by:

```text
City Watch
Merchants Guild
```

Existing NPC faction membership supplies the identifiers:

```text
Captain Valerius -> City Watch
Blacksmith Gronk -> Merchants Guild
```

M23 does not add a faction registry, tiers, allied/rival graph, or institutional simulation.

---

## 5. Probe A — personal benefit / institutional harm

Production dialogue:

```text
valerius_m23_public_override
The Order You Broke in Public
```

Prerequisite:

```text
valerius_exp_order_questioned
```

Selected response applies two independently authored consequences:

```text
RELATIONSHIP_EXPERIENCE
valerius_exp_m23_public_override

FACTION_REPUTATION
City Watch -10
```

The Relationship Experience changes Valerius personally:

```text
Trust          +6
Understanding  +5
Shared Meaning +3
Reliance       +5
Reciprocity    +2
Affinity       -1
```

The mixed effect is intentional. Valerius dislikes the public breach as a short-horizon interpersonal signal while personally increasing trust/understanding/reliance in the player's disciplined judgment.

At the same time:

```text
City Watch reputation = -10
```

Therefore the same event proves:

```text
Valerius personal Relationship deepens
while
City Watch institutional standing worsens
```

Knowledge remains unchanged.

---

## 6. Probe A institutional consumer

Production dialogue:

```text
valerius_m23_watch_clearance
Clearance the Captain Cannot Give Alone
```

Requirements:

```text
valerius_exp_m23_public_override
City Watch >= 0
```

Immediately after the public override:

```text
Valerius Relationship evidence exists
City Watch = -10
-> clearance hidden in UI
-> direct thunk invocation rejected
```

Holding the Relationship evidence constant and changing only City Watch standing to neutral:

```text
same Valerius Relationship evidence
City Watch = 0
-> clearance becomes available
-> direct authoritative interaction succeeds
```

This proves institutional content reads institutional authority rather than treating personal trust as sufficient.

---

## 7. Probe B — institutional benefit / no personal improvement

Production dialogue:

```text
gronk_m23_guild_audit
Weights That Match the Ledger
```

Selected response applies exactly:

```text
FACTION_REPUTATION
Merchants Guild +12
```

It applies no:

```text
RELATIONSHIP_EXPERIENCE
AFFINITY_DELTA
KNOWLEDGE_FACT
```

The focused qualification holds Gronk's complete Relationship state constant and proves:

```text
Merchants Guild 0 -> +12
while
Gronk Relationship state remains unchanged
```

City Watch and Knowledge remain unchanged as cross-domain controls.

---

## 8. Probe B institutional consumer

Production dialogue:

```text
gronk_m23_guild_priority
A Guild Queue, Not a Favor
```

Requirement:

```text
Merchants Guild >= 10
```

Before the audit:

```text
Merchants Guild = 0
-> topic hidden
-> direct thunk invocation rejected
```

After the audit:

```text
Merchants Guild = 12
-> topic visible
-> authoritative interaction succeeds
```

The content explicitly frames the consequence as Guild priority rather than personal favor from Gronk.

---

## 9. Interpersonal independence control

M23 reuses an existing qualified Gronk Relationship consumer without modifying it:

```text
gronk_blade_held
requires gronk_exp_quality_over_finish
```

With Merchants Guild standing held at +12 but Relationship evidence missing:

```text
gronk_blade_held
-> rejected
```

After adding only the required Relationship Experience:

```text
same Merchants Guild standing
+ gronk_exp_quality_over_finish
-> gronk_blade_held succeeds
```

Therefore:

```text
Faction standing cannot substitute for personal Relationship evidence
```

This complements the Valerius institutional consumer, where Relationship evidence cannot substitute for faction standing.

---

## 10. Quest reward normalization control

The focused qualification uses the existing production quest:

```text
quest_valerius_patrol_duty
```

Its top-level reward includes:

```text
+10 City Watch REPUTATION
```

On turn-in, M23 proves:

```text
City Watch += 10
Valerius NPC affinity unchanged
Relationship state unchanged by the REPUTATION reward
Knowledge unchanged
quest completes normally
```

Any independent Relationship consequence remains authored through Relationship Experiences rather than hidden inside the reputation reward.

---

## 11. Persistence and legacy behavior

Ordinary save/load preserves simultaneously:

```text
City Watch standing
Merchants Guild standing
Valerius Relationship state
```

and therefore preserves their divergence.

A legacy-like current state without the new `factions` root reads:

```text
City Watch = 0
Merchants Guild = 0
```

without inferring institutional standing from existing Relationship evidence.

New-game Player reset clears faction standing so campaign state does not leak forward.

Save schema remains v1.

---

## 12. Knowledge boundary

The positive probes explicitly verify that changing faction standing does not mutate the M22 Knowledge domain.

Qualified separation:

```text
NPC knows fact
!=
Institution likes player
```

M23 adds no automatic bridge such as:

```text
Valerius learns good fact
-> City Watch reputation +X
```

A future authored event may have both Knowledge and Faction consequences, but each must remain explicit.

---

## 13. Dormant spillover remains unqualified

The old prototype file `src/constants/relationshipConstants.ts` contains reputation levels, faction ally/rival mappings, and `calculateSpillover`.

M23 does not activate or import that machinery.

The focused test explicitly guards that new Faction/NPC/Quest runtime files do not use `calculateSpillover`.

Therefore M23 cannot be cited as evidence for:

- allied-faction reputation propagation;
- rival-faction penalties;
- faction matrices;
- reputation bands or tiers.

---

## 14. M24 boundary

M23 adds no objective regional World State authority.

The focused qualification verifies there is no new:

```text
worldState
factionDiplomacy
```

root introduced by this work.

Institutional dialogue availability is a bounded consumer of faction standing, not M24 simulation.

---

## 15. Behavioral qualification

First complete behavioral candidate:

```text
head 677b392b739be26405575184d2b6824f5c992d62
tree fc4e8be07e1ca29153ccb919f70f0b9a88632e06
```

Build Validation:

```text
#227
run 34205856815
job 101995051668
PASS
```

Passed on the exact behavioral head:

```text
dependency installation                          PASS
TypeScript                                       PASS
M23 faction reputation qualification             PASS
M22 social knowledge propagation qualification   PASS
Checkpoint C repair qualification                PASS
M21 bounded offline progress qualification       PASS
M20 Copy production automation qualification     PASS
Active-loop repair qualification                 PASS
modified historical qualification                PASS
accumulated M4-M19 baseline qualification        PASS
production build                                 PASS
```

Compared with frozen baseline:

```text
17 commits ahead
0 behind
17 changed files
```

No implementation correction was required after the first Build Validation candidate.

---

## 16. Acceptance criteria disposition

| Criterion | Result |
|---|---|
| First-class persisted faction state | PASS |
| Rule of Two institutions | PASS — City Watch + Merchants Guild |
| Personal benefit / institutional harm | PASS — Valerius public override |
| Institutional benefit / no personal improvement | PASS — Guild audit |
| Institutional content consumes faction standing | PASS — two consumers |
| Interpersonal content still consumes Relationship | PASS — `gronk_blade_held` control |
| Same Relationship + different faction standing changes institutional result | PASS |
| Same faction standing + different Relationship changes interpersonal result | PASS |
| UI and below-UI faction gating | PASS |
| Save/load preserves divergence | PASS |
| Legacy missing faction state is neutral | PASS |
| New-game reset clears faction state | PASS |
| Existing faction-tagged quest reward routes to Faction | PASS |
| Knowledge does not mirror automatically | PASS |
| Dormant spillover not activated | PASS |
| M24 World State not introduced | PASS |

No preregistered falsifier was observed.

---

## 17. Formal verdict

```text
M23_PASS
```

The bounded evidence supports the preregistered scientific proposition.

### Qualified claim

> At least two bounded production institutions can hold persisted player standing independently from personal NPC Relationship state; authored events can move the institutional axis without automatic Relationship mirroring; and real institutional/interpersonal consumers can read their respective authorities independently.

---

## 18. Evidence ceiling

This PASS does **not** qualify:

- generalized faction registries;
- reputation tiers/bands;
- final reputation numeric balance;
- faction diplomacy;
- ally/rival spillover;
- faction-vs-faction matrices;
- reputation decay;
- institutional Knowledge/consensus;
- automatic Knowledge-to-reputation conversion;
- automatic Relationship-to-reputation conversion;
- automatic reputation propagation;
- territory control;
- faction patrol simulation;
- generalized political consequences;
- M24 objective regional World State;
- M25 complete chapter integration;
- human pacing, comprehension, narrative quality, or fun.

The dormant legacy reputation/spillover constants remain prototype residue, not M23 authority.

---

## 19. Required next boundary

After this M23 result and canonical documentation are requalified on the exact documentation-complete head and that exact head is merged:

```text
M23 Faction Reputation: PASS
-> M24 Objective World State: AUTHORIZED NEXT
```

M24 must start from the then-current merged baseline with its own preregistration and fresh repository recon.

M24 is not implemented or preregistered by M23.