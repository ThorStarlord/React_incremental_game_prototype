# Import/Export Addendum

This addendum describes the save import/export mechanics and data format.

## 1. Overview
- **Purpose:** Allow players to transfer saves via base64-encoded strings.
- **Core Loop:** Export save → Copy code → Import code → Load state.

## 2. Features
- Manual export/import via UI.
- Data format: base64-encoded JSON.
- Validation and error handling for imports.

## 3. Integration
- Save/Load system for serialization.
- Settings system for import/export options.
