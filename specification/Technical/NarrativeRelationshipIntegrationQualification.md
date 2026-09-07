# M13 — Narrative Relationship Integration Qualification

**Status:** results recorded; final documentation head requires exact-head requalification before merge  
**Baseline:** post-M12 `main` at `47df94af410eac8863676bcd467241f3b81beb61`  
**Baseline tree:** `d9a1a65e1a468166463ab74da055cbd7ada150c3`

## Question

Can ordinary production story/gameplay both produce Relationship evidence and later consume persisted Relationship evidence to alter story availability or consequence, without NPC-specific generic-runtime exceptions?

The target causal loop is:

`story/gameplay event -> Relationship Experience/Memory -> later story gate -> materially different story/gameplay consequence -> new Relationship evidence`

M13 is not a whole-campaign story implementation. It is one bounded production narrative slice designed to test the two-way contract between authored story content and the generic Relationship runtime.

## Slice — The Merchant District Leak

Two already-qualified M12 relationships participate:

- **Rogue Silas** — instrumental trust, secrecy, mutual leverage.
- **Captain Valerius** — institutional trust, reliability, disciplined dissent, delegated judgment.

The slice deliberately reuses their existing defining relationship evidence rather than inventing new dimensions or archetype engines.

### Prior Silas evidence

`silas_exp_secret_neither_sold` / Memory `silas_memory_secret_neither_sold`

Meaning: the player and Silas each held profitable leverage over the other and independently declined to sell it.

### Prior Valerius evidence

`valerius_exp_order_questioned` / Memory `valerius_memory_order_questioned`

Meaning: the player challenged an order by naming the mission objective it endangered, and Valerius changed the deployment rather than demanding ceremonial obedience.

## Preregistered narrative loop

1. **Relationship -> story availability:** Silas's leak conversation is unavailable unless `silas_exp_secret_neither_sold` already exists.
2. **Story -> Relationship:** taking the costly tip records a new Silas M13 Experience and unlocks a trace quest.
3. **Gameplay -> Relationship:** tracing the leak through ordinary quest/location progression records a second Silas M13 Experience.
4. **Cross-NPC Relationship evidence -> later story:** Valerius receives a generic fallback briefing once the leak is traced, but the delegated-response topic is available only when both the traced Silas evidence and `valerius_exp_order_questioned` exist.
5. **Different consequence:** the fallback briefing does not unlock the response operation; the qualified delegated briefing does.
6. **Story/gameplay -> new Relationship Memory:** completing the delegated response records a Valerius M13 defining Experience/Memory representing authority that has become willing to rely on the player's independent judgment.

## Hypothesis

The existing production content contracts are sufficient:

- Dialogue `requiredExperienceIds` can consume persisted Relationship evidence generically.
- Dialogue `RELATIONSHIP_EXPERIENCE` effects can produce new Relationship evidence.
- Dialogue `UNLOCK_QUEST` effects can expose later gameplay consequences.
- Existing quest `REACH_LOCATION` and resolution adapters can turn gameplay into authored Relationship Experiences.
- Save/load can preserve the causal history between an earlier Relationship event and a later story gate.

Therefore M13 should require authored content/data and qualification only, not a new narrative-rule engine.

## Counter-hypothesis / falsification

M13 must stop and record the failure instead of patching around it if the bounded slice requires any of the following solely to work:

- an `if (npcId === ...)` branch in generic Relationship, NPC, Quest, save, or game-event runtime;
- a Silas-specific or Valerius-specific story engine/adapter;
- a new persistent Relationship dimension such as Authority, Duty, Secrecy, or Leverage;
- direct Experience injection as the only way to make the principal production path work;
- a second shadow relationship state in story code (for example `silasTrustsPlayer` or `valeriusWillDelegate`) duplicating Relationship evidence;
- a new save schema solely for this story slice;
- story gating that cannot survive save/load using the existing persistent Relationship state.

None of these falsification conditions was required by the qualified behavioral candidate.

## Implemented production loop

