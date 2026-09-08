# M25 — Complete Chapter Vertical Slice Result

**Verdict:** `M25_PASS`  
**Frozen baseline:** `5866e8f898d909641e9f46ff927c2d399691e353`  
**Baseline tree:** `a7634babc08653fc1de51ae3e3c3ce7e303e290a`  
**Preregistration:** `specification/Technical/M25CompleteChapterVerticalSlice.md`  
**Preregistration commit:** `2663bc44cbca742bce71fa63db11852d455025ec`  
**Recon amendment:** `specification/Technical/M25CompleteChapterVerticalSliceReconAmendment.md`  
**Recon amendment commit:** `358c519d685caf78a834d602f624a74e1553ed11`

---

## 1. Answer to the preregistered question

Yes.

The already-qualified Relationship, Trait, Combat, Exploration, Knowledge, Faction, World-State, Copy, persistence, and bounded Offline authorities can compose into one coherent Merchant District chapter without a chapter engine, chapter-local shadow state, new save schema, new condition DSL, new combat model, or generalized simulation layer.

The first complete behavioral candidate qualified two strategically distinct production routes:

```text
Route A — Public Order / Institutional Friction
Route B — Quiet Network / Trade Recovery
```

Both routes begin from the same class of controlled pre-chapter history, execute real production interactions and travel, complete the real M17 combat quest, accumulate route-specific Relationship/Knowledge/Faction/World-State consequences, deliberately delegate a personally learned routine to a Copy, cross save/load, settle bounded offline routine progress, and terminate in different player-facing conclusions that consume canonical domain state rather than one chapter-completion boolean.

Therefore:

```text
M25_PASS
```

---

## 2. First complete behavioral candidate

```text
head
b0bbf25012b3ef66a7853a999b36e80a73e688ba

tree
eea9694ed939da0e1fd9d2b189655dcee57259af

Build Validation #247
run 34215192746
job 102025183866
PASS
```

Every gate completed successfully on that candidate:

```text
TypeScript                                       PASS
M25 complete chapter vertical slice             PASS
M24 objective world state                       PASS
M23 faction reputation                          PASS
M22 social knowledge propagation                PASS
Checkpoint C integration repair                 PASS
M21 bounded offline progress                    PASS
M20 Copy production automation                  PASS
Active RPG loop repair                          PASS
Modified historical qualification               PASS
Accumulated M4–M19 qualification                PASS
Production build                                PASS
```

The earlier #244, #245, and #246 candidates failed at TypeScript before M25 behavior ran because the new qualification source initially treated optional NPC/dialogue fields as statically mandatory. Those were compile-time test defects only; they produced no behavioral M25 verdict. The type assertions were corrected to respect the existing schema without weakening any M25 behavioral control.

---

## 3. What M25 actually added

M25 remained intentionally thin.

Behavioral production changes are only:

```text
public/data/m25-chapter-content.json
```

with two bounded, non-repeatable, mutation-free conclusion consumers:

```text
valerius_m25_public_order_conclusion
gronk_m25_quiet_network_conclusion
```

plus one small normalization in `initializeNPCsThunk` so the two known bounded production content extensions:

```text
/data/m24-world-state-content.json
/data/m25-chapter-content.json
```

share the same merge path.

There is no dynamic content discovery, manifest framework, chapter DSL, M25 reducer, M25 save root, new Quest type, generalized condition language, or `chapterComplete` / `m25Route` authority.

The dedicated cross-system proof is:

```text
src/features/NPCs/M25CompleteChapterVerticalSlice.test.tsx
```

and Build Validation now runs it before all historical gates.

---

## 4. Route A — Public Order / Institutional Friction

The qualified public-order route composes:

```text
pre-chapter qualified Gronk / Silas / Valerius history
        ↓
M14 valerius_m14_aftermath_council
        ↓
public_crackdown
        ↓
three independently authored Relationship consequences
        ↓
M15 forged-ledger inquiry
        ↓
silas_m15_debt_not_renewed
        ↓
silas_exp_old_silence_reinterpreted
        ↓
legal City Center -> City Gate -> Whispering Woods travel
        ↓
M17 Telluric Echo combat through ordinary viable tactic
        ↓
legal return to City Center
        ↓
personal Forge Assistance practice
        ↓
Gronk knows objective fact / Valerius remains ignorant
        ↓
explicit report to Valerius
        ↓
Valerius Knowledge changes, Relationship does not
        ↓
M22 Knowledge consumer
        ↓
M23 public Watch override
        ↓
Valerius personal Trust deepens
+
City Watch Reputation = -10
        ↓
M24 patrol redeployment
        ↓
Merchant District watchPresence = heavy
        ↓
Silas world-state consumer
        ↓
player deliberately assigns known Forge routine to Copy
        ↓
save / load
        ↓
bounded offline settlement completes only the running routine task
        ↓
valerius_m25_public_order_conclusion
```

