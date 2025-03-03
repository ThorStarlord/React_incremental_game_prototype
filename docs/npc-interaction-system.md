# NPC Interaction System Documentation

## Overview

The NPC interaction system allows players to engage with non-player characters through various interfaces including dialogue, relationship building, trading, and quests. The system is built on a tabbed interface that dynamically displays content based on the player's relationship level with each NPC.

## Component Structure

### Container Components

1. **NPCPanel**: The main container component that coordinates all NPC interactions.
2. **NPCTabContent**: Manages the content displayed for each tab and handles conditional rendering based on relationship levels.

### Presentation Components

1. **NPCHeader**: Displays the NPC's basic information including name and relationship status.
2. **NPCTabNav**: Navigation component that provides tab selection for different interaction types.
3. **RelationshipBenefits**: Shows the benefits available at the current relationship tier.
4. **DialogueTab**: Handles dialogue interactions with conversation options and responses.
5. **RelationshipTab**: Allows players to perform actions that build relationships with NPCs.
6. **TradeTab**: Interface for buying and selling items with NPCs.
7. **QuestsTab**: Shows available, in-progress, and completed quests from the NPC.

## Relationship System

The NPC relationship system is based on numerical values that determine relationship tiers:

- **Stranger**: 0-24 relationship points
- **Acquaintance**: 25-49 relationship points
- **Friend**: 50-74 relationship points
- **Close Friend**: 75-99 relationship points
- **Trusted Ally**: 100+ relationship points

Each tier unlocks new interactions:
- Basic dialogue is available at all tiers
- Relationship-building activities unlock at the Acquaintance tier
- Trading becomes available at the Friend tier
- Quests unlock at the Close Friend tier
- Special interactions unlock at the Trusted Ally tier

## Dialogue System

The dialogue system uses a branching structure where each dialogue node contains:
- Text spoken by the NPC
- Options for the player to select
- Optional relationship changes
- References to the next dialogue node for each option
- Optional requirements for certain dialogue options (traits, skills, etc.)

## State Management

The NPC interaction system uses React's Context API to manage:
- NPC relationship values
- Dialogue history and state
- Quest progress
- Trade history

## Usage

To integrate an NPC into the game:

1. Create an NPC object with:
   - Unique ID
   - Name
   - Description
   - Initial relationship value
   - Dialogue tree
   - Available trades (if applicable)
   - Available quests (if applicable)

2. Render the NPC panel with:
```jsx
<NPCPanel npcId={selectedNpc.id} />
```

## Future Enhancements

- Gift-giving system to improve relationships
- Reputation system affecting multiple NPCs
- Time-dependent dialogue options
- NPC moods and personality traits affecting interactions
- NPC memory of past player actions
