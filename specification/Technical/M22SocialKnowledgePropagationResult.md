# M22 — Social Knowledge Propagation Result

**Verdict:** `M22_PASS`  
**Frozen baseline:** `main` = `092b91d947e9ad71b3a79569f8e97ab990c64639`  
**Baseline tree:** `e9193e77bccd55b1186b0f6326e53b2c117615a3`  
**Preregistration:** `M22SocialKnowledgePropagation.md`  
**Preregistration commit:** `492e82afe91a84ac4a2a6efebce049e1408ba2c2`  
**Recon amendment:** `M22SocialKnowledgePropagationReconAmendment.md`  
**Recon amendment commit:** `c0b955a6bca3d4e77b6efb16bd8e337cd8b36ece`  
**First complete behavioral head:** `fdc81d85bb9c65c7788f2c8393e44d7ec27e7cf1`  
**First complete behavioral tree:** `f314f2825bbd5298ccd6092a582ffeccecb5ce2f`  
**Build Validation:** #222 — run `34201261970`, job `101980332907` — PASS

---

## 1. Decision

```text
M22_PASS
```

The repository now supports one bounded production case in which:

```text
objective event truth
!=
Gronk's knowledge of the event
!=
Valerius's knowledge of the event
!=
Relationship state
```

The qualified composition is:

```text
player successfully practices Forge Assistance in City Center
-> existing Player routine-familiarity record becomes objectively true
-> canonically co-present Gronk witnesses
-> Gronk learns fact_m22_player_practiced_forge_assistance
-> Valerius remains ignorant
-> save/load preserves Gronk-known / Valerius-ignorant divergence
-> player explicitly reports the fact to Valerius
-> Valerius learns the same fact
-> later Valerius dialogue becomes available because Valerius knows
```

No M23 faction-standing or M24 objective regional world-state authority was introduced.

---

## 2. Scientific question

Preregistered question:

> Can one objective gameplay event produce different persistent knowledge states for different NPCs based on actual acquisition paths, and can later production content consume that knowledge independently of Relationship, Faction, and objective World-State authority?

### Answer

**Yes, within the bounded M22 proof.**

The objective event is not stored inside Knowledge. The already-qualified Player Forge-familiarity record remains the objective source:

```text
Player.routineFamiliarity.forge_assistance
source = city_center_forge_assistance
```

Knowledge stores only per-NPC awareness of that objective event through the stable fact reference:

```text
fact_m22_player_practiced_forge_assistance
```

This allows the same objective truth to coexist with different NPC awareness states.

---

## 3. Why the Forge event was selected

Recon deliberately rejected the temptation to build a generalized `WorldFacts` subsystem simply to give Knowledge something to point at.

The existing Forge Assistance practice already provides a stronger bounded source because it is:

- player-driven;
- canonically location-bound to City Center;
- one-time/idempotent;
- persisted;
- independently qualified before M22;
- unrelated to Relationship authority;
- already meaningful to the Copy/incremental loop.

Therefore M22 treats:

```text
successful City Center Forge practice
```

as the objective event and uses a Knowledge fact ID only as an awareness reference.

This preserves the M24 boundary:

```text
Knowledge is not objective World State.
```

---

## 4. Knowledge authority implemented

A new first-class Redux root exists:

```text
knowledge
```

Minimal state:

```ts
interface KnowledgeState {
  factIdsByNpcId: Record<string, string[]>;
}
```

The feature currently owns only:

- idempotent per-NPC fact acquisition;
- per-NPC fact queries;
- persistence through ordinary RootState save/load;
- new-game reset;
- the direct-witness listener for the single qualified M22 fact.

It does not own objective truth.

No fact removal, decay, confidence, rumor, deception, or recursive epistemic state exists.

---

## 5. Production fact identity

The sole M22 production fact is:

```text
fact_m22_player_practiced_forge_assistance
```

Semantic meaning:

> The player personally completed the qualified City Center Forge Assistance practice event.

