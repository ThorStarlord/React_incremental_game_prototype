# M25 — Complete Chapter Vertical Slice Recon Amendment

**Status:** Frozen after fresh post-M24 repository recon and before M25 behavioral/content implementation  
**Preregistration:** `specification/Technical/M25CompleteChapterVerticalSlice.md`  
**Preregistration commit:** `2663bc44cbca742bce71fa63db11852d455025ec`  
**Frozen baseline:** `5866e8f898d909641e9f46ff927c2d399691e353`  
**Frozen baseline tree:** `a7634babc08653fc1de51ae3e3c3ce7e303e290a`

---

## 1. Recon conclusion

M25 does **not** need a chapter engine, quest-graph DSL, new state reducer, generalized condition language, new save schema, or new combat/travel/automation subsystem.

The merged repository already contains almost every required chapter beat as independently qualified production content. The smallest honest M25 is therefore:

```text
existing qualified chapter-capable content
+
a bounded M25 conclusion/content extension
+
one cross-system Route-of-Two qualification suite
```

M25's job is to prove **composition**, not subsystem acquisition.

The leading Merchant District Crisis hypothesis survives recon and is now frozen as the production setting.

---

## 2. Chapter entry boundary

M25 is a **chapter vertical slice**, not a literal full-campaign-from-new-game qualification.

The automated suite may establish a controlled chapter-entry fixture from already-qualified pre-M25 history. That fixture represents campaign history which prior milestone suites independently prove can be earned and persisted.

The fixture may seed only already-qualified historical prerequisites/capabilities needed to enter this chapter, including:

- established Gronk/Silas/Valerius Relationship history used by M14/M15;
- permanent `WillowsWisdom` as an already-learned capability;
- a mature/eligible existing Copy suitable for the already-qualified Forge Assistance task.

This fixture is **not M25 evidence** by itself. Every M25 chapter beat after the frozen entry boundary must execute through ordinary production authorities.

The test must clearly distinguish:

```text
pre-chapter qualified history fixture
!=
M25 chapter behavior under test
```

No new M25-only history boolean or `chapterStarted` flag is authorized.

---

## 3. Existing chapter spine discovered by recon

### 3.1 Shared multi-NPC decision — M14

Existing production node:

```text
valerius_m14_aftermath_council
```

It already requires substantial Gronk/Silas/Valerius history and provides one irreversible shared decision with three independently authored Relationship interpretations.

Two responses are ideal M25 route anchors:

```text
public_crackdown
quiet_reroute
```

`quiet_reroute` additionally unlocks:

```text
quest_m14_quiet_reroute
```

whose real `REACH_LOCATION` objective targets:

```text
location_merchant_district
```

and whose `prove_reroute` resolution records:

```text
gronk_exp_quiet_reroute_proven
```

This already supplies a player decision -> travel/gameplay -> later Relationship-evidence chain.

### 3.2 Long-horizon callback — M15

Existing Valerius inquiry:

```text
valerius_m15_forged_ledger_inquiry
```

Existing Silas callbacks preserve earlier Relationship meaning across intervening content:

```text
quiet/protect history
-> silas_m15_debt_still_counts
-> silas_exp_old_silence_repaid

public-crackdown history
-> silas_m15_debt_not_renewed
-> silas_exp_old_silence_reinterpreted
```

These are the frozen M25 long-horizon route callbacks.

M25 will not author a substitute callback.

### 3.3 Trait-sensitive active capability — M16/M17

M16 already qualifies:

```text
Relationship learning provenance
-> permanent WillowsWisdom
-> different quest solution space
```

M17 already qualifies the same permanent capability in a real combat encounter:

```text
quest_m17_telluric_echo
encounter_m17_telluric_echo
location_whispering_woods
```

The encounter remains winnable through an ordinary control line, while permanent `WillowsWisdom` exposes the optional:

```text
Trace the Cycle
-> Disrupt the Feedback
```

line.

