Implementation Status: ✅ SPEC UPDATED (restock rules, affinity gates, constants; UI + dedicated slice still planned)

# Trading System Specification

This document specifies how players buy/sell items with NPCs, including shop inventories, pricing, and restock behavior.

## 1. Overview
- Purpose: Provide economic interactions tied to relationships and traits.
- Core Loop: Discover shop → Browse stock → Buy/Sell → Restock cycles.

## 2. Data Model
- Shop (per NPC or standalone vendor):
	- vendorId: string (usually npcId)
	- stock: Array<{ itemId: string; quantity: number; priceOverride?: number }>
	- lastRestockAt: number (epoch ms)
	- restockIntervalMs: number
	- buybackPool?: Array<{ itemId: string; quantity: number; pricePaid: number }> (optional)
- Price baseline sourced from item catalog `value` field.

## 3. Pricing & Services
There are two price domains in the current implementation:

1) NPC Services (implemented)
- Base price uses `service.currentPrice` if present, else `service.basePrice`.
- Affinity discount: `discountPct = min(floor(affinity/5), 20)`; final price = `floor(base * (1 - discountPct/100))`.
- Zero-cost routing services (merchant/quest links) emit an info toast and require no payment.
- Success effects: training -> +1 attribute point; trait teacher -> +1 skill point; info/crafter -> informative/toast.

2) Item Trading (planned)
- Base: `basePrice = item.value` (item catalog).
- Discount: future-friendly formula (affinity coefficient) to be defined; re-use `TRADING` constants.
- Final buy/sell multipliers are configured in `TRADING`.

## 4. Slice & Thunks (Planned)
- Slice key: `trading` or colocate under `npc` vendors; prefer `trading` for separation.
- Actions:
	- restockVendor(vendorId)
	- buyItem({ vendorId, itemId, quantity })
	- sellItem({ vendorId, itemId, quantity })
- Thunks:
	- processVendorRestocksThunk(tickDelta) — driven by GameLoop.
	- calculatePriceSelectors (memoized) using NPC affinity + traits.

## 5. UI/UX (Planned)
- Shop panel inside NPC view: stock list, price per item, quantity stepper, buy/sell toggles.
- Insufficient funds/items errors via Notification toasts.
- Indicators for restock timer and relationship-based discounts.

## 6. Integration
- Inventory: transfer items on buy/sell; check capacity (if enabled).
- NPC System: affinity is used for service discounts now; vendors tie to NPCs.
- Trait System: discount traits may affect pricing later; shopkeeper traits may affect stock.
- GameLoop: invokes restock processing (implemented in NPC thunks).
- Notifications: confirmations and errors via `notifications` slice.

## 7. Constants
`TRADING` in `src/constants/gameConstants.ts` (implemented subset):
- `REFRESH_INTERVAL_MS`: 5 min default restock cadence
- `MAX_ITEMS_PER_REFRESH`: max distinct stock increments per refresh
- `STOCK_CAP_PER_ITEM`: per-item cap in vendor stock
- `AFFINITY_TO_UNLOCK_NEW_ITEMS`: at/above this affinity, vendors can introduce new catalog items from their inventory list

Planned additions:
- GLOBAL_BUY_MULT, GLOBAL_SELL_MULT, AFFINITY_COEFF, MAX_BUY_PER_TX, MAX_SELL_PER_TX

## 8. Error Handling
- Guard against negative quantities, missing stock, or insufficient funds.
- Atomic updates: adjust vendor stock and player inventory in a single transaction.

## 9. Roadmap (Deferred)
- Dynamic stock influenced by world state and quests.
- Buyback pool, rarity tiers, limited-time offers.
- Currencies beyond gold; barter mechanics.
- Haggling mini-game gated by Charisma/traits.
