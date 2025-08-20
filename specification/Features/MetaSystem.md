# Meta System Specification

This document describes the meta/session management system, including save metadata and autosave flags.

## 1. Overview
- **Purpose:** Track session info, save/load metadata, and autosave state.
- **Core Loop:** Game start → Session metadata → Save/load → Autosave.

## 2. Features
- Redux slice: `meta`.
- Fields: sessionId, saveTimestamp, autosaveEnabled, etc.
- UI: Save/load panel, autosave indicator.

## 3. Integration
- Save/Load system for persistence.
- Settings system for autosave config.
