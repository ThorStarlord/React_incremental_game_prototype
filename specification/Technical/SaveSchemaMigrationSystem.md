# Save Schema Versioning & Migration System

**Status:** M10 implemented; exact final PR-head qualification is recorded on PR #31  
**Scope:** Save-envelope identity, deterministic forward migrations, local/import parity, migration diagnostics, and the boundary between persistent migration and current-runtime reconciliation  
**Purpose:** Make historical save evolution explicit, ordered, testable, and provenance-preserving.

---

## 1. Core invariant

> **A save migration transforms representations; it must not manufacture historical facts that the source save could not have known.**

Migrations may preserve known facts, add representation metadata, and introduce neutral/default structure when the source representation genuinely lacked it.

They must not fabricate causal history merely to satisfy a newer model.

For Relationship state, M9's stronger domain rule remains authoritative:

> **Preserve legacy progress; never fabricate modern relationship history.**

That means schema migration must not invent Experiences, Memories, Connection qualification evidence, semantic relationship dimensions, Trait assimilation, Trait compatibility, or Trait-discovery evidence.

---

## 2. Version authority

The save schema has one authoritative current version:

```typescript
CURRENT_SAVE_SCHEMA_VERSION
```

It lives in:

```text
src/shared/utils/saveSchema.ts
```

Game/content version and save-schema version are different concepts.

The current persistent envelope is conceptually:

```typescript
interface SaveEnvelope {
  schemaVersion: number;
  gameVersion: string;
  timestamp: number;
  state: RootState;
}
```

`gameVersion` describes the game/content build associated with the state.

`schemaVersion` describes the persistent representation contract and determines which migration chain is required.

Do not use the game version as a substitute for schema identity.

---

## 3. Historical version model

M10 introduces the first explicit schema identity.

The repository cannot honestly distinguish several different pre-M10 persistent schemas because older saves did not persist a schema-version field.

Therefore the supported model is deliberately minimal:

```text
v0 = any recognizable supported historical payload with no schemaVersion
v1 = explicit M10 SaveEnvelope
```

Missing `schemaVersion` means **legacy v0**.

A present `schemaVersion` is strict schema identity. It must be a non-negative integer number. Values such as `null`, `"1"`, booleans, negative numbers, or fractional numbers are malformed and fail as `INVALID_SAVE`; they are never coerced into a migration version.

M10 does not infer multiple unrecorded historical versions from surrounding gameplay state.

That would manufacture representational certainty the saved bytes do not contain.

---

## 4. Supported v0 shapes

Two historical transport/storage shapes existed before M10.

### Stored wrapper

```typescript
{
  version: string;
  timestamp: number;
  state: RootState;
}
```

### Raw exported/imported state

```typescript
RootState
```

Both are v0 because neither carries explicit schema identity.

For a raw historical `RootState`, the old export format did not contain an envelope timestamp. M10 normalizes that unknown timestamp to the deterministic sentinel `0` during v0 decoding rather than inventing a wall-clock time.

When an imported historical state is persisted as a new save slot, the new slot receives its real current save timestamp while the migrated envelope retains authoritative historical metadata such as `gameVersion`.

---

## 5. Migration registry

Forward migrations are explicit adjacent transitions registered by source version.

Conceptually:

```typescript
const SAVE_MIGRATIONS = {
  0: migrateV0ToV1,
  1: migrateV1ToV2,
  2: migrateV2ToV3,
};
```

The current production registry contains:

```text
v0 -> v1
```

A migration step declares:

```typescript
{
  id,
  fromVersion,
  toVersion,
  migrate
}
```

The runner requires each transition to advance exactly one version.

A registration claiming, for example:

```text
v2 -> v4
```

when `v2 -> v3` is required is invalid.

No step may be skipped silently.

---

## 6. Migration execution

The canonical persistent path is:

```text
serialized payload
-> detect source schema
-> normalize source representation
-> apply vN -> vN+1
-> apply additional adjacent migrations as required
-> validate current envelope
-> expose migration diagnostics
-> install migrated RootState
-> current-runtime reconciliation
```

`runSaveMigrationChain(...)` is the generic ordered runner.

`migrateSavePayload(...)` is the production entry point that targets `CURRENT_SAVE_SCHEMA_VERSION` using the production registry.

Migration returns observable evidence:

```typescript
{
  sourceVersion,
  targetVersion,
  appliedMigrations,
  envelope
}
```

A caller can therefore report:

```text
v0 -> v1
applied: save-schema-v0-to-v1
```

without reverse engineering incidental load behavior.

---

## 7. Immutability

Schema migration operates on serialized Redux-compatible data.

The migration boundary clones the source representation before a step may transform it.

A supported migration must not unexpectedly mutate the caller's historical object.

This matters for:

- deterministic tests;
- diagnostics;
- retry behavior;
- reasoning about failed migrations;
- preventing partial conversion of an object that may still be needed for error handling.

