# Trading System Specification

This document details the mechanics for trading with NPCs, including shop stock, restock logic, and price modifiers.

## 1. Overview
- **Purpose:** Allow players to buy/sell items with NPCs, influenced by relationship and traits.
- **Core Loop:** Discover shop → View stock → Buy/sell items → Restock.

## 2. Shop Model
- Each NPC may have a shop with stock defined in their state.
- Stock restocks periodically (see `TRADING` constants).
- Prices modified by affinity and traits.

## 3. Features
- Buy/sell UI in NPC panel.
- Restock timer and notification.
- Price calculation logic.

## 4. Integration
- Inventory system for item transfer.
- NPC system for shop ownership and affinity.
- Constants: `TRADING` in `gameConstants.ts`.
