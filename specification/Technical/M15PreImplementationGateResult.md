# M15 Pre-Implementation Gate Result

**Status:** STOP — prerequisite correctness defect found before M15 behavior changes  
**M15 preregistration:** `M15LongHorizonRelationshipCallbackQualification.md`  
**M15 branch baseline:** `6eac07a973eb032ccbf4a89fa3ba6fc5003101fb`

## Gate

Before M15 implementation, verify that the M14 policy Experiences used as historical discriminators are mutually exclusive in ordinary production play.

## Result

**FAIL.**

The production Dialogue UI derives visible topics from `npc.availableDialogues` and positive Relationship evidence gates. It does not remove or hide a topic because it was previously selected.

`processNPCInteractionThunk` likewise reprocesses the same dialogue node on later calls. It enforces `requiredExperienceIds` and `anyOfExperienceIds`, then applies every effect matching the newly selected `responseId`. It does not consult `npc.completedDialogues` or otherwise enforce one-shot decision semantics.

M14 response-specific Relationship Experiences have distinct ids/unique keys, so Relationship idempotency prevents duplicate application of the *same* response but does not prevent a later different response from the same decision node.

Therefore an ordinary playthrough can accumulate mutually exclusive outcomes from:

- `valerius_m14_aftermath_council` — public crackdown / protect source / quiet reroute;
- `gronk_m14_repair_ledger` — build for load / restore visible order.

This is a pre-existing M14 correctness defect, not an M15 authoring inconvenience.

## Required action

Per the M15 preregistration:

1. stop M15 implementation;
2. preserve this finding;
3. repair and qualify one-shot/exclusive dialogue decision semantics separately;
4. merge the exact qualified repair to `main`;
5. restart/rebase M15 from corrected `main`;
6. rerun the exclusivity gate before adding M15 production content.

Do not work around this defect with an M15 story flag, NPC-specific runtime branch, or negative-history condition.

## Preliminary repair direction

The repository already carries `NPC.completedDialogues`, but current runtime does not use it for completion semantics.

Two independent M14 production decisions require the same missing behavior. The bounded candidate repair is therefore:

- add an explicit authoring flag such as `repeatable: false` to one-shot decision topics;
- default existing topics to repeatable when the flag is absent;
- after successful processing of a non-repeatable topic, record its id in `completedDialogues`;
- hide completed non-repeatable topics in the production UI;
- reject direct thunk bypass of a completed non-repeatable topic;
- persist this using existing NPC save state rather than adding a new save schema;
- mark both M14 decision topics non-repeatable;
- qualify that only one response-specific historical outcome can be recorded per topic.

The repair must be performed outside the M15 feature branch.