Implementation Status: ✅ **BASIC STATE/UI IMPLEMENTED**

# Copy System Specification

This document details the mechanics for creating, managing, and utilizing "Copies" – entities created by the player through a unique process, inheriting aspects of the player and potentially a target.

**Implementation Note:** The feature slice for this system is located at `src/features/Copy/` (singular), and its state is managed under the `copy` key in the Redux store.

## 1. Overview

*   **Concept:** Copies are extensions of the player's will and essence, created through a specific interaction outcome ("Seduction"). They serve various purposes, from infiltration to specialized tasks, and grow over time.
*   **Core Loop:** Target -> Seduction Interaction -> Creation -> Growth (Normal/Accelerated) -> Management/Deployment -> Loyalty Maintenance.

## 2. Creation Method: Seduction Outcome

*   **Trigger:** Successfully completing a "Seduction" interaction path with a suitable target (likely an NPC, potentially other entities based on game design). This is a high-level social/interaction challenge outcome, not necessarily literal seduction.
*   **Result:** Instead of typical relationship gains, a successful Seduction outcome results in the creation of a nascent Copy.
*   **Essence Cost:** The initial creation might have a base Essence cost, or the cost might be front-loaded into the Seduction interaction itself. (TBD - Initial cost or interaction cost?)
*   **Target Influence:** The target NPC involved in the Seduction might have their relationship significantly altered, potentially becoming highly loyal, confused, or even hostile depending on their personality and the context. The Copy is linked to this "parent" target in some way (flavor, potential unique interactions).

## 3. Growth Options

*   **Normal Growth:**
    *   **Time:** Takes a significant amount of in-game time (e.g., equivalent to 18-20 years, represented abstractly over days/weeks of gameplay).
    *   **Essence Cost:** Minimal or zero ongoing Essence cost.
    *   **Purpose:** Primarily for long-term goals, infiltration, developing deep-cover agents, or when Essence is scarce. The Copy grows organically within the game world.
*   **Accelerated Growth:**
    *   **Time:** Drastically reduced time (e.g., 1 week of in-game time).
    *   **Essence Cost:** Requires a significant upfront Essence investment (e.g., 50 Essence - needs balancing).
    *   **Purpose:** Rapid deployment, creating specialized agents quickly, filling immediate needs. The growth is magically/metaphysically forced.

## 4. Inheritance

*   **Base Abilities:** Copies automatically inherit the player's core "Emotional Resonance" ability.
    *   **Emotional Resonance (Player Ability):** This is a planned player characteristic that allows Copies to potentially form connections and interact with the Trait system (perhaps in a limited way initially). Its specific mechanics are currently undefined and planned for future implementation with the Copy system. **Note: This is distinct from the sidelined "Soul Resonance" concept found in `soulResonanceUtils.ts`.**
*   **Shared Traits:** Copies inherit *snapshots* of any traits the player had actively shared with the *target parent* via Trait Slots *at the moment of creation*.
    *   These inherited traits become the Copy's initial base traits.
    *   They do *not* automatically update if the player later changes the traits shared with the parent.
*   **Player Traits:** Do Copies inherit traits the player has permanently active or equipped for themselves? (TBD - Probably not by default, to differentiate them from the player).

## 5. Stats, Abilities, and Progression

*   **Independent Stats:** Copies possess their own set of stats (Health, Mana, Attributes) and a Power Level, distinct from the player and the parent target.
    *   Initial stats might be influenced by the player's stats, the parent target's stats, and the growth method (Normal vs. Accelerated).
*   **Trait Gain:** Can Copies acquire new traits independently?
    *   *Option 1:* Yes, through their own interactions or tasks, potentially consuming their own generated Essence (if they generate any).
    *   *Option 2:* No, they can only gain traits shared with them by the player via dedicated Copy Trait Slots (see below).
    *   *Decision:* Option 2 seems more aligned with the "extension of the player" theme initially. Player shares traits to customize Copies.
*   **Skill Progression:** Can Copies learn/improve skills? (TBD - If a skill system exists, how do Copies interact with it?).

## 6. Control, Management, and Limits

*   **Interface:** A dedicated UI panel/screen is needed to view, manage, and potentially issue commands to Copies. (Link to `UI_UX/UserFlows.md`, `UI_UX/LayoutDesign.md`).
    *   Displays Copy status, location, current task, loyalty, stats, inherited/shared traits.
*   **Commands:** What level of control does the player have?
    *   Assigning tasks (e.g., gather resources, scout area, assist in combat, influence target).
    *   Setting general behavior (passive, defensive, aggressive).
    *   Moving to specific locations.
*   **Limit:** Is there a maximum number of active Copies the player can maintain simultaneously?
    *   *Decision:* Yes, likely limited by a player stat (e.g., Charisma, Intelligence) or a specific upgrade/trait related to control or Essence capacity. Start with a low limit (e.g., 1-3) that can be increased.
*   **Trait Slots for Copies:** Does the player grant trait slots *to* Copies similar to NPCs?
    *   *Decision:* Yes, this seems the primary way to customize and empower Copies. The number of slots a Copy can receive could scale with its age, loyalty, or player upgrades.

## 7. Loyalty

*   **Concept:** A measure of the Copy's alignment with the player's goals and resistance to external influence or deviation. Crucial for reliable function.
*   **Maintenance:**
    *   **Trait Sharing:** Sharing beneficial traits via Copy Trait Slots increases Loyalty (links to `TraitSystem.md` / `SlotSharingSystem.md`). The "Growing Affinity" trait likely affects Copies too.
    *   **Task Completion:** Successfully completing assigned tasks maintains/increases Loyalty.
    *   **Player Interaction:** Positive direct interaction (if implemented) could boost Loyalty.
    *   **Essence Investment:** Spending Essence on Accelerated Growth or other enhancements might provide a Loyalty boost.
*   **Decay/Loss:**
    *   Neglect (lack of tasks or interaction).
    *   Failure on critical tasks.
    *   Removing beneficial shared traits.
    *   Exposure to strong opposing influences.
    *   (Potential) A natural slow decay over time if not maintained.
*   **Consequences of Low Loyalty:**
    *   Reduced task efficiency.
    *   Ignoring commands.
    *   Potential to act independently or even turn against the player.
    *   Increased vulnerability to being "poached" or influenced by rivals.

## 8. UI/UX Considerations

*   Clear indication of Copy creation possibility during Seduction interactions.
*   Management screen listing all Copies, their status, and key info.
*   Interface for assigning tasks and managing shared traits for each Copy.
*   Visual representation of Copies in the game world (if applicable) or on maps.
*   Notifications for Copy creation, task completion, low loyalty warnings.

## 9. Balancing Notes

*   Cost of Seduction interaction vs. Copy benefits.
*   Essence cost of Accelerated Growth vs. time saved.
*   Impact of inherited traits vs. traits shared later.
*   Scaling of Copy stats/power relative to player and enemies.
*   Loyalty gain/loss rates need careful tuning.
*   The limit on the number of Copies needs to be balanced against their utility.
