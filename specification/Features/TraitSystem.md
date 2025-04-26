# Trait System Specification

This document details the design and mechanics of the Trait system, which allows players to customize their character and influence others (**including NPCs and Copies**) with passive bonuses and unique effects.

## 1. Overview

*   **Purpose:** Traits provide passive modifications to character stats, abilities, or game mechanics. They allow for build diversity, character customization, and influencing NPCs/**Copies**.
*   **Core Loop:** Discover/Target -> Acquire -> Equip / Make Permanent / Share (with NPCs/**Copies**).

## 2. Trait Acquisition

*   **Primary Method: Emotional Connection & Resonance**
    *   The player can acquire traits observed in targets (NPCs, potentially enemies, or even abstract concepts) by establishing an "Emotional Connection" and spending Essence to resonate with and copy the trait's underlying pattern.
    *   **Analogy:** This is akin to creating a blueprint or template based on the target's trait; it's not stealing the trait itself but replicating its structure within the player's own system.
    *   **Essence Cost:** The Essence cost to acquire a trait via resonance depends on:
        *   **Target Power Level:** Acquiring traits from more powerful or complex targets costs more Essence. (Formula TBD - e.g., `BaseCost * TargetLevelModifier`).
        *   **Trait Potency/Rarity/Complexity:** More impactful, rarer, or complex traits have a higher base Essence cost. (Defined per trait).
        *   **Emotional Connection Level:** A higher connection level with the target might reduce the Essence cost (Formula TBD).
    *   **Quality Variation:**
        *   Traits acquired from different targets might have minor variations. This could manifest as:
            *   A "flavor" property indicating the source (e.g., "Trait of Valor (from Guard Captain)").
            *   Slight variations in non-core stats or descriptions.
            *   *Decision:* Initially, focus on flavor text. Minor stat variations can be a future enhancement if needed for balance or depth.
*   **Other Acquisition Methods:**
    *   Completing specific quests or achievements might grant certain traits directly.
    *   Reaching high relationship milestones with specific NPCs might unlock unique traits for acquisition (potentially free or reduced cost).
    *   (Future) Research or crafting systems could yield traits.
*   **Requirements:** Conditions needed before a trait can be acquired (applies mostly to non-resonance methods or specific resonance targets).
    *   Minimum player level.
    *   Prerequisite traits (especially for tiered traits).
    *   Specific quest completion.
    *   NPC relationship level (for traits offered by NPCs).

## 3. Trait Slots

*   **Concept:** Players have a limited number of slots to equip active traits for themselves. Shared slots for targets (**NPCs and Copies**) are handled separately (See Section 7).
*   **Base Slots:** Player starts with a base number of slots (e.g., 1-2, defined in `PlayerInitialState`).
*   **Leveling Slots:** Additional slots are unlocked upon reaching specific player levels (Defined in `PlayerSystem.md` / `gameConstants.ts`).
*   **Free Trait Slots (Essence-Based):**
    *   Additional slots are unlocked passively as the player reaches certain thresholds of **Total Essence Earned** or perhaps **Current Essence Level** (TBD - Total Earned feels more permanent).
    *   **Thresholds/Curve:** Define the specific Essence amounts needed for each free slot (e.g., Slot 1 at 1k Essence, Slot 2 at 10k, Slot 3 at 100k - needs balancing).
*   **Maximum Slots:** Define the total maximum number of equippable trait slots for the player (e.g., 10-15).
*   **Equipping/Unequipping:** Assigning acquired traits to player slots is free and can be done at any time outside of combat.

## 4. Trait Permanence

*   **Concept:** The player can use a special ability, likely unlocked via progression, called "Make Permanent" or similar. This ability targets an acquired trait.
*   **Mechanics:**
    *   Consumes a significant amount of Essence.
    *   Makes the targeted trait permanently active for the player *without* consuming an equip slot.
    *   The original acquired trait remains available to be equipped or shared if desired (TBD - or is the "template" consumed/marked as permanent?). *Decision:* Keep the template available.
*   **Essence Cost Scaling:** The cost to make a trait permanent scales based on:
    *   **Trait Power/Rarity:** More potent traits cost significantly more to make permanent.
    *   **Target Power Level (Optional):** The power level of the original source target *might* influence the permanence cost (TBD - adds complexity, maybe omit initially).
*   **Target Scope:**
    *   Can primarily target traits the player possesses for self-permanence.
    *   *Question:* Can this ability be used on NPCs or **Copies** directly to make one of *their* traits permanent for *them*? (Potentially very powerful, needs careful consideration. Maybe a high-tier upgrade or separate ability). *Decision:* Initially, only for player self-permanence.

## 5. Trait Types & Categories

*   **Categorization:** (Standard RPG categories)
    *   `Combat`: Affecting damage, defense, speed, etc.
    *   `Magic`/`Resonance`: Affecting mana/Essence, spell power, resistances.
    *   `Social`: Affecting NPC interactions, trading, loyalty gain.
    *   `Utility`/`Gathering`: Affecting resource gain, crafting speed.
    *   `Knowledge`: Affecting XP gain, skill learning, research speed.
    *   `Physical`: Affecting health, stamina, physical resistance.
*   **Rarity/Potency:** Classification affecting power, cost (acquisition/permanence), and potentially acquisition difficulty.
    *   Common
    *   Uncommon
    *   Rare
    *   Epic
    *   Legendary
    *   (Potentially unique/artifact tiers)

## 6. Trait List (Examples - Needs Expansion)

*   **Growing Affinity:**
    *   **Description:** Your understanding of connection allows you to passively increase the loyalty and favorability of those you share traits with.
    *   **Effect:** Provides a small, passive increase to Loyalty/Relationship points over time with any target (**NPC or Copy**) currently benefiting from one of your shared traits. Effect might scale with the number of traits shared or the player's Charisma/Social stats.
    *   **Category:** Social
    *   **Potency/Rarity:** Uncommon/Rare
    *   **Application:** This trait, when acquired by the player, likely needs to be *equipped* by the player to function. It enhances the *outcome* of slot sharing.
*   **(Define other planned traits):**
    *   *Example Combat Trait:* Name: Warrior's Resilience, Desc: Toughened through countless battles..., Effect: +5% Max Health, Category: Physical, Rarity: Common.
    *   *Example Essence Trait:* Name: Essence Attunement, Desc: You resonate more easily with the flow of Essence., Effect: +3% Essence Gain from all sources, Category: Resonance, Rarity: Uncommon.
    *   *(Continue defining key traits for core mechanics)*

## 7. Slot Sharing & Target Influence (High-Level - Consider separate Spec later)

*   **Granting Slots:** How does the player grant trait slots to a target (**NPC, Copy**)?
    *   Likely via a specific interaction menu/ability unlocked after reaching a certain Emotional Connection level (for NPCs) or via the Copy Management UI (for Copies). Requires player focus/interaction.
*   **Slots per Target:**
    *   Targets start with 0 shared slots.
    *   **NPCs:** The number of slots scales with the **Emotional Connection Level** (e.g., Level 1 Connection = 1 Slot, Level 3 = 2 Slots, Level 5 = 3 Slots - needs balancing).
    *   **Copies:** The number of slots scales with the **Copy's Loyalty or Age** (TBD - needs balancing, see `CopySystem.md`).
*   **Shareable Traits:** Which traits can be placed in shared slots?
    *   Any trait the player has *acquired* (whether equipped by the player or not). Permanent traits can likely also be shared.
*   **System Awareness:** Granting a trait slot and sharing a trait grants the target a degree of "system awareness."
    *   They become implicitly aware of the benefit provided by the trait.
    *   They understand, on some level, that this benefit comes *from the player*.
    *   This awareness is crucial for the Loyalty mechanic (**especially for Copies**).
*   **Loyalty:**
    *   A measure of the target's positive disposition (**NPCs**) or alignment with player goals (**Copies**), influenced by shared traits.
    *   Enhanced by:
        *   The number and potency of shared traits.
        *   The player having the "Growing Affinity" trait active.
        *   Positive interactions, quest completions (standard NPC relationship mechanics - Link to `NPCSystem.md`).
        *   Successful task completion (**Copies**).
    *   Decreased by:
        *   Negative interactions.
        *   Removing shared traits (causes a temporary dip?).
        *   Sharing traits perceived as negative or controlling (if such traits exist).
        *   Task failure (**Copies**).
*   **Player Utility:** What benefit does the player gain from sharing traits?
    *   **Enhanced NPCs:** NPCs with shared traits might perform tasks better (e.g., a guard with a combat trait is stronger, a merchant with a social trait offers better prices *to the player*). They might unlock new dialogue or services based on shared traits.
    *   **Enhanced Copies:** Player-created **Copies** become significantly more effective by inheriting traits relevant to their function (e.g., gathering, combat, influence).
    *   **Unlocking Potential:** Sharing specific traits might be required to unlock certain dialogues, quests, or abilities in targets.
    *   **Loyalty Benefits:** High loyalty might lead to NPCs offering unique quests, items, or support. High loyalty in **Copies** ensures reliable execution of commands.

## 8. Trait Effects (Detailed Mechanics)

*   **Effect Definition:** Structure within the `Trait` object.
    *   Likely an object: `effects: { maxHealth?: number, attackPowerPercent?: number, essenceGainMultiplier?: number }`
    *   Keys define the target stat/mechanic.
    *   Values define the magnitude (positive or negative). Use distinct keys for flat (`maxHealth`) vs. percentage (`attackPowerPercent`) bonuses.
*   **Effect Stacking:** How do multiple effects on the same stat combine?
    *   *Decision:* Additive stacking for flat bonuses. Multiplicative stacking for percentage bonuses (applied after flat bonuses). Needs careful implementation order.
*   **Conditional Effects:** (Future Enhancement) Some traits could have effects that only activate under specific conditions (e.g., `onLowHealth`, `whileInCombat`).

## 9. UI/UX Considerations

*   Clear display of Acquired vs. Equipped vs. Permanent traits.
*   Interface for managing Player Trait Slots.
*   Interface for viewing Targets (**NPCs and Copies**), their Emotional Connection/Loyalty level, available Shared Slots, and currently shared traits.
*   Clear display of trait effects, requirements, and Essence costs (acquisition/permanence).
*   Notifications for discovering/acquiring traits and unlocking slots.
*   Visual indicator on NPCs/targets showing they have shared traits active.

## 10. Balancing Notes

*   Pacing of trait acquisition vs. Essence generation.
*   Cost scaling for acquisition and permanence must feel rewarding but meaningful.
*   Power level of traits vs. slot limitations (player and shared).
*   Impact of permanent traits - should be powerful but expensive.
*   Ensure slot sharing feels impactful and worth the investment/interaction for both **NPCs and Copies**.
*   Balance the number of player slots vs. shared slots available across different target types.