M25 will reuse the M17 encounter rather than authoring a second combat system or combat encounter merely for milestone identity.

The two M25 routes may deliberately choose different valid M17 tactics while both owning `WillowsWisdom`:

```text
capability exists
!=
capability must be used
```

### 3.4 Travel / spatial authority — M18 + active-loop repair

Existing authored graph:

```text
Merchant District <-> City Center <-> City Gate <-> Whispering Woods
```

`travelToLocationThunk` is the player travel authority and rejects illegal direct jumps.

The M17 encounter is already location-gated to Whispering Woods.

Gronk in-person interaction is already location-gated to his City Center canonical anchor.

M25 therefore has real reasons to travel and does not need a chapter-local location flag.

### 3.5 Knowledge + routine familiarity — M22 / integration repair

Existing active action:

```text
practiceForgeAssistanceThunk
```

At City Center it produces ordinary player familiarity:

```text
player.routineFamiliarity.forge_assistance
source = city_center_forge_assistance
```

and M22's existing listener makes canonically co-present Gronk know:

```text
fact_m22_player_practiced_forge_assistance
```

while Valerius remains ignorant.

Existing explicit report:

```text
valerius_m22_forge_report
```

transfers that same fact to Valerius without automatic Relationship mutation.

Existing consumer:

```text
valerius_m22_forge_logistics
```

then reads canonical Valerius Knowledge.

This is the frozen M25 Knowledge beat.

### 3.6 Institutional consequence — M23

Two existing independent institution paths remain ideal route continuations.

#### Public-order route

```text
valerius_m23_public_override
-> valerius_exp_m23_public_override
-> City Watch -10
```

Valerius's personal Relationship deepens while City Watch standing falls.

#### Quiet-network route

```text
gronk_m23_guild_audit
-> Merchants Guild +12
```

Gronk personal Relationship remains unchanged by the institutional approval.

M25 will reuse these paths rather than inventing chapter-local reputation effects.

### 3.7 Objective world consequence — M24

Two existing Merchant District mutations compose directly with the M23 route split.

#### Public-order continuation

```text
valerius_exp_m23_public_override
-> valerius_m24_redeploy_patrols
-> Merchant District watchPresence = heavy
-> silas_m24_patrol_pressure
```

#### Quiet-network continuation

```text
Merchants Guild >= 10
-> gronk_m24_release_verified_freight
-> Merchant District tradeFlow = strong
-> valerius_m24_freight_corridor
```

No new M25 World-State fields are authorized.

### 3.8 Delegation + offline return — M20/M21

The same Forge familiarity produced by active play is already required below UI by:

```text
startCopyProductionTaskThunk({ taskId: 'forge_assistance' })
```

A qualified eligible Copy can then begin the authored routine task.

M21 can advance or complete only that **already-running** task during bounded offline settlement while leaving Relationship, Quest, Combat, travel, Knowledge, Faction, and World-State player decisions untouched.

This produces a coherent M25 late-chapter cadence:

```text
player personally learns routine
-> social Knowledge diverges / is explicitly reported
-> player deliberately delegates mastered routine
-> save
-> bounded offline settlement advances only safe work
-> return
-> player still owns chapter conclusion
```

---

## 4. Frozen Route of Two

M25 will qualify two strategically distinct complete routes from the same controlled chapter-entry class.

### Route A — Public Order / Institutional Friction

Frozen causal spine:

```text
pre-chapter qualified history
-> M14 public_crackdown
-> three divergent Relationship consequences
-> Valerius forged-ledger inquiry
-> M15 silas_m15_debt_not_renewed
-> silas_exp_old_silence_reinterpreted
-> intentional travel to Whispering Woods
-> M17 combat via ordinary valid tactic
-> return toward City Center
-> active Forge Assistance practice
-> Gronk knows / Valerius initially does not
-> explicit Valerius report + Knowledge consumer
-> M23 valerius_m23_public_override
-> Valerius personal Relationship deepens
-> City Watch reputation -10
-> M24 valerius_m24_redeploy_patrols
-> watchPresence = heavy
-> M24 Silas patrol-pressure consumer
-> deliberately assign Forge Assistance to eligible Copy
-> save/load
-> bounded offline settlement advances/completes only that task
-> M25 public-order conclusion
```

