# Dialogue System Specification

This document details the dialogue node schema, effects, and integration with NPCs and quests.

## 1. Overview
- **Purpose:** Enable branching dialogue, relationship changes, and quest triggers.
- **Core Loop:** Player interacts → Dialogue node → Effects applied → Next node/exit.

## 2. Dialogue Model
- Nodes: text, choices, effects (AFFINITY_DELTA, UNLOCK_QUEST, GIVE_ITEM, OPEN_SERVICE).
- Effects processed by listeners/thunks.

## 3. Features
- Dialogue UI: branching, choices, tooltips.
- Integration: NPCs, quests, trading, trait discovery.
- Data: `/data/dialogues.json`.
