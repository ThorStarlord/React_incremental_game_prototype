# M25 — Complete Chapter Vertical Slice Qualification

**Status:** Preregistered before M25 behavior/content changes  
**Branch:** `feature/m25-complete-chapter-vertical-slice`  
**Frozen baseline `main`:** `5866e8f898d909641e9f46ff927c2d399691e353`  
**Frozen baseline tree:** `a7634babc08653fc1de51ae3e3c3ce7e303e290a`  
**Prior milestone:** M24 Objective World State = `M24_PASS`  
**Next boundary if M25 qualifies and merges:** human integrated playability review

---

## 1. Scientific / product question

> Can the qualified Relationship, Trait, Combat, Exploration, Tether, Copy, Offline, Knowledge, Faction, and World-State systems compose into one coherent playable chapter in which earlier social history changes capability, capability changes action, action changes world/social consequences, and routine work can be delegated without surrendering important player decisions?

This is the M25 question from the post-M17 roadmap, frozen against the actual documentation-complete M24 merged baseline.

M25 is an **integration and authored-content qualification**. It is not permission to hide a new large subsystem inside a chapter.

---

## 2. Hypothesis

The already-qualified systems should be sufficient to author one bounded production chapter where causal state crosses multiple existing domains through their public contracts rather than through shadow flags or duplicated authority.

A successful chapter should make a coherent chain observable:

```text
prior social history
-> available learned capability / interpretation
-> intentional travel and active play
-> capability-sensitive action
-> combat / investigation / resolution
-> objective world consequence
-> divergent NPC knowledge
-> personal Relationship consequences
-> independent Faction consequence
-> routine follow-up becomes Copy-delegatable
-> bounded offline progress advances only safe routine work
-> return leaves a meaningful player-owned decision / conclusion
```

This hypothesis does **not** predeclare the Merchant District implementation, exact quests, exact Trait, exact combat encounter, or exact route structure. Fresh recon must determine what the merged runtime can honestly compose.

---

## 3. Leading chapter hypothesis, not frozen implementation

The roadmap recommends **Merchant District Crisis** because the area already contains qualified history involving Silas, Valerius, Gronk, the City Watch, the Merchants Guild, Knowledge, and objective Merchant District World State.

Recon should test that hypothesis first.

The final chapter may use that setting only if it can compose the required systems without inventing artificial M25-only bypasses.

---

## 4. Required chapter-scale authorities

M25 must preserve the independent ownership established by prior milestones:

```text
WORLD / WORLD STATE -> location, objective events, objective regional conditions
KNOWLEDGE           -> which NPC knows which objective facts
RELATIONSHIP        -> what shared history means between specific people
TRAIT               -> what capability the protagonist has internalized
PLAYER              -> possessed capability/loadout and player-owned state
GAMEPLAY            -> what active actions are available / legal
QUEST / STORY       -> pursued problems and authored consequences
FACTION             -> institutional standing
COPY                -> explicitly delegatable routine work
OFFLINE             -> bounded progression of already-running safe routine processes
```

M25 may compose these authorities. It must not collapse them.

---

## 5. Minimum production chapter shape

The final qualified chapter must contain a coherent bounded path with all of the following classes of beat represented by real production content:

1. **Establish problem** — a chapter-scale Merchant-District or recon-justified crisis/problem becomes actionable.
2. **Social investigation** — existing Relationship and/or Knowledge state changes what information or access is available.
3. **Capability opportunity** — at least one already-qualified learned Trait or capability materially changes an active option or resolution path.
4. **Intentional travel** — the player moves among meaningful existing locations because the problem requires it.
5. **Combat** — at least one bounded existing-style encounter is part of chapter progress; no new combat architecture is required.
6. **Shared social decision** — one player decision has independently authored meaning for more than one principal NPC.
7. **Long-horizon callback** — prior Relationship evidence materially affects later access, interpretation, or consequence.
8. **Objective world consequence** — chapter action changes qualified World State through World-State authority.
9. **Knowledge divergence / transfer** — the chapter demonstrates that not every NPC automatically knows the same fact.
10. **Faction consequence** — institutional standing changes independently from personal Relationship state.
11. **Automation opportunity** — a routine follow-up uses the already-qualified Copy delegation contract.
12. **Offline return** — bounded offline settlement may advance only an already-running safe routine process.
13. **Conclusion** — chapter-ending content reflects the actual composed state rather than a single generic completion flag.

