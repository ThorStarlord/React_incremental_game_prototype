/**
 * Simple shared item catalog for trading/inventory UI.
 * This can be expanded later or loaded from JSON.
 */

export interface ItemDef {
  id: string;
  name: string;
  description: string;
  category: 'Consumable' | 'Weapon' | 'Armor' | 'Material' | 'Gem' | 'Tool' | 'Other';
  basePrice: number; // in gold
}

export const itemCatalog: Record<string, ItemDef> = {
  // Potions and consumables
  potion_health: {
    id: 'potion_health',
    name: 'Health Potion',
    description: 'Restores 50 HP instantly. A reliable companion for any adventurer.',
    category: 'Consumable',
    basePrice: 25,
  },
  potion_mana: {
    id: 'potion_mana',
    name: 'Mana Potion',
    description: 'Restores 30 MP instantly. Essential for spellcasters.',
    category: 'Consumable',
    basePrice: 20,
  },

  // Weapons/Armor
  sword_iron: {
    id: 'sword_iron',
    name: 'Iron Sword',
    description: 'A sturdy blade forged from quality iron. +5 Attack.',
    category: 'Weapon',
    basePrice: 100,
  },
  shield_wooden: {
    id: 'shield_wooden',
    name: 'Wooden Shield',
    description: 'Basic protection from physical attacks. +3 Defense.',
    category: 'Armor',
    basePrice: 40,
  },

  // Materials / Gems
  herb_rare: {
    id: 'herb_rare',
    name: 'Moonleaf Herb',
    description: 'A rare herb that glows softly under moonlight. Used in advanced alchemy.',
    category: 'Material',
    basePrice: 75,
  },
  gem_small: {
    id: 'gem_small',
    name: 'Small Ruby',
    description: 'A small but beautiful ruby. Can be used for crafting or decoration.',
    category: 'Gem',
    basePrice: 150,
  },

  // Alternative IDs referenced by JSON
  item_iron_sword: {
    id: 'item_iron_sword',
    name: 'Iron Sword',
    description: 'A sturdy blade forged from quality iron. +5 Attack.',
    category: 'Weapon',
    basePrice: 100,
  },
  item_steel_shield: {
    id: 'item_steel_shield',
    name: 'Steel Shield',
    description: 'Solid protection with a polished steel finish. +7 Defense.',
    category: 'Armor',
    basePrice: 180,
  },
  item_lockpicks: {
    id: 'item_lockpicks',
    name: 'Lockpicks',
    description: 'Tools for opening locks discreetly.',
    category: 'Tool',
    basePrice: 35,
  },
  item_poison_vial: {
    id: 'item_poison_vial',
    name: 'Vial of Poison',
    description: 'A small vial containing a potent toxin.',
    category: 'Material',
    basePrice: 65,
  },
};

export const getItemDef = (itemId: string): ItemDef | undefined => itemCatalog[itemId];