The route therefore demonstrates that a personally endorsed decision can still create institutional friction and a harder objective security posture.

The conclusion is legal only because the composed canonical evidence exists:

```text
public-crackdown Relationship evidence
Silas debt reinterpretation
Valerius public-override Relationship evidence
Forge familiarity
Valerius Knowledge of the Forge fact
City Watch reputation < 0
Merchant District watchPresence = heavy
```

Selecting the conclusion does not mutate Relationship, Knowledge, Faction, World State, or Quest authority.

---

## 5. Route B — Quiet Network / Trade Recovery

The qualified quiet-network route composes:

```text
same class of pre-chapter qualified history
        ↓
M14 valerius_m14_aftermath_council
        ↓
quiet_reroute
        ↓
three different Relationship consequences
        ↓
quest_m14_quiet_reroute
        ↓
legal City Center -> Merchant District travel
        ↓
prove_reroute
        ↓
gronk_exp_quiet_reroute_proven
        ↓
M15 forged-ledger inquiry
        ↓
silas_m15_debt_still_counts
        ↓
silas_exp_old_silence_repaid
        ↓
legal Merchant District -> City Center -> City Gate -> Whispering Woods travel
        ↓
M17 Telluric Echo combat through optional WillowsWisdom tactic
        ↓
legal return to City Center
        ↓
personal Forge Assistance practice
        ↓
Gronk knows / Valerius initially does not
        ↓
explicit Valerius report + Knowledge consumer
        ↓
M23 Merchants Guild audit
        ↓
Merchants Guild Reputation = +12
+
Gronk Relationship unchanged by institutional approval
        ↓
M24 verified freight release
        ↓
Merchant District tradeFlow = strong
        ↓
Valerius world-state consumer
        ↓
player deliberately assigns Forge routine to Copy
        ↓
save / load
        ↓
bounded offline settlement completes only the running routine task
        ↓
gronk_m25_quiet_network_conclusion
```

The conclusion is legal only because the route has actually produced:

```text
quiet-reroute Relationship evidence
proved-reroute Relationship evidence
Silas debt repayment
Forge familiarity
Gronk Knowledge of the Forge fact
Merchants Guild reputation >= 10
Merchant District tradeFlow = strong
```

The opposite public-order conclusion remains unavailable.

---

## 6. Strategic route distinction

The Rule-of-Two is not cosmetic.

The routes differ in at least:

```text
M14 shared decision
three-NPC Relationship interpretation
whether a real reroute quest is created and completed
M15 long-horizon Silas callback
M17 combat tactic actually selected
institution affected
Faction standing
objective Merchant District condition
world-state downstream consumer
final NPC / conclusion
```

The routes deliberately converge on Forge familiarity, Knowledge transfer, Copy delegation, persistence, and offline settlement because those are shared chapter capabilities rather than route identity.

So M25 proves:

```text
shared systems
!=
shared outcome
```

---

## 7. Causal composition now demonstrated

M25's central architectural result is that previously separate milestone authorities now form real causal chains.

One qualified chain is:

```text
old Relationship history
-> later authored interpretation
-> player route choice
-> real travel / quest work
-> later Relationship evidence
-> institutional consequence
-> objective World State
-> later NPC content
```

Another is:

```text
learned permanent Trait
-> optional combat action exists
-> active tactical choice
-> combat quest progress
```

And the late-chapter idle loop is:

```text
player personally performs Forge routine
-> objective familiarity exists
-> NPC Knowledge diverges
-> player explicitly reports to another NPC
-> same familiarity authorizes Copy delegation
-> save / load
-> bounded offline time advances only already-running routine work
-> unresolved chapter conclusion remains player-owned
```

This is composition rather than merely having multiple reducers in one store.

---

## 8. Independence controls retained

The complete chapter keeps the prior authorities separate:

