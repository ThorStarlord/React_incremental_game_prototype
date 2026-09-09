# V2 Participant Session Envelope

**Campaign:** `SIR-2026-09-09-POST-M25-V2`  
**Audience:** controller/custodian dispatch template  
**Participant exposure:** only the neutral text below plus the participant's exact frozen profile packet and current harness-generated player-facing observation

---

## 1. Neutral participant instruction

Deliver the following without campaign/evaluator commentary:

```text
You are a fresh simulated player interacting with a game for the first time.

Use only ordinary player-facing information supplied to you in this session.

Do not inspect, request, search for, or use repository source, specifications, tests, debug state, hidden state, local-storage contents, implementation details, route walkthroughs, other participant records, or evaluator notes.

You are allowed to misunderstand the game. Do not try to guess a developer-intended answer. Form and revise your model naturally from the information the game visibly provides.

For every observation, respond exactly with:

CURRENT INTERPRETATION:
CURRENT HYPOTHESIS:
DECISION:
REASON:
ACTION:
CONFUSION:

Supported actions are:

snapshot
click <action-id>
fill <action-id> <text>
press <key>
back
quit

For click/fill, copy the opaque action ID exactly from the current observation. Never invent, shorten, renumber, or reuse an action ID from an older observation.

Report concise current conclusions and decision rationale only. Do not provide private or exhaustive chain-of-thought.
```

Then provide the exact frozen profile packet.

---

## 2. Screenshot capability

Before the first observation, the controller records one of:

```text
SCREENSHOT_RELAY_CAPABLE: YES
SCREENSHOT_RELAY_CAPABLE: NO
SCREENSHOT_RELAY_CAPABLE: UNKNOWN
```

If `YES`, the matching ordinary screenshot may accompany the harness-generated relay.

If `NO` or `UNKNOWN`, tell the participant only:

```text
Screenshots are not available through this participant surface. Use the player-visible text and controls supplied in each observation.
```

Do not infer visual details that were not delivered.

---

## 3. First observation wrapper

Send:

```text
Your first playable turn begins now.

<contents of participant-relay-001.md, verbatim>
```

If screenshot-capable, attach the matching `observation-001.png` without extra causal annotation.

Do not summarize the relay or reconstruct its controls.

---

## 4. Subsequent observation wrapper

Send:

```text
Here is the resulting player-facing observation.

<contents of participant-relay-NNN.md, verbatim>
```

If screenshot-capable, attach the matching screenshot.

Do not add statements such as `this happened because your Connection changed` unless those exact words are themselves player-visible game text.

---

## 5. V2 action rejection wrapper

If the qualified harness rejects a click/fill because the action ID is invalid, stale, or no longer matches the current visible-control set, send only neutral operational feedback:

```text
Your previous action was rejected because it no longer matched the currently visible control set. No replacement action was chosen for you.

Here is a fresh player-facing observation. Choose a new action from it.

<fresh participant-relay-NNN.md, verbatim>
```

If screenshot-capable, attach the new matching screenshot.

Do not tell the participant which new action corresponds to the old intention.

---

## 6. Mechanical execution failure wrapper

If an ordinary action fails for a non-causal operational reason and the controller can continue fairly:

```text
The selected UI action could not be applied mechanically. No substitute action was chosen for you.

Here is the current fresh player-facing observation. Choose your next action from what is now visible.

<fresh participant-relay-NNN.md, verbatim>
```

Record the intervention in the raw record.

---

## 7. Intended-mechanic question response

If the participant asks what a mechanic is supposed to mean or which choice is intended, respond neutrally:

```text
Use only what the game itself has shown you. Record the uncertainty in CONFUSION and choose your next action from the current player-facing observation.
```

Do not answer the mechanic question.

---

## 8. Natural causal probe wrapper

Only at a preregistered natural checkpoint, send the exact neutral probe, for example:

```text
Before continuing, answer this using only what the game has visibly shown you:

What do you currently think Affinity represents?
```

Then resume the ordinary observation/action loop.

Do not reveal the canonical answer after the response.

---

## 9. Session end

If the participant chooses `quit`, reaches a valid campaign completion condition, or the controller must stop under a preregistered validity boundary, send no evaluator interpretation.

Neutral end message:

```text
The play session has ended. No further game actions are required in this participant context.
```

Freeze the raw record before any evaluator sees it.

---

## 10. Dispatch checklist

Before Observation 001:

```text
Fresh participant context                         YES
Correct immutable session ID                      YES
Correct V2 profile packet/blob                    YES
No repository/GitHub access                       YES
No source/spec/tests exposed                      YES
No V1 evidence/result exposed                     YES
No other V2 participant evidence exposed          YES
No evaluator/controller causal notes exposed      YES
Game runtime exact frozen candidate verified      YES
V2 apparatus exact qualified identity verified    YES
Fresh browser/game state                          YES
Screenshot capability recorded                    YES
Harness-generated relay used verbatim              YES
Manual control reconstruction                     NO
```

If any epistemic isolation item cannot honestly be marked `YES`, do not launch that participant.