# Isolated Participant Session Envelope

**Campaign:** `SIR-2026-09-08-POST-M25-V1`  
**Use:** Controller-facing dispatch template. Do not expose this campaign document itself to participants.

---

## 1. Dispatch rule

For a participant session, send only:

1. the exact content of that participant's frozen packet;
2. the neutral session instructions below;
3. the current ordinary player-facing observation.

Do **not** send repository links, campaign links, specification paths, result documents, other participant records, or controller commentary.

---

## 2. Neutral session instructions to send

Use the following text without adding intended-design hints:

```text
You are participating as a fresh simulated player in a game review.

Use only the game information I provide from the ordinary player-facing interface. Do not inspect or request source code, tests, specifications, debug state, repository files, hidden game state, or implementation artifacts.

For each observation, respond concisely in exactly this structure:

CURRENT INTERPRETATION:
<what you currently think is happening>

CURRENT HYPOTHESIS:
<your current best model of the relevant game behavior; uncertainty is allowed>

DECISION:
<what you want to do next and what goal it serves>

REASON:
<brief reason based only on information visible to you>

ACTION:
<one available UI command>

CONFUSION:
<anything currently unclear, or NONE>

You are allowed to be wrong. Do not try to guess the developer's intended answer. Infer from what the game shows you.

Do not provide private chain-of-thought. Give only the concise interpretation, hypothesis, decision, reason, action, and confusion requested above.
```

Then append the exact frozen profile packet content.

Do not append a solution, route description, glossary, or evaluation rubric.

---

## 3. First observation delivery

After the participant has the packet and neutral instructions, send:

```text
PLAYER-FACING OBSERVATION <ID>

VISIBLE TEXT:
<rendered visible text>

VISIBLE CONTROLS:
<ordinary visible controls with current harness numbers>

SCREENSHOT:
<attach screenshot when the participant surface supports image input>

Choose your next action using the required response format.
```

If screenshots cannot be delivered in the chosen participant surface, record that limitation in the raw record. Do not replace the missing screenshot with hidden implementation information.

---

## 4. Subsequent observation delivery

After executing the participant's action, use:

```text
ACTION EXECUTION:
<brief operational result only>

PLAYER-FACING OBSERVATION <NEXT-ID>

VISIBLE TEXT:
...

VISIBLE CONTROLS:
...

SCREENSHOT:
...

Continue using the required response format.
```

Do not add causal commentary to `ACTION EXECUTION`.

Good:

```text
The selected button was clicked successfully.
```

Bad:

```text
That lowered City Watch reputation while increasing Valerius Trust.
```

unless that exact causal statement was itself player-visible in the ordinary UI.

---

## 5. Mechanical action failure message

If a numbered control disappears or an action fails for a purely operational reason, send only:

```text
The requested UI action could not be applied because the visible control state changed. No game-causality explanation is being provided.

Here is a fresh player-facing observation. Choose a new ACTION from the currently visible controls.
```

Then send the new observation.

Do not select a replacement action for the participant.

---

## 6. Participant asks controller for the intended mechanic

Use this neutral response:

```text
I cannot explain the intended mechanic during this run. Please make your best inference from the ordinary player-facing information available to you and continue if reasonable.
```

Do not answer the causal question.

---

## 7. Natural probe wrapper

When a preregistered causal probe is appropriate, send:

```text
Before the next action, please answer this brief game-understanding question using only what the game has shown you:

<neutral preregistered probe>
```

After the participant answers, resume ordinary observations.

Do not reveal whether the answer was correct.

---

## 8. Session end message

When the participant reaches its natural completion or chooses `quit`, send:

```text
The play session is ending here. Give one final concise response in the same format, with ACTION set to `quit`, reflecting your current model and any unresolved confusion.
```

Do not ask:

- whether the participant enjoyed the game as a human;
- whether a real human would retain;
- whether the product has market fit.

Synthetic preference-like comments may arise naturally but remain diagnostic only.

---

## 9. Controller-only dispatch checklist

Before opening each participant session:

```text
[ ] new isolated context
[ ] no GitHub connector enabled for participant
[ ] no repository files provided
[ ] exact packet blob verified
[ ] no prior participant transcript included
[ ] no evaluator notes included
[ ] session ID assigned
[ ] fresh game browser context assigned
[ ] raw record created but interpretations blank
```

If any required isolation item cannot be satisfied, do not launch the participant.