```text
WORLD / WORLD STATE
what objectively exists / happened

KNOWLEDGE
who knows it

RELATIONSHIP
what shared history means personally

FACTION
how an institution regards the player

TRAIT / PLAYER CAPABILITY
what the protagonist can now do

QUEST / COMBAT / TRAVEL
what active action is happening

COPY
what routine work the player deliberately delegated

OFFLINE
how already-running safe routine work advances while absent
```

Specific M25 controls prove:

```text
Knowledge transfer != automatic Relationship change
Guild approval      != Gronk Relationship change
Valerius trust      != City Watch approval
Faction state       != World State
World State         != automatic Knowledge grant
Trait ownership     != mandatory golden tactic
Offline progress    != narrative auto-resolution
conclusion           != chapter-local shadow state
```

---

## 9. Persistence and offline boundary

Both routes cross an ordinary save/load boundary after accumulating meaningful multi-domain state and after the player deliberately starts the Copy's Forge Assistance task.

After restore, the suite proves relevant route state remains coherent, including:

```text
Relationship Experiences
permanent WillowsWisdom
Forge routine familiarity
NPC Knowledge
Faction standing
Merchant District World State
player location
Quest state
running Copy task
```

Then bounded offline settlement completes the already-running Forge routine and grants its authored Gold reward.

The suite snapshots and proves no offline mutation to:

```text
Relationship
Quest
Knowledge
Faction
World State
player location
```

Therefore M25 preserves the key product boundary:

```text
delegate grind
!=
delegate judgment
```

---

## 10. Chapter conclusions are consumers, not authority

The two M25 conclusion nodes have:

```text
repeatable = false
effects = []
```

They are gated below UI by existing Relationship, familiarity, Knowledge, Faction, and World-State prerequisite contracts.

Direct thunk attempts fail before the required composed evidence exists.

After a valid route, the opposite conclusion still fails.

The route-specific conclusion records ordinary dialogue completion only; it does not synthesize a new gameplay authority.

---

## 11. No hidden subsystem was required

Fresh recon predicted the chapter could be built by composition. The result confirms that prediction.

M25 introduced no:

- chapter engine;
- generalized quest graph;
- new game-state slice;
- schema migration;
- chapter-state machine;
- chapter result enum;
- generalized condition DSL;
- generalized content plugin loader;
- new combat architecture;
- new world-state field;
- new Knowledge fact;
- new Copy task;
- autonomous offline narrative logic.

That is a significant product result: the existing milestone architecture was sufficient to author and qualify a complete bounded chapter loop.

---

## 12. Evidence ceiling

`M25_PASS` qualifies only this bounded claim:

> One bounded Merchant District chapter can compose pre-existing qualified Relationship history, permanent Trait capability, intentional travel, Trait-sensitive combat, multi-NPC decision consequences, long-horizon callbacks, divergent Knowledge, independent institutional reputation, objective regional World State, player-learned routine familiarity, deliberate Copy delegation, persistence, and bounded offline routine progress into at least two strategically distinct routes whose player-facing conclusions consume canonical domain state rather than a chapter-local shadow flag.

It does **not** qualify:

- human comprehension;
- pacing;
- emotional impact;
- fun;
- final UX quality;
- final combat/economy balance;
- retention;
- commercial viability;
- campaign-scale chapter authoring;
- generalized content scalability;
- generalized faction diplomacy;
- generalized rumor/Knowledge simulation;
- generalized world simulation;
- autonomous Copy planning;
- offline narrative simulation.

Those product-experience questions are intentionally outside automated M25 authority.

---

## 13. Next boundary

With `M25_PASS`, the automated post-M17 milestone sequence is complete.

The next correct activity is **not M26**.

It is:

```text
HUMAN INTEGRATED PLAYABILITY REVIEW
```

That review must evaluate what the automated qualification deliberately cannot establish:

```text
Does the chapter make sense to a human player?
Does the causal structure read clearly without test knowledge?
Do the route differences feel meaningful?
Does Relationship history feel like history rather than gates?
Does the Trait feel learned and useful rather than decorative?
Does travel feel intentional rather than connective friction?
Does combat belong in the chapter rhythm?
Do Knowledge / Faction / World-State consequences read as distinct?
Does Copy/offline delegation feel relieving rather than disempowering?
Is the chapter paced well?
Is it fun enough to justify the architecture?
```

M25 implementation and automated milestone work must stop at that boundary after documentation-complete exact-head qualification and merge.