### Silas — Relationship history changes story availability

The new topic `silas_watch_leak_tip` is present in Silas's production dialogue catalog but is gated by the already-earned M12 evidence `silas_exp_secret_neither_sold`.

Choosing the costly information route through the normal NPC Dialogue UI:

- records `silas_exp_watch_leak_shared`;
- unlocks `quest_m13_trace_merchant_leak`;
- does not use an M13-specific runtime branch.

The trace quest uses the ordinary `REACH_LOCATION` objective for `location_merchant_district`. Resolving the verified pattern through the normal Quest UI records `silas_exp_watch_leak_traced` via the existing quest `relationshipExperienceId` adapter.

After the two M13 Silas beats, his Connection remains level II while Connection Progress moves from the M12 value `58` to `75`. M13 therefore extends narrative history without inventing a new Connection tier.

### Valerius — cross-NPC evidence changes later consequence

Once `silas_exp_watch_leak_traced` exists, Valerius exposes the fallback topic `valerius_leak_rumor`. That branch accepts the information as a report but does not delegate a response operation.

The stronger topic `valerius_delegated_leak_response` requires both:

- `silas_exp_watch_leak_traced`; and
- `valerius_exp_order_questioned`.

Thus a Relationship Experience earned with one NPC participates in ordinary story availability while interacting with another NPC, without introducing separate cross-NPC story flags.

On the qualified history, the normal Dialogue UI records `valerius_exp_merchant_leak_delegated` and unlocks `quest_m13_break_merchant_leak`. That quest again uses the ordinary `REACH_LOCATION` + quest-resolution path. Its resolution records defining Experience `valerius_exp_merchant_leak_broken` and Memory `valerius_memory_merchant_leak_broken` — **The Patrol He Let You Rewrite**.

Valerius remains Connection II while Connection Progress moves from `55` to `75`. Final semantic dimensions after the M12 + M13 evidence are:

- Affinity `1`
- Trust `38`
- Understanding `31`
- Shared Meaning `31`
- Reliance `33`
- Vulnerability `8`
- Reciprocity `23`

The new Memory is stable and represents delegated judgment that survived real operational use rather than a new generic Authority/Duty dimension.

## Negative-branch qualification

The dedicated routed test constructs the already-qualified Silas M12 history but deliberately omits Valerius's M12 disciplined-dissent history.

It then plays the entire new Silas M13 route through ordinary Dialogue, Quest, location, and resolution paths.

Observed result:

- `silas_exp_watch_leak_traced` exists;
- Valerius's fallback report topic is visible;
- Valerius's delegated-command response is not visible;
- `quest_m13_break_merchant_leak` is not unlocked.

The test also attempts to bypass the UI by dispatching the normal `processNPCInteractionThunk` directly against `valerius_delegated_leak_response`. The generic runtime rejects the interaction because `valerius_exp_order_questioned` is missing. This demonstrates that the relationship-mediated story gate is enforced below presentation rather than being merely hidden by the UI.

## Persistence qualification

The positive case constructs the already independently-qualified Silas and Valerius M12 histories, then plays every **new M13 beat** through normal production paths.

After the Silas leak has been traced, but **before** the Valerius consequence, the test crosses a real save/load boundary using the existing save utilities.

After load:

- `silas_exp_watch_leak_traced` remains present;
- Silas's defining M12 Memory remains present;
- Valerius's defining M12 Memory remains present;
- the Valerius fallback topic remains available;
- the delegated topic remains available because both required Experience facts survived persistence.

The resumed state then completes the delegated Valerius route through normal Dialogue/Quest/location/resolution surfaces and creates the new defining Memory.

This is the central M13 result: persisted Relationship history is not merely displayed after load; it remains **future narrative causality**.

## Architecture result

M13 story behavior was implemented without modifying generic behavioral runtime files in:

- Relationships;
- NPC interaction;
- Quest resolution;
- game-event location handling;
- Essence;
- Traits; or
- save schema/migration.

