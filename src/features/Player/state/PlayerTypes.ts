import type { Trait } from '../../Traits';
import type { TraitSlot } from '../../Traits/state/TraitsTypes';
import type { ProcessedTraitEffects } from '../utils/traitEffectProcessor';

/**
 * Core player statistics interface
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
 * Player attributes that affect derived stats
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
 * Temporary status effect that modifies player stats
 */
export interface StatusEffect {
  id: string;
  name: string;
  description: string;
  category: 'buff' | 'debuff' | 'consumable' | 'fatigue' | 'equipment' | 'trait';
  type?: string; // Added: General type of effect (e.g., 'healing', 'damage', 'control')
  effects?: Partial<PlayerStats>;
  duration: number;
  startTime: number;
  isActive: boolean;
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
  permanentTraits: string[];
  traitSlots: TraitSlot[]; // Player's equipped trait slots
  maxTraitSlots: number; // Maximum number of player trait slots
  totalPlaytime: number; // in milliseconds
  isAlive: boolean;
  resonanceLevel: number; // New: Player's Resonance Level
  activeTraitEffects: ProcessedTraitEffects;
}

/**
 * Interface for player progression data used in UI components
 */
export interface PlayerProgressionData {
  totalPlaytime: number;
  playtimeFormatted: string;
  availableAttributePoints: number;
  availableSkillPoints: number;
  totalAttributePoints: number;
  attributeInvestment: number;
  progressionLevel: number;
  resonanceLevel: number;
  maxResonanceLevel?: number;
  progressToNextLevel?: number;
}

// ============================================================================
// Action Payload Types
// ============================================================================

export interface AllocateAttributePointPayload {
  attribute: keyof PlayerAttributes;
}

export interface EquipTraitPayload {
  slotIndex: number;
  traitId: string;
}

export interface UnequipTraitPayload {
  slotIndex: number;
}

// ============================================================================
// Derived Data Types for Selectors
// ============================================================================

/**
 * Health and mana percentage data for UI components
 */
export interface VitalPercentages { // Exported
  healthPercent: number;
  manaPercent: number;
  status: 'critical' | 'low' | 'normal' | 'full'; // Added status for consistency
}

/**
 * Health and mana percentage data for UI components
 */
export interface PlayerHealthData { // Exported
  current: number;
  max: number;
  percentage: number;
  status: 'critical' | 'low' | 'normal' | 'full';
}

/**
 * Health and mana percentage data for UI components
 */
export interface PlayerManaData { // Exported
  current: number;
  max: number;
  percentage: number;
  status: 'critical' | 'low' | 'normal' | 'full' | 'empty';
}

/**
 * Grouped combat statistics for display
 */
export interface CombatStats {
  attack: number;
  defense: number;
  speed: number;
  criticalChance: number;
  criticalDamage: number;
}

/**
 * Performance and progression metrics
 */
export interface PerformanceStats {
  totalPlaytime: number;
  formattedPlaytime: string;
  availableAttributePoints: number;
  availableSkillPoints: number;
  resonanceLevel: number;
  powerLevel: number; // Added: Derived power level
}

/**
 * Health and mana status levels for color coding
 */
export interface VitalStatus {
  healthStatus: 'high' | 'medium' | 'low' | 'critical';
  manaStatus: 'high' | 'medium' | 'low' | 'empty';
}

/**
 * Component prop interfaces
 */
export interface StatDisplayProps {
  label: string;
  value: number | string; 
  unit?: string;
  showProgress?: boolean; 
  maxValue?: number; 
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  precision?: number;
  showIcon?: boolean;
  icon?: React.ReactNode;
  size?: 'small' | 'medium' | 'large'; 
}

export interface ProgressBarProps {
  current: number;
  max: number;
  height?: number;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  showPercentage?: boolean;
  showValues?: boolean;
  animated?: boolean;
  className?: string;
}

export interface PlayerStatsUIProps {
  stats: PlayerStats;
  vitalPercentages: VitalPercentages;
  combatStats: CombatStats;
  performanceStats: PerformanceStats;
  vitalStatus: VitalStatus;
}

/**
 * Interface for trait slot data used in UI components
 */
export interface TraitSlotData {
  id: string;
  index: number;
  isUnlocked: boolean;
  traitId?: string | null;
  unlockRequirements?: {
    type: 'resonanceLevel' | 'quest' | 'relationshipLevel';
    value: number | string;
  };
}

/**
 * Props interface for PlayerTraitsContainer component
 */
export interface PlayerTraitsContainerProps {
  className?: string;
  onTraitEquip?: (traitId: string, slotIndex: number) => void;
  onTraitUnequip?: (slotIndex: number) => void;
  showAvailableTraits?: boolean;
  compactView?: boolean;
  showLoading?: boolean;
  onTraitChange?: (action: 'equip' | 'unequip', traitId: string) => void;
}

/**
 * Props interface for PlayerTraitsUI component
 */
export interface PlayerTraitsUIProps {
  traitSlots: TraitSlotData[];
  equippedTraits: Trait[]; // Changed from any[] to Trait[]
  permanentTraits: Trait[]; // Changed from any[] to Trait[]
  availableTraits: Trait[]; // Added: For displaying traits available to equip
  onEquipTrait?: (traitId: string, slotIndex: number) => void;
  onUnequipTrait?: (slotIndex: number) => void;
  onTraitSelect?: (traitId: string) => void;
  className?: string;
  isLoading?: boolean;
  error?: string | null;
}

// ============================================================================
// Re-export canonical initial state type for consistency
// ============================================================================

export type PlayerInitialState = PlayerState;
