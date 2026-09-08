# Post-M25 Synthetic Review Authority Amendment

**Status:** Governing post-M25 evidence-boundary amendment  
**Base reviewed:** `main` at `297b8a90bdae5014da11627e253c32c4ea7e2c8d`  
**M25:** `PASS`  
**Human product validation:** `DEFERRED / UNPROVEN`  
**M26:** **NOT AUTHORIZED**

---

## 1. Purpose

This document consciously weakens the immediate post-M25 product-validation claim so the repository can perform a lower-cost blind synthetic-player review before recruiting human participants.

It supersedes **only** the next-activity and promotion clauses in `PostM25ProductDirection.md` that require the Human Integrated Playability / Product Review to occur before any post-M25 product-direction decision.

All qualified M4-M25 milestone semantics, all product hypotheses recorded in `PostM25ProductDirection.md`, and all existing non-expansion constraints remain unchanged unless a later explicit authority record says otherwise.

This amendment does **not** claim that synthetic evidence is equivalent to human evidence.

```text
human validation deferred
!=
human validation passed
```

---

## 2. New governing boundary

The authorized sequence is now:

```text
M25 Complete Chapter Vertical Slice        PASS
Automated mechanical qualification         COMPLETE
Synthetic review infrastructure            AUTHORIZED NEXT
Blind Simulated Integrated Product Review  AUTHORIZED AFTER INFRASTRUCTURE QUALIFIES
Human product validation                    DEFERRED / UNPROVEN
Product Direction Decision                  AFTER SYNTHETIC VERDICT
M26                                         NOT AUTHORIZED
```

A synthetic-review result may inform a Product Direction Decision. It does not itself authorize M26 or any implementation roadmap.

Any future implementation milestone still requires an explicit product-direction decision followed by a separately scoped and preregistered milestone against the then-current repository state.

---

## 3. Evidence ladder

Use the following evidence levels:

```text
LEVEL 1
Automated mechanical qualification

    ->

LEVEL 2
Blind simulated-player product qualification

    ->

LEVEL 3
Fresh human usability / comprehension study

    ->

LEVEL 4
Broader human playtesting:
fun / pacing / emotion / retention
```

M25 supplies strong Level-1 evidence.

The newly authorized campaign attempts only Level 2.

Level-2 evidence must never be reported as Level-3 or Level-4 evidence.

---

## 4. What Level 2 may support

A properly isolated simulated review may support bounded claims about:

- integrated mechanical traversal through the ordinary player-facing UI;
- mechanical discoverability risks;
- whether player-visible information is sufficient in principle to reconstruct important causal relationships;
- state legibility;
- authority legibility;
- route reasoning from visible evidence;
- obvious interaction-density or pacing-risk signals;
- repeated plausible misconceptions across independent synthetic profiles;
- likely product-coherence risks worth repairing before expansion.

The preferred wording is diagnostic, for example:

> Several independent blind synthetic profiles inferred that Faction Reputation and personal Relationship were distinct from player-visible evidence.

or:

> Multiple independent blind synthetic profiles treated NPC Knowledge as global objective truth, and normal play did not expose enough corrective evidence in the tested slice.

---

## 5. What Level 2 must not support

The synthetic campaign must not claim evidence for:

- actual human comprehension;
- actual human enjoyment;
- actual human emotional response;
- actual human frustration;
- actual human pacing judgments;
- accessibility;
- retention;
- commercial readiness;
- product-market fit;
- real-player desire to continue.

These remain:

```text
HUMAN COMPREHENSION       UNPROVEN
HUMAN ENJOYMENT           UNPROVEN
HUMAN EMOTIONAL RESPONSE  UNPROVEN
HUMAN PACING              UNPROVEN
RETENTION                  UNPROVEN
HUMAN PRODUCT VALIDATION   DEFERRED
```

A synthetic participant may generate comments that resemble preferences or emotions. Those comments are hypothesis-generating diagnostics only and must not be counted as human evidence.

---

## 6. Relationship to issue #26

GitHub issue #26 remains valid future human research.

This amendment does not close, satisfy, or retroactively weaken that issue's human-comprehension claim.

