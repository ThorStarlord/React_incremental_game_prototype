# Merchant District Aftercare — Experimental source candidate

**Status:** UNTESTED, UNQUALIFIED, post-1.0/1.1 exploratory branch. Not a 1.0 hotfix, not accepted 1.1 scope, not a release or Beta result.

**Base:** `main` at `06f7ab3e5765816343b98f9d93ef6f4ba6c0a6c0` (includes UI4, research PR #187, and read-only district journal PR #189). The original `v1.0.0` release tag is unchanged.

## Why this bounded build

The post-UI4 divergent exploration identified a specific candidate: existing information and institutional authority should matter when the player returns to a place altered by prior choices. A new generic knowledge engine, dynamic city simulator, Trait migration, or expansion of campaign chapters would impose much larger cost and risk. This branch instead adds **two authored, optional, one-shot district follow-up conversations**, each available only after its actual Chapter 1 resolution has been recorded:

- **Public-order route:** after Valerius's conclusion and heavy Watch patrols, request a merchant-facing audit or an internal review of the patrol ledger. Existing Faction reputation changes differently, and Valerius alone records which request he heard.
- **Quiet-network route:** after Gronk's conclusion and strong trade flow, request a signed manifest for Watch review or retain it in the Guild ledger. Existing Faction reputation changes differently, and Gronk alone records which request he heard.

Both choices remain viable and leave the prior chapter, map, quests, and save schema intact. They use the existing per-NPC Knowledge and institutional Faction owners. Neither choice grants information to unseen NPCs or presumes the requested review has already happened. There is no new automatic delivery, service, travel edge, shopping economy, or player decision delegated to Copies.

## Implementation boundaries

1. `requiredCompletedDialogueIds` is an optional prerequisite for an NPC's *own* earlier one-shot conversation. Both topic presentation and the interaction thunk check it. Other dialogue topics continue under existing gates.
2. `decisionContext` is optional, already-available topic text displayed **before** the player commits. It is separate from the spoken response, and unavailable topics remain hidden.
3. The interaction history records the authored response the player actually selected and the node's spoken text, including terminal nodes. This makes branching decisions recoverable by the player without generating a synthetic Memory.
   The two follow-up choices also use existing inline next-node presentation to give each response its own character reaction, without creating an additional decision or independent conversation topic.
4. Current Moment reflects only already recorded district World State and player-initiated, NPC-heard follow-up requests. It prioritizes a ready Valerius *story contact* without claiming he is physically in the district; the Gronk lead points toward City Center's existing adjacent route.
5. The chapter routes remain owned by the original conclusion dialogue IDs; aftercare cannot complete, revoke, or rewrite Chapter 1. Existing Faction and Knowledge state, not extra parallel save flags, carry the results.
6. A read-only district-aftercare panel appears on return visits **only** when a known character's actual route conclusion and available/completed follow-up establish its relevance. When pending, it links to an existing legal conversation or adjacent travel, never a teleport or inferred NPC position. When recorded, it reads the NPC's Knowledge fact, the selected authored response, and its Faction effects, while showing **current** standing separately from the decision's historical delta. Location atmosphere remains from objective World State, not duplicated as a fabricated Memory.
7. Response-specific Faction standing previews are derived from authored effect definitions only for already available topics that explicitly opt into a `decisionContext`; no unknown locked-topic effects are revealed.

## Risks and qualifications still required

- The two conversations and their modest reputation deltas are **provisional gameplay design**; they do not establish preference, fun, or balance.
- A historical save that has already recorded the Chapter 1 conclusion should become eligible once its existing NPC and dialogue catalog load; a save without the required completed conversation should not get this follow-up.
- The original 1.0 release, its exact-head qualification, and the human-evidence ceiling remain independent. Do not promote this branch as tested, merge-ready, Beta-passing, or released.
- **Owner-requested execution mode for this branch: no unit tests and no evidence/browser tests were added or run.** This intentional evidence gap must be resolved before any ordinary protected merge under `AGENTS.md`. Do not reuse the green checks of PR #189 as evidence for this head.
- The six-profile coding-agent playtest on issue #188 remains separately blocked by unavailable GitHub AI Credits. These authored choices were not evaluated by independent simulated participants.
