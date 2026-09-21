# GC-12 Content Alpha Completion Preregistration

**Status:** CONTENT COMPLETION PREREGISTRATION  
**Program:** Campaign One / 1.0 Game Completion  
**Prepared:** 2026-09-20

## Goal

Promote structural Alpha to **Content Alpha** by proving that the bounded Campaign One is fully authored from New Game through all four finale/epilogue variants, with no required placeholder or diagnostic copy.

This package does not add a gameplay system.

## Entry

GC-12 depends on an exact-head `ALPHA_PASS / HUMAN_UNVALIDATED` candidate. If Alpha uncovers a structural defect, that defect is repaired before Content Alpha is declared.

## Player-visible copy contract

Required campaign content must have intentional player-facing text:

- dialogue title and body;
- authored response labels where the node asks for a player choice;
- Quest title, description and objective descriptions;
- resolution label, description and consequence log;
- Relationship Experience title and interpretation;
- player-visible Memory title, summary, protagonist view and target view.

The following markers are prohibited in those player-visible fields:

```text
TODO
TBD
placeholder
prototype
test copy
debug
diagnostic prose
temporary copy
lorem
GC-<number>
M<number>
```

Legitimate story vocabulary such as the **Diagnostic Counterphase** route is not a diagnostic-copy marker.

## Terminal narration

A dialogue node may intentionally have no response buttons when it is a non-choice continuation/reaction that applies its effect on display.

Current bounded terminal narration exceptions:

- `elder_willow_wisdom`;
- `elder_willow_lore`;
- `gronk_smile`.

They still require intentional display titles and body text.

## Campaign callback coverage

Content Alpha requires authored long-horizon callbacks for all six anchor relationships. Representative canonical evidence:

- Elder Willow — later Structural Steward/counterphase authored consequences reference Willow-derived judgment;
- Gronk — Chapter 1 aftermath plus Chapter 6 structural preparation;
- Silas — long-horizon old-silence callback in the Merchant District arc;
- Valerius — institutional/public-order callbacks and Chapter 6 mobilization;
- Elara — independent verification, network diagnosis and diagnostic preparation;
- Lyra — Chapters 3, 5, 7, finale and state-responsive aftermath.

The player is not required to see every optional callback in one run. Content Alpha proves that each authored path exists and is reachable under its legal route.

## Finale breadth

All four legal finale histories must contain complete authored material:

1. distributed dissipation;
2. structural redirection;
3. diagnostic disruption;
4. fortified containment.

Each route requires:

- a finale-entry dialogue;
- a finale Quest and resolution copy;
- a finale Relationship consequence;
- an aftermath dialogue;
- a player-visible durable Memory;
- a reachable route trace into the aftermath.

## Validation

`content-alpha:validate` will:

- run the focused content-completeness test;
- run the content-intelligence self-test/audit/reachability qualification;
- trace each of the four finale aftermath routes;
- run chapter-definition integrity.

The Build Validation workflow runs Content Alpha only after the Alpha gate.

## Exit

Declare:

```text
CONTENT_ALPHA
HUMAN_UNVALIDATED
```

only when the exact candidate:

- retains Alpha qualification;
- has no required campaign placeholder/diagnostic copy;
- has complete player-facing campaign text;
- has all six anchor callback contracts;
- has all four authored finale/epilogue variants;
- passes exact-head Build Validation.

Human comprehension, pacing, balance and enjoyment remain GC-13 evidence, not GC-12 claims.
