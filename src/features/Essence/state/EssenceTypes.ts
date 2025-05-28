/**
 * Essence System Type Definitions
 * 
 * Core types for the Essence system including state, actions, and component interfaces.
 * Follows Feature-Sliced Design principles with co-located type definitions.
 */

export interface EssenceState {
  currentEssence: number;
  totalCollected: number;
  generationRate: number; // per second
  perClickValue: number;
  lastGenerationTime: number;
  isGenerating: boolean;
  loading: boolean;
  error: string | null;
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
  activeConnections: number;
}
