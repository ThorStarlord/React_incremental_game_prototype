# Beta Human Evidence Record Template

**Authority:** `specification/Technical/BetaCompletionContract.md`  
**Canonical backlog:** issue #109

> Use this template only for sessions completed by real human participants.
> Automated tests, synthetic browser runs, LLM personas, repository analysis, and simulated product reviews do not count toward the Beta human-evidence floor.

## Privacy

Use an anonymous participant identifier. Do not record names, email addresses, account identifiers, or unrelated personal information.

---

## Session identity

| Field | Value |
| --- | --- |
| Participant ID | `P-___` |
| Session type | `FIRST_SESSION` or `FULL_PLAYTHROUGH` |
| Date / timezone | |
| Observer | |
| Exact commit SHA | |
| Build Validation run | |
| Build/deployment identity | |
| Browser + exact version | |
| OS | |
| Viewport | |
| Fresh browser profile/context? | YES / NO |
| Fresh save? | YES / NO |
| Prior participant knowledge of this game | NONE / LIMITED / PRIOR PLAYER |
| Developer intervention during required progression | NONE / describe below |

## Intervention/deviation log

Record every intervention or deviation, even when it seems harmless.

| Time / campaign point | Intervention or deviation | Why it occurred | Did it alter progression? |
| --- | --- | --- | --- |
| | | | |

---

# A. First-session observation

Complete this section for `FIRST_SESSION` records and for the opening portion of full playthroughs.

## Discoverability

Without coaching, could the participant:

- [ ] identify the first meaningful action after New Game;
- [ ] find NPC/dialogue;
- [ ] find and understand the Quest surface;
- [ ] discover travel when required;
- [ ] distinguish an ordinary action from unavailable/future content;
- [ ] recover after a mistaken navigation/action.

Notes:

## Causal understanding

Ask the participant to explain in their own words, without supplying terminology first:

- What changed because of the last important relationship interaction?
- Why is the newly available option available?
- What is the difference between a Relationship/capability, Knowledge, Faction standing, and World State when those concepts first matter?
- What work has the player personally learned?
- What work can a Copy safely repeat, and what must the player still decide?

Participant explanation:

Observer classification:

- [ ] understood sufficiently to choose intentionally;
- [ ] partially understood / recoverable confusion;
- [ ] severe misunderstanding blocking intentional choice.

## Terminology / presentation

Record any player-facing term, label, status, or feedback the participant could not interpret.

| Surface / term | Participant interpretation | Intended meaning | Severity |
| --- | --- | --- | --- |
| | | | |

## First-session pacing

Record observed waiting, repetition, or dead time. Do not infer enjoyment from duration alone.

| Segment | Observed issue | Severity | Notes |
| --- | --- | --- | --- |
| | | | |

---

# B. Full beginning-to-ending playthrough

Complete this section for `FULL_PLAYTHROUGH` records.

## Completion

| Field | Value |
| --- | --- |
| Reached campaign-complete Epilogue? | YES / NO |
| Required developer coaching? | NONE / describe |
| Required debug route/state mutation? | NO / if YES this run does not satisfy the floor |
| Soft-lock encountered? | NO / describe |
| Save corruption/loss? | NO / describe |
| Final counterphase plan | |
| Telluric Echo outcome | |
| Approximate elapsed play time | |

## Route/history summary

Record enough state to establish that playthroughs are genuinely external and materially distinct where applicable.

- Chapter 1 route:
- Chapter 4 route:
- Chapter 5 route:
- Chapter 6 network posture:
- Chapter 7 counterphase plan:
- Important Relationship Memories:
- Important Knowledge distribution:
- Faction standing that affected choices:
- World State that affected choices:
- Copy/delegation use:
- Build/capability profile:

## Save/recovery observations

- [ ] save/load behavior was understandable;
- [ ] no duplicate one-time reward/dialogue after reload;
- [ ] offline return feedback matched what actually advanced;
- [ ] invalid/recovery behavior encountered, if any, was understandable.

Notes:

