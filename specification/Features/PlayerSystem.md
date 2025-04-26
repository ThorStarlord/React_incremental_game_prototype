# Player System Specification

This document defines the core attributes, statistics, progression mechanics, and state related to the player character.

## 1. Overview

*   **Concept:** The player character's role and fundamental characteristics. The player possesses unique abilities related to Emotional Resonance, allowing them to acquire traits and create/influence Copies.
*   **Core State:** Key pieces of information defining the player (name, stats, attributes, etc.). Includes state related to managing Copies.

## 2. Player Stats

*   **Primary Stats (Directly Modifiable/Affected):**
    *   `Health (HP)`: Current and Maximum. Governs survivability.
    *   `Mana (MP)` / `Energy`: Current and Maximum. Used for skills/abilities.
    *   `Stamina`: (Optional) Used for actions like sprinting, dodging.
*   **Combat Stats (Derived or Base + Bonuses):**
    *   `Attack Power` / `Damage`: Base damage output.
    *   `Defense` / `Armor`: Damage reduction.
    *   `Speed` / `Attack Speed`: How often the player acts in combat or action speed.
    *   `Critical Hit Chance`: Probability of landing a critical hit.
    *   `Critical Hit Damage`: Multiplier applied on a critical hit.
*   **Regeneration Stats:**
    *   `Health Regen`: HP recovered per tick/second.
    *   `Mana Regen`: MP recovered per tick/second.
*   **Other Potential Stats:**
    *   Movement Speed.
    *   Magic Resistance.
    *   Evasion Chance.
    *   Resource Gathering Speed.
    *   Crafting Speed/Quality.
    *   **Copy Limit:** Maximum number of active Copies the player can maintain.

## 3. Player Attributes

*   **Core Attributes (Points allocated):**
    *   `Strength (STR)`: Influences physical damage, carry capacity.
    *   `Dexterity (DEX)`: Influences attack speed, critical chance, evasion.
    *   `Constitution (CON)`: Influences max health, health regen.
    *   `Intelligence (INT)`: Influences magic damage, max mana, **potentially Copy Limit or effectiveness**.
    *   `Wisdom (WIS)`: Influences mana regen, magic resistance, skill effectiveness.
    *   `Charisma (CHA)`: Influences NPC interactions, prices, **potentially Copy Limit or Loyalty**.
*   **Attribute Points:**
    *   How are they gained? (e.g., through leveling, specific traits, quest rewards, milestones).
    *   Cost to increase an attribute (constant or increasing?).
*   **Attribute Effects:**
    *   Define the specific formula linking each attribute to the stats it influences (e.g., `Max Health = Base Health + (CON * 10)`, `Copy Limit = Base Limit + floor(CHA / 5)`).

## 4. Skills (Optional - High Level)

*   **Skill System Overview:** Brief description if a separate skill system exists. Could include skills related to Copy management or enhancement.
*   **Skill Points:** How are they gained and spent? (e.g., through leveling, specific traits, quest rewards, milestones).
*   *(Detailed skill specifications belong in a separate `SkillsSystem.md`)*

## 5. Player State Management

*   **Initial State:** Default values for a new character (`PlayerInitialState`), including initial Copy Limit.
*   **Saving/Loading:** What parts of the player state need to be persisted? (Includes all stats, attributes, inventory, relationships, **and references to owned Copies**).
*   **State Updates:** How is the player state modified by game events (combat, resting, using items, **creating/managing Copies**, etc.)?

## 6. UI/UX Considerations

*   Character Sheet display (Stats, Attributes, **Copy Limit**).
*   Interface for spending attribute/skill points.
*   Integration with Copy Management UI.
