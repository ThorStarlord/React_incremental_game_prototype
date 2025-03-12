import { GameItem, ItemType } from './ItemGameStateTypes';

export type InventoryItem = GameItem & {
  quantity: number;
  // ...existing code...
};

export type Inventory = {
  items: InventoryItem[];
  // ...existing code...
};
