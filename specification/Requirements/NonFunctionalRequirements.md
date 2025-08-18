# Non-Functional Requirements

This document lists the non-functional requirements for the React Incremental RPG Prototype, describing *how* the system should perform certain actions or qualities it should possess.

## NFR-PERF: Performance

*   **NFR-PERF-001:** The GameLoop system should execute reliably at the defined tick rate (10 TPS default) without significant frame drops under typical load.
*   **NFR-PERF-002:** UI interactions (button clicks, opening menus, equipping items) should feel responsive, ideally completing visual feedback within 200ms.
*   **NFR-PERF-003:** Loading a saved game should complete within a reasonable timeframe (e.g., < 5 seconds for typical save sizes).
*   **NFR-PERF-004:** Autosave operations should run in the background with minimal noticeable impact on gameplay performance.
*   **NFR-PERF-005:** Redux state updates and selector computations should be efficient, avoiding unnecessary re-renders of unrelated components. Memoized selectors should be used for derived data.
*   **NFR-PERF-006:** The GameLoop should maintain 60fps rendering while executing fixed timestep logic independently.

## NFR-MAINT: Maintainability

*   **NFR-MAINT-001:** The codebase shall adhere to the principles of Feature-Sliced Design, promoting modularity and low coupling between features.
*   **NFR-MAINT-002:** Code shall follow established coding standards and best practices outlined in the project's contribution guidelines (e.g., TypeScript usage, component design patterns, Redux Toolkit conventions).
*   **NFR-MAINT-003:** Code shall be well-documented, particularly for complex logic, public APIs of features (via `index.ts`), and type definitions. JSDoc comments should be used where appropriate.
*   **NFR-MAINT-004:** Deferred this prototype phase per NFR-QA-001 — automated tests (unit/integration/e2e) are out of scope; verification is via manual exploratory testing and smoke checks.
*   **NFR-MAINT-005:** Dependencies shall be kept up-to-date where feasible, and unused dependencies should be removed.

## NFR-SCAL: Scalability

*   **NFR-SCAL-001:** The architecture (Feature-Sliced Design, Redux) should support the addition of new game features (e.g., new resources, crafting systems, combat types) with minimal impact on existing, unrelated features.
*   **NFR-SCAL-002:** State management should handle a growing number of entities (e.g., traits, NPCs, Copies, items) efficiently. Consider normalization within Redux slices if performance becomes an issue with large collections.
*   **NFR-SCAL-003:** The UI layout should accommodate the addition of new panels or information displays within the established column structure or via modals/drawers.

## NFR-STAB: Stability & Reliability

*   **NFR-STAB-001:** The application should handle unexpected errors gracefully (e.g., using Error Boundaries in React) and prevent crashes where possible.
*   **NFR-STAB-002:** Save/Load operations should be reliable, ensuring data integrity and preventing save file corruption under normal circumstances. Basic validation should be performed on load.
*   **NFR-STAB-003:** State transitions managed by Redux should be predictable and free from race conditions or unexpected side effects. Reducers must remain pure functions.

## NFR-SEC: Security (Client-Side Context)

*   **NFR-SEC-001:** Input sanitation should be applied if user-generated content is ever displayed (e.g., custom save names) to mitigate potential XSS risks (though React generally handles this).
*   **NFR-SEC-002:** The import save function should perform basic validation on the structure of the imported data to prevent errors caused by malformed input. It should handle parsing errors gracefully.
*   **NFR-SEC-003:** Acknowledge that `localStorage` is not secure and avoid storing sensitive information (not applicable for this prototype, but good practice).

## NFR-UX: User Experience

*   **NFR-UX-001:** The user interface should be intuitive and consistent, following the guidelines established in `UI_UX_Guidelines.md` and leveraging MUI components effectively.
*   **NFR-UX-002:** Clear feedback should be provided for user actions (e.g., button presses, save/load operations, errors).
*   **NFR-UX-003:** The game should be playable across different screen sizes (desktop, potentially tablet/mobile) with appropriate layout adjustments (Responsiveness).
*   **NFR-UX-004:** Do not use native blocking browser dialogs (`window.alert`, `window.confirm`, `window.prompt`). Surface feedback via in-app notifications/toasts or MUI Dialogs. Async thunks must return errors via `rejectWithValue` or set error state; UI components render messages accordingly.

## NFR-ACC: Accessibility

*   **NFR-ACC-001:** Use semantic HTML elements where appropriate (MUI helps with this).
*   **NFR-ACC-002:** Ensure interactive elements are keyboard navigable.
*   **NFR-ACC-003:** Maintain sufficient color contrast, especially when customizing the theme.
*   **NFR-ACC-004:** Add ARIA attributes where necessary for custom interactive components that lack clear semantics.
## NFR-QA: Testing Policy

*   **NFR-QA-001:** Automated tests (unit/integration/e2e) are out of scope for this prototype phase. Verification will be done via manual exploratory testing and smoke checks.
