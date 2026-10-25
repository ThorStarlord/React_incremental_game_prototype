# Campaign One 1.1 — Trait Expression UI contract (UX-D)

**Status:** Proposed stacked UI implementation on draft PR #178. Not valid for released 1.0; do not call it 1.1-qualified before exact-head Build Validation.

The 1.1 implementation distinguishes known/discovered Trait patterns, current expression, and permanent assimilation. Stabilization is the Essence-based transition that records lasting assimilation, not an additional always-on effect state. Slots hold expressed effects. Suppression never deletes assimilated ownership.

## Doctrine preview
- Preview the current expression set and the proposed expression set using exactly the first unlocked slots that `activateDoctrineThunk` occupies.
- Only doctrines whose required pair is assimilated are presented as eligible.
- Show pattern names and explicit "will suppress" and "will express" differences; do not invent skill bonuses or probabilistic predictions.
- When existing expressed effects will be suppressed, get explicit confirmation before invoking canonical thunk.
- Switching remains free, with no NPC proximity requirement or added delay.
- Confirmation does not alter save schema or gameplay policy.

## Tests
- Pure preview agrees with the canonical two-slot adoption/switch rule; no hidden state mutation.
- Existing Doctrine surface tests now explicitly confirm destructive switches and preserve the expected active Doctrine/Quest outcomes.
- Check human comprehension separately; deterministic tests do not prove intuitive buildcraft.

**Dependency:** PR #178's universal Trait expression and save v3 migration must be qualified before promotion. A failure of PR #178's Build Validation cannot be waived by successful UI previews.
