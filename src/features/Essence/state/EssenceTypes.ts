/**
 * Essence System Type Definitions
 * 
 * Core types for the Essence system including state, actions, and component interfaces.
 * Follows Feature-Sliced Design principles with co-located type definitions.
 */

export interface EssenceConnection {
  npcId: string;
  connectionDepth: number; // Represents the strength/depth of the connection (e.g., 0-100)
  baseGenerationRate: number; // Base essence generated per tick by this specific connection
  lastGeneratedTick: number; // The game tick when essence was last generated from this connection
}

export interface EssenceState {
  currentEssence: number;
  totalCollected: number;
  generationRate: number; // Essence per second
  perClickValue: number; // Manual generation amount
  lastGenerationTime: number;
  isGenerating: boolean;
  loading: boolean;
  error: string | null;
  // FIXED: Added the missing property to track the resonance level within the essence state.
  currentResonanceLevel: number;
}

export interface EssenceTransaction {
  amount: number;
  type: 'gain' | 'spend';
  source: string;
  timestamp: number;
  description?: string;
}

export interface EssenceSource {
  id: string;
  name: string;
  baseRate: number;
  multiplier: number;
  isActive: boolean;
}

export interface EssenceUpgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  effect: {
    type: 'generation_rate' | 'click_value' | 'multiplier';
    value: number;
  };
  purchased: boolean;
}

export interface EssenceDisplayProps {
  currentEssence: number;
  showAnimation?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export interface EssenceStatistics {
  currentAmount: number;
  totalCollected: number;
  generationRate: number;
  perClickValue: number;
  activeConnections: number; // This will now be derived from npcConnections
}

/**
 * Type definitions for the Essence system
 */

/**
 * Core Essence state interface
 */
export interface EssenceState {
  currentEssence: number;
  totalCollected: number;
  generationRate: number;
  perClickValue: number;
  lastGenerationTime: number;
  isGenerating: boolean;
  loading: boolean;
  error: string | null;
}

/**
 * Payload for essence transaction actions
 */
/**
 * FIXED: Updated the payload to include optional source and description fields.
 * This makes the transaction actions more informative and fixes the payload errors.
 */
export interface EssenceTransactionPayload {
  amount: number;
  source?: string;
  description?: string;
}
