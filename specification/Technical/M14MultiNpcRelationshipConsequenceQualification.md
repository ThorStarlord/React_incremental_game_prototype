# M14 — Multi-NPC Relationship Consequence Qualification

**Status:** results recorded; PASS subject only to exact-final-head requalification  
**Baseline:** post-M13 `main` at `7a22b5c34de7e4e2e24497a0aff48ceb0bd90430`  
**Baseline tree:** `fc3f840fa0d7e4face0e6f206190d2ff64350f5c`

## Question

Can one bounded production story situation consume several existing Relationship histories and produce distinct, potentially conflicting relational consequences for multiple NPCs without NPC-specific coordination branches, shadow social-state flags, or a new Relationship dimension?

The target shape is:

`shared story event -> one player decision -> several NPC-specific Relationship interpretations -> different later story/gameplay consequence`

M14 is not a whole-campaign social simulation. It is a bounded stress test of whether the M13 story/Relationship bridge can become a shared social narrative rather than a set of independent character lanes.

## Cast and existing evidence

M14 reuses three already-qualified production relationships:

- **Rogue Silas** — mutual leverage, secrecy, restraint, operational information.
- **Captain Valerius** — institutional trust, disciplined dissent, delegated judgment.
- **Blacksmith Gronk** — professional reliability, constraint-sensitive craft judgment, proven work.

The main shared event requires historical evidence from all three routes. Existing M12/M13 evidence is historical setup and is not reimplemented as M14-specific state.

## Preregistered reconnaissance finding

`QuestResolutionOption` exposes a singular `relationshipExperienceId`. This was identified before implementation as a potential pressure point for a one-event-to-many-relationships story.

However, ordinary Dialogue already supports an array of effects and `processNPCInteractionThunk` records every authored `RELATIONSHIP_EXPERIENCE` effect in that array. M14 therefore tested whether a single authored response could fan out into several independent Relationship Experiences targeting different NPCs before changing the quest schema or introducing a new story bridge.

## Probe A — The Cost of Closing the Leak

After the M13 Merchant District Leak is broken, Valerius, Silas, and Gronk disagree about the aftermath:

- Valerius values restoring public control and institutional credibility.
- Silas values preserving an embedded information source rather than burning the whole network.
- Gronk values keeping trade and repair routes structurally functional instead of winning a clean-looking crackdown that damages the district.

One ordinary player choice in `valerius_m14_aftermath_council` emits three independently authored Relationship Experiences through the existing Dialogue effect array.

Implemented policy choices:

1. **Public crackdown** — strongest institutional signal; burns Silas's channel and imposes material trade cost.
2. **Protect the source** — preserves Silas's intelligence channel; weakens visible institutional closure and leaves practical risk.
3. **Quiet reroute** — changes routes and constraints to starve the leak while preserving trade and some intelligence value.

### Conflicting interpretation result

The consequences are not a shared positive/negative score.

The public crackdown is the clearest stress case:

- **Valerius:** Trust `+6`, Understanding `+2`, Shared Meaning `+5`, Reliance `+4`.
- **Silas:** Affinity `-3`, Trust `-7`, **Understanding `+5`**, Shared Meaning `-4`, Reliance `-5`, Vulnerability `+2`, Reciprocity `-3`.
- **Gronk:** Affinity `-3`, Trust `-4`, **Understanding `+4`**, Shared Meaning `-5`, Reliance `-3`, Reciprocity `-2`.

Silas and Gronk therefore understand the player's reasoning more clearly while trusting or relying on that choice less. This directly demonstrates that shared-event conflict remains multidimensional rather than collapsing to a single approval score.

The quiet-reroute decision emits a different three-NPC interpretation and unlocks ordinary follow-up quest `quest_m14_quiet_reroute`.

## Gameplay consequence — Reroute the Load

`quest_m14_quiet_reroute` deliberately retains the existing singular quest contract:

- giver: Valerius;
- objective: ordinary `REACH_LOCATION` for `location_merchant_district`;
- one normal resolution option;
- one singular `relationshipExperienceId`: `gronk_exp_quiet_reroute_proven`.

The quest proves the selected shared policy under real gameplay traffic. Its completion makes the second shared event available through ordinary persisted Relationship evidence.

This is important to the architecture result: M14 did not widen the quest schema merely because the story involved several relationships. Multi-NPC interpretation remained at the shared decision boundary where the existing Dialogue effect list already models it cleanly.

## Probe B — The Repair Ledger

`gronk_m14_repair_ledger` is a second independently authored shared event anchored on Gronk rather than Valerius.

After `gronk_exp_quiet_reroute_proven`, the player chooses between:

- repairing the actual load path even if reopening takes longer; or
- restoring visible order first and deferring the deeper structural repair.

Each response emits two distinct Relationship Experiences from one ordinary player decision:

- one Gronk interpretation;
- one Valerius interpretation.

For `build_for_load`:

- Gronk gains Affinity `+1`, Trust `+5`, Understanding `+3`, Shared Meaning `+5`, Reliance `+4`, Reciprocity `+3`;
- Valerius loses Affinity `-1` while gaining Trust `+2`, Understanding `+4`, Shared Meaning `+1`, Reliance `+1`, Reciprocity `+2`.

For `restore_visible_order`, Valerius reacts positively while Gronk gains Understanding `+4` but loses Trust `-5`, Shared Meaning `-5`, and Reliance `-4`.

