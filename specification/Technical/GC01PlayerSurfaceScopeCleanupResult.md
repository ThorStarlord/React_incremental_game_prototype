# GC-01 — 1.0 Player-Surface Scope Cleanup Result

**Status:** COMPLETE / INTEGRATED  
**Program:** Campaign One / 1.0 Game Completion  
**Requirement source:** `GameCompletionRoadmap.md` / `../Features/FeatureScopeMatrix.md`  
**Human Product Review:** issue #109 remains OPEN / UNPROVEN

## Completion requirement

GC-01 closes the first post-transition Alpha requirement:

> Player-facing navigation must not advertise cut/deferred Campaign One systems or a duplicate save authority as if they were required 1.0 work.

## Integrated changes

### Router

`src/routes/AppRouter.tsx` no longer mounts `PlaceholderPage` routes for:

```text
/game/skills
/game/inventory
/game/crafting
/game/saves
```

There was also no production `/game/save-load` route despite navigation previously marking that destination implemented.

A nested game wildcard now redirects unknown/cut legacy `/game/*` destinations to `dashboard`, while the global wildcard continues returning non-game unknown routes to the main menu.

No canonical gameplay state is changed by routing fallback.

### Navigation

`src/layout/constants/navigationConfig.ts` retains historical IDs for compatibility but makes their Campaign One status explicit:

```text
skills      -> unavailable / CUT
inventory   -> unavailable / DEFER_POST_1_0
crafting    -> unavailable / CUT
saves       -> unavailable / duplicate save placeholder
save-load   -> unavailable / duplicate save route id
```

`save-load` changed from `isImplemented: true` to `false` because it did not have a production route and because canonical save/load/import/export already lives on the main menu.

Primary `NAVIGATION_SECTIONS` now contain only real Campaign One destinations (plus development-only Debug), and `DEFAULT_NAV_ITEMS` mirrors implemented availability instead of exposing every historical ID.

### Compatibility

`TabId` deliberately keeps historical/deferred IDs so persisted layout state and older code references remain interpretable. Comments now classify them rather than claiming Copies/Essence are future work or cut systems are pending implementation.

### Persistence boundary

No save implementation was added or removed. The existing Main Menu remains the canonical player-facing surface for:

- New Game;
- Continue;
- Load Game;
- Import;
- Export;
- save deletion.

GC-01 therefore removes a false duplicate UI promise rather than creating a second persistence authority.

## Focused qualification

GC-01 adds:

```bash
npm run gc01:validate
```

`GC01PlayerSurfaceScopeCleanup.test.ts` proves:

1. cut/deferred/duplicate-save IDs are absent from implemented/default navigation;
2. those IDs are unavailable through `isItemAvailable`;
3. required current 1.0 player surfaces remain available;
4. primary sections do not advertise excluded IDs;
5. `AppRouter` no longer contains placeholder routes or `PlaceholderPage`;
6. legacy/unknown game URLs fail closed to the Dashboard;
7. Main Menu still exposes the canonical persistence actions.

Build Validation runs the focused GC-01 gate immediately after documentation-authority qualification.

## Qualification and integration evidence

```text
base main:          135896d4ab6866981761328e849887ee64c43a18
qualified candidate: caabc1581316dab33f7eeb98dac9b32072ec57df
Build Validation:   #343 / run 34629859287 / PASS
PR:                 #117 / merged
merge commit:       ff829ce6ee4da8a693adfb783fe843775403326d
```

The exact candidate passed the full repository Build Validation chain before merge, including the GC-01 positive and rejection qualification, existing GameLoop/timing qualification, TypeScript checks, content intelligence, synthetic review contracts, historical regression suites, and production build.

## Explicit non-goals

GC-01 introduces no:

- Skills system or skill tree;
- Inventory implementation;
- Crafting implementation;
- second save-management model;
- persistence/schema change;
- gameplay/progression state change;
- visual redesign;
- mobile-specific redesign.

Historical feature specifications are preserved as reference/provenance rather than deleted.

## Evidence ceiling

A green GC-01 proves only that the current player surface no longer advertises the excluded destinations and that current required destinations remain configured.

It does not prove:

- navigation is understandable to fresh players;
- Dashboard information hierarchy is good;
- onboarding is sufficient;
- the remaining labels are optimal;
- the game is fun or release-ready.

Those remain later human/Beta concerns.

## Qualification state

`GC-01 = COMPLETE / INTEGRATED`.

The next completion-program responsibility is GC-02 Prologue / onboarding. This result does not authorize GC-02 implementation inside the GC-01 package.
