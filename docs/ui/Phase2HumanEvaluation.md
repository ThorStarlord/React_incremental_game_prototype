# Phase 2 — Fresh Player Evaluation Protocol

**Status:** Procedure only. No human participants have been recruited or tested by the coding agent. `HUMAN-UNVALIDATED / BETA_PASS=NO`.
**Source boundary:** Run on an explicitly identified build/commit. Do not assume a passing automated campaign is a human-comprehension pass.

## Recruitment and provenance
Obtain consent from actual fresh players unfamiliar with this campaign. The repository's Beta floor requires at least **five accepted first sessions** and **three accepted external beginning-to-ending fresh-save playthroughs**. Record anonymized participant/session ID, exact candidate commit, build, OS/browser/viewport, first-session familiarity, session dates and consent. These requirements are not satisfied by browser automation or synthetic reviews.

## Non-leading first-session tasks
Give each player the game and ask them, without naming the target screen:
1. Start a new game and describe where the protagonist is and what they think can happen next.
2. Find Elder Willow and complete the first authored conversation. Ask what they think the choice changed.
3. Find and revisit a known character. Ask whether they believe the character is *physically here*, remotely contactable, or of unknown location, and why.
4. Locate the next unresolved Quest and identify the most meaningful next action without facilitator hints.
5. When they encounter a Trait or Copy choice, explain its expected consequences before acting, then describe what actually happened.
6. Try the same journey with a narrow/mobile viewport when eligible. Ask participants to find navigation without telling them where the menu trigger is.

For the full-campaign sessions, keep participant-owned branch decisions and follow one complete authored route through finale, with save/Continue and at least one interruption. Do not force a particular route or bypass stuck moments to get a pass.

## Observation and acceptance
For every attempt log objective completion (with/without hints), hesitation, dead ends, mistaken beliefs, illegible text or focus, misleading action labels, and whether participants distinguished narrative consequences from resource/quest mechanics. Capture screenshots/recordings only with consent. Separate system defects from taste-based observations and source-visible hypotheses.

Severity: **blocking** = cannot proceed without intervention; **major** = acts on an incorrect understanding or repeatedly gets lost; **minor** = recoverable friction; **preference** = subjective suggestion not sufficient alone to change product authority.

Record the exact evidence and reproducibility for proposed repairs. Recurring severe findings must be resolved or explicitly accepted by the relevant release authority. A browser-only or coding-agent session cannot be counted as a human Beta session.

## Release-decision boundary## UI4 session observations — use with the original non-leading protocol

For each consented fresh player, separately capture what they infer from the first City Center scene, whether they can name the next legal road before clicking, whether the Elder Willow character motif communicates a memorable identity, and whether location art helps them feel oriented. Do not tell participants these are the study hypotheses beforehand.

After an authentic decision, ask what they believe changed, whether they find the related relationship record without hints, and whether they mistakenly believe ordinary dialogue always creates a Memory. When Copy management is naturally reached, ask them to identify routine work, advanced Trait-sharing options, and what acknowledgement does **not** resolve. On mobile, observe where the next action sits and whether scrolling is understood. Record participant words and actions separately from reviewer interpretation; any visual preference is a *preference finding*, not a product-performance pass.

Use a before/after comparison only if both builds are actually tested with comparable consented participants; do not infer experiential improvement merely from a new screenshot. This section is **research readiness**, not a conducted study.

## Release-decision boundary
Current `v1.0.0` was a personal release under a documented human-floor waiver, not a true Beta pass. This procedure neither revokes that release nor silently promotes PR #181. Until accepted external records meet the defined floor, preserve **HUMAN-UNVALIDATED / BETA_PASS=NO**.
