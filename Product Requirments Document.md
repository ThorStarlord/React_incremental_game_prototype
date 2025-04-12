# Product Requirements Document: Incremental RPG Prototype (Developer Focused)

**Version:** 1.9
**Date:** 2023-11-16
**Author/Team:** [Your Name/Team Name]
**Status:** Development Guide

## 1. Introduction

### 1.1 Purpose
This document serves as a **developer guide and requirements specification** for building the **Incremental RPG Prototype**. It outlines the core features, target architecture, and specific implementation details for this initial phase, focusing on validating mechanics and establishing a scalable foundation using React, TypeScript, Redux Toolkit, and Material UI. A key technical goal is implementing a flexible 3-column layout with draggable components between side columns.

### 1.2 Goals
*   **Demonstrate Core Loop:** Implement the Essence generation/spending loop.
*   **Validate Trait System:** Build a functional acquire/equip/effect system for Traits.
*   **Establish Architecture:** Implement and test the feature-sliced structure, Redux patterns, the responsive 3-column layout (with *draggable components* and collapsible panels), and the mechanism for rendering content.
*   **Implement Persistence:** Ensure reliable save/load/import/export, including the layout configuration.
*   **Build Foundational UI:** Create the core layout (`MainGameLayout`), necessary displays/dialogs using MUI, with a simplified header and no footer.

### 1.3 Scope
*   **Core Resource:** Essence (manual test generation, passive generation, spending).
*   **Player:** Basic state, stats, attributes (display only), simple XP/Level concept.
*   **Trait System:** Definition loading, acquisition, equipping (limited slots), basic stat effects, permanent traits.
*   **Persistence:** Local Storage based save/load/import/export **(including layout state)**.
*   **Settings:** Basic autosave configuration.
*   **UI:** Main Menu, **`MainGameLayout`** (3-Column: responsive Left, responsive Middle, responsive Right), core displays, dialogs. Middle Column renders **only a mock placeholder view** initially. Simplified header, no footer. Individual components within Left/Right columns are collapsible **and draggable between Left/Right columns**.
*   **Technical:** Implementation of dynamic component rendering for side columns, drag-and-drop mechanism for components between side columns, mechanism for rendering views within the Middle Column.

**Out of Scope for Prototype v1.0:**
*   Combat, detailed NPCs, Inventory, Skills, World Map/Exploration, Quests, Multiplayer.
*   Complex Balancing, advanced UI polish/animations.
*   **Implementation of actual intra-game views** (World Map, Town, etc.) and the routing/state logic to switch between them within the Middle Column.
*   Complex Header functionality (navigation, icons, menus).
*   Game Footer.
*   **Draggable resizing** *between* columns (focus is on responsive widths and component drag-and-drop).
*   **Layout strategy for very small screens**.
*   **Drag-and-drop into the Middle Column**. Components can only be moved between Left and Right columns.

## 2. Target Audience

*   **Primary:** Developer (You) - Guiding implementation and architectural choices.

## 3. Goals & Objectives

*   **(Objective 1-8 remain the same as v1.2)**
*   **Objective 9:** Implement the specified 3-column layout (`MainGameLayout`) with responsive Left/Right column widths (down to a minimum) and a responsive, flexible Middle column.
*   **Objective 10:** Utilize a dynamic component registry pattern for rendering content within the Left and Right columns.
*   **Objective 11:** Implement a minimalist header displaying only the game title.
*   **Objective 12:** Implement the structure allowing the Middle Column to render different components, initially showing only a single mock/test component.
*   **Objective 13:** Ensure clicking "New Game" navigates the user to the main `MainGameLayout`, displaying the initial mock content in the Middle Column.
*   **Objective 14:** Implement collapsibility for **individual component panels** within the Left and Right columns, triggered by clicking their headers.
*   **Objective 15:** Implement **drag-and-drop functionality** allowing users to move component panels **between the Left and Right columns**.
*   **Objective 16:** Persist the user's customized layout (which components are in which side column and their order) along with the game save data.

## 4. Features & Requirements

**(Sections 4.1 to 4.5 remain the same as v1.2 - Essence, Player, Traits, Persistence, Settings)**
*   **Note:** Persistence requirements (4.4) now implicitly include saving/loading the layout state (which components are where).

---

### 4.6 User Interface & Layout

*   **REQ-UI-001:** A Main Menu screen shall provide access to New Game, Continue, Load Game, Import/Export, and Settings/About options. Clicking 'New Game' shall navigate the user to the main game view rendered within the **`MainGameLayout`** component (e.g., to route `/game`).
*   **REQ-UI-002:** The main game interface (`MainGameLayout`) shall utilize a **responsive three-column layout** (Left, Middle, Right) for larger screens using Material UI components.
*   **REQ-UI-003:** The **Left Column** shall contain a dynamic list of component panels. Initially, it will include:
    *   Player Stats panel (`PlayerStats.tsx`).
    *   Essence information panel (`EssenceDisplay.tsx`).
*   **REQ-UI-004:** The **Middle Column** shall serve as the **content host**. For the prototype:
    *   This column will render **only a single, simple mock/dummy component**.
    *   This mock component **must contain the manual test button** for gaining Essence and placeholder text.
*   **REQ-UI-005:** The **Right Column** shall contain a dynamic list of component panels. Initially, it will include:
    *   Trait management panel (`TraitSlots.tsx`).