## Finale / epilogue comprehension

Ask the participant:

1. Why were your finale options available?
2. Which earlier relationships/capabilities mattered?
3. What did institutional standing or world conditions change?
4. Did the epilogue appear to reflect choices/history you remembered making?

Participant explanation:

Observer classification:

- [ ] ending causality understandable;
- [ ] partial confusion without progression failure;
- [ ] severe causal mismatch / ending felt unrelated to play.

---

# C. Findings

Record findings individually. Repeated severe findings matter more than raw participant count.

| Finding ID | Severity | Finding class | Area | Reproduction / evidence | Blocks ordinary progression or intentional choice? | Disposition |
| --- | --- | --- | --- | --- | --- | --- |
| | | | | | | |

Suggested severity vocabulary:

- `BLOCKER` — cannot complete required progression or save integrity is compromised;
- `CRITICAL` — severe authority/outcome corruption or primary supported browser unusable;
- `HIGH` — major repeated failure likely to prevent ordinary understanding/completion;
- `MEDIUM` — meaningful friction/confusion with workaround or recovery;
- `LOW` — polish/clarity issue without material progression risk.

Classify each finding before choosing a repair:

- `NAVIGATION_DISCOVERABILITY` — the player cannot find the relevant surface/action;
- `STATE_LEGIBILITY` — the player sees the surface but cannot tell what changed;
- `CAUSAL_MODEL` — the player observes the change but infers the wrong cause;
- `TERMINOLOGY` — labels obscure an otherwise recoverable mental model;
- `PACING_GRIND` — waiting or repetition displaces consequential choices;
- `BALANCE` — costs/rewards/encounters distort intended viable choices;
- `PRESENTATION_ACCESSIBILITY` — visual hierarchy, feedback, input, readability, or focus blocks use;
- `MECHANICAL_CONTRADICTION` — runtime behavior teaches or enforces the wrong rule.

## Repair routing

Do not default to adding a tutorial, popup, or new system. For an accepted finding:

1. preserve the near-verbatim observation and reproduction evidence;
2. classify the failure at the smallest causal layer above;
3. repair the smallest layer that explains the failure;
4. add deterministic regression coverage when the repair changes repository-owned behavior;
5. rerun the affected human scenario on the new exact build when the finding was severe or repeated;
6. never count a synthetic or LLM rerun as replacement human evidence.

## Session acceptance

This record counts toward the Beta floor only when:

- exact build/browser provenance is present;
- fresh-save basis is recorded;
- interventions/deviations are disclosed;
- required observations are completed;
- findings are recorded rather than silently omitted.

**Counts toward Beta floor:** YES / NO  
**If NO, reason:**

---

# Aggregate Beta evidence ledger

Maintain this summary in or alongside the eventual Beta result.

## First-session floor

| Participant ID | Exact SHA | Browser | Fresh save | Accepted record | Blocking/repeated finding IDs |
| --- | --- | --- | --- | --- | --- |
| P-001 | | | | | |
| P-002 | | | | | |
| P-003 | | | | | |
| P-004 | | | | | |
| P-005 | | | | | |

Required minimum: **5 accepted fresh-player first-session observations**.

## Full-playthrough floor

| Participant ID | Exact SHA | Browser | Reached Epilogue | No developer intervention in required progression | Accepted record | Finding IDs |
| --- | --- | --- | --- | --- | --- | --- |
| P-101 | | | | | | |
| P-102 | | | | | | |
| P-103 | | | | | | |

Required minimum: **3 accepted external beginning-to-ending fresh-save playthroughs**.

## Promotion decision

Do not write `BETA_PASS` solely because the numerical floor is reached.

Before promotion, confirm:

- [ ] minimum accepted session counts are met;
- [ ] no unresolved BLOCKER or CRITICAL finding remains;
- [ ] no repeated severe comprehension/progression failure remains unresolved or unaccepted with rationale;
- [ ] exact deterministic CI gates are green on the candidate being promoted;
- [ ] issue #109 points to or contains the accepted evidence records.