Recon may satisfy multiple beats through one coherent scene when the authorities remain independently authored and independently testable.

---

## 6. Integration budget / anti-expansion control

Roadmap target remains approximately:

```text
3 principal NPCs
1–2 secondary NPCs
4–6 quests
1–2 Trait-sensitive problems
1 combat encounter
3–5 meaningful locations
1 multi-NPC decision
1 long-horizon callback
1 Copy automation opportunity
1 offline-return beat
2 factions
1 bounded world-state cluster
multiple NPC knowledge states
1 coherent chapter ending
```

This is a budget, not a requirement to maximize counts.

If fresh recon shows the same product proof can be achieved with less new authored content by composing existing qualified content, prefer the smaller integration.

---

## 7. Required Route-of-Two qualification

Automated qualification must exercise **at least two strategically distinct complete chapter routes** from a controlled chapter/new-game start through conclusion.

The two routes must differ in a material decision or capability/history dependency, not merely response text.

Required route shape:

```text
chapter start
-> travel
-> Relationship / Knowledge-sensitive access
-> Trait-sensitive active choice
-> combat
-> shared decision
-> Knowledge + Relationship + Faction + World-State consequences
-> Copy delegation
-> save/load
-> bounded offline settlement
-> chapter conclusion
```

The final proof must show that both routes are valid while producing at least one meaningful persisted divergence in later chapter state or conclusion.

A single golden route with a cosmetic alternate response is insufficient.

---

## 8. Required positive controls

The final M25 production qualification must prove, at minimum:

1. Chapter start is reachable through ordinary production surfaces.
2. The player must intentionally traverse existing travel/location authority for required beats.
3. Prior Relationship and/or Knowledge evidence changes at least one real later option/access path.
4. An already-qualified Trait/capability changes at least one active gameplay or resolution option.
5. At least one combat encounter is completed through ordinary combat authority.
6. One shared player decision produces independently authored consequences for multiple social authorities without mirroring them automatically.
7. Objective Merchant District state changes through World-State authority and is later consumed.
8. At least two NPCs can hold different Knowledge about a chapter-relevant fact at the same point in the route.
9. Faction Reputation changes through Faction authority and does not substitute for personal Relationship state.
10. A routine follow-up becomes delegatable only under the already-qualified Copy eligibility/familiarity contract.
11. Save/load preserves the integrated chapter state.
12. Offline settlement advances only the already-running safe routine process and does not auto-resolve player-owned narrative/combat/travel/social decisions.
13. Chapter conclusion is gated below the UI by the actual required integrated state.
14. At least two strategically distinct routes reach legitimate conclusions with meaningful persisted divergence.
15. Accumulated M4–M24 qualification remains green on the exact candidate.

---

## 9. Causal-chain controls

M25 must prove composition rather than co-location.

At least one route must demonstrate an explicit causal chain comparable to:

```text
prior Relationship evidence
-> Trait/capability access or interpretation
-> active action becomes possible / changes
-> authored action mutates objective or social state
-> later content reads that changed authority
```

At least one later beat must consume earlier state through the canonical selector/prerequisite contract rather than through a duplicate chapter-local boolean.

---

## 10. Independence controls

M25 must retain the prior milestone separations while composing them.

The qualification should include snapshots/controls sufficient to show, where applicable:

```text
Knowledge change       != automatic Relationship change
Relationship change    != automatic Faction change
Faction change         != automatic World-State change
World-State change     != automatic Knowledge grant
Copy/offline progress  != narrative decision automation
Trait availability     != quest-completion alias
chapter completion     != one giant shadow flag replacing domain state
```

If one authored scene legitimately changes multiple domains, each effect must be explicit and independently attributable.

---

## 11. Persistence / compatibility controls

The chapter must survive ordinary persistence boundaries using the existing save envelope.

Qualification must prove:

- integrated chapter progress survives save/load;
- Relationship, Knowledge, Faction, World State, Quest, Copy, and relevant Player/Trait state remain coherent after load;
- offline settlement after load advances only qualified safe work;
- new-game/reset does not leak prior chapter state;
- M25 does not require a schema migration unless fresh recon demonstrates a genuinely incompatible representation need.

