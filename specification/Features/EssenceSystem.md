# Essence System Specification

This document outlines the design and mechanics of the Essence system in the game. Essence is the core metaphysical resource representing potential, connection, and the capacity for influence and growth.

## 1. Overview

*   **Purpose:** Essence fuels the player's unique abilities related to emotional connection, trait manipulation, and the creation/enhancement of Copies. It serves as the primary currency for advanced progression and interaction mechanics.
*   **Core Loop:** Establish Emotional Connections -> Generate Essence passively -> Spend Essence on Influence, Trait Acquisition/Permanence, **Accelerated Copy Growth**, and potentially other upgrades.

## 2. Essence Sources

*   **Primary Source: Emotional Connection**
    *   **Formation:** Connections are established and deepened through meaningful interactions with targets (NPCs, potentially other entities). Key actions include:
        *   Dialogue choices that resonate with the target.
        *   Completing quests or tasks for the target.
        *   Sharing beneficial traits with the target (see Trait System).
        *   Demonstrating understanding or empathy towards the target's goals or state.
    *   **Connection Depth:** The strength of the connection is tracked (details likely in `NPCSystem.md` or `RelationshipSystem.md`). This depth directly influences Essence generation.
    *   **Generation:** Once a connection is formed, Essence is generated passively over time. The rate depends on:
        *   **Target Complexity/Power Level:** More significant or powerful targets generate more base Essence.
        *   **Connection Depth:** Deeper connections yield a higher generation rate.
        *   *(Formula TBD: e.g., `Rate = BaseTargetValue * ConnectionDepthMultiplier * GlobalModifiers`)*
*   **Secondary Sources:**
    *   **Manual Actions:** Potential for minor Essence gain through specific, focused actions (e.g., "Resonate" click action, minimal base gain).
    *   **Rewards:** One-time gains from completing significant quests, achievements, or overcoming major challenges.
    *   **Combat/Defeat:** Minor Essence gain from defeating enemies, representing absorbed potential (less significant than connections).

## 3. Essence Generation Mechanics

*   **Connection-Based Generation:**
    *   Passive, continuous generation from all active emotional connections.
    *   The total passive generation rate is the sum of rates from all individual connections.
*   **Multipliers:**
    *   Global multipliers affecting all Essence generation (e.g., from player traits, temporary buffs, game progression milestones).
    *   Source-specific multipliers (less common, maybe a trait enhancing generation from specific connection types).
    *   Stacking: Define how multipliers combine (likely multiplicative).
*   **Offline Progress:** Calculate passive generation based on connection rates and global multipliers while the game is closed (standard offline progress calculation).

## 4. Essence Costs & Spending (Sinks)

*   **Emotional Influence:**
    *   Spending Essence to perform actions that directly (but subtly) influence a target's emotional state or favorability towards the player (e.g., accelerating relationship gain, calming hostility). Cost scales with desired effect intensity and target resistance.
*   **Trait Acquisition:**
    *   The primary cost for resonating with and acquiring a trait blueprint from a target. Cost determined by trait rarity/complexity and potentially reduced by connection depth. (See `TraitSystem.md`).
*   **Trait Permanence:**
    *   Significant Essence cost to make an acquired trait permanently active for the player without requiring an equip slot. Cost scales heavily with trait power/rarity. (See `TraitSystem.md`).
*   **Accelerated Copy Growth:**
    *   Spending Essence to speed up the development, training, or task performance of player-created Copies. A significant upfront cost is required to choose the accelerated path upon creation. (See `CopySystem.md`).
*   **Standard Upgrades (Optional):**
    *   If applicable, costs for upgrading secondary mechanics (e.g., manual click power, base offline progress multiplier if not solely connection-driven). These should be less central than the core sinks.
*   **Other Potential Sinks:**
    *   High-level crafting or research.
    *   Unlocking unique abilities or game features tied to Essence manipulation.

## 5. UI/UX Considerations

*   Clear display of current Essence total.
*   Detailed breakdown of current Essence generation rate (e.g., total passive rate, list of contributions per connection).
*   Clear indication of Essence costs for actions (tooltips, confirmation dialogs).
*   Visual feedback for gaining/spending Essence (subtle background effects, UI animations).
*   Interface for managing connections and viewing their contribution (likely part of NPC/Relationship UI).

## 6. Balancing Notes

*   Pacing of establishing connections vs. Essence costs of early actions (Trait Acquisition, **Accelerated Copy Growth**).
*   Ensure connection depth feels rewarding in terms of Essence generation scaling.
*   Balance the costs of major sinks (Trait Acquisition/Permanence, **Accelerated Copy Growth**) against achievable generation rates at different game stages.
*   The relative value of Essence generated from connections vs. secondary sources. Connections should be significantly more impactful.
*   Avoid hyper-inflation; ensure meaningful choices for spending Essence throughout the game.
*   Late-game scaling – are there sufficient, interesting sinks for high Essence generation?