---

## 8. Failure semantics

Migration failures are explicit.

`SaveMigrationError` distinguishes major failure families:

```text
INVALID_SAVE
FUTURE_SCHEMA
MISSING_MIGRATION
INVALID_MIGRATION_RESULT
```

### Invalid schema identity

If `schemaVersion` is present but is not a non-negative integer number:

```text
schemaVersion: null | "1" | true | -1 | 1.5
-> INVALID_SAVE
```

The decoder does not use JavaScript numeric coercion to reinterpret malformed identity as a valid migration source.

### Future schema

If the runtime supports v1 and receives v2:

```text
v2 > current v1
-> reject
```

The system does not attempt an implicit downgrade.

### Missing step

If a chain requires:

```text
v1 -> v2
```

and no such step exists:

```text
-> fail at that exact boundary
```

It must not jump forward or install a partially migrated representation as current.

### Invalid migration output

A migration claiming `v1 -> v2` must actually produce a v2 envelope.

A wrong version or invalid envelope is a migration failure.

---

## 9. Local save lifecycle

New saves are always written at the current schema.

Conceptually:

```text
active RootState
-> createCurrentSaveEnvelope
-> game_save_${saveId}
```

The canonical local metadata list remains:

```text
saved_games
```

Metadata for newly created saves records both:

```text
version       = game/content version
schemaVersion = persistent schema version
```

Those fields must not be conflated.

Historical metadata can legitimately omit `schemaVersion`; absence means the slot predates explicit schema identity.

---

## 10. Load lifecycle

The normal Main Menu load path is now:

```text
read game_save_${saveId}
-> migrateSavePayload(serialized payload)
-> current persistent envelope
-> replaceState(migrated state)
-> initializeRelationshipRuntimeThunk({ migrateLegacyProfiles: true })
-> register current relationship authoring
-> perform bounded M9 compatibility reconciliation where needed
-> recalculate derived passive Essence rate
-> enter game
```

This order is intentional.

Persistent representation migration happens **before** Redux replacement.

Current-runtime/content reconciliation happens **after** the migrated state becomes active.

An unsupported/corrupt schema therefore cannot masquerade as a successful load followed by partial runtime repair.

---

## 11. Persistent migration vs runtime reconciliation

This is an architectural boundary, not merely an implementation detail.

### Persistent migration

Persistent migration answers:

> What representation did these saved bytes use, and how do we transform that representation into the current persistent contract?

It must be deterministic from the saved representation plus migration code.

### Runtime reconciliation

Runtime reconciliation answers:

> Given current migrated state and today's authored/runtime definitions, what registrations or derived state must the running game establish?

Examples include:

- registering current Relationship progression definitions;
- reconciling a raw legacy NPC depth into M9's bounded compatibility Bond Profile;
- recalculating passive Essence generation;
- establishing runtime caches/listeners where required.

M9's legacy Relationship mapping remains in runtime reconciliation because its maximum compatible Connection level is defined by the **current authored relationship manifest**.

Moving that mapping into the serialized v0 -> v1 migration would make historical schema conversion depend on live content loading and blur persistent facts with current-content interpretation.

M10 deliberately does not do that.

---

## 12. M9 provenance preservation

After v0 -> v1 persistent migration, an old save may still have only legacy NPC fields such as:

```text
affinity
connectionDepth
```

The existing M9 runtime reconciliation may then preserve:

- legacy Affinity;
- bounded compatibility Connection level;
- original legacy depth as provenance.

It still must not fabricate:

- Experiences;
- Memories;
- Connection Progress;
- qualification evidence;
- Trust;
- Understanding;
- Shared Meaning;
- Reliance;
- Vulnerability;
- Reciprocity;
- Trait assimilation;
- Trait compatibility;
- authored Trait discovery.

Schema v1 does not weaken those rules.

---

## 13. Essence boundary

Migration may cause the current runtime to recalculate a generation **rate** from migrated/reconciled state.

Migration itself must not mint current Essence balance.

The existing M9 qualification remains responsible for proving that a legacy-derived Connection cannot fabricate a modern high-quality bond and cannot bypass Trait-learning evidence.

---

## 14. Import/export authority

M10 removes the previous split between local save representation and import/export representation.

### Export

New export codes/files emit the current canonical envelope, including `schemaVersion`.

Copy/paste save codes encode the JSON envelope as UTF-8 bytes before base64 conversion, so non-ASCII authored or player text is preserved. Surrounding copy/paste whitespace is ignored during decode.

### Historical import

Old exported raw `RootState` remains accepted as v0.

### Current import

A current envelope is recognized as current and receives no semantic migration.

### Persistence after import

Imported supported payloads pass through `migrateSavePayload(...)`. The resulting **migrated current envelope** is then persisted as the new save slot rather than reconstructing a second envelope from `RootState`.

This preserves authoritative envelope-level metadata, including a historical wrapper's `gameVersion`, even when the embedded state does not carry that value.