---

## 12. Falsification / stop conditions

M25 must stop, produce a non-PASS result, or isolate a prerequisite repair if recon/implementation shows any of the following:

1. A large new generic subsystem is required to make the chapter work.
2. The chapter only works by adding shadow booleans that duplicate Relationship, Knowledge, Faction, World State, Trait, Quest, Copy, or Offline authority.
3. The two automated routes are strategically identical apart from text/cosmetic response choice.
4. A required legality gate exists only in UI and can be bypassed below UI.
5. Copy or offline progression resolves meaningful narrative, travel, combat, Relationship, Knowledge, Faction, or World-State decisions for the player.
6. Relationship, Knowledge, Faction, or World State are synchronized/mirrored merely to simplify chapter authoring.
7. Trait-sensitive content actually reads quest/story completion instead of qualified capability state.
8. Chapter conclusion is a generic `completed=true` path that does not consume the intended integrated causal state.
9. Persistence reconstructs or invents chapter social/world facts after load instead of preserving canonical authority.
10. M25 requires broad balance tuning, generalized encounter generation, new AI, generalized chapter scripting infrastructure, or campaign-scale narrative architecture.
11. Accumulated M4–M24 qualification regresses materially.

A prerequisite repair must be qualified separately rather than smuggled into M25 under the name of integration.

---

## 13. Explicit non-goals

M25 does **not** attempt to qualify:

- complete campaign scalability;
- all chapters / acts / endings;
- generalized chapter-authoring DSL or workflow engine;
- procedural narrative generation;
- final combat balance;
- final economy balance;
- generalized faction diplomacy;
- generalized Knowledge/rumor simulation;
- city/economy/population/ecology simulation;
- autonomous Copy planning or task chaining;
- offline narrative simulation;
- final UX/accessibility polish;
- commercial viability;
- retention;
- human pacing, comprehension, emotional impact, or fun.

Those human experience questions remain for the explicit **human integrated playability review** after a successful M25 merge.

---

## 14. Qualification workflow

After this preregistration is committed:

```text
fresh post-M24 repository recon
-> map existing chapter-capable content and all required system seams
-> freeze M25 recon amendment before behavioral implementation
-> author / connect the smallest coherent complete chapter
-> add Route-of-Two M25 qualification suite
-> add M25 as an additive Build Validation gate
-> freeze first complete behavioral SHA/tree
-> exact-head Build Validation
-> record M25 result + evidence ceiling
-> reconcile only canon actually superseded by M25
-> freeze documentation-complete SHA/tree
-> exact-head Build Validation again
-> expected-head merge only if PASS
-> verify integrated tree / parents / signature
-> query merge SHA separately for actual post-merge workflows
-> STOP at human integrated playability review boundary
```

Repository Gemini review remains diagnostic only. Build Validation plus these preregistered criteria are merge authority.

---

## 15. Verdict vocabulary

The result document must use exactly one of:

```text
M25_PASS
M25_WEAK
M25_FAIL
```

### `M25_PASS`

At least two strategically distinct complete production routes compose the existing qualified systems through a coherent bounded chapter, accumulated M4–M24 qualification remains green, and no blocking architectural contradiction remains.

After merge, automated milestone implementation stops and the next required activity is the human integrated playability review.

### `M25_WEAK`

The integrated direction remains viable, but a bounded prerequisite/integration repair is required before the chapter can honestly qualify. Human integrated playability review remains premature.

### `M25_FAIL`

The current qualified systems do not compose into the intended chapter loop without material architectural/product reconsideration.

---

## 16. Evidence ceiling target

If qualified, the strongest intended claim is only:

> One bounded chapter demonstrates the intended integrated product loop: consequential Relationships can affect learned capability or access, learned capability can alter active gameplay, active play can change objective and social conditions, routine follow-up can be delegated and advanced offline, and the resulting state remains narratively causal across persistence through at least two strategically distinct routes.

M25_PASS would **not** qualify human comprehension, pacing, emotional quality, fun, final balance, retention, campaign scalability, or commercial readiness.