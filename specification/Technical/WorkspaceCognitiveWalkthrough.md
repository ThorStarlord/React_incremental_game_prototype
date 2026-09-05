# Workspace Cognitive Walkthrough — Willow Relationship Loop

**Status:** PASS for player-facing causal legibility; human comprehension not claimed  
**Scope:** M5 replacement evidence after narrowing the claim  
**Candidate basis:** relationship vertical slice on PR #25

## 1. Why this qualification exists

The original M5 wording asked whether a genuinely fresh human player could complete the Willow onboarding and explain the causal relationship model afterward.

That is a legitimate user-research claim, but it cannot be proven from the repository workspace alone. The repository can, however, support a narrower and still useful claim:

> **The normal player-facing Willow experience exposes enough causal information for the intended relationship model to be reconstructible from the game itself, without relying on Debug or hidden specification text.**

This document records a workspace-based cognitive walkthrough against that narrower claim.

It does **not** claim:

- that a real fresh player will notice every explanation;
- that the terminology is optimal;
- that the information architecture is effortless to discover;
- that comprehension has been empirically measured with human participants.

Those remain future usability/product-research questions rather than merge-blocking claims for PR #25.

---

## 2. Method

The walkthrough treats only material reachable or rendered through the normal Willow player flow as evidence:

- NPC Overview;
- Dialogue text/responses;
- Quests and authored resolution text;
- Relationship summary;
- landmark Memory summaries;
- Recent Meaningful Experience interpretations;
- Trait Resonance gates;
- final Resonance confirmation text.

Debug panels and design/specification prose are excluded as player-comprehension evidence.

The rubric asks whether the intended causal concept is **expressed or strongly reconstructible** from those player-facing surfaces.

Result labels:

- **PASS — explicit:** the normal UI directly states the concept.
- **PASS — dramatized/inferable:** authored events make the causal relation legible even if the ontology label is not defined formally.
- **WEAK:** the player-facing evidence exists but could reasonably support a competing interpretation.
- **FAIL:** the normal UI teaches or strongly implies the wrong model.

---

## 3. Claim-by-claim walkthrough

### 3.1 Affinity is not Connection XP

**Result: PASS — explicit.**

The migrated NPC Overview tells the player:

> “Deep Connection is earned through meaningful Experiences, choices, and landmark Memories. Affinity reflects current disposition, but filling Affinity does not level this bond.”

The Relationship tab repeats the distinction:

> “Connection measures how much shared history has made you matter to one another. It is not the same as Affinity.”

The normal player surface therefore does not merely omit the legacy Affinity-grind model; it explicitly contradicts it for migrated relationships.

The authored `Willow Disagrees` event also supplies behavioral evidence: the relationship can become more significant through conflict even when immediate warmth falls.

**Workspace conclusion:** the intended distinction is causally legible.

---

### 3.2 Connection comes from meaningful relational evidence, not progress alone

**Result: PASS — explicit.**

The Relationship tab shows Connection progress but immediately qualifies it:

> “Progress alone is not enough: meaningful Experience and Memory evidence must also qualify the change.”

Once a level is earned, the same surface exposes a section labeled:

> “Why this Connection level was earned”

and names the qualifying Experiences/Memories.

The Overview also directs the player toward Dialogue and Quests as the mechanisms that create relationship history rather than offering the old generic +Affinity interaction for migrated NPCs.

**Workspace conclusion:** Connection has visible causal provenance rather than presenting as an unexplained hidden threshold.

---

### 3.3 Memories are consequential relationship history/evidence, not loot

**Result: PASS — explicit.**

The Relationship tab defines the concept directly:

> “Memories are the defining experiences that the relationship can later use as evidence.”

`The Seed Preserved` is presented as:

> “You gave up an immediate advantage to protect something whose value was still only potential.”

`The Lesson Made Yours` is presented as:

> “You recognized Willow's pattern where Willow was not present to point it out.”

The Ancient Seed preserve choice explicitly says there is **no immediate Essence payout**, separating landmark relationship evidence from resource loot.

The Trait surface later displays required Memory evidence as one of several Resonance conditions.

**Workspace conclusion:** the player-facing representation consistently treats Memory as historical/qualifying evidence rather than spendable reward.

---

### 3.4 Deeper qualified Connection changes ongoing passive Essence

**Result: PASS — explicit.**

The Relationship tab exposes a dedicated **Passive Essence** section with the current per-second contribution and states:

> “This is an ongoing consequence of the current bond, not an Essence reward dropped by a scene.”

The Ancient Seed quest reinforces the distinction by contrasting:

- preserve/awaken — delayed relationship significance, no immediate Essence payout;
- extract Sunstone — immediate Essence from the Sunstone's independent charge.

This gives the player both an explanatory UI statement and a concrete authored counterexample to “important relationship scene = Essence drop.”

