# Repository Audit: Canonical vs Experimental Files

**Date:** 2026-02-07
**Scope:** Full repository structure audit

---

## Summary

| Category | Count | Description |
|----------|-------|-------------|
| **Canonical** | 9 features + infrastructure | Actively used in production build |
| **Experimental** | 2 features | Incomplete or debug-only |
| **Reference** | 4 doc sets | Reusable design/analysis documentation |
| **Removed** | 4 items | Dead code with zero imports |

---

## Canonical Features (Active & Integrated)

These features are fully implemented, registered in the Redux store, and have production UI.

| Feature | Key Files | Notes |
|---------|-----------|-------|
| **Copy** | Slice, Selectors, Thunks, 4 components | Character copy/clone system |
| **Essence** | Slice, Selectors, Thunks, hooks, 2 components | Core resource system |
| **GameLoop** | Slice, Selectors, Thunks, hook, component | Game tick infrastructure |
| **Meta** | Slice, Selectors, Thunks | Save/load, versioning |
| **NPCs** | Slice, Selectors, Thunks, Listeners, data, hooks, components | Full NPC interaction system |
| **Player** | Slice, Selectors, Thunks, hooks, components, utils | Player state management |
| **Quest** | Slice, Selectors, Thunks, 2 components | Radiant quest system |
| **Settings** | Slice, Selectors, Thunks, 5 UI panels | Graphics/gameplay/audio/UI settings |
| **Traits** | Slice, Selectors, Thunks, effects, hooks, components, utils | Trait acquisition and management |

### Canonical Infrastructure

| File/Directory | Purpose |
|----------------|---------|
| `src/app/store.ts` | Redux store configuration |
| `src/app/hooks.ts` | Typed Redux hooks |
| `src/app/listeners/` | Event listener middleware |
| `src/gameLogic/systems/autosaveSystem.ts` | Autosave infrastructure |
| `src/constants/` | Game, player, and relationship constants |
| `src/config/relationshipConstants.ts` | NPC relationship tier configuration |
| `src/theme/` | MUI theme provider system |
| `src/hooks/` | Shared hooks (import/export, keyboard, notifications, saves) |
| `src/layout/` | Global layout components |
| `src/pages/` | Route-level page components |
| `src/routes/` | React Router configuration |
| `src/shared/` | Cross-feature shared components and utilities |

---

## Experimental Features (Incomplete or Debug-Only)

### Combat (`src/features/Combat/`)
- **Status:** Placeholder — empty state interface, single `targetKilled` action
- **Integration:** Referenced in `GameEventListeners.ts` but not registered in Redux store
- **Recommendation:** Keep as scaffold if combat is planned; otherwise remove

### Inventory (`src/features/Inventory/`)
- **Status:** Scaffold — basic CRUD reducers, debug panel only
- **Integration:** Registered in store, but only used on `DebugPage`
- **Recommendation:** Expand with production UI or extract to a design document

---

## Items Requiring Manual Resolution

### Duplicate Trait Effect Components
- `src/features/Traits/effects/` contains 4 components
- `src/features/Traits/components/containers/` and `src/features/Traits/components/ui/` contain same-named components
- **Both locations are actively imported** — this creates maintenance risk
- **Action needed:** Consolidate to one location and update all imports

### Dual Relationship Constants
- `src/config/relationshipConstants.ts` — NPC relationship tiers (tier-based system)
- `src/constants/relationshipConstants.ts` — Reputation ranges and faction modifiers (enum-based system)
- **Different content serving different purposes** — not true duplicates
- **Action needed:** Consider renaming for clarity (e.g., `relationshipTiers.ts` vs `reputationConstants.ts`)

---

## Reference Documentation

| Document | Status | Purpose |
|----------|--------|---------|
| `specification/GameDesignDocument.md` | Current | Master game design reference |
| `specification/Features/` | Current | Feature-level design specs |
| `specification/Technical/` | Current | Architecture and technical specs |
| `specification/Narrative/` | Current | Story and NPC narrative docs |
| `specification/UI_UX/` | Current | UI/UX design specifications |
| `specification/Requirements/` | Current | Feature requirements |
| `docs/analysis/ContextAnalysis.md` | Resolved | Documents Context→Redux migration |
| `docs/analysis/GameContainerAnalysis.md` | Resolved | Documents component refactoring |
| `docs/analysis/DragDropAnalysis.md` | Resolved | Documents DnD→click migration |
| `gemini.md` | Current | AI agent project instructions |

---

## Dead Code Removed in This Audit

| Item | Reason |
|------|--------|
| `src/features/NPC/` | Empty directory — `NPCTypes.ts` was empty with zero imports. Superseded by `src/features/NPCs/` |
| `src/features/Traits/hooks/useThemeUtils.ts` | Unused hook — zero imports across entire codebase |
| `src/logo.svg` | Unused CRA default asset — zero references |
| `src/theme.ts` | Superseded by `src/theme/` directory — zero imports |
