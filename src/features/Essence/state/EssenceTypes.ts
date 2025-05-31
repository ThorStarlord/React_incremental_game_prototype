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
  generationRate: number; // overall passive generation rate per second (sum of all active connections + other bonuses)
  perClickValue: number;
  lastGenerationTime: number; // Timestamp of the last time passive essence was generated
  isGenerating: boolean;
  loading: boolean;
  error: string | null;
  npcConnections: Record<string, EssenceConnection>; // Map of NPC ID to their EssenceConnection data
  currentResonanceLevel: number; // Player's current resonance level
  maxResonanceLevel: number; // Maximum achievable resonance level
  resonanceThresholds: number[]; // Array of totalCollected essence needed for each level [level1_threshold, level2_threshold, ...]
}

export interface EssenceGenerationSource {
  id: string;
  type: 'npc_connection' | 'manual' | 'quest_reward' | 'achievement';
  amount: number;
  description: string;
}

export interface EssenceTransactionPayload {
  amount: number;
  source?: string;
  description?: string;
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
