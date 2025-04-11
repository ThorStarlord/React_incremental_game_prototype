# Product Requirements Document: Incremental RPG Prototype (Developer Focused)

**Version:** 1.3
**Date:** 2023-11-16
**Author/Team:** [Your Name/Team Name]
**Status:** Development Guide

## 1. Introduction

### 1.1 Purpose
This document serves as a **developer guide and requirements specification** for building the **Incremental RPG Prototype**. It outlines the core features, target architecture, and specific implementation details for this initial phase, focusing on validating mechanics and establishing a scalable foundation using React, TypeScript, Redux Toolkit, and Material UI.

### 1.2 Goals
*   **Demonstrate Core Loop:** Implement the Essence generation/spending loop.
*   **Validate Trait System:** Build a functional acquire/equip/effect system for Traits.
*   **Establish Architecture:** Implement and test the feature-sliced structure, Redux patterns, and chosen tech stack.
*   **Implement Persistence:** Ensure reliable save/load/import/export.
*   **Build Foundational UI:** Create the core layout and necessary displays/dialogs using MUI.

### 1.3 Scope
*   **Core Resource:** Essence (manual test generation, passive generation, spending).
*   **Player:** Basic state, stats, attributes (display only), simple XP/Level concept.
*   **Trait System:** Definition loading, acquisition, equipping (limited slots), basic stat effects, permanent traits.
*   **Persistence:** Local Storage based save/load/import/export.
*   **Settings:** Basic autosave configuration.
*   **UI:** Main Menu, 3-Column Game Layout (with specific resizability), core displays, dialogs. Middle Column is a placeholder.
*   **Technical:** Implementation of dynamic component rendering for side columns.

**Out of Scope for Prototype v1.0:**
*   Combat, detailed NPCs, Inventory, Skills, World Map/Exploration, Quests, Multiplayer.
*   Complex Balancing, advanced UI polish/animations.
*   Functional content/interactions within the Middle Column (beyond test button).

## 2. Target Audience

*   **Primary:** Developer (You) - Guiding implementation and architectural choices.

## 3. Goals & Objectives

*   **(Objective 1-8 remain the same as v1.2)**
*   **Objective 9:** Implement the specified 3-column layout with draggable Left/Right columns and a static Middle column.
*   **Objective 10:** Utilize a dynamic component registry pattern for rendering content within the Left and Right columns.

## 4. Features & Requirements

**(Sections 4.1 to 4.5 remain the same as v1.2 - Essence, Player, Traits, Persistence, Settings)**

---

### 4.6 User Interface & Layout

*   **REQ-UI-001:** A Main Menu screen shall provide access to New Game, Continue, Load Game, Import/Export, and Settings/About options.
*   **REQ-UI-002:** The main game interface (`GameContainer`) shall implement a **responsive three-column layout** (Left, Middle, Right) for larger screens using Material UI components (e.g., Box, Grid).
*   **REQ-UI-003:** The **Left Column** shall primarily display core player information. For the prototype, this includes:
    *   Player Stats panel (`PlayerStats.tsx`).
    *   Essence information panel (`EssenceDisplay.tsx`).
    *   *(Future: Inventory Summary, Equipment)*
*   **REQ-UI-004:** The **Middle Column** shall serve as the main interaction area. For the prototype, this column will be **largely empty or contain placeholder content**. It *must* include:
    *   The manual test button for gaining Essence (`BasicEssenceButton.tsx`).
    *   *(Future: World Map, Town/Dungeon Views, Dialogue Windows, Combat Screen)*
*   **REQ-UI-005:** The **Right Column** shall display auxiliary information and management panels. For the prototype, this includes:
    *   Trait management panel showing equipped traits and trait slots (`TraitSlots.tsx`).
    *   *(Future: Quest Log, Faction Reputations, Detailed Acquired Trait List/Codex)*
*   **REQ-UI-006:** On smaller screens, the layout shall adapt (e.g., collapsing side columns into drawers/tabs). *(Prototype focus: functional desktop layout first)*.
*   **REQ-UI-007:** Core information (Essence, Player Health/Mana) shall be readily visible during gameplay.
*   **REQ-UI-008:** Clear visual feedback shall be provided for key actions using standard MUI components.
*   **REQ-UI-009:** UI components within columns should be modular and potentially collapsible (using shared `Panel` component).
*   **REQ-UI-010 (Layout Behavior):** The **Left and Right columns** shall be **resizable** by the user via draggable anchors/dividers implemented in the UI (e.g., using a library like `react-resizable` or custom implementation).
*   **REQ-UI-011 (Layout Behavior):** The **Middle Column's width** shall adjust automatically based on the resizing of the Left and Right columns but shall **not be directly resizable itself** relative to the side columns (i.e., it fills the remaining space).
*   **REQ-UI-012 (Architecture):** The content within the Left and Right columns shall be rendered using a **Dynamic Component Registry** pattern. This involves:
    *   Defining a registry mapping component IDs (strings) to actual React components and metadata (title, default state, etc.).
    *   Allowing the `LeftColumn` and `RightColumn` components to accept an array of component IDs to render.
    *   Dynamically importing/rendering the specified components from the registry. *(See `src/layout/components/LeftColumn.tsx` / `RightColumn.tsx` for existing implementation foundation)*.

## 5. Design & UI/UX Considerations

*   **Framework:** Utilize Material UI (MUI) components.
*   **Clarity:** Clear display of resources, costs, effects.
*   **Feedback:** Immediate visual feedback for actions.
*   **Responsiveness:** Basic desktop responsiveness.
*   **Accessibility:** Basic a11y considerations.

## 6. Technical Requirements & Architecture

*   **Tech Stack:** React, TypeScript, Redux Toolkit, Material UI, React Router.
*   **State Management:** Redux Toolkit with feature slices.
*   **Structure:** Feature-Sliced project organization.
*   **Styling:** MUI (`sx`, `styled`) complemented by CSS Modules for specific component needs.
*   **Persistence:** Local Storage for save data and settings.
*   **Layout:** Resizable 3-column layout as specified in REQ-UI-010 & REQ-UI-011.
*   **Component Rendering:** Dynamic Component Registry pattern for side columns as specified in REQ-UI-012.

## 7. Release Criteria (Prototype v1.0)

The prototype will be considered complete when:
*   All features listed under Objectives (Section 3) are functional and implemented.
*   The core Essence/Trait loop is demonstrable.
*   Save/Load/Import/Export work reliably.
*   Autosave functions according to settings.
*   The specified 3-column layout with **draggable Left/Right columns** and a static Middle column is implemented.
*   The **Dynamic Component Registry** pattern is used for rendering side column content.
*   The application is relatively stable.

## 8. Future Considerations (Post-Prototype)

*   [Optional: List any specific design or technical questions yet to be resolved for the prototype, e.g., "Final formula for passive Essence generation?", "Exact UI for trait slot unlocking?", "Placeholder content/message for the empty Middle Column?"]