The dedicated qualification suite also audits representative generic runtime files for M13 story IDs and fails if the new quest/dialogue/Experience identifiers appear there.

M13 introduced:

- authored Dialogue nodes;
- authored Quest definitions;
- authored Relationship Experiences/Memory;
- production NPC dialogue-list entries;
- one dedicated routed qualification suite;
- CI/test wiring;
- qualification documentation.

It did **not** introduce:

- a new narrative rule engine;
- an NPC-specific story adapter;
- a shadow `silasTrustsPlayer` / `valeriusWillDelegate` state;
- a new Relationship dimension;
- a new Connection tier;
- a new save schema.

## Behavioral qualification evidence

First complete implementation candidate:

`023aceb5f1cf7500227588c8a7c365bac5b857ec`

Build Validation **#158** (`34068155328`): **PASS**

Passed on that exact candidate:

- dependency installation ✅
- `npx tsc --noEmit` ✅
- accumulated M4–M12 Relationship / Trait / save qualification ✅
- dedicated M13 narrative integration suite ✅
- production `npm run build` ✅

No implementation repair cycle was required after the first M13 candidate entered CI.

Because this results record changes the PR head, the documentation head must be independently requalified before merge. The exact final head/run is recorded in PR metadata after that gate; this document cannot self-embed its own final commit SHA without creating another SHA.

## Acceptance criteria

M13 PASS requires all of the following:

- [x] exact post-M12 baseline frozen before implementation;
- [x] bounded production story slice authored;
- [x] Silas and Valerius both participate;
- [x] an ordinary story interaction creates new Relationship evidence;
- [x] later story availability consumes already-recorded Relationship evidence;
- [x] a cross-NPC story gate consumes Silas evidence while interacting with Valerius;
- [x] an unqualified Valerius history cannot access the delegated-response operation;
- [x] a qualified Valerius history can access and unlock that operation;
- [x] the qualified consequence creates further Relationship evidence and a defining Memory;
- [x] at least one save/load boundary occurs after causal evidence is earned but before its later story consequence;
- [x] the later story gate still behaves correctly after load;
- [x] principal M13 production proof uses normal NPC dialogue + quest/location + quest-resolution paths;
- [x] no NPC-specific generic runtime branch is added;
- [x] no new Relationship dimension is added;
- [x] no new save schema is added;
- [x] accumulated M4–M12 Relationship/Trait/save qualification remains green on the behavioral candidate;
- [x] dedicated M13 routed production qualification passes on the behavioral candidate;
- [x] production build passes on the behavioral candidate;
- [ ] exact final documentation/PR head is requalified after this results commit;
- [x] final results and evidence ceiling are recorded here before merge.

## Verdict

**PASS, contingent only on exact-final-head requalification after recording these results.**

The substantive M13 hypothesis survived: a bounded production story can use existing persisted Relationship evidence as a cause of later story availability and consequence, including across NPC boundaries, while subsequent story/gameplay creates new Relationship evidence through the same generic runtime.

This is stronger than M12's authoring-scalability result. M12 showed that relationships can be authored without recurring engine development; M13 shows that those relationships can become inputs to later story causality without creating a second relationship system inside narrative code.

## Deliberate non-goals / evidence ceiling

Even a final PASS does not establish:

- full campaign narrative architecture;
- arbitrary branching-story scalability;
- dynamic/procedural storytelling;
- whole-cast relationship-mediated story integration;
- human enjoyment, comprehension, pacing, or emotional quality;
- global quest/economy balance;
- romance or social-simulation completeness;
- relationship-mediated Trait scalability beyond existing qualified cases.

The maximum M13 claim is narrower:

> A bounded production story can generate, persist, consume, and extend Relationship evidence across multiple NPCs and multiple story/gameplay beats using the existing generic runtime contracts.

## Merge boundary

PR #34 must remain draft until the documentation/results head itself passes exact-head Build Validation. Per owner instruction, the repository Gemini workflow is not a merge authority for M13; Build Validation and this recorded evidence are the qualification authority.