The route's persisted identity is not one M25 flag. It is the composition of existing canonical evidence:

```text
valerius_exp_aftermath_public_crackdown
silas_exp_old_silence_reinterpreted
valerius_exp_m23_public_override
City Watch < 0
Merchant District watchPresence = heavy
Valerius knows Forge fact
forge_assistance familiarity exists
```

### Route B — Quiet Network / Trade Recovery

Frozen causal spine:

```text
same class of pre-chapter qualified history
-> M14 quiet_reroute
-> three different Relationship consequences
-> quest_m14_quiet_reroute
-> intentional City Center -> Merchant District travel
-> prove_reroute
-> gronk_exp_quiet_reroute_proven
-> Valerius forged-ledger inquiry
-> M15 silas_m15_debt_still_counts
-> silas_exp_old_silence_repaid
-> intentional travel to Whispering Woods
-> M17 combat using optional WillowsWisdom tactic
-> return to City Center
-> active Forge Assistance practice
-> Gronk knows / Valerius initially does not
-> explicit Valerius report + Knowledge consumer
-> M23 gronk_m23_guild_audit
-> Merchants Guild reputation +12
-> Gronk personal Relationship unchanged by audit
-> M24 gronk_m24_release_verified_freight
-> tradeFlow = strong
-> M24 Valerius freight-corridor consumer
-> deliberately assign Forge Assistance to eligible Copy
-> save/load
-> bounded offline settlement advances/completes only that task
-> M25 quiet-network conclusion
```

The route's persisted identity is likewise existing canonical evidence:

```text
gronk_exp_aftermath_quiet_reroute
gronk_exp_quiet_reroute_proven
silas_exp_old_silence_repaid
Merchants Guild >= 10
Merchant District tradeFlow = strong
Gronk knows Forge fact
forge_assistance familiarity exists
```

These routes differ in Relationship interpretation, long-horizon callback, active route work, institutional standing, objective world consequence, and combat tactic. They are not cosmetic variants.

---

## 5. M25-only production content

Fresh recon found one real missing semantic at the chapter scale: **a route-sensitive player-facing conclusion that consumes the already-composed authorities without replacing them**.

M25 may therefore add exactly one bounded dialogue content extension:

```text
public/data/m25-chapter-content.json
```

It will contain two non-repeatable conclusion nodes only.

### Public-order conclusion

Frozen ID:

```text
valerius_m25_public_order_conclusion
```

It must read existing canonical prerequisites through the generic dialogue contracts:

- public-crackdown Relationship evidence;
- `silas_exp_old_silence_reinterpreted`;
- `valerius_exp_m23_public_override`;
- Forge routine familiarity;
- Valerius knows `fact_m22_player_practiced_forge_assistance`;
- City Watch reputation remains negative;
- Merchant District `watchPresence = heavy`.

It has no M25 state mutation and no `chapterComplete` flag.

### Quiet-network conclusion

Frozen ID:

```text
gronk_m25_quiet_network_conclusion
```

It must read:

- quiet-reroute Relationship evidence;
- `gronk_exp_quiet_reroute_proven`;
- `silas_exp_old_silence_repaid`;
- Forge routine familiarity;
- Gronk knows `fact_m22_player_practiced_forge_assistance`;
- Merchants Guild reputation >= 10;
- Merchant District `tradeFlow = strong`.

It likewise has no M25 state mutation and no completion flag.

The conclusion itself is a **consumer**, not a new authority.

---

## 6. Content-extension loading decision

M24 currently loads one bounded dialogue extension through an M24-specific block in `initializeNPCsThunk`.

M25 creates the second independent production extension with the same shape:

```text
dialogues
npcDialogueIds
```

Rule-of-Two now justifies one tiny normalization: `initializeNPCsThunk` may iterate a frozen list of the two known extension URLs and merge both through the same generic shape handling.

Frozen list:

```text
/data/m24-world-state-content.json
/data/m25-chapter-content.json
```

This is **not** a plugin framework, manifest system, generalized content registry, dynamic discovery system, arbitrary loader API, or chapter DSL.

No generic file scanning is authorized.

The M24 extension must remain behaviorally identical under this normalization.

---

## 7. Quest / story decision

M25 will **not add a new Quest type, Quest prerequisite type, Quest resolution field, or new M25 quest** merely to call the integration a chapter.

The integrated proof reuses existing quests and interactions where they already carry the required semantics.

In particular:

- `quest_m14_quiet_reroute` is the Route-B route-work proof;
- `quest_m17_telluric_echo` supplies the bounded combat objective;
- M15's long-horizon callback supplies route-sensitive story access;
- M22/M23/M24 dialogues provide later social/institutional/world consumers.

The roadmap's 4–6 quest count remains a budget target, not a requirement to duplicate already-qualified semantics.

---

## 8. Combat decision

M25 will not add a new encounter.

It reuses the M17 Telluric Echo encounter because it is already:

- production-authored;
- quest-integrated;
- location-gated;
- Trait-sensitive;
- deterministic enough for Route-of-Two qualification;
- winnable with or without the optional Trait tactic.

Route A will exercise the ordinary valid line.
Route B will exercise the `WillowsWisdom` tactical line.

This makes learned capability visibly alter action without forcing a golden answer.

---

## 9. Copy / offline decision

No new Copy task is required.

Both routes will:

1. earn Forge familiarity through `practiceForgeAssistanceThunk` during the chapter;
2. use an already-qualified eligible Copy fixture representing pre-chapter Copy progression;
3. start `forge_assistance` through `startCopyProductionTaskThunk`;
4. persist the integrated state through ordinary save/load;
5. settle a bounded positive offline interval through `settleOfflineProgressThunk`;
6. prove Gold/progress changes while unresolved chapter conclusion remains player-owned;
7. only then select the M25 conclusion.

M25 must not invent Copy task-completion history merely to gate the conclusion. The qualification sequence itself proves offline work occurred before the still-player-owned conclusion.

---

## 10. Knowledge decision

The Forge-practice fact remains the only M25 knowledge fact needed.

M25 will not add a new fact catalog entry merely for chapter identity.

Both routes must prove the existing divergence in-line:

```text
Forge practice
-> Gronk knows
-> Valerius does not
```

then explicit report:

```text
valerius_m22_forge_report
-> Valerius knows
```

and consume it through:

```text
valerius_m22_forge_logistics
```

Route conclusions may additionally gate on the relevant NPC's canonical Knowledge.

---

## 11. Persistence boundary

Each route must cross one ordinary save/load boundary **after** the chapter has accumulated meaningful multi-domain state and after the Copy task has been deliberately assigned.

After restore, the suite must prove preservation of at least:

- route-defining Relationship Experiences;
- permanent `WillowsWisdom`;
- Forge familiarity;
- Gronk/Valerius Knowledge divergence or post-report Knowledge as appropriate;
- Faction standing;
- Merchant District World State;
- player location;
- running Copy production-task identity/progress;
- relevant Quest state.

Then bounded M21 settlement occurs on the restored state.

No M25 save-schema change is authorized by recon.

---

## 12. M25 conclusion gates are below UI

The two M25 conclusion nodes use the existing `processNPCInteractionThunk` prerequisite contracts.

The dedicated suite must prove direct thunk attempts fail before conclusion when at least one required canonical authority is absent, for example:

- missing required Relationship evidence;
- missing NPC Knowledge;
- wrong Faction standing;
- wrong World State.

UI visibility is supporting evidence only.

