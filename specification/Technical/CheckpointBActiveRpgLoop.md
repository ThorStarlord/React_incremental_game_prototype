# Checkpoint B — Active RPG Loop Evaluation

**Status:** Evaluation contract frozen before verdict-producing reconnaissance  
**Baseline:** `e73f7ccb08752dfbb9b03749950b8208fd91eefe`  
**Baseline tree:** `e085de1f2efbabf53b401496cd78deb907522829`  
**Branch:** `chore/checkpoint-b-active-rpg-loop`

## Purpose

Checkpoint B is a product/architecture evaluation, not a feature milestone.

The question is no longer whether the individual Relationship, Trait, Quest, Combat, Exploration, Tether, and Essence mechanics can work in isolation. M13-M19 already provide bounded empirical evidence for those mechanics. This checkpoint asks whether the existing production surfaces compose into a coherent **active RPG loop** before the roadmap authorizes incremental automation through M20.

## Evaluation question

> Do the qualified Relationship, Trait, Quest, Combat, Exploration, Tether, and Essence capabilities compose into a coherent active RPG loop in which player decisions have understandable causes, meaningful tradeoffs, and visible consequences?

## Required evaluation axes

Checkpoint B records two independent verdict axes before producing an overall authorization decision.

### Axis A — Technical composition

Evaluate whether the current production architecture supports a causal chain approximating:

```text
meaningful NPC interaction
-> Relationship Experience / Memory / Connection
-> Relationship-derived Essence / Trait-learning conditions
-> permanent learned Trait
-> player-facing Quest / Combat capability
-> player choice
-> authored travel through objective space
-> location-sensitive Quest and spatial Tether consequences
-> gameplay consequence
-> later Relationship interpretation where authored
```

A technical PASS does **not** require one single quest to exercise every link. It requires the links to compose through compatible authoritative state/contracts without duplicate shadow state or contradictory ownership.

### Axis B — Player-facing coherence

Evaluate whether a player can reasonably understand and experience the active loop as one game rather than as unrelated menus/systems.

The evaluation must inspect:

1. **Relationship -> capability legibility** — can the player understand that a learned capability came from a consequential relationship rather than an arbitrary perk menu?
2. **Capability identity** — does an important Trait preserve a coherent semantic identity across independent gameplay uses?
3. **Travel agency** — is there an understandable reason to move, and does movement alter real gameplay facts?
4. **Spatial opportunity cost** — can location make one relationship more immediately resonant while another becomes less immediate?
5. **Combat / gameplay choice quality** — does Trait ownership expand options without becoming an automatic best action or prerequisite for success?
6. **Essence / Tether legibility** — can the current rate change be explained from Relationship significance plus present world context?
7. **Consequence closure** — do gameplay consequences reconnect to story/Relationship state in at least bounded production slices rather than ending as isolated mechanical output?

## Primary integrated probe

Use **Elder Willow / `WillowsWisdom`** as the primary integrated probe because current qualified production evidence spans:

```text
Willow Relationship
-> Relationship-mediated Trait learning
-> permanent WillowsWisdom
-> Trait-sensitive Quest capability (M16)
-> Trait-sensitive Combat capability (M17)
-> travel toward Whispering Woods (M18)
-> spatial Willow Tether / Essence changes (M19)
```

Use Gronk as an independent spatial-opportunity-cost corroboration where relevant.

## Evidence sources

Checkpoint B may use:

- production content and UI wiring on the frozen branch;
- existing milestone qualification tests/results through M19;
- current canonical specifications;
- a structured repository-backed cognitive walkthrough.

Automated tests may establish state/contract composition. They cannot by themselves establish human enjoyment, pacing, clarity, or usability.

## No-feature constraint

Checkpoint B begins as a **documentation/evaluation-only milestone**.

Do not add runtime behavior, production content, save-schema changes, generic frameworks, or new tests merely to make the checkpoint pass.

If the evaluation discovers a missing bridge or player-facing weakness, record it as evidence. Do not repair it inside this checkpoint unless a separate bounded repair milestone is explicitly authorized after the verdict.

In particular, do not introduce:

- generalized world-state architecture;
- a generalized ability/condition DSL;
- new combat systems;
- new Trait semantics;
- new travel/Tether semantics;
- Copy automation;
- offline progression;
- faction/knowledge systems;
- new Relationship dimensions or shadow social flags.

## Evaluation matrix