Objective truth remains the Player routine-familiarity record.

The fact constant therefore means:

```text
what an NPC may know about the event
```

not:

```text
whether the event happened
```

---

## 6. Acquisition path A — direct witnessing

Gronk already has a qualified canonical world anchor:

```text
npc_blacksmith_gronk -> location_city_center
```

The existing Forge practice already requires the player to be canonically at City Center.

M22 adds a listener on the successful existing action:

```text
practiceForgeAssistanceThunk.fulfilled
```

and grants Gronk knowledge only when:

```text
Player Forge familiarity exists
+
isPlayerAtNpcWorldLocation(Gronk, Player.location) == true
```

Then:

```text
Gronk learns fact_m22_player_practiced_forge_assistance
```

### Qualified control

Before practice:

```text
Gronk does not know
Valerius does not know
```

Attempted Forge practice outside City Center:

```text
practice rejects
Gronk still does not know
Valerius still does not know
```

Successful City Center practice:

```text
objective familiarity = true
Gronk knows = true
Valerius knows = false
```

This demonstrates that the event becoming true does not broadcast the fact globally.

---

## 7. Acquisition path B — explicit communication/report

The second path uses ordinary data-driven NPC dialogue rather than a Knowledge debug command.

Production topic:

```text
valerius_m22_forge_report
```

Title:

```text
A Workshop Fact, Not a Reputation Claim
```

Availability requires:

```text
Player.routineFamiliarity.forge_assistance
```

and forbids the topic when Valerius already knows:

```text
fact_m22_player_practiced_forge_assistance
```

The selected report response applies exactly one new generic dialogue effect:

```text
KNOWLEDGE_FACT
```

which targets the current dialogue NPC.

Therefore:

```text
Valerius ignorant
+
player has actually performed Forge practice
+
player explicitly reports it
-> Valerius knows
```

No automatic Relationship Experience or Affinity effect is attached to the report.

---

## 8. Real downstream knowledge consumer

Production topic:

```text
valerius_m22_forge_logistics
```

Title:

```text
What the Watch Can Now Ask
```

Its gate is:

```text
requiredKnowledgeFactIds = [fact_m22_player_practiced_forge_assistance]
```

The M22 qualification proves both presentation and below-UI enforcement:

```text
Valerius ignorant
-> topic not shown in NPCDialogueTab
-> direct thunk dispatch rejects
```

then:

```text
Valerius informed
-> topic becomes visible
-> direct thunk dispatch succeeds
```

The consumer does not gate on Player Forge familiarity, Quest status, or Relationship Experience as a substitute for Valerius awareness.

This closes the preregistered F7 falsifier: Knowledge is not merely stored; real production content consumes it.

---

## 9. Generic dialogue contract added

`DialogueNode` now supports:

```ts
requiredRoutineFamiliarityIds?: RoutineFamiliarityId[];
requiredKnowledgeFactIds?: string[];
forbiddenKnowledgeFactIds?: string[];
```

`DialogueEffect` now supports:

```ts
{
  type: 'KNOWLEDGE_FACT';
  factId: string;
}
```

The contract is enforced in both:

```text
NPCDialogueTab presentation availability
+
processNPCInteractionThunk below-UI validation
```

Therefore a caller cannot bypass the knowledge/familiarity prerequisites merely by dispatching the thunk directly.

`KNOWLEDGE_FACT` always targets the current dialogue NPC in M22; there is no arbitrary target or broadcast mechanism.

---

## 10. Persistence

The repository already persists full Redux RootState.

M22 does not bump the save schema:

```text
CURRENT_SAVE_SCHEMA_VERSION = 1
```

Qualification proves:

```text
Gronk knows
Valerius ignorant
-> save
-> load
-> Gronk still knows
-> Valerius still ignorant
```

A legacy-like current-schema state with the `knowledge` root removed is tolerated by Knowledge selectors as:

```text
no recorded facts
```

and a positive M21 offline settlement does not invent knowledge.