There is no `m25Route`, `chapterResult`, `merchantCrisisComplete`, or equivalent shadow authority.

---

## 13. Required dedicated qualification suite

Frozen target:

```text
src/features/NPCs/M25CompleteChapterVerticalSlice.test.tsx
```

The suite must prove at least:

1. production M25 extension contains exactly the two bounded conclusion nodes;
2. M24 and M25 extensions load through the same frozen two-URL normalization;
3. no new M25 reducer/save root/quest type/condition DSL/chapter flag is introduced;
4. public-order conclusion fails closed without its composed prerequisites;
5. quiet-network conclusion fails closed without its composed prerequisites;
6. full Route A executes from chapter entry through conclusion;
7. full Route B executes from chapter entry through conclusion;
8. both routes perform legal travel rather than location teleport for M25-under-test travel beats;
9. both routes complete the real M17 combat Quest through the existing combat event bridge;
10. Route A uses the ordinary viable combat line;
11. Route B uses the optional `WillowsWisdom` tactical line;
12. M14 route choice produces distinct multi-NPC Relationship evidence;
13. M15 callback differs according to that older history;
14. Forge practice creates Gronk/Valerius Knowledge divergence;
15. explicit report transfers Knowledge without automatic Relationship mutation;
16. Route A produces negative City Watch standing plus heavy Watch presence;
17. Route B produces positive Merchants Guild standing plus strong trade flow;
18. social/world authorities do not mirror one another automatically;
19. Forge familiarity authorizes deliberate Copy assignment;
20. ordinary save/load preserves integrated route state;
21. offline settlement advances/completes only the already-running routine Copy task;
22. chapter conclusion remains absent/illegal until its route-specific composed prerequisites exist;
23. the opposite route conclusion remains unavailable after route completion;
24. no M25 state mutation occurs merely by reading/selecting the conclusion;
25. accumulated M4–M24 qualification remains green.

---

## 14. Build Validation integration

Add one new first behavioral gate:

```text
M25 complete chapter vertical slice qualification
```

Then preserve every existing gate unchanged:

```text
TypeScript
M25
M24
M23
M22
Checkpoint C repair
M21
M20
Active-loop repair
modified historical qualification
accumulated M4–M19 qualification
production build
```

M25 does not remove or weaken historical evidence to make the integrated route pass.

---

## 15. Stop conditions refined by recon

In addition to the preregistration, implementation must stop and split a prerequisite repair if:

- the existing generic dialogue prerequisite/effect contracts cannot express the two conclusions without a new condition language;
- the M24/M25 extension normalization changes M24 behavior;
- M17 cannot be exercised coherently in the integrated route without changing its qualified combat semantics;
- M20/M21 require a new offline/narrative bridge;
- a conclusion needs a synthetic chapter-completion boolean to distinguish routes;
- route fixtures must directly seed any state that the route itself is supposed to prove;
- the two routes converge to state-equivalent endings except for text.

---

## 16. Evidence ceiling after recon

If M25 passes, the intended strongest claim remains:

> One bounded Merchant District chapter can compose pre-existing qualified Relationship history, permanent Trait capability, intentional travel, Trait-sensitive combat, multi-NPC decision consequences, long-horizon callbacks, divergent Knowledge, independent institutional reputation, objective regional World State, player-learned routine familiarity, deliberate Copy delegation, persistence, and bounded offline routine progress into at least two strategically distinct routes whose player-facing conclusions consume canonical domain state rather than a chapter-local shadow flag.

It will still not qualify human pacing, comprehension, emotional impact, fun, final balance, commercial viability, retention, or campaign-scale chapter authoring.

---

## 17. Implementation boundary

With this recon amendment frozen, behavioral work is now authorized only for:

```text
1. two-node m25 chapter content extension
2. two-extension normalization in NPC initialization
3. M25 Route-of-Two qualification suite
4. additive Build Validation gate
```

Anything larger requires an explicit prerequisite finding rather than silent scope expansion.