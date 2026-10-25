# Merchant District Aftercare — Experimental source candidate

**Status:** OWNER-AUTHORIZED SOURCE-ONLY INTEGRATION / UNTESTED / UNQUALIFIED post-1.0/1.1 candidate. PR #190 records the actual merge state. Not a 1.0 hotfix, independently accepted 1.1 thesis, a release or a Beta result.

**Base:** `main` at `06f7ab3e5765816343b98f9d93ef6f4ba6c0a6c0` (includes UI4, research PR #187, and read-only district journal PR #189). The original `v1.0.0` release tag is unchanged.

## Why this bounded build

The post-UI4 divergent exploration identified a specific candidate: existing information and institutional authority should matter when the player returns to a place altered by prior choices. A new generic knowledge engine, dynamic city simulator, Trait migration, or expansion of campaign chapters would impose much larger cost and risk. This branch instead adds **two authored, optional, one-shot district follow-up conversations**, each available only after its actual Chapter 1 resolution has been recorded:

- **Public-order route:** after Valerius's conclusion and heavy Watch patrols, request a merchant-facing audit or an internal review of the patrol ledger. Existing Faction reputation changes differently, and Valerius alone records which request he heard.
- **Quiet-network route:** after Gronk's conclusion and strong trade flow, request a signed manifest for Watch review or retain it in the Guild ledger. Existing Faction reputation changes differently, and Gronk alone records which request he heard.

Both choices remain viable and leave the prior chapter, map, quests, and save schema intact. They use the existing per-NPC Knowledge and institutional Faction owners. Neither choice grants information to unseen NPCs or presumes the requested review has already happened. There is no new automatic delivery, service, travel edge, shopping economy, or player decision delegated to Copies.

## Implementation boundaries

1. `requiredCompletedDialogueIds` is an optional prerequisite for an NPC's *own* earlier one-shot conversation. Both topic presentation and the interaction thunk check it. Other dialogue topics continue under existing gates.
2. `decisionContext` is optional, already-available topic text displayed **before** the player commits. It is separate from the spoken response, and unavailable topics remain hidden.
3. For the new `decisionContext` conversations only, the interaction history records the authored response the player actually selected. Their inline next-node presentation includes both the prompt and the character's response-specific reply. Ordinary 1.0 topics retain their original transcript and next-node presentation behavior; terminal topics were already shown by the existing runtime. This makes the new branching decisions recoverable without fabricating a synthetic Memory.
4. Current Moment reflects only already recorded district World State and player-initiated, NPC-heard follow-up requests. It prioritizes a ready Valerius *story contact* without claiming he is physically in the district; the Gronk lead points toward City Center's existing adjacent route.
5. The chapter routes remain owned by the original conclusion dialogue IDs; aftercare cannot complete, revoke, or rewrite Chapter 1. Existing Faction and Knowledge state, not extra parallel save flags, carry the results.
6. A read-only district-aftercare panel appears on return visits **only** when a known character's actual route conclusion and available/completed follow-up establish its relevance. When pending, it links to an existing legal conversation or adjacent travel, never a teleport or inferred NPC position. When recorded, it reads the NPC's Knowledge fact, the selected authored response, and its Faction effects, while showing **current** standing separately from the decision's historical delta. Location atmosphere remains from objective World State, not duplicated as a fabricated Memory.
7. Response-specific Faction standing previews are derived from authored effect definitions only for already available topics that explicitly opt into a `decisionContext`; no unknown locked-topic effects are revealed. Ordinary dialogue projections keep their previous `{id,label}` response shape; only opt-in authored decisions add preview fields. A successful follow-up also displays the immediate standing changes beside the conversation response so the player need not return to the district merely to discover what their choice did.

## Discoverability and load-race boundaries

- When a recorded route makes an authored follow-up available, the Current Moment lists **Gronk's manifest** by name when the player is actually in City Center with Gronk; Valerius's **patrol ledger** remains an explicitly unanchored story conversation, never an invented NPC location. Other NPC topics retain their ordinary titles and action labels. The Merchant District return-visit panel separately offers already-qualified travel/contact links.
- **Spatial decision integrity:** an opted-in aftercare topic may be ready while its NPC is elsewhere, but the NPC dialogue UI disables commitment and names the known destination. The interaction thunk independently rejects direct remote dispatches against an anchored NPC, using the canonical world-location authority. Gronk therefore must be met in City Center; Valerius remains an unanchored authored story contact, not a purported encounter in the district. This is scoped to new opt-in decisionContext topics, not a retroactive change to historical campaign dialogue behavior.
- The old-save catalog refresh now discards its result if the NPC state changes before the optional fetch resolves. The NPC reducer independently rejects topic additions to NPCs absent from the discovered list, not just trusting the async caller. This protects New Game / competing Load transitions without adding a duplicate save authority.
- The aftercare projection consumes the existing Knowledge and Faction selectors for recipient awareness and current standing, preserving their legacy-safe read semantics.

## Recorded decisions beyond the district

The existing Player Insight panel now has an **optional, read-only “Your district decisions”** section. It does not require being in the Merchant District, and appears only for already discovered characters whose route conclusion and follow-up are actually marked completed. A memoized selector reads the *same NPC-specific Knowledge fact* and authored, response-scoped Faction effects used by the local return-visit view, so player decisions remain inspectable even when the location is elsewhere.

The display distinguishes a request *recorded with an individual* from a completed public audit or automatic sharing, shows the authored standing delta without pretending to reconstruct an institution-wide transaction log, and links to the real NPC conversation surface. If completion exists but its specific Knowledge fact is missing, the UI reports that uncertainty rather than inventing an answer. It does not create Memories, make future topics visible, mutate state, add NPC schedules, or introduce another journal authority.

## Content-authoring dependency integrity

`scripts/content-intelligence/content-graph.js` now models `requiredCompletedDialogueIds` as an ordinary blocking `requires-completed-dialogue` edge from the aftercare topic to the actual route conclusion. This keeps static dependency traces and missing-target reports aligned with the runtime gate, instead of implying the new choices are reachable independently of Chapter 1. No new ChapterEngine, content DSL, or alternate state machine is introduced.

## Recipient and completion authority

The interaction thunk now rejects direct attempts to run an opted-in 1.1 follow-up on the wrong NPC, an undiscovered NPC, or a topic not offered by that NPC. The earlier-completed-dialogue prerequisite remains checked against **that same NPC's** actual completion list. This narrows only the new opt-in decision contract, leaving legacy freeform/ordinary dialogue behavior unchanged.

The content graph also reports `COMPLETED_DIALOGUE_NPC_MISMATCH` when a follow-up requires a completed topic authored for a different NPC. Missing prerequisite IDs remain normal `DANGLING_REFERENCE` errors. These source-level guards preserve the distinction between per-NPC Knowledge and institutional Faction standing; they do not make the intended player-facing behavior qualified without execution.

## Existing-save content compatibility

The original source candidate relied on startup/Chapter 1 content loading, but a loaded save replaces the Redux snapshot, including old `NPC.availableDialogues` and `dialogueNodes` values. This can leave previously concluded routes with no route-follow-up topic, even when the new static asset is present.

After `replaceState` and relationship runtime reconciliation, the normal Load/Continue path now performs a **bounded, best-effort catalog refresh** of only the two aftercare topics and their authored reply nodes. A dedicated NPC reducer adds topic IDs **only to already discovered NPCs present in the saved snapshot**, with set union. It never creates new NPCs, grants undiscovered knowledge, clears completed topics, changes Affinity or Connection, changes inventory/quests, or alters the persisted save schema. A missing optional file logs a warning and does not invalidate the save. The ordinary fresh-game Chapter 1 cast-loading path is unchanged.

This is source-only construction; no load/Continue scenario was executed under the owner's no-tests instruction. The owner subsequently authorized ordinary PR merges *without* waiting for such tests on 2026-10-25. This integration carries unverified load/recovery behavior and must not be described as technically qualified.

## Unexecuted acceptance matrix (NOT RUN)

The following cases remain **planned checks only**, not executed results; listing them does not count as a unit, browser, synthetic, or human test. Under the 2026-10-25 owner instruction this is not a PR merge prerequisite, but it limits claims about integrated correctness:

| Case | Expected behavior and rejected failure |
| --- | --- |
| Fresh public-order conclusion | After the exact Valerius conclusion, heavy patrol World State exposes only his ledger follow-up; before completion, no aftercare topic appears. |
| Fresh quiet-network conclusion | After the exact Gronk conclusion, strong trade World State exposes only his manifest follow-up; Gronk remains anchored to City Center rather than physically appearing in the Merchant District. The decision is visible but not clickable while the player is elsewhere, and direct remote thunk dispatch has no effects. |
| Response-specific outcomes | Each selected response applies only its authored faction effects and records one request fact with its actual NPC; no other NPC learns it automatically. Completed one-shot topics cannot fire effects again by direct thunk dispatch. |
| Historical decision visibility | Player Insight has no future/unmade request; after a real completion it shows the specific NPC's recorded request and authored standing deltas without minting a new Relationship Memory. |
| Older-save recovery | Load/Continue adds both optional topics only to already discovered saved NPCs. It preserves earlier progress and rejects a stale catalog refresh after a different save or New Game supersedes it. |
| Dialogue compatibility | Ordinary original 1.0 conversation transcripts and next-node behavior are unchanged. Invalid response IDs, mismatched recipients, and missing same-NPC prerequisites fail closed before any effects. |
| Content-authoring consistency | Completion edges point to real same-NPC dialogue definitions. No generic Chapter engine, additional region road or freeform rumor/belief authority is introduced. |
| Release and player evidence | Full exact-head Build Validation must include original normal-UI campaign, save/Continue checkpoints, browsers and production build. Neither a pass nor a failure can be claimed until actually run. Human participants remain a separate requirement for genuine Beta findings. |

**Construction stopping rule:** no further feature expansion merely to enlarge this unqualified source-only integration. The owner specifically authorized merging the PR without a test gate; publish only the factual GitHub merge result, never a technical qualification, human preference, or Beta pass. Repair a demonstrated problem when found.

## Frontier after this source candidate

Post-UI4 exploration compared relationship-derived capability buildcraft (A), deliberate information control (B), reactive places/institutions (C), and earned Copy delegation (D). This branch is a narrow B+C reversible build; it does **not** establish that B+C is the preferred primary product identity. The rival 1.1 universal Trait implementation remains draft PR #178 based on an older released commit and not mergeable with current main; its dependent PRs #180/#182 are separate. The qualified existing Copy standing-order and exception surfaces already support D, so another Copy panel without a concrete new need would duplicate implemented functionality.

**Bounded next recommendation:** after owner-authorized source-only integration, inspect actual gameplay only when tests/evidence become permitted or defects arise; reconcile the current main/1.1 Trait branch and evaluate build differentiation separately before promoting any larger A expansion. Keep D a competing identity hypothesis until actual player-experience evidence discriminates it, not a license for an autonomous Copy planner. The source-only merge does not select a full 1.1 product thesis, issue a release, or authorize broader scope.

## Risks and qualifications still required

- The two conversations and their modest reputation deltas are **provisional gameplay design**; they do not establish preference, fun, or balance.
- A historical save that has already recorded the Chapter 1 conclusion should become eligible once its existing NPC and dialogue catalog load; a save without the required completed conversation should not get this follow-up.
- The original 1.0 release, its exact-head qualification, and the human-evidence ceiling remain independent. This branch may be merged under the owner's explicit waiver, but must not be represented as tested, technically qualified, Beta-passing, or a new release.
- **Owner-requested execution mode: no unit tests and no evidence/browser tests were added or run.** On 2026-10-25 the owner explicitly waived this as an ordinary PR merge prerequisite; the intentional evidence gap remains real after merge. Do not reuse green checks of PR #189 as evidence for this head.
- The six-profile coding-agent playtest on issue #188 remains separately blocked by unavailable GitHub AI Credits. These authored choices were not evaluated by independent simulated participants.