There is no separate import-only migration chain.

That is a core M10 invariant:

> **Transport location does not choose migration semantics; schema identity does.**

---

## 15. Compatibility wrapper

`loadSavedGame(...)` remains as a compatibility API for existing callers that only need `RootState`.

New migration-aware load surfaces should prefer:

```typescript
loadSavedGameWithMigration(...)
```

because it exposes:

- migrated state;
- current envelope;
- source/target schema;
- applied migration ids.

The compatibility wrapper catches migration errors and returns `null` using the repository's older load contract.

The primary Main Menu path uses the strict migration-aware API so unsupported future schemas remain observable.

---

## 16. Qualification

M10 adds:

```text
src/shared/utils/saveSchema.test.ts
src/shared/utils/saveUtils.test.ts
```

### Schema-pipeline coverage

The dedicated tests prove:

1. newly created envelopes identify the current schema;
2. current saves require no migration;
3. missing `schemaVersion` means legacy v0;
4. malformed present schema identities are rejected rather than coerced;
5. historical stored wrappers migrate v0 -> v1;
6. historical raw RootState exports migrate v0 -> v1;
7. future schemas are rejected;
8. multiple registered transitions execute in deterministic ascending order;
9. missing transitions fail at the exact boundary;
10. migrations cannot skip a required version;
11. migration does not mutate the source historical object;
12. a migrated current envelope is idempotent on a second pass.

### Storage/import coverage

The save-utils tests prove:

1. `createSave` stores current schema identity in both envelope and metadata;
2. UTF-8 save-code transport round-trips non-ASCII text and ignores surrounding copy/paste whitespace;
3. a locally stored historical save uses the canonical migration pipeline;
4. an imported historical raw state uses that same pipeline;
5. a migrated import is re-persisted as current schema;
6. imported wrapper-level `gameVersion` survives re-persistence even when embedded state lacks it;
7. a current imported envelope is not migrated twice;
8. a future local schema fails at the strict load boundary.

### Existing regressions retained

Build Validation continues to run:

- M4 Relationship runtime;
- M5 routed Willow;
- M6 Lyra universality;
- M7 Elara collaboration;
- M8 Trait discovery;
- M9 legacy Relationship save migration;
- M10 schema/versioning tests;
- TypeScript;
- production build.

Build Validation **#115** passed on the first M10 code candidate before documentation/metadata reconciliation.

A late review identified stricter schema-identity, Unicode transport, and imported-envelope metadata edge cases. Build Validation **#125** passed the hardened code candidate before this final documentation reconciliation.

Because this documentation commit changes the PR head, only a later exact-final-head run qualifies the final candidate; that final run is recorded on PR #31 rather than encoded as a mutable status claim here.

---

## 17. Future migration authoring protocol

When persistent state changes incompatibly in the future:

1. Increment `CURRENT_SAVE_SCHEMA_VERSION` by exactly one.
2. Define what factual representation changed between vN and vN+1.
3. Add exactly one explicit `vN -> vN+1` migration step.
4. Preserve known historical facts.
5. Identify every new field as preserved, derived, neutral/defaulted, or inferred.
6. Add provenance when an inference materially affects gameplay or explanation.
7. Never manufacture unavailable causal history.
8. Add migration-specific tests for the new boundary.
9. Run historical chains from every supported source version to current.
10. Retain existing subsystem regression tests.
11. Qualify the exact final PR head after documentation/review fixes.

Do not edit old migration steps to make a new schema work unless correcting a proven bug in historical migration behavior.

A historical transition is part of the compatibility contract once released.

---

## 18. Deliberate non-goals

M10 does not add:

- a database;
- cloud/server persistence;
- event sourcing;
- CRDTs;
- arbitrary schema downgrades;
- automatic rollback migrations;
- a generalized serializer for every game object;
- a new Redux/state-management framework;
- Relationship redesign;
- Essence redesign;
- Trait redesign.

M10 establishes trustworthy **forward** evolution of the existing persistent model.

---

## 19. Evidence ceiling

M10 proves that supported serialized representations have an explicit path to the current persistent envelope and that the existing gameplay regressions survive that architecture.

It does not prove that:

- every hypothetical future state shape can be migrated automatically;
- save corruption can always be repaired;
- live content can reconstruct historical facts that were never persisted;
- future-schema saves can be safely downgraded;
- persistence is transactional across browser/storage failures;
- cloud synchronization exists.

Those claims are outside the implemented evidence.

---

## 20. Success criterion

M10 succeeds when the repository can say:

> **Given a supported historical save representation, the runtime can identify its schema, apply an explicit deterministic forward migration chain, preserve facts without inventing unavailable history, arrive at the current persistent envelope, install that state, and then perform current-runtime reconciliation as a separate phase.**

The key conceptual shift is:

> **A save is not merely data that happens to load; it is a historical representation with an explicit path to the current model.**
