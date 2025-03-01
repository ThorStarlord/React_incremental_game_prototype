import { worldInitialState } from '../features/World/worldInitialState';
import { playerInitialState } from '../features/Player/playerInitialState';
import { npcsInitialState } from '../features/NPCs/npcsInitialState';
import { traitsInitialState } from '../features/Traits/traitsInitialState';
import { itemsInitialState } from '../features/Inventory/itemsInitialState';
import { essenceInitialState } from '../features/Essence/essenceInitialState';

export const getInitialState = () => ({
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
  traits,
  items,
  gameTime: {
    day: 1,
    period: 'morning', // morning, afternoon, evening, night
    timestamp: Date.now()
  },
  notifications: []
});

export const initialState = getInitialState();