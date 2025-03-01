import { worldInitialState } from '../features/World/worldInitialState';
import { playerInitialState } from '../features/Player/playerInitialState';
import { npcsInitialState } from '../features/NPCs/npcsInitialState';
import { traitsInitialState } from '../features/Traits/traitsInitialState';
import { itemsInitialState } from '../features/Inventory/itemsInitialState';
import { essenceInitialState } from '../features/Essence/essenceInitialState';

export const getInitialState = () => ({
  player: playerInitialState,
  essence: essenceInitialState,
  npcs: npcsInitialState,
  traits: traitsInitialState,
  items: itemsInitialState,
  world: worldInitialState,
  gameTime: {
    day: 1,
    period: 'morning', // morning, afternoon, evening, night
    timestamp: Date.now()
  },
  notifications: []
});

export const initialState = getInitialState();