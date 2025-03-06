/**
 * Shared utility functions for reducers
 */
import { addNotification } from '../utils/notificationUtils';
import { GameState, BaseState } from '../GameStateTypes';

/**
 * Creates a notification and adds it to state
 */
export const withNotification = (
  state: GameState, 
  message: string, 
  type: string = "info", 
  duration: number = 3000
): GameState => addNotification(state, { message, type, duration });

export const updateById = <T extends BaseState>(
    array: T[], 
    id: string, 
    updates: Partial<T>
  ): T[] => array.map(item => item.id === id ? { ...item, ...updates } : item);
  
  /**
   * Update a nested property in state
   */
  export const updateNested = (
    state: Record<string, any>,
    path: string[], 
    value: any
  ): Record<string, any> => {
    if (path.length === 1) {
      return { ...state, [path[0]]: value };
    }
    
    const [current, ...rest] = path;
    return {
      ...state,
      [current]: updateNested(state[current] || {}, rest, value)
    };
  };
  
  /**
   * Clamps a number between min and max values
   */
  export const clamp = (value: number, min: number, max: number): number => 
    Math.max(min, Math.min(max, value));
  
  /**
   * Safely updates a quantity in an inventory
   */
  export const updateInventoryQuantity = (
    inventory: any[], 
    itemIndex: number, 
    change: number
  ): any[] => {
    if (itemIndex === -1) return inventory;
    
    if (inventory[itemIndex].quantity + change <= 0) {
      return inventory.filter((_, idx) => idx !== itemIndex);
    }
    
    return inventory.map((item, idx) => 
      idx === itemIndex 
        ? { ...item, quantity: item.quantity + change } 
        : item
    );
  };
  
  /**
   * Creates a reducer action handler function
   */
  export const createReducerHandler = <S, P>(
    fn: (state: S, payload: P) => S
  ) => (state: S, action: { payload: P }) => fn(state, action.payload);
