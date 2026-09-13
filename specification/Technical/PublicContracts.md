# Public Runtime and Persistence Contracts

**Status:** CURRENT AUTHORITY for 1.0 compatibility decisions

This application is distributed as a client-side game rather than a reusable
library. Its public contracts are therefore the interfaces a player, browser
storage, imported save, authored content bundle, or release tool can observe.

## Contract classes

| Contract | Authority | Compatibility rule |
| --- | --- | --- |
| Runtime Redux state | `src/app/store.ts` | Internal composition only; never serialize or import as a save schema. |
| Persisted save state | `src/shared/persistence/PersistedGameState.ts` and `saveSchema.ts` | Schema-versioned. Additive changes require defaults; incompatible changes require a numbered migration. |
| Save metadata | `saved_games` localStorage record | Invalid entries are ignored and never become load authority. IDs are unique even when the clock repeats. |
| Save payload keys | `game_save_<id>` | Existing keys remain readable for supported versions; deletion and migration must be explicit. |
| Authored IDs | JSON content under `public/data` | IDs are durable references. Renaming requires an alias or migration; descriptions are not executable contracts. |
| Player routes | `src/routes` | Removing or redirecting a route is a release change and must update browser qualification. |
| Release scripts | `scripts/release-*.js` | A green deterministic result cannot imply missing Beta, deployment, or browser evidence. |

## SemVer policy

Until the release record is promoted, package metadata must not claim a stable
1.0 contract. Once promoted:

- patch releases may fix implementations without changing persisted meaning;
- minor releases may add optional persisted fields with deterministic defaults;
- major releases are required for incompatible save, route, or durable-ID changes;
- every save-schema change must add a migration or explicitly reject the old version.

Runtime-only Redux fields, notifications, loading flags, and selected UI state
are not persistent API. The `PersistedGameState` projection is the only legal
input to a save envelope.
