Implementation Status: 📋 SPEC READY (UI + slice planned)

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

## 3. Pricing Formula
- Base: `basePrice = item.value`
- Affinity modifier: `affinityMod = 1 - clamp(affinity, -100, 100) * A`, where A ≈ 0.001–0.003 (config).
- Trait discounts/surcharges: multiplicative modifiers via selectors.
- Final buy price: `ceil(basePrice * affinityMod * traitMods * GLOBAL_BUY_MULT)`
- Final sell price: `floor(basePrice * GLOBAL_SELL_MULT * traitModsSell)`
- All coefficients configured in `TRADING` constants.

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
- NPC System: read `affinity` for pricing; vendors tied to specific NPCs.
- Trait System: discount traits affect pricing; shopkeeper traits may affect stock.
- GameLoop: invokes restock processing at intervals.
- Notifications: confirmations and errors.

## 7. Constants
- `TRADING` in `src/constants/gameConstants.ts`:
	- GLOBAL_BUY_MULT, GLOBAL_SELL_MULT, AFFINITY_COEFF, RESTOCK_INTERVAL_MS_DEFAULT,
		MAX_BUY_PER_TX, MAX_SELL_PER_TX.

## 8. Error Handling
- Guard against negative quantities, missing stock, or insufficient funds.
- Atomic updates: adjust vendor stock and player inventory in a single transaction.

## 9. Roadmap (Deferred)
- Dynamic stock influenced by world state and quests.
- Buyback pool, rarity tiers, limited-time offers.
- Currencies beyond gold; barter mechanics.
- Haggling mini-game gated by Charisma/traits.
