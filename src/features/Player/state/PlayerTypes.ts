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
  effects: Partial<PlayerStats>; // Can modify any player stat
  duration: number; // in game ticks or seconds
  remainingDuration: number;
  source?: string; // e.g., trait ID, item ID
  isBuff: boolean;
}

/**
 * Trait slot interface for player trait management
 */
export interface TraitSlot {
  id: string;
  slotIndex: number;
  traitId: string | null;
  isLocked: boolean;
  unlockRequirement?: string;
}

/**
 * Main player state interface
 */
export interface PlayerState {
  attributes: PlayerAttributes;
  baseStats: PlayerStats; // Stats before attributes, traits, or status effects
  calculatedStats: PlayerStats; // Final stats after all modifiers
  currentHealth: number;
  currentMana: number;
  statusEffects: StatusEffect[];
  activeTraitEffects: ProcessedTraitEffects; // Effects from equipped/permanent traits
  traitSlots: Array<string | null>; // IDs of equipped traits
  maxTraitSlots: number;
  permanentTraits: string[]; // IDs of permanently learned traits
  
  // Progression related
  resonanceLevel: number;
  attributePoints: number;
  skillPoints: number; // If a skill system is added
  playtime: number; // Total playtime in seconds

  lastStatsUpdate: number; // Timestamp of the last recalculateStats
  isLoading: boolean;
  error: string | null;
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

// ============================================================================
// Additional required interfaces for component props
// ============================================================================

export interface TraitSlotData {
  id: string;
  slotIndex: number;
  traitId: string | null;
  isLocked: boolean;
  unlockRequirement?: string;
}

export interface Trait {
  id: string;
  name: string;
  description: string;
  category: string;
  rarity: string;
  effects: Record<string, number>;
}

/**
 * Represents processed trait effects ready to be applied to player stats
 * Maps stat names to their modifier values
 */
export interface ProcessedTraitEffects {
  health?: number;
  maxHealth?: number;
  mana?: number;
  maxMana?: number;
  attack?: number;
  defense?: number;
  speed?: number;
  healthRegen?: number;
  manaRegen?: number;
  criticalChance?: number;
  criticalDamage?: number;
  [statName: string]: number | undefined;
}
