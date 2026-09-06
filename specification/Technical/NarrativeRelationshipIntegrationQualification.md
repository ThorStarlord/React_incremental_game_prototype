# M13 — Narrative Relationship Integration Qualification

**Status:** preregistered before implementation  
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

## Planned narrative loop

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

## Acceptance criteria

M13 PASS requires all of the following:

- [ ] exact post-M12 baseline frozen before implementation;
- [ ] bounded production story slice authored;
- [ ] Silas and Valerius both participate;
- [ ] an ordinary story interaction creates new Relationship evidence;
- [ ] later story availability consumes already-recorded Relationship evidence;
- [ ] a cross-NPC story gate consumes Silas evidence while interacting with Valerius;
- [ ] an unqualified Valerius history cannot access the delegated-response operation;
- [ ] a qualified Valerius history can access and unlock that operation;
- [ ] the qualified consequence creates further Relationship evidence and a defining Memory;
- [ ] at least one save/load boundary occurs after causal evidence is earned but before its later story consequence;
- [ ] the later story gate still behaves correctly after load;
- [ ] principal production proof uses normal NPC dialogue + quest/location + quest-resolution paths;
- [ ] no NPC-specific generic runtime branch is added;
- [ ] no new Relationship dimension is added;
- [ ] no new save schema is added;
- [ ] accumulated M4–M12 Relationship/Trait/save qualification remains green;
- [ ] dedicated M13 routed production qualification passes;
- [ ] production build passes;
- [ ] exact final PR head is qualified;
- [ ] final results and evidence ceiling are recorded here before merge.

## Deliberate non-goals / evidence ceiling

Even a PASS does not establish:

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

Open a dedicated M13 PR only after implementation begins. Keep it draft until exact-head Build Validation passes and this document records the actual results. Ignore the repository Gemini workflow as a merge authority per owner instruction; Build Validation and the recorded M13 evidence are the qualification authority.
