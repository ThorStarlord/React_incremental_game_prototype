# Inventory System Specification

This document outlines the design and mechanics of the Inventory system, which manages item storage, acquisition, and usage for the player.

## 1. Overview
- **Purpose:** Provide a simple, extensible item storage system for quest rewards, trading, and crafting.
- **Core Loop:** Acquire items → Store in inventory → Use/trade/craft → Remove items.

## 2. Data Model
- Items stored as a map: `{ [itemId: string]: Item }`.
- Supports stackable and unique items.

## 3. Features
- Add/remove items (via quests, trading, NPCs).
- Item usage hooks for quest objectives and crafting (planned).
- UI: Inventory panel with item list, tooltips, and action buttons.

## 4. Integration
- Used by Quest, Trading, and Crafting systems.
- Redux slice: `inventory`.

## 5. Planned Extensions
- Item categorization, sorting, filtering.
- Crafting integration.
- Equipment slots (future).
