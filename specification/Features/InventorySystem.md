Implementation Status: ✅ SPEC ALIGNED (state implemented; UI panel planned)

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
- Inventory storage structure (implemented MVP):
	- items: Record<string, number>  // itemId -> quantity
	- (order/capacity/currency planned; not stored yet)

## 3. State & Slice
- Slice directory: `src/features/Inventory/` (singular feature folder)
- Slice key: `inventory` (camelCase)
- Core reducers/actions (implemented subset):
	- addItem({ itemId, quantity }): adds or stacks quantity
	- removeItem({ itemId, quantity }): decrements or deletes when reaches zero
	Planned:
	- setItemQuantity, clearInventory, sortInventory
- Thunks/listeners (planned):
	- grantQuestRewardThunk(questId) → add items based on quest data.
	- handleDialogueGiveItem(effect) → add item(s) on dialogue effect.
	- ensureCapacityGuardMiddleware (optional) to block additions when full.
- Selectors:
	- selectInventoryItems(): array for UI with denormalized metadata.
	- selectItemQuantity(itemId): number.
	- selectHasItem(itemId, qty=1): boolean.

## 4. Item Catalog Data
- Source of truth (prototype): `src/shared/data/itemCatalog.ts`
- Interface: `ItemDef { id, name, description, category, basePrice }`
- Helper: `getItemDef(itemId)` used by NPC trades/restock logic

## 5. UI/UX
- Inventory Panel (planned):
	- Location: `src/features/Inventory/components/InventoryPanel.tsx` (planned)
	- Features: list/grid view, search/filter by category/tags, quantity badges, item tooltip.
	- Actions per item: Use (if consumable), Split stack (optional), Drop (optional), Sell (via Trading UI context).
- Quick Actions: grant/remove buttons in Debug page for prototyping.

## 6. Integration Points
- Dialogue: `GIVE_ITEM` effects add items via `addItem` during `processNPCInteractionThunk`.
- Quests: turn-ins and rewards (planned) will use add/remove flows.
- Trading: buy/sell transfers items and currency between player and shop (planned UI); restock already integrates with catalog.
- Notifications: success/error toasts upon add/remove/insufficient quantity.
- Save/Load: included in root Redux state serialization.

## 7. Constants & Balancing
- `TRADING` constants control restock cadence and affinity gates.
- Future `INVENTORY` constants (planned): DEFAULT_MAX_STACK, DEFAULT_CAPACITY, DROP_ENABLED.
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
