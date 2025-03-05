import { useEffect, useCallback } from 'react';
import { useGameState, useGameDispatch } from '../../context/gameContext';

/**
 * Interface for a resource object
 */
interface Resource {
  id: string;
  name: string;
  amount: number;
  maxAmount?: number;
  regenerationRate?: number;
  category?: string;
  rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  icon?: string;
  description?: string;
  lastUpdated?: number;
}

/**
 * Type for resource categories
 */
type ResourceCategory = 'currency' | 'material' | 'essence' | 'crafting' | 'special';

/**
 * Interface for resource action types
 */
interface ResourceAction {
  type: 'ADD_RESOURCE' | 'REMOVE_RESOURCE' | 'SET_RESOURCE' | 'UPDATE_RESOURCE_REGENERATION' | 'RESET_RESOURCES';
  payload: {
    resourceId?: string;
    amount?: number;
    resource?: Resource;
    category?: ResourceCategory;
    source?: string;
  };
}

/**
 * Interface for hook return value
 */
interface UseResourceSystemReturn {
  resources: Record<string, Resource>;
  addResource: (resourceId: string, amount: number, source?: string) => boolean;
  removeResource: (resourceId: string, amount: number, source?: string) => boolean;
  hasEnoughResource: (resourceId: string, amount: number) => boolean;
  getResourceAmount: (resourceId: string) => number;
  getResourcesByCategory: (category: ResourceCategory) => Resource[];
  getResourceCapPercentage: (resourceId: string) => number;
  resetResources: (category?: ResourceCategory) => void;
}

/**
 * Hook to manage game resources and operations
 * 
 * @returns Object with resource data and management functions
 */
const useResourceSystem = (): UseResourceSystemReturn => {
  const gameState = useGameState();
  const dispatch = useGameDispatch();
  
  // Get resources from game state with type safety
  const resources: Record<string, Resource> = gameState.resources || {};
  
  /**
   * Add resources to the player's inventory
   * 
   * @param resourceId - ID of the resource to add
   * @param amount - Amount to add
   * @param source - Source of the resource (for logging/analytics)
   * @returns Boolean indicating if operation was successful
   */
  const addResource = useCallback((resourceId: string, amount: number, source?: string): boolean => {
    if (amount <= 0 || !resourceId) return false;
    
    // Get current resource
    const resource = resources[resourceId];
    
    // If resource doesn't exist yet, we can't add to it
    if (!resource) return false;
    
    // Check if adding would exceed max amount
    const newAmount = resource.amount + amount;
    const finalAmount = resource.maxAmount ? Math.min(newAmount, resource.maxAmount) : newAmount;
    
    // Update resource through reducer
    dispatch({
      type: 'ADD_RESOURCE',
      payload: {
        resourceId,
        amount: finalAmount - resource.amount,
        source
      }
    });
    
    return true;
  }, [resources, dispatch]);
  
  /**
   * Remove resources from the player's inventory
   * 
   * @param resourceId - ID of the resource to remove
   * @param amount - Amount to remove
   * @param source - Source of the removal (for logging/analytics)
   * @returns Boolean indicating if operation was successful
   */
  const removeResource = useCallback((resourceId: string, amount: number, source?: string): boolean => {
    if (amount <= 0 || !resourceId) return false;
    
    // Get current resource
    const resource = resources[resourceId];
    
    // If resource doesn't exist or not enough, can't remove
    if (!resource || resource.amount < amount) return false;
    
    // Update resource through reducer
    dispatch({
      type: 'REMOVE_RESOURCE',
      payload: {
        resourceId,
        amount,
        source
      }
    });
    
    return true;
  }, [resources, dispatch]);
  
  /**
   * Check if player has enough of a specific resource
   * 
   * @param resourceId - ID of the resource to check
   * @param amount - Amount required
   * @returns Boolean indicating if player has enough
   */
  const hasEnoughResource = useCallback((resourceId: string, amount: number): boolean => {
    if (amount <= 0) return true;
    if (!resourceId) return false;
    
    const resource = resources[resourceId];
    return !!resource && resource.amount >= amount;
  }, [resources]);
  
  /**
   * Get current amount of a specific resource
   * 
   * @param resourceId - ID of the resource to get
   * @returns Current amount of the resource, or 0 if not found
   */
  const getResourceAmount = useCallback((resourceId: string): number => {
    return resources[resourceId]?.amount || 0;
  }, [resources]);
  
  /**
   * Get all resources that belong to a specific category
   * 
   * @param category - Category to filter by
   * @returns Array of resources in that category
   */
  const getResourcesByCategory = useCallback((category: ResourceCategory): Resource[] => {
    return Object.values(resources).filter(
      (resource): resource is Resource => 
        resource !== undefined && resource.category === category
    );
  }, [resources]);
  
  /**
   * Calculate percentage of resource capacity used
   * 
   * @param resourceId - ID of the resource to check
   * @returns Percentage of capacity used (0-100), or 100 if no max amount
   */
  const getResourceCapPercentage = useCallback((resourceId: string): number => {
    const resource = resources[resourceId];
    if (!resource || !resource.maxAmount) return 100;
    
    return (resource.amount / resource.maxAmount) * 100;
  }, [resources]);
  
  /**
   * Reset all resources or resources in a specific category
   * 
   * @param category - Optional category to reset
   */
  const resetResources = useCallback((category?: ResourceCategory): void => {
    dispatch({
      type: 'RESET_RESOURCES',
      payload: {
        category
      }
    });
  }, [dispatch]);
  
  // Handle automatic resource regeneration
  useEffect(() => {
    const regenerationInterval = setInterval(() => {
      // Find resources with regeneration rate
      Object.values(resources).forEach(resource => {
        if (!resource.regenerationRate || resource.regenerationRate <= 0) return;
        if (resource.maxAmount && resource.amount >= resource.maxAmount) return;
        
        // Calculate time-based regeneration
        const now = Date.now();
        const lastUpdated = resource.lastUpdated || now;
        const elapsedSeconds = (now - lastUpdated) / 1000;
        const regenerationAmount = resource.regenerationRate * elapsedSeconds;
        
        if (regenerationAmount < 0.01) return; // Skip tiny amounts
        
        // Determine new amount, respecting max capacity
        const newAmount = resource.amount + regenerationAmount;
        const finalAmount = resource.maxAmount 
          ? Math.min(newAmount, resource.maxAmount)
          : newAmount;
        
        if (finalAmount > resource.amount) {
          dispatch({
            type: 'UPDATE_RESOURCE_REGENERATION',
            payload: {
              resourceId: resource.id,
              amount: finalAmount,
              lastUpdated: now
            }
          });
        }
      });
    }, 5000); // Check every 5 seconds
    
    return () => clearInterval(regenerationInterval);
  }, [resources, dispatch]);
  
  return {
    resources,
    addResource,
    removeResource,
    hasEnoughResource,
    getResourceAmount,
    getResourcesByCategory,
    getResourceCapPercentage,
    resetResources
  };
};

export default useResourceSystem;
