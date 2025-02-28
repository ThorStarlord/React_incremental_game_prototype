import { traits } from '../data/traits';
import { npcs } from '../data/npcs';
import { items } from '../data/items';

export const initialState = {
  player: {
    name: "Adventurer",
    level: 1,
    health: 100,
    maxHealth: 100,
    energy: 50,
    maxEnergy: 50,
    acquiredTraits: [],
    equippedTraits: {},
    traitSlots: 3,
    skills: [],
    activeQuests: [],
    completedQuests: [],
    discoveredNPCs: [],
    inventory: []
  },
  essence: 0,
  npcs: npcs.map(npc => ({
    ...npc,
    relationship: 0,
    metAt: null,
    dialogueState: null,
    dialogueHistory: []
  })),
  traits: traits,
  items: items,
  gameTime: {
    day: 1,
    period: 'morning', // morning, afternoon, evening, night
    timestamp: Date.now()
  },
  notifications: []
};