For each transition, record:

| Transition | Existing production proof | Technically integrated now? | Player-visible / understandable? | Gap class |
|---|---|---|---|---|
| Story / gameplay -> Relationship | M13-M15 | TBD | TBD | TBD |
| Relationship -> permanent Trait | Willow/Elara + M16 | TBD | TBD | TBD |
| Trait -> Quest capability | M16 | TBD | TBD | TBD |
| Trait -> Combat capability | M17 | TBD | TBD | TBD |
| Travel -> Quest consequence | M18 | TBD | TBD | TBD |
| Travel -> spatial Tether | M19 | TBD | TBD | TBD |
| Tether -> live Essence rate | M19 | TBD | TBD | TBD |
| Combat -> Quest consequence | M17 | TBD | TBD | TBD |
| Gameplay consequence -> later Relationship interpretation | M13-M17 bounded slices | TBD | TBD | TBD |

Gap classes should distinguish at least:

- missing mechanic;
- missing production-content bridge;
- UI / feedback / explainability weakness;
- pacing / sequencing weakness;
- economy/relevance weakness;
- no material gap found.

## Structured cognitive walkthrough

For the Willow-centered probe, answer from repository evidence:

1. Can the player identify why `WillowsWisdom` became available/permanent?
2. Can the player see a coherent connection between its Quest and Combat uses?
3. Can the player intentionally travel toward Willow / Whispering Woods through the M18 UI?
4. Does that travel change objective Quest state and/or current Willow Tether/Essence without rewriting the Relationship?
5. Is the resulting Tether/Essence change surfaced or explainable in the current UI?
6. Can a `WillowsWisdom` owner still choose an ordinary gameplay/combat route?
7. Does at least one qualified gameplay consequence feed later Relationship evidence/story causality?
8. Does the current production content present these links as a discoverable sequence, or are they only composable when an evaluator manually stitches separate milestone fixtures together?

The final question is intentionally strict: **architecture can compose while product sequencing remains weak**.

## Verdict scale

### Technical composition

- **PASS** — current authorities/contracts compose without a new architectural bridge; remaining issues are presentation/content/pacing rather than structural incompatibility.
- **WEAK** — composition is possible only through notable manual stitching, duplicated state, brittle one-off bridges, or a missing bounded integration contract.
- **FAIL** — one or more core authorities fundamentally conflict or the intended causal chain cannot be represented without redesign.

### Player-facing coherence

- **PASS** — a player-facing production route already communicates the major causal links and meaningful tradeoffs with only normal polish debt remaining.
- **WEAK** — the mechanics are technically coherent but the current product does not yet make the integrated causal loop sufficiently legible/discoverable/continuous.
- **FAIL** — the player-facing experience materially contradicts the intended loop or the systems behave as disconnected features with no credible bounded integration path.

## Overall authorization outcomes

The checkpoint ends with exactly one marker:

```text
CHECKPOINT_B_PASS
M20 authorized
```

or

```text
CHECKPOINT_B_WEAK
bounded active-loop integration repair required
M20 not authorized
```

or

```text
CHECKPOINT_B_FAIL
active RPG architecture requires reconsideration
M20 not authorized
```

A technical PASS plus player-facing WEAK normally produces `CHECKPOINT_B_WEAK`, because the roadmap requires a coherent active RPG loop before automation is added.

## Acceptance criteria

- baseline SHA/tree frozen;
- evaluation contract committed before verdict-producing recon;
- actual production wiring traced from repository authority;
- Willow-centered integrated probe documented;
- Gronk spatial corroboration considered;
- technical composition and player-facing coherence scored independently;
- no runtime/content/test/save/workflow behavior changed to influence the verdict;
- concrete gaps classified rather than vaguely described;
- explicit authorization marker recorded;
- product/canon status updated only as necessary to reflect the checkpoint result;
- docs-only exact-head Build Validation passes before merge;
- merge uses expected-head guard;
- integrated tree verified;
- post-merge CI claimed only if an actual run exists;
- stop before any M20 implementation.

## Evidence ceiling

Checkpoint B can establish whether the **current repository** composes into a technically coherent and/or player-legible bounded active RPG loop based on production wiring, existing qualification evidence, and a structured cognitive walkthrough.

It cannot establish human enjoyment, commercial viability, long-session pacing, accessibility, retention, campaign-scale balance, or broad player comprehension without actual external playtesting.
