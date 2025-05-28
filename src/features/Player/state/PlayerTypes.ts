import type { Trait } from '../../Traits';

/**
 * Player statistics interface - represents computed player stats
 * Includes base stats modified by attributes, traits, and status effects
 */
export interface PlayerStats {
  // Core vital statistics
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  
  // Combat statistics
  attack: number;
  defense: number;
  speed: number;
  
  // Regeneration statistics
  healthRegen: number;        // Health regeneration per second
  manaRegen: number;          // Mana regeneration per second
  
  // Advanced combat statistics
  criticalChance: number;     // 0.0 to 1.0 (percentage as decimal)
  criticalDamage: number;     // Multiplier (1.0 = 100%, 2.0 = 200%)
}

/**
 * Player base stats interface - stored values before calculations
 * These are the raw values stored in Redux state
 */
export interface PlayerBaseStats {
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  attack: number;
  defense: number;
  speed: number;
  healthRegen: number;        // Consistent with PlayerStats
  manaRegen: number;          // Consistent with PlayerStats
  criticalChance: number;
  criticalDamage: number;
}

/**
 * Player attributes interface
 */
export interface PlayerAttributes {
  strength: number;
  dexterity: number;
  intelligence: number;
  constitution: number;
  wisdom: number;
  charisma: number;
}

/**
 * Status effect interface for temporary modifications
 */
export interface StatusEffect {
  id: string;
  name: string;
  description: string;
  duration: number; // in milliseconds, -1 for permanent
  effects: Partial<PlayerStats>; // stat modifications
  startTime: number; // timestamp when effect was applied
  type?: string; // effect type (buff, debuff, neutral)
  category?: string; // effect category (combat, social, magical, etc.)
}

/**
 * Trait slot data structure for UI components
 */
export interface TraitSlot {
  id: string;
  slotIndex: number;
  traitId: string | null;
  isLocked: boolean;
  unlockRequirement?: string;
}

// Enhanced trait slot data for UI components - aligned with container transformation
export interface TraitSlotData {
  // Core properties from transformation
  id: string;
  index: number;
  isUnlocked: boolean;
  traitId: string | null;
  // Optional derived properties for UI compatibility
  slotIndex?: number; // Derived from index or provided separately
  isLocked?: boolean; // Inverse of isUnlocked (!isUnlocked)
  isEquipped?: boolean; // Derived from traitId !== null
  traitName?: string;
  traitDescription?: string;
  traitRarity?: string;
  unlockRequirement?: string;
}

/**
 * Main player state interface
 */
export interface PlayerState {
  stats: PlayerStats;
  attributes: PlayerAttributes;
  availableAttributePoints: number;
  availableSkillPoints: number;
  statusEffects: StatusEffect[];
  equippedTraits: (string | null)[];
  permanentTraits: string[];
  traitSlots: TraitSlot[];
  totalPlaytime: number; // in milliseconds
  isAlive: boolean;
}

/**
 * Action payload interfaces for Redux
 */
export interface AllocateAttributePointPayload {
  attributeName: keyof PlayerAttributes;
  points: number;
}

export interface EquipTraitPayload {
  traitId: string;
  slotIndex: number;
}

export interface UnequipTraitPayload {
  slotIndex: number;
}

/**
 * Enhanced data interfaces for selectors
 */
export interface PlayerHealthData {
  current: number;
  max: number;
  percentage: number;
  status: 'critical' | 'low' | 'normal' | 'full';
}

export interface PlayerManaData {
  current: number;
  max: number;
  percentage: number;
  status: 'critical' | 'low' | 'normal' | 'full';
}

export interface CombatStats {
  attack: number;
  defense: number;
  speed: number;
  criticalChance: number;
  criticalDamage: number;
}

export interface PerformanceStats {
  totalPlaytime: number;
  powerLevel: number;
  availableAttributePoints: number;
  availableSkillPoints: number;
}

/**
 * Player progression data interface for Progression container
 */
export interface PlayerProgressionData {
  totalPlaytime: number;
  formattedPlaytime: string;
  availableAttributePoints: number;
  availableSkillPoints: number;
  isAlive: boolean;
  characterLevel?: number; // Optional for future level system
  experiencePoints?: number; // Optional for future XP system
  nextLevelRequirement?: number; // Optional for future progression
}

/**
 * Container component prop interfaces
 */
export interface PlayerTraitsContainerProps {
  className?: string;
  showPermanentTraits?: boolean;
  showEquippedTraits?: boolean;
  maxSlotsDisplayed?: number;
  showLoading?: boolean;
  onTraitEquip?: (traitId: string, slotIndex: number) => void;
  onTraitUnequip?: (slotIndex: number) => void;
  onTraitMakePermanent?: (traitId: string) => void;
  onTraitChange?: (action: 'equip' | 'unequip' | 'permanent', value: string) => void;
}

/**
 * Component prop interfaces
 */
export interface PlayerStatsUIProps {
  healthData: PlayerHealthData;
  manaData: PlayerManaData;
  combatStats: CombatStats;
  performanceStats: PerformanceStats;
  className?: string;
}

export interface PlayerTraitsUIProps {
  slots: TraitSlotData[];
  equippedTraits: any[]; // TODO: Replace with proper Trait type when available
  permanentTraits: any[]; // TODO: Replace with proper Trait type when available
  onSlotClick?: (slotId: string) => void;
  onTraitEquip?: (traitId: string, slotIndex: number) => void;
  onTraitUnequip?: (slotIndex: number) => void;
  onTraitMakePermanent?: (traitId: string) => void;
  // Event handlers from container
  onEquipTrait?: (slotIndex: number, traitId: string) => void;
  onUnequipTrait?: (slotId: string) => void;
  onMakePermanent?: (traitId: string) => void;
  // Display and state properties
  showLoading?: boolean;
  isLoading?: boolean;
  equippedCount?: number;
  permanentCount?: number;
  maxSlots?: number;
  // Add missing properties from container
  totalSlots?: number;
  unlockedSlots?: number;
  className?: string;
}

export interface StatDisplayProps {
  label: string;
  value: string | number;
  maxValue?: number;
  showProgress?: boolean;
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  unit?: string; // Unit property for displaying units like "%" or "/sec"
  className?: string;
}

export interface ProgressBarProps {
  current: number;
  max: number;
  height?: number;
  showValues?: boolean;
  showPercentage?: boolean;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  animate?: boolean;
  className?: string;
}