**Workspace conclusion:** ongoing relationship-derived Essence is legible as a rate consequence, not harvest loot.

---

### 3.5 Willow's Wisdom requires more than enough Essence

**Result: PASS — explicit.**

The Traits tab states:

> “Relationship-mediated Traits must be understood and assimilated before Essence can make them permanent.”

The `WillowsWisdom` card exposes separate gates for:

- Connection;
- Assimilation;
- Compatibility;
- Memory evidence;
- Essence.

The Resonate button remains disabled until the full set is satisfied and its tooltip lists blockers.

**Workspace conclusion:** the normal UI makes it difficult to infer that Essence alone is sufficient.

---

### 3.6 Assimilation represents learning/internalization, not another purchased currency

**Result: PASS — dramatized and reinforced by explicit wording.**

The Trait surface uses the phrase “understood and assimilated before Essence can make them permanent.”

More importantly, the authored Willow sequence supplies the semantics:

- **The First Lesson** introduces the slow-pattern principle;
- **Three Nights of Teaching** has Willow repeatedly test predictions and expose mistakes;
- **The Lesson Made Yours** demonstrates the protagonist applying the pattern independently, away from Willow.

The player-facing Recent Meaningful Experiences uses authored interpretations such as sustained practice converting abstract exposure into working prediction skill and independent application demonstrating that the pattern has become the protagonist's own.

Assimilation therefore has a visible narrative referent rather than being presented only as a percentage meter.

**Residual risk:** a player who never inspects Relationship/Experience explanation text could still treat the percentage instrumentally. That is a human-attention/usability question, not a contradiction in the current player-facing model.

**Workspace conclusion:** causal meaning is reconstructible; empirical salience remains untested.

---

### 3.7 Essence is the final Resonance resource, not the cause of relationship/understanding

**Result: PASS — explicit.**

The final confirmation asks whether the player wants to:

> “Spend [cost] Essence to stabilize the already-assimilated pattern ... as a permanent Trait?”

It immediately clarifies:

> “Essence is the final stabilization cost; it does not replace the relationship, Memory, and assimilation evidence shown in the Trait card.”

That ordering matches the actual runtime gate: relationship/assimilation evidence qualifies first; Essence is spent only at final permanent Resonance.

**Workspace conclusion:** the player-facing sequence states the intended causal role of Essence directly.

---

### 3.8 Conflict can deepen Connection even when Affinity falls

**Result: PASS — dramatized/inferable.**

`Willow Disagrees` challenges a simplistic reading of Willow's principle rather than rewarding agreement. The normal relationship state can show lower Affinity while the subsequent relationship history and Connection evidence continue to advance.

The Relationship tab's definition of Connection as shared history/significance rather than liking makes this outcome interpretable rather than contradictory.

M6 separately proves the same ontology more aggressively with Lyra, but the Willow player slice itself already contains a corrective conflict beat.

**Workspace conclusion:** the player-facing ontology supports non-affectional deepening.

---

## 4. Overall result

### PASS — player-facing causal legibility

The workspace supports the following narrower claim:

> **The Willow vertical slice exposes a coherent, non-contradictory player-facing causal model in which meaningful relationship history qualifies Connection; landmark Memories preserve defining evidence; qualified Connection contributes ongoing passive Essence; teaching and independent application build Trait assimilation; and Essence is used at final Resonance to stabilize an already-qualified pattern.**

The strongest concepts are not merely implied by hidden mechanics. They are stated directly on normal player-facing surfaces and reinforced by authored events.

No inspected normal-player surface teaches the central legacy misconception that Affinity fills Connection, nor does the Resonance UI teach that Essence alone purchases `WillowsWisdom`.

---

## 5. Evidence ceiling

This qualification must **not** be restated as:

- “fresh players understand the system”;
- “the onboarding is proven intuitive”;
- “human comprehension passed”;
- “no tutorial/usability changes will ever be needed.”

A real participant could still:

- skip the Relationship tab;
- ignore explanatory text;
- misunderstand `Assimilation` despite the surrounding narrative;
- fail to notice why passive Essence changed;
- find the terminology too dense.

Those are empirical human-attention and usability questions.

The permitted claim is narrower:

> **The intended causal model is present and reconstructible from normal player-facing evidence.**

---

## 6. Merge-scope decision

For PR #25, human-comprehension validation is **deferred from the merge claim**, not silently treated as passed.

PR #25 may therefore be evaluated on:

1. runtime correctness;
2. routed mechanical playability;
3. player-facing causal legibility;
4. adversarial ontology generalization.

A future human playtest remains valuable product research, but it is no longer a prerequisite for claiming that this PR implements and exposes the relationship progression model.

Issue #26 retains the blind-human protocol as optional future research and is explicitly non-blocking for PR #25.

If a future human session reveals a misconception, classify and fix it as usability/product evidence rather than retroactively treating this workspace qualification as a human study.