*   **REQ-UI-006:** The width of the **Left and Right columns** shall **adapt responsively** to the screen size, each having a defined minimum width.
*   **REQ-UI-007:** Core information (Essence, Player Health/Mana) shall be readily visible during gameplay (likely starting in the Left Column).
*   **REQ-UI-008:** Clear visual feedback shall be provided for key actions using standard MUI components.
*   **REQ-UI-009:** UI components rendered within the Left and Right columns shall be contained within a **collapsible panel** structure (e.g., `Panel.tsx`). Each panel should have a distinct header area.
*   **REQ-UI-010 (Component Behavior - Collapse):** Clicking the **header** of an individual component panel within the Left or Right column shall **toggle its expanded/collapsed state**.
*   **REQ-UI-011 (Layout Behavior - Middle):** The **Middle Column** shall remain **always visible**. Its width will **adapt responsively**, filling the available horizontal space not occupied by the Left and Right columns.
*   **REQ-UI-012 (Architecture - Rendering):** The content panels within the Left and Right columns shall be rendered using a **Dynamic Component Registry** pattern, driven by state representing the current layout configuration.
*   **REQ-UI-013 (Header):** The game layout shall include a **minimalist header area** containing only the **game title displayed as text**.
*   **REQ-UI-014 (Footer):** The game layout **shall not include a footer** area.
*   **REQ-UI-015 (Navigation Mechanism):** The architecture shall support rendering different components/pages *within* the responsive Middle Column. *(Mock component only for prototype)*.
*   **REQ-UI-016 (Component Behavior - Drag & Drop):** Component panels within the Left and Right columns shall be **draggable**. The user shall be able to drag a panel from one side column and drop it into the other side column, changing its location and potentially its order within that column.
    *   A visual indicator (e.g., drag handle icon on the panel header) should suggest draggability.
    *   Visual feedback (e.g., ghost image, drop target highlighting) should be provided during the drag operation.
    *   Dragging a component **into the Middle Column** shall not be permitted.
*   **REQ-UI-017 (Persistence - Layout):** The state representing which components are in the Left vs. Right column, and their order, **must be persisted** as part of the game save data and restored upon loading.

## 5. Design & UI/UX Considerations

*   **Framework:** Utilize Material UI (MUI) components. Consider a drag-and-drop library compatible with React/MUI (e.g., `@dnd-kit/core`).
*   **Clarity:** Clear display of resources, costs, effects. Clear indication of draggable elements and drop zones.
*   **Feedback:** Immediate visual feedback for actions, including drag/drop operations.
*   **Responsiveness:** Basic desktop responsiveness.
*   **Accessibility:** Basic a11y considerations (keyboard navigation for drag/drop might be complex and deferred).

## 6. Technical Requirements & Architecture

*   **Tech Stack:** React, TypeScript, Redux Toolkit, Material UI, React Router, **Drag-and-Drop Library (e.g., @dnd-kit/core)**.
*   **State Management:** Redux Toolkit. Needs a slice or part of a slice (e.g., within `SettingsSlice` or a new `UISlice`) to manage the layout state (component positions/order).
*   **Structure:** Feature-Sliced project organization.
*   **Styling:** MUI (`sx`, `styled`) & CSS Modules.
*   **Persistence:** Local Storage for save data (including layout state) and settings.
*   **Layout:** Responsive 3-column layout (Left/Right min-width, responsive Middle). **Individual panels** within Left/Right columns are **collapsible** and **draggable between columns**. Simplified Header. No Footer.
*   **Component Rendering:** Dynamic Component Registry pattern for side columns.

## 7. Release Criteria (Prototype v1.0)

The prototype will be considered complete when:
*   All features listed under Objectives (Section 3) are functional and implemented.
*   The core Essence/Trait loop is demonstrable.
*   Save/Load/Import/Export work reliably, **including restoring the component layout**.
*   Autosave functions according to settings.
*   The specified 3-column layout (`MainGameLayout`) with responsive columns and a minimalist header is implemented.
*   Individual component panels within the Left/Right columns are **collapsible via their headers**.
*   Component panels **can be dragged and dropped between the Left and Right columns**, and the layout change persists after save/load.
*   The Dynamic Component Registry pattern is used.
*   The Middle Column renders the mock content.
*   The underlying structure allows for future replacement of the mock content.
*   The application is relatively stable.

## 8. Future Considerations (Post-Prototype)

*   Implementing specific game views within the Middle Column.
*   Implementing Combat, Skills, Inventory, NPCs.
*   Detailed balancing.
*   Advanced trait effects.
*   More sophisticated player progression.
*   Enhanced UI/UX, animations, visual polish.
*   More comprehensive settings options.
*   Refined error handling and user feedback.
*   Implementing layout strategies for very small screens.
*   Adding functionality back to the Header.
*   Potentially adding a Footer.
*   Implementing **drag-and-drop reordering** *within* a column.
*   Implementing **inter-column resizing** (draggable dividers).
*   **Accessibility improvements** for drag-and-drop functionality.

## 9. Open Issues

*   [Define the specific minimum width for the Left and Right columns.]
*   [Confirm the exact UI component to use for collapsible panels.]
*   [Select and integrate a suitable drag-and-drop library (e.g., @dnd-kit/core).]
*   [Define the exact state structure needed to store the layout configuration.]