/**
 * Player state type definitions following Feature-Sliced Design
 * Based on specification in DataModel.md
 */

// Core Player State Interface
export interface PlayerState {
  name: string;
  stats: PlayerStats;
  attributes: Record<string, Attribute>;
  attributePoints: number;
  skillPoints: number;
  statusEffects: StatusEffect[];
  equipment: EquipmentState;
  gold: number;
  totalPlayTime: number; // In milliseconds
  isAlive: boolean;
}

// Player Statistics Interface
export interface PlayerStats {
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  attack: number;
  defense: number;
  speed: number;
  healthRegen: number;
  manaRegen: number;
  critChance: number; // 0.0 to 1.0
  critDamage: number; // Multiplier (e.g., 1.5 for +50%)
  [key: string]: number; // Allow dynamic stats
}

// Player Attributes Interface
export interface Attribute {
  name: string;
  value: number; // Current value including bonuses
  baseValue: number; // Value from allocated points
}

// Status Effects Interface
export interface StatusEffect {
  id: string;
  name: string;
  type: string; // e.g., 'buff', 'debuff'
  duration: number; // Remaining duration in seconds or ticks
  magnitude?: number;
  source?: string;
  timestampApplied: number;
  effects: Partial<PlayerStats>;
}

// Equipment Interfaces
export interface EquipmentItem {
  id: string;
  name: string;
  type: string; // e.g., 'weapon', 'armor', 'accessory'
  slot: string; // e.g., 'head', 'chest', 'mainHand'
  stats?: Partial<PlayerStats>;
  rarity?: string; // e.g., 'common', 'rare'
}

export interface EquipmentState {
  head?: EquipmentItem | null;
  chest?: EquipmentItem | null;
  legs?: EquipmentItem | null;
  feet?: EquipmentItem | null;
  mainHand?: EquipmentItem | null;
  offHand?: EquipmentItem | null;
  accessory1?: EquipmentItem | null;
  accessory2?: EquipmentItem | null;
  [key: string]: EquipmentItem | null | undefined;
}

// Action Payload Types
export interface UpdatePlayerPayload {
  updates: Partial<PlayerState>;
}

export interface ModifyHealthPayload {
  amount: number;
  type: 'damage' | 'heal';
}

export interface AllocateAttributePayload {
  attributeName: string;
  points: number;
}

export interface EquipItemPayload {
  slot: string;
  item: EquipmentItem | null;
}

export interface EquipTraitPayload {
  slotIndex: number;
  traitId: string;
}

export interface UnequipTraitPayload {
  slotId: string;
}

// Enhanced Data Interfaces for Selectors
export interface PlayerHealthData {
  current: number;
  max: number;
  percentage: number;
}

export interface PlayerManaData {
  current: number;
  max: number;
  percentage: number;
}

export interface CombatStats {
  attack: number;
  defense: number;
  speed: number;
  critChance: number;
  critDamage: number;
}

export interface PerformanceStats {
  totalPlayTime: number;
  powerLevel: number;
}

// Equipment Category Interfaces
export interface ArmorEquipment {
  head?: EquipmentItem | null;
  chest?: EquipmentItem | null;
  legs?: EquipmentItem | null;
  feet?: EquipmentItem | null;
}

export interface WeaponEquipment {
  mainHand?: EquipmentItem | null;
  offHand?: EquipmentItem | null;
}

export interface AccessoryEquipment {
  accessory1?: EquipmentItem | null;
  accessory2?: EquipmentItem | null;
}

// Component Props Interfaces
export interface PlayerStatsContainerProps {
  showDetails?: boolean;
  className?: string;
}

export interface PlayerTraitsContainerProps {
  showLoading?: boolean;
  onTraitChange?: (action: 'equip' | 'unequip' | 'permanent', traitId: string) => void;
  className?: string;
}

export interface TraitSlotData {
  id: string;
  index: number;
  isUnlocked: boolean;
  traitId?: string | null;
}

export interface PlayerStatsUIProps {
  stats: PlayerStats;
  showDetails?: boolean;
}

export interface StatDisplayProps {
  label: string;
  value: number | string;
  unit?: string;
  showProgress?: boolean;
  maxValue?: number;
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  size?: 'small' | 'medium' | 'large';
}

export interface ProgressBarProps {
  value: number;
  maxValue: number;
  height?: number;
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  showValue?: boolean;
  showPercentage?: boolean;
  animate?: boolean;
  className?: string;
}

export interface PlayerEquipmentProps {
  equipment: EquipmentState;
  onEquipItem?: (slot: string, item: EquipmentItem | null) => void;
  onUnequipItem?: (slot: string) => void;
  showQuickActions?: boolean;
  className?: string;
}

export interface ProgressionProps {
  showAdvancedStats?: boolean;
  className?: string;
}
