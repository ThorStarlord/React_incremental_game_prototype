# Constants Overview

This document summarizes key game constants and their locations for tuning and reference.

## 1. Overview
- Centralized constants in `src/constants/gameConstants.ts` and related files.

## 2. Major Constants (Implemented subset)
- `COPY_SYSTEM`:
	- Growth/decay rates, accelerated multiplier and cost
	- Essence bonus per qualifying Copy
	- Trait slot caps and unlock rules
	- Creation/promotion costs and task rewards (baseline)
- `TRADING`:
	- `REFRESH_INTERVAL_MS`, `MAX_ITEMS_PER_REFRESH`, `STOCK_CAP_PER_ITEM`, `AFFINITY_TO_UNLOCK_NEW_ITEMS`
- `ESSENCE_GENERATION`:
	- `BASE_RATE_PER_SECOND`, `NPC_CONTRIBUTION_MULTIPLIER`
- `TRAIT_RESONANCE`:
	- `MIN_CONNECTION_DEPTH`

## 3. Usage
- Referenced by feature slices and thunks for game logic (NPC, Copy, Essence).
- Extend cautiously; keep this overview synced with `gameConstants.ts`.
