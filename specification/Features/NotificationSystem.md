# Notification System Specification

This document describes the global notification system for transient messages and feedback.

## 1. Overview
- **Purpose:** Provide user feedback for actions, errors, and game events.
- **Core Loop:** Trigger event → Show notification → Auto-dismiss or manual clear.

## 2. Features
- Types: success, error, info, warning.
- Optional timeouts for auto-dismiss.
- Redux slice: `notifications`.
- UI: Notification panel and toast messages.

## 3. Integration
- Used by all features for feedback (e.g., trait equip, copy creation, quest completion).
