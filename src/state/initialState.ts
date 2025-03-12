import { BASE_ITEMS } from '../types/ItemsInitialState';
import { PlayerState } from '../types/PlayerGameStateTypes';

export const initialState: PlayerState = {
  inventory: {
    items: [
      { ...BASE_ITEMS.sword, quantity: 1 },
      // Add more initial items as needed
    ],
  },
  // ...existing code...
};
