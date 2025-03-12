export enum ItemType {
  Weapon = 'weapon',
  Armor = 'armor',
  Consumable = 'consumable',
  Material = 'material',
  Quest = 'quest',
  Misc = 'misc',
}

export type GameItem = {
  id: string;
  name: string;
  description: string;
  type: ItemType;
  // ...existing code...
};
