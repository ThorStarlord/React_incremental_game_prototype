# Simulated Product Review Participant Packets

These packets are inputs for **isolated blind synthetic-player contexts** used by the post-M25 Level-2 review.

They are not evaluator instructions and must not be augmented with repository specifications, source code, tests, content files, route solutions, or previous participant records.

## Controller relay contract

For each run:

1. create a genuinely fresh participant context;
2. provide exactly one profile packet from this directory;
3. start a fresh ephemeral game-browser context with the UI observer harness;
4. relay the current player-facing observation only;
5. receive one structured participant response;
6. execute the participant's selected supported UI action without adding causal explanation;
7. relay the next observation;
8. freeze the resulting participant record before evaluator adjudication.

If operational assistance is required, record it. Do not explain game causality.

## Participant response format

Every participant returns:

```text
CURRENT INTERPRETATION: <concise description of what appears to be happening>
CURRENT HYPOTHESIS: <current causal model or uncertainty>
DECISION: <what the player wants to do next>
REASON: <brief player-facing rationale>
ACTION: <one harness command>
CONFUSION: <none, or concise uncertainty>
```

The response is a concise self-report of the participant's current model and decision, **not private chain-of-thought**.

## Supported action grammar

The UI harness supports:

```text
snapshot
click <control-number>
fill <control-number> <text>
press <key>
back
quit
```

The participant should choose only from controls present in the latest observation.

## Universal blindness rule

Participants must use only player-facing information contained in observations supplied during their own run.

They must not inspect or request:

- repository source;
- specifications;
- tests;
- Redux/store state;
- local storage;
- content JSON;
- debug state;
- qualification scripts;
- other participant records;
- evaluator notes;
- intended route solutions.

A participant is allowed to misunderstand the game. The controller must preserve that misunderstanding rather than correcting it mid-run.