No load-time inference or reconciliation creates M22 facts.

---

## 11. Idempotence

`learnNpcFact` stores each fact ID at most once per NPC.

Qualification dispatches the same Gronk fact repeatedly and retains:

```text
[ fact_m22_player_practiced_forge_assistance ]
```

rather than duplicates.

The Valerius report is also one-shot and knowledge-aware:

- the node is marked `repeatable: false`;
- it is hidden when Valerius already knows;
- below-UI duplicate invocation rejects;
- the Knowledge reducer itself remains idempotent even if called directly.

---

## 12. New-game isolation

Knowledge is campaign state, not account-global state.

The Knowledge reducer listens to the existing `resetPlayerState` action and clears all per-NPC facts.

Qualification proves:

```text
Gronk knows
Valerius knows
-> new-game Player reset
-> Forge familiarity empty
-> Gronk knowledge empty
-> Valerius knowledge empty
```

This prevents one playthrough's social awareness from leaking into another.

---

## 13. Relationship separation

The new direct-witness and report paths both prove Knowledge can change without automatic Relationship mutation.

### Witness path

The test snapshots the Relationship root before successful Forge practice and confirms the new Gronk knowledge does not alter it.

### Report path

The test snapshots Relationship state before Valerius receives the fact and confirms the report changes Knowledge while Relationship remains identical.

### Consumer path

The knowledge-gated follow-up also has no Relationship effect and leaves Relationship state unchanged.

Therefore M22 qualifies:

```text
NPC knows fact
!=
NPC Trust / Affinity / Bond / Connection
```

This does not prevent future authored scenes from independently creating Relationship Experiences when learning a fact is relationally meaningful. It only prevents Knowledge acquisition itself from silently redefining Relationship state.

---

## 14. Faction / M23 separation

M22 introduces no:

- faction slice;
- City Watch standing;
- Merchants Guild standing;
- faction reputation bands;
- institutional reaction propagation.

The focused qualification confirms the root contains no new M22 `faction` authority.

Existing legacy Quest `REPUTATION` labels and their old NPC-Relationship adapter remain pre-M23 compatibility behavior and were not modified by M22.

The qualified invariant is therefore:

```text
Valerius knows fact
!=
City Watch reputation
```

because the latter does not yet exist as modern authority.

---

## 15. World-State / M24 separation

M22 introduces no:

- `WorldState` root;
- regional `WorldFacts` engine;
- trade-flow field;
- watch-presence field;
- infrastructure state;
- generalized objective-event registry.

The focused qualification confirms no new `worldState` root exists.

Objective truth for the M22 fact remains the existing Player Forge-familiarity event.

Therefore:

```text
NPC awareness
!=
objective regional world condition
```

remains structurally preserved for M24.

---

## 16. Historical M13 knowledge-shaped seam

Recon identified an older pre-M22 content seam:

```text
silas_exp_watch_leak_traced
-> valerius_leak_rumor
```

and the later:

```text
valerius_delegated_leak_response
```

currently consumes both Silas and Valerius Relationship evidence.

Those older Relationship Experiences encode legitimate relational history as well as knowledge-shaped causal ordering.

M22 intentionally does **not** rewrite that chain.

Reason:

- migrating it safely would require separating objective leak truth, Silas awareness, player access, Valerius awareness, and retained Relationship meaning;
- doing so would widen a bounded first Knowledge proof into historical narrative migration;
- the preregistered question only requires one production Rule-of-Two proof.

Current status:

```text
historical M13 cross-NPC awareness semantics
= explicit migration/design debt
= NOT part of the M22 qualified claim
```

The new Forge fact itself has no parallel Relationship or story boolean serving as shadow Knowledge authority.

---

## 17. Falsification review

