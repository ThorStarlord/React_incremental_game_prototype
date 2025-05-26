/**
 * @file mockNPCData.ts
 * @description Mock data for NPCs and trading items for development and testing
 */

import type { NPC, TradeItem } from '../state/NPCTypes';

/**
 * Mock NPCs for development and testing
 */
export const getMockNPCs = (): NPC[] => [
  {
    id: 'npc_merchant',
    name: 'Elena the Merchant',
    description: 'A friendly trader who knows the value of everything and everyone.',
    location: 'Market Square',
    relationshipValue: 10,
    connectionDepth: 0.5,
    loyalty: 50,
    availableDialogues: ['greeting', 'trade_talk'],
    completedDialogues: [],
    availableQuests: ['delivery_quest'],
    completedQuests: [],
    teachableTraits: ['persuasion', 'commerce'],
    status: 'available',
    isDiscovered: true,
    isAvailable: true,
    traits: {
      persuasion: {
        id: 'persuasion',
        name: 'Persuasion',
        relationshipRequirement: 15,
        essenceCost: 50,
        isVisible: true,
      },
      commerce: {
        id: 'commerce',
        name: 'Commerce',
        relationshipRequirement: 25,
        essenceCost: 75,
        isVisible: false,
      },
    },
    inventory: {
      currency: 500,
      items: [
        {
          id: 'health_potion',
          name: 'Health Potion',
          description: 'Restores 50 health points',
          category: 'consumable',
          rarity: 'common',
          basePrice: 25,
          currentPrice: 25,
          quantity: 10,
          effects: { health: 50 },
        },
        {
          id: 'mana_crystal',
          name: 'Mana Crystal',
          description: 'Restores 30 mana points',
          category: 'consumable',
          rarity: 'uncommon',
          basePrice: 40,
          currentPrice: 40,
          quantity: 5,
          effects: { mana: 30 },
        },
      ],
    },
  },
  {
    id: 'npc_scholar',
    name: 'Marcus the Scholar',
    description: 'A wise academic who studies the mysteries of essence and traits.',
    location: 'Ancient Library',
    relationshipValue: 5,
    connectionDepth: 0.2,
    loyalty: 30,
    availableDialogues: ['knowledge_seeking'],
    completedDialogues: [],
    availableQuests: ['research_assistance'],
    completedQuests: [],
    teachableTraits: ['analytical_mind', 'essence_sensitivity'],
    status: 'available',
    isDiscovered: true,
    isAvailable: true,
    traits: {
      analytical_mind: {
        id: 'analytical_mind',
        name: 'Analytical Mind',
        relationshipRequirement: 20,
        essenceCost: 100,
        isVisible: true,
      },
      essence_sensitivity: {
        id: 'essence_sensitivity',
        name: 'Essence Sensitivity',
        relationshipRequirement: 40,
        essenceCost: 150,
        isVisible: false,
      },
    },
  },
  {
    id: 'npc_warrior',
    name: 'Kara the Protector',
    description: 'A fierce warrior dedicated to protecting the innocent.',
    location: 'Training Grounds',
    relationshipValue: 0,
    connectionDepth: 0,
    loyalty: 20,
    availableDialogues: ['challenge'],
    completedDialogues: [],
    availableQuests: ['combat_training'],
    completedQuests: [],
    teachableTraits: ['combat_prowess', 'unwavering_resolve'],
    status: 'available',
    isDiscovered: false,
    isAvailable: true,
    traits: {
      combat_prowess: {
        id: 'combat_prowess',
        name: 'Combat Prowess',
        relationshipRequirement: 30,
        essenceCost: 125,
        isVisible: false,
      },
      unwavering_resolve: {
        id: 'unwavering_resolve',
        name: 'Unwavering Resolve',
        relationshipRequirement: 50,
        essenceCost: 200,
        isVisible: false,
      },
    },
  },
];

/**
 * Mock trade items for development and testing
 */
export const getMockTradeItems = (): TradeItem[] => [
  {
    id: 'health_potion',
    name: 'Health Potion',
    description: 'Restores 50 health points',
    category: 'consumable',
    rarity: 'common',
    basePrice: 25,
    currentPrice: 25,
    quantity: 15,
    effects: { health: 50 },
  },
  {
    id: 'mana_crystal',
    name: 'Mana Crystal',
    description: 'Restores 30 mana points',
    category: 'consumable',
    rarity: 'uncommon',
    basePrice: 40,
    currentPrice: 40,
    quantity: 8,
    effects: { mana: 30 },
  },
  {
    id: 'essence_shard',
    name: 'Essence Shard',
    description: 'A crystallized fragment of pure essence',
    category: 'material',
    rarity: 'rare',
    basePrice: 100,
    currentPrice: 100,
    quantity: 3,
    effects: { essence: 25 },
  },
  {
    id: 'iron_sword',
    name: 'Iron Sword',
    description: 'A sturdy weapon for combat',
    category: 'weapon',
    rarity: 'common',
    basePrice: 150,
    currentPrice: 150,
    quantity: 2,
    effects: { attack: 10 },
  },
  {
    id: 'leather_armor',
    name: 'Leather Armor',
    description: 'Basic protection for adventurers',
    category: 'armor',
    rarity: 'common',
    basePrice: 120,
    currentPrice: 120,
    quantity: 1,
    effects: { defense: 8 },
  },
];
