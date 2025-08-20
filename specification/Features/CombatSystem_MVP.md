# Combat System MVP Specification

This document outlines the minimal combat event system for quest objectives and future expansion.

## 1. Overview
- **Purpose:** Track combat events (e.g., target killed) for quest progression.
- **Core Loop:** Combat event → Update quest objective.

## 2. Features
- Redux slice: `combat` (event-only, no combat state yet).
- Event: `targetKilled` dispatched for quest listeners.

## 3. Planned Extensions
- Full combat state, turn order, abilities, and UI (future).
