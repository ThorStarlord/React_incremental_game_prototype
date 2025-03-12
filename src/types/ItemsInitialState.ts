import { ItemType } from './ItemGameStateTypes';

export type Item = {
  id: string;
  name: string;
  description: string;
  type: ItemType;
  // ...existing code...
};

export const BASE_ITEMS: Record<string, Item> = {
  sword: {
    id: 'sword',
    name: 'Sword',
    description: 'A sharp blade.',
    type: ItemType.Weapon,
    // ...existing code...
  },
  // Add more items as needed
};