| Falsifier | Result |
|---|---|
| Global knowledge leak | **Not observed.** Gronk learns from canonical witnessing while Valerius remains ignorant. |
| Relationship-as-knowledge | **Not observed.** No Relationship threshold grants the M22 fact. |
| Knowledge-as-Relationship | **Not observed.** Knowledge acquisition leaves Relationship state unchanged. |
| Shadow knowledge flag for M22 fact | **Not observed.** Downstream consumer reads canonical Knowledge. |
| Illegitimate witnessing | **Not observed.** Gronk acquisition uses existing canonical co-presence. |
| Report without explicit transfer | **Not observed.** Valerius learns only through explicit report effect. |
| Technical-only knowledge | **Not observed.** Real Valerius topic consumes Knowledge. |
| Inappropriate fact identity | **Not observed.** Objective truth remains existing Forge familiarity, not a Relationship Experience ID. |
| M23 leakage | **Not observed.** No faction-standing system added. |
| M24 leakage | **Not observed.** No world-state/fact engine added. |
| Overbuilt epistemics | **Not observed.** No provenance, confidence, rumor, deception, forgetting, or recursive beliefs. |
| Persistence/reconciliation invention | **Not observed.** Missing root stays empty; offline time does not teach. |

No preregistered falsifier blocks the bounded PASS.

---

## 18. Build Validation #222

Exact behavioral candidate:

```text
head fdc81d85bb9c65c7788f2c8393e44d7ec27e7cf1
tree f314f2825bbd5298ccd6092a582ffeccecb5ce2f
```

Run/job:

```text
Build Validation #222
run 34201261970
job 101980332907
PASS
```

Passed:

- dependency installation ✅
- TypeScript ✅
- M22 social knowledge propagation qualification ✅
- Checkpoint C incremental integration repair qualification ✅
- M21 bounded offline progress qualification ✅
- M20 Copy production automation qualification ✅
- Active-loop repair qualification ✅
- modified historical qualification ✅
- accumulated M4-M19 baseline qualification ✅
- production build ✅

No historical test expectations were weakened to produce the M22 PASS.

---

## 19. First behavioral diff scope

Against frozen baseline:

```text
16 commits ahead
0 behind
```

Changed surfaces are bounded to:

- M22 preregistration/recon docs;
- Knowledge runtime/types/selectors/listener/test;
- root store registration;
- generic NPC dialogue type/UI/thunk integration;
- two authored Valerius dialogue topics and NPC advertisement;
- one additive Build Validation gate.

No M23/M24 implementation appears in the behavioral candidate.

---

## 20. Qualified claim

> The existing objective City Center Forge-practice event can make canonically co-present Gronk know `fact_m22_player_practiced_forge_assistance` while Valerius remains ignorant; ordinary save/load preserves that divergence; an explicit one-shot Valerius report transfers the same fact; and a later data-driven Valerius topic consumes canonical Knowledge rather than Relationship state, with no automatic Relationship, Faction, or World-State mutation.

---

## 21. Evidence ceiling / explicit non-claims

This M22 PASS does **not** qualify:

- more than the single current production fact;
- a generalized fact catalog;
- historical M13/M14/M15 awareness migration;
- acquisition provenance persistence;
- player knowledge as a separate domain;
- rumor graphs;
- automatic gossip;
- misinformation;
- lies or deception simulation;
- confidence/belief scores;
- forgetting or knowledge decay;
- epistemic inference;
- recursive theory-of-mind;
- automatic transfer between NPCs;
- faction reputation or institutional standing (M23);
- objective regional world-state consequences (M24);
- complete chapter composition (M25);
- human comprehension, pacing, narrative quality, or fun.

---

## 22. Next authorization boundary

M22 has reached a behavioral `M22_PASS`, but M23 is not authorized merely by this result commit.

Required remaining M22 sequence:

```text
M22 behavioral PASS
-> reconcile canonical documentation
-> exact-head documentation-complete Build Validation
-> merge exact qualified M22 head
-> verify integrated tree
```

Only after a qualified merged M22 PASS does the next roadmap candidate become:

```text
M23 — Faction Reputation
```

This M22 branch must not implement M23.