Issue #26 already establishes the relevant epistemic principle: automated or agent-driven traversal must not silently become evidence that a genuinely fresh human understood the Willow causal model.

The new synthetic campaign follows the same discipline by making its weaker claim explicit.

---

## 7. Participant isolation requirement

The simulated review must separate:

```text
controller / custodian
        -> knows repository authority

blind simulated participants
        -> know only their participant packet
        -> receive only ordinary player-facing observations

independent evaluator
        -> receives frozen participant records
        -> may then inspect canonical design to adjudicate them
```

A participant context must not read source code, specifications, tests, fixture data, Redux state, content JSON, qualification scripts, other participant records, or evaluator notes before or during its run.

One informed context role-playing multiple supposedly fresh players is not sufficient isolation.

If isolated participant contexts cannot be established, use:

```text
INCONCLUSIVE — participant isolation insufficient
```

---

## 8. UI-only execution requirement

Participant actions must be executed through the ordinary player-facing game surface.

Allowed:

- Playwright interaction with rendered buttons, links, inputs, and navigation;
- screenshots;
- rendered visible text;
- player-visible labels, placeholders, URLs, and control state;
- fresh ephemeral browser contexts.

Forbidden:

- Redux DevTools or direct store access;
- direct dispatch;
- debug-event injection;
- direct local-storage inspection or mutation;
- source-map inspection;
- fixture manipulation;
- direct content-JSON inspection;
- hidden state mutation;
- test helpers that bypass ordinary UI behavior.

The repository may use browser automation to operate the normal UI. Automation is not permission to bypass the UI.

---

## 9. Existing ChatGPT loop script

The baseline repository contains `scripts/chatgpt-loop.js`, added in commit `297b8a90bdae5014da11627e253c32c4ea7e2c8d`.

That script is **not** synthetic-review participant authority.

It reuses a persistent ChatGPT browser profile and repeatedly continues one conversation, so it cannot by itself establish blind participant isolation or independent synthetic-player provenance.

The synthetic-review harness must therefore be separate and game-facing.

---

## 10. Infrastructure qualification boundary

Before any participant result is accepted, the repository should contain and qualify:

- this authority amendment;
- the frozen synthetic-review preregistration;
- six distinct participant packets;
- a UI-only Playwright observation/action harness;
- a static protocol validator;
- a CI smoke test proving the harness can open the normal game and capture a player-facing observation without hidden-state access;
- a result template with explicit evidence ceilings.

Infrastructure qualification does **not** equal simulated-review qualification.

The intended infrastructure stop marker is:

```text
SYNTHETIC_REVIEW_AUTHORITY_RECONCILED
SYNTHETIC_REVIEW_PREREGISTRATION_FROZEN
SYNTHETIC_REVIEW_UI_HARNESS_QUALIFIED
SYNTHETIC_PARTICIPANT_PACKETS_READY

SIMULATED PANEL EXECUTION  READY / NOT YET RUN
HUMAN PRODUCT VALIDATION   DEFERRED
M26                        NOT AUTHORIZED
```

---

## 11. Promotion rule after the synthetic review

A Product Direction Decision may occur only after:

1. the blind synthetic panel is executed with credible participant isolation;
2. raw participant records are frozen before evaluator adjudication;
3. repeated failure patterns are distinguished from one-off agent behavior;
4. synthetic-method limitations are recorded;
5. a bounded synthetic verdict is assigned;
6. the decision compares competing post-M25 product hypotheses rather than merely confirming a preselected direction.

Human product validation may remain deferred after that decision, but the evidence debt must remain visible.

A later human study may contradict the synthetic result.

---

## 12. Current decision marker

```text
M25 Complete Chapter Vertical Slice        PASS
Automated mechanical qualification         COMPLETE
Synthetic review infrastructure            AUTHORIZED NEXT
Blind simulated product review             PENDING
Human product validation                    DEFERRED / UNPROVEN
Post-M25 product hypotheses                RECORDED
M26                                         NOT AUTHORIZED
```

The purpose of the weaker gate is to cheaply search for obvious integrated product risks without pretending that simulation has answered the human-product question.