# UI4 coding-agent simulated product review

**Campaign:** SIR-2026-10-25-UI4
**Status:** READY FOR EXECUTION / SIX PARTICIPANTS NOT RUN
**Evidence class:** SYNTHETIC when executed in independent agent contexts; source-aware preflight is only HEURISTIC.
**Frozen game candidate:** main d3b397f9d2fbe1757e8e9eb96eb7080a4cad2f7d
**Frozen game tree:** 446046c984a1bc0efd50d955dd636167aefb537d
**UI4 source qualification:** PR #185; Build Validation 40158794677 PASS.
**Documentation qualification:** PR #186; Build Validation 40159576607 PASS.
**Human Product Review:** issue #109 remains 0/5 first sessions, 0/3 external campaigns, BETA_PASS=NO.

## Purpose and historical boundary

A coding agent should simulate independent first-time players **through the actual game interface**, not infer player understanding from the already scripted 105/104-step release runs.

The old SIR-2026-09-08-POST-M25-V1 stopped INCONCLUSIVE after a controller-relay action mismatch. Its September V2 replacement has observation-bound action IDs and six participant packets but its frozen manifest targets game commit 953b01b, **not the current UI4 release**. Preserve both historical records; start a new campaign with a new candidate identity.

This document is an executable handoff, **not** a claim that six agents have played. The controller cannot impersonate the participant because it already knows the source.

## Existing apparatus to reuse

- Observation / action harness: scripts/simulated-product-review/ui-observer.js (blob cc6074fc86bd35eceb6ffd7f544b16259e8e5270).
- Fail-closed action contract: scripts/simulated-product-review/action-contract.js (blob e47d83587258e4749d07df93303d64900ef83ecc).
- Profile manifest: scripts/simulated-product-review/profiles-v2.json (blob af9b2bb2a355c4133197b40f8d4ff041994a6552).
- Methodology: SimulatedIntegratedProductReview.md, SimulatedIntegratedProductReviewV2Amendment.md and the September V2 ControllerRunbook / ParticipantSessionEnvelope / RawParticipantRecordTemplate.
- Six existing profiles: A Goal-Focused, B Explorer, C RPG Veteran, D Incremental/Automation, E Narrative-First, F Skeptical Model-Builder. Packet paths are in the profile manifest. Verify each blob before execution.

The V2 observation-bound IDs are required. Controller may not renumber or paraphrase control lists or substitute a preferred click. If the UI changes, recapture the observation and let the participant choose again.

## How the coding agent executes

1. Checkout the **exact frozen candidate** in an isolated game worktree, verify its commit and tree, then run npm ci and launch the standard game on localhost:3000. No injected saves, hidden Redux inspection, seeded quests, test-only routes or debug navigation.
2. In a separate apparatus worktree, verify the exact observer/action-contract blobs; install npm packages and Chromium. Run:
   
       npm run simulated-review:observe -- --profile goal-focused --url http://127.0.0.1:3000 --out .simulated-review-output/ui4/A --headless --screenshot-relay-capable yes

   Repeat in fresh state for explorer, rpg-veteran, incremental, narrative, and skeptical. Use distinct session IDs SIR-UI4-A through SIR-UI4-F.
3. Launch **a fresh isolated model/coding-agent conversation for each participant**. It receives only its profile packet, neutral envelope, and the harness-generated participant-relay-NNN.md plus matching screenshot if actually supported. No source, test suite, design intent, other participant results or controller hints. One model role-playing six profiles in the controller's source-aware context is **not a clean blind panel**.
4. At each observation, require the participant's concise CURRENT INTERPRETATION, CURRENT HYPOTHESIS, DECISION, REASON, ACTION and CONFUSION. Give the exact opaque action ID back to the harness. Allow natural quitting and wrong models. Never force the known campaign walkthrough.
5. At natural game events, use neutral prompts: What changed? Why do you think this action became available? What did your previous choice influence? What do you expect a Copy to choose for you? Avoid revealing answers.
6. Freeze the raw participant transcript, observations, screenshots, control-set/relay digests, append-only ledger and provenance separately after each session **before** the evaluator sees them. Do not repair the game mid-panel.
7. Only after all six clean raw records (or a documented preregistered early stop), run an independent evaluation for recurrent misconceptions and product vs controller/tool failures. Assign PASS / WEAK / FAIL / INCONCLUSIVE only if the provenance justifies it.
8. For reproducible current-product defects, open a bounded repair ticket with exact observation/action evidence and a minimal regression test. Do not modify the older frozen SIR results.

## Phased questions

**Opening discovery:** Can each profile find the Willow lead and a *legal* next road without a route script? Does the Find Elder Willow action feel like a journey step or merely a scroll link? Can the player recover after exploring optional Merchant District / Forge controls?

**Relationship and Traits:** Does a model who expects levels and currency to grant powers discover the recorded relationship-to-capability connection? Does an explanation help without spoiling undiscovered information?

**Knowledge, Faction, World State:** Can skeptical or narrative-oriented profiles distinguish what happened, who knows, institutional standing, and personal memories through information the game actually displays?

**Delegation:** Can incremental-oriented profiles discover personal routine mastery, Copy eligibility, exception acknowledgement and the authority left with the player? Do not require invented automatic planning.

**Long-horizon agency:** When naturally reached, do different choices and old memories visibly matter? Record visible evidence, not a fixed-script assertion that two endings exist.

## Source-aware UI4 screenshot preflight (NOT participant observations)

The Build Validation 40158794677 screenshots show City Center, an Explorer's Journal, the Find Elder Willow link, a highlighted City Gate road, optional Forge practice, and mobile scrolling. The following are **questions predicted by a source-aware reviewer**, not clean agent outcomes:

| Profile | What to test rather than assume |
| --- | --- |
| Goal-Focused | Understands click-to-scroll vs automatic travel and legal adjacency |
| Explorer | Recovers the main lead after browsing Merchant District, NPCs and Forge |
| RPG Veteran | Recognizes relationship-learned Trait identities instead of only ordinary level progression |
| Incremental | Understands why Copy delegation requires prior mastery |
| Narrative-First | Finds consequences and character meaning rather than only status cards |
| Skeptical | Revises wrong models about Knowledge vs World State, Faction vs Relationship |

## Stop and claim boundary

- READY is not EXECUTED. A qualified Playwright smoke test is not a blind coding-agent panel.
- If the current execution surface has **no independently spawnable agent contexts**, report BLOCKED: NO INDEPENDENT AGENT EXECUTOR. Leave this packet runnable for a coding agent with that capability rather than inventing transcripts.
- Human perception, enjoyment, emotional impact and Beta acceptance remain unproven. A synthetic result may justify a bounded 1.0 repair, but cannot count toward issue #109 or authorize indiscriminate 1.1 expansion.
- Compare actual results with PostUI4DivergentExploration.md before selecting a further build.
