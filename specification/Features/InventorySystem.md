Implementation Status: 📋 FOUNDATION SPEC COMPLETE (state + UI planned)

# Inventory System Specification

This document defines the Inventory system: item representation, storage, transfer, and usage flows across the game.

## 1. Overview
- Purpose: Provide a scalable item storage and interaction layer that supports quest rewards, NPC trading, crafting (future), and event-driven usage.
- Core Loop: Acquire → Store → Inspect → Use/Trade/Consume → Remove.

## 2. Data Model
- Item identity: string `itemId` unique across game data.
- Item schema (conceptual):
	- id: string
	- name: string
	- description: string
	- category: 'consumable' | 'material' | 'quest' | 'equipment' | 'currency'
	- stackable: boolean
	- maxStack: number (default 99 if stackable)
	- value: number (base price for trading; see Trading spec)
	- tags?: string[] (for filters/search)
	- effects?: Array<{ type: string; magnitude?: number; durationMs?: number }>
- Inventory storage structure:
	- entities: Record<string, { itemId: string; quantity: number }>
	- order: string[] (stable ordering for UI; optional)
	- capacity: number | null (null = unlimited for prototype)
	- currency: Record<string, number> (e.g., { gold: 0 }) — optional for MVP, can be modeled as items too.

## 3. State & Slice
- Slice directory: `src/features/Inventory/` (singular feature folder)
- Slice key: `inventory` (camelCase)
- Core reducers/actions (planned):
	- addItem({ itemId, quantity }): adds or stacks quantity; respects maxStack if enforced.
	- removeItem({ itemId, quantity }): decrements or removes entry; no negative quantities.
	- setItemQuantity({ itemId, quantity }): admin/debug convenience.
	- clearInventory(): empties all items (debug/reset).
	- sortInventory({ by, direction }): optional client-side ordering.
- Thunks/listeners (planned):
	- grantQuestRewardThunk(questId) → add items based on quest data.
	- handleDialogueGiveItem(effect) → add item(s) on dialogue effect.
	- ensureCapacityGuardMiddleware (optional) to block additions when full.
- Selectors:
	- selectInventoryItems(): array for UI with denormalized metadata.
	- selectItemQuantity(itemId): number.
	- selectHasItem(itemId, qty=1): boolean.

## 4. Item Catalog Data
- Source of truth: `/public/data/items.json` (planned) or embedded constants for prototype.
- Validation: Unknown `itemId` guarded with notification warning and ignored.

## 5. UI/UX
- Inventory Panel (planned):
	- Location: `src/features/Inventory/components/InventoryPanel.tsx` (planned)
	- Features: list/grid view, search/filter by category/tags, quantity badges, item tooltip.
	- Actions per item: Use (if consumable), Split stack (optional), Drop (optional), Sell (via Trading UI context).
- Quick Actions: grant/remove buttons in Debug page for prototyping.

## 6. Integration Points
- Dialogue: GIVE_ITEM effects route to inventory add; TAKE_ITEM effects remove.
- Quests: objective checks `selectHasItem` for turn-ins; rewards grant items.
- Trading: buy/sell transfers items and currency between player and shop.
- Notification: success/error toasts upon add/remove/insufficient quantity.
- Save/Load: fully serialized within root save; no side-car needed.

## 7. Constants & Balancing
- `INVENTORY` in `src/constants/gameConstants.ts` (planned):
	- DEFAULT_MAX_STACK, DEFAULT_CAPACITY, DROP_ENABLED, SELL_PRICE_MULTIPLIER.
- Price/value baseline lives in item catalog; Trading applies modifiers.

## 8. Error Handling
- Prevent negative quantities, overflow beyond maxStack (if enforced).
- On missing catalog entry, log and notify (non-blocking) and skip mutation.

## 9. Performance
- Keep state normalized; selectors memoize projections for UI.
- Avoid re-sorting on every update; store an `order` array when necessary.

## 10. Roadmap (Deferred)
- Equipment subsystem with slots and stat links.
- Crafting/recipes using materials with batch operations.
- Sorting presets, favorites/pins, and custom tabs.
- Capacity upgrades and encumbrance.
- Item rarities and modifiers (affixes) for depth.

## 11. Assumptions
- Currency can be modeled either as items or a separate `currency` map; choose the simpler approach per milestone.
- MVP does not enforce capacity; gameplay depth comes later via Trading/Crafting.