Probe B therefore reproduces the fan-out capability independently and preserves divergent relational interpretation.

## Rule-of-Two result

**No generic bridge intervention is warranted.**

Both independently authored probes succeeded using the pre-existing Dialogue effect array:

- Probe A: one response -> three NPC-targeted Relationship Experiences.
- Probe B: one response -> two NPC-targeted Relationship Experiences.

The suspected singular quest field did not block either probe. `QuestResolutionOption.relationshipExperienceId` remains singular, and no plural `relationshipExperienceIds` contract was added.

M14 therefore records a negative abstraction result: the evidence does **not** justify a new multi-NPC narrative effect type, quest schema, generic social-state layer, or dialogue condition language.

## Persistence result

The qualified quiet-reroute path saves after the three-NPC council decision and before the later gameplay consequence.

After load:

- all three council Experiences remain present;
- `quest_m14_quiet_reroute` remains available on Valerius;
- the resumed game accepts the quest through the normal Quest UI;
- ordinary location movement marks it ready;
- normal quest resolution records `gronk_exp_quiet_reroute_proven`;
- that persisted Experience exposes Probe B on Gronk;
- Probe B then records separate Gronk and Valerius consequences through ordinary Dialogue.

The shared-event relational consequences therefore survive a causal save/load boundary and continue controlling later story availability.

## Architecture audit

M14 story behavior changes only authored data/content, qualification documentation/tests, and CI gate wiring.

No generic behavioral change was made to:

- Relationship slice/selectors/thunks;
- NPC interaction runtime;
- Quest runtime or Quest types;
- game-event listeners;
- Essence or Trait behavior;
- save schema.

No M14-specific identifier appears in the audited generic Relationship/NPC/Quest/game-event/save runtime files.

M14 adds no:

- NPC-ID generic runtime branch;
- shadow social boolean such as `silasTrustsPlayer`, `valeriusWillDelegate`, or `gronkSupportsPlan`;
- persistent Relationship dimension;
- Connection tier;
- multi-relationship quest field;
- narrative effect type;
- save schema.

## Behavioral qualification

First complete behavioral candidate:

`cd355e8d8f91fbc799dad8ba8e37b48c6badf315`

Candidate tree:

`0acdf8c1d821038d445ee47e2a3801ef2f7f29fc`

Build Validation #160 (`34070717106`): **PASS**

- dependency installation: PASS;
- TypeScript: PASS;
- accumulated M4–M13 Relationship / Trait / save qualification: PASS;
- dedicated M14 multi-NPC consequence suite: PASS;
- production build: PASS.

No implementation repair cycle was required after the first complete M14 behavioral candidate entered CI.

## Acceptance criteria

M14 evidence now satisfies:

- [x] exact post-M13 baseline frozen before implementation;
- [x] one bounded shared narrative problem authored;
- [x] Silas, Valerius, and Gronk all participate in Probe A;
- [x] at least two prior Relationship histories gate or materially shape the shared event;
- [x] one ordinary player decision emits distinct Relationship Experiences for at least three NPCs;
- [x] those consequences are not all identical or uniformly positive;
- [x] at least one NPC gains Understanding while losing at least one of Trust, Affinity, or Reliance;
- [x] the decision unlocks a materially different later story/gameplay consequence;
- [x] Probe B independently emits distinct Relationship Experiences for at least two NPCs from one ordinary player response;
- [x] no generic bridge change occurs unless the Rule of Two is satisfied;
- [x] no NPC-specific generic runtime branch is added;
- [x] no new Relationship dimension or Connection tier is added;
- [x] no shadow social-state boolean is added;
- [x] save/load preserves the shared-event Relationship consequences and their later availability;
- [x] principal production proof uses ordinary NPC Dialogue, Quest/location, quest resolution, and Relationship persistence paths;
- [x] accumulated M4–M13 qualification remains green;
- [x] dedicated M14 production qualification passes;
- [x] production build passes;
- [ ] exact final PR head is qualified after this results record;
- [x] results and evidence ceiling are recorded here before merge.

The remaining unchecked item is intentionally external to this self-referential results commit: changing this document changes the PR head. The documentation-complete SHA must receive its own exact-head Build Validation before merge; that run is merge evidence and should be recorded in PR metadata rather than causing an infinite documentation/requalification loop.

## Verdict

**PASS, contingent only on exact-final-head requalification of this documentation-complete candidate.**

The bounded M14 hypothesis survived without a generic bridge intervention:

> One shared production decision can be interpreted differently by several existing relationships, including conflicting multidimensional consequences, and those consequences can persist into later gameplay and another shared decision using the existing generic contracts.

## Evidence ceiling

This PASS does not establish:

- a true multi-speaker conversation UI;
- arbitrary N-NPC social simulation;
- faction reputation generalization;
- whole-campaign branching scalability;
- automated NPC knowledge propagation;
- procedural storytelling;
- human enjoyment, pacing, emotional quality, or comprehensibility;
- economy/balance quality.

The maximum M14 claim remains:

> A bounded shared production event can be interpreted differently by multiple existing relationships, can produce conflicting per-NPC Relationship consequences from one ordinary player decision, and can carry those consequences into later story/gameplay using existing generic contracts.

## Merge boundary

PR #35 must remain draft until the documentation-complete exact head passes Build Validation. Per owner instruction, ignore the repository Gemini workflow as a merge authority. If the exact-final-head gate passes and the PR remains mergeable, M14 is accepted and may merge without a generic bridge change.