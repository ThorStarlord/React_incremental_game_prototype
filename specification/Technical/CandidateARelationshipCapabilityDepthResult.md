# Candidate A Relationship-Capability Depth Result

**Status:** BOUNDED REPOSITORY-DEPTH RESULT — HUMAN-UNVALIDATED  
**Scope:** Campaign One / 1.0 Candidate A relationship-derived capability buildcraft  
**Authority:** FeatureCompletionGapAnalysis.md + RelationshipCapabilityConstellation.md + CampaignOneTraitCatalogueAudit.md

## Question

What is the smallest additional repository-owned change that closes the remaining repeated cross-domain-use gap for the four canonical relationship-derived capabilities without adding another doctrine, a generic capability graph, or more late-campaign switching tax?

## Decision

Reuse the existing authored Dialogue prerequisite seam for durable learned capability:

```ts
requiredPermanentTraitIds?: string[];
```

The field means exactly the same durable-authority fact it means for Quest and Combat:

```text
player.permanentTraits
-> owns durable learned capability

Relationship
-> explains where the capability came from

Dialogue
-> decides whether that capability is locally applicable
```

Dialogue does not infer capability from Affinity, Connection, Experience history, doctrine focus, or NPC identity.

## New authored consumers

### Constraint Sense

```text
Gronk relationship history
-> ConstraintSense permanently learned
-> GC08 Protect the Critical Bottlenecks (Quest)
-> The Constraint After the Procedure (Dialogue)
-> authored Relationship Experience consequence
```

The dialogue becomes available only after the independent GC08 bottleneck application and permanent `ConstraintSense` ownership. It asks the player to distinguish visible urgency from the work that actually carries the system.

### Adversarial Calibration

```text
Lyra relationship history
-> AdversarialCalibration permanently learned
-> GC08 Red-Team the Distributed Procedure (Quest)
-> Model the Move, Not the Mood (Dialogue)
-> authored Relationship Experience consequence
```

The dialogue becomes available only after the independent GC08 stress-test application and permanent `AdversarialCalibration` ownership. It asks the player to predict the hostile move without converting disagreement into affection.

Both are optional. Neither is needed to complete Campaign One.

## Runtime authority

The presentation projection receives permanent Trait IDs directly from Player state.

Unavailable permanent-Trait topics:

- are not shown;
- expose no missing-Trait spoiler reason;
- cannot be forced through direct thunk invocation.

Available permanent-Trait topics expose a bounded causal reason:

```text
Learned capability: Constraint Sense
Learned capability: Adversarial Calibration
```

`processNPCInteractionThunk` independently evaluates the same durable Player authority before any authored effect executes.

## Candidate A exit shape

After this package:

- Structural Steward and Countermodeler have repeated later-campaign consumers at GC06, GC08, and GC10;
- GC07/GC09 remain permanent-capability pair gates rather than doctrine-switch tax;
- every canonical source Trait has independent use outside doctrine participation;
- Willow/Elara span Quest + Combat;
- Gronk/Lyra span Quest + Dialogue;
- baseline routes remain legal;
- provenance remains visible through existing Trait/Player Insight surfaces;
- no third doctrine, capability graph, or catalogue expansion is introduced.

This satisfies the bounded repository-owned Candidate A L3 exit shape.

## Qualification contract

Focused evidence is owned by the existing GC08 / Trait depth qualification:

```bash
npm run gc08:validate
npm run trait-depth:validate
npm run content:intelligence:validate
npm run docs:authority:validate
```

The package must not merge unless exact-head Build Validation succeeds under current repository policy.

## Claim ceiling

Repository evidence may establish that:

- the permanent-Trait Dialogue gate exists and fails closed;
- Constraint Sense and Adversarial Calibration have independent cross-domain Campaign One consumers;
- the two existing doctrines and four source capabilities meet the bounded authored depth shape above.

Repository evidence does **not** establish that:

- fresh players understand capability provenance or doctrine focus;
- doctrine switching is enjoyable;
- temporary Trait experimentation/sharing deserves more attention;
- either doctrine is balanced or preferred;
- the additional conversations improve pacing, emotional impact, retention, or replayability.

Those remain human/product evidence questions under issue #109 and downstream Beta convergence.

## Stop decision for Candidate A

Do not add more Candidate A consumers merely to increase example count.

Candidate A reopens only when:

1. Candidate C composition exposes a concrete missing capability consumer;
2. a correctness defect breaks the existing buildcraft loop; or
3. later human evidence demonstrates a specific product-value gap that repository changes can address.

The active feature-completion frontier advances to Candidate C — Strategic consequence composition.
