# M14 — Multi-NPC Relationship Consequence Qualification

**Status:** preregistered before implementation  
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

The main shared event may require prior evidence from all three routes. Existing M12/M13 evidence is historical setup and must not be reimplemented as M14-specific state.

## Reconnaissance finding

`QuestResolutionOption` currently exposes a singular `relationshipExperienceId`. This is a potential pressure point for a one-event-to-many-relationships story.

However, ordinary Dialogue already supports an array of effects and `processNPCInteractionThunk` records every authored `RELATIONSHIP_EXPERIENCE` effect in that array. Therefore a single authored response may already fan out into several independent Relationship Experiences targeting different NPCs.

M14 must test that existing contract before changing the quest schema or introducing a new story bridge.

## Probe A — The Cost of Closing the Leak

After the M13 Merchant District Leak is broken, Valerius, Silas, and Gronk disagree about the aftermath:

- Valerius values restoring public control and institutional credibility.
- Silas values preserving an embedded information source rather than burning the whole network.
- Gronk values keeping trade and repair routes structurally functional instead of winning a clean-looking crackdown that damages the district.

A single player choice in the shared aftermath must emit three Relationship Experiences — one for each NPC — through the existing Dialogue effect array.

Planned policy choices:

1. **Public crackdown** — strongest institutional signal; burns Silas's channel and imposes material trade cost.
2. **Protect the source** — preserves Silas's intelligence channel; weakens visible institutional closure and leaves practical risk.
3. **Quiet reroute** — changes routes and constraints to starve the leak while preserving trade and some intelligence value.

The resulting dimension vectors must not all be positive or identical. At least one route must demonstrate a relationally costly choice in which Understanding can rise while Trust/Affinity/Reliance fall.

Each policy choice should unlock a different authored follow-up quest or consequence without requiring a new quest runtime.

## Probe B — The Repair Ledger

A second, independently authored shared event must exercise the same fan-out capability from a different NPC anchor after the first policy consequence.

Gronk and Valerius disagree about whether post-operation repairs should optimize visible speed or the load-bearing constraints that actually failed. One response must emit distinct Gronk and Valerius Experiences through the same existing Dialogue effect mechanism.

Probe B exists to prevent a one-off success in Probe A from being mistaken for general evidence. Generic story/Relationship infrastructure may change only if both probes expose the same concrete limitation.

## Rule of Two for generic bridge changes

Do not add generic multi-relationship quest/story infrastructure because one authored event is inconvenient.

A generic bridge change is justified only if the same missing capability blocks both Probe A and Probe B independently.

Examples of changes that would require Rule-of-Two evidence:

- `relationshipExperienceIds` on quest resolution;
- a new multi-NPC narrative-effect type;
- a new generic story-state layer solely to fan out Relationship consequences;
- a new dialogue condition language.

If existing Dialogue effects cleanly support both probes, no generic bridge change is warranted.

## Falsification / stop conditions

Stop and record the failure rather than patch around it if M14 requires any of the following solely to work:

- `if (npcId === ...)` logic in generic Relationship, NPC, Quest, save, or game-event runtime;
- `silasTrustsPlayer`, `valeriusWillDelegate`, `gronkSupportsPlan`, or equivalent shadow social flags;
- a new persistent Relationship dimension such as Authority, Duty, Trade, Secrecy, Leverage, or Craft Alignment;
- duplicating one world decision as several fake independent player decisions merely to produce per-NPC consequences;
- direct Experience injection as the principal production route for the new M14 beats;
- a new save schema solely for M14;
- a generic bridge abstraction supported by only one probe.

## Acceptance criteria

M14 PASS requires all of the following:

- [ ] exact post-M13 baseline frozen before implementation;
- [ ] one bounded shared narrative problem authored;
- [ ] Silas, Valerius, and Gronk all participate in Probe A;
- [ ] at least two prior Relationship histories gate or materially shape the shared event;
- [ ] one ordinary player decision emits distinct Relationship Experiences for at least three NPCs;
- [ ] those consequences are not all identical or uniformly positive;
- [ ] at least one NPC gains Understanding while losing at least one of Trust, Affinity, or Reliance;
- [ ] the decision unlocks a materially different later story/gameplay consequence;
- [ ] Probe B independently emits distinct Relationship Experiences for at least two NPCs from one ordinary player response;
- [ ] no generic bridge change occurs unless the Rule of Two is satisfied;
- [ ] no NPC-specific generic runtime branch is added;
- [ ] no new Relationship dimension or Connection tier is added;
- [ ] no shadow social-state boolean is added;
- [ ] save/load preserves the shared-event Relationship consequences and their later availability;
- [ ] principal production proof uses ordinary NPC Dialogue, Quest/location, quest resolution, and Relationship persistence paths;
- [ ] accumulated M4–M13 qualification remains green;
- [ ] dedicated M14 production qualification passes;
- [ ] production build passes;
- [ ] exact final PR head is qualified;
- [ ] results and evidence ceiling are recorded here before merge.

## Evidence ceiling

Even a PASS does not establish:

- a true multi-speaker conversation UI;
- arbitrary N-NPC social simulation;
- faction reputation generalization;
- whole-campaign branching scalability;
- automated NPC knowledge propagation;
- procedural storytelling;
- human enjoyment, pacing, emotional quality, or comprehensibility;
- economy/balance quality.

The maximum M14 claim is:

> A bounded shared production event can be interpreted differently by multiple existing relationships, can produce conflicting per-NPC Relationship consequences from one ordinary player decision, and can carry those consequences into later story/gameplay using existing generic contracts.

## Merge boundary

Open a dedicated M14 PR after implementation begins. Keep it draft until exact-head Build Validation passes and this document records the actual results. Per owner instruction, ignore the repository Gemini workflow as a merge authority.