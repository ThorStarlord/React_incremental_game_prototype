# Post-M25 Contextual Causal Legibility

**Status:** REPOSITORY-ONLY / HERMETIC QUALIFICATION  
**Human comprehension evidence:** UNPROVEN

## Purpose

Move causal legibility from a separate dashboard toward the decision surface itself without exposing hidden authored prerequisites.

The first bounded application is an already-available NPC dialogue topic.

```text
canonical evidence
-> existing topic availability checks
-> topic survives filtering
-> concise "Available because" explanation
```

A topic that does not pass availability returns no explanatory prerequisites and remains absent from the UI. There is deliberately no player-facing `Locked because` list in this package.

## Evidence sources

The presentation helper may explain availability from evidence already present in the player's current state, including:

- recorded Relationship Experiences;
- mastered routine familiarity;
- already-shared NPC Knowledge;
- current institutional standing;
- current objective world conditions.

Negative/forbidden prerequisites constrain availability but are not narrated as hints.

## Authority boundary

This feature explains existing eligibility. It does not:

- make an unavailable topic available;
- create new canonical gameplay state;
- choose a dialogue response;
- expose future branch prerequisites;
- infer hidden authored facts as player knowledge.

## Qualification

`PostM25ContextualCausalLegibility.test.ts` verifies positive explanations, fail-closed spoiler behavior, negative-prerequisite secrecy, and UI wiring.
