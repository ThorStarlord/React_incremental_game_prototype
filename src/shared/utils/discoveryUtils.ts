/**
 * Interface for a discoverable location
 */
interface Location {
  id: string;
  name: string;
  type: string;
  isDiscovered?: boolean;
  requiresItem?: string;
  requiresLevel?: number;
  coordinates?: [number, number];
  [key: string]: any;
}

/**
 * Interface for the player discovery record
 */
interface DiscoveryRecord {
  locations: Record<string, boolean>;
  lastDiscovered?: string;
  totalDiscovered: number;
  achievements?: string[];
}

/**
 * Interface for discovery requirements
 */
interface DiscoveryRequirement {
  type: 'level' | 'item' | 'quest' | 'location';
  value: string | number;
  errorMessage?: string;
}

/**
 * Check if a player has discovered a specific location
 * 
 * @param {DiscoveryRecord} discoveryRecord - Player's discovery record
 * @param {string} locationId - ID of the location to check
 * @returns {boolean} Whether the location has been discovered
 */
export const isLocationDiscovered = (
  discoveryRecord: DiscoveryRecord, 
  locationId: string
): boolean => {
  if (!discoveryRecord || !discoveryRecord.locations) {
    return false;
  }
  
  return !!discoveryRecord.locations[locationId];
};

/**
 * Check if player meets the requirements to discover a location
 * 
 * @param {object} player - The player data
 * @param {Location} location - The location to check
 * @returns {boolean | string} True if requirements met, or error message if not
 */
export const checkDiscoveryRequirements = (
  player: any, 
  location: Location
): boolean | string => {
  // Check level requirements
  if (location.requiresLevel && player.level < location.requiresLevel) {
    return `Requires level ${location.requiresLevel}`;
  }
  
  // Check item requirements
  if (location.requiresItem && 
      (!player.inventory || !player.inventory.some((item: any) => item.id === location.requiresItem))) {
    const itemName = location.requiresItemName || 'required item';
    return `Requires ${itemName}`;
  }
  
  // Check quest completion requirements
  if (location.requiresQuest &&
      (!player.completedQuests || !player.completedQuests.includes(location.requiresQuest))) {
    return `Unavailable - complete required quests first`;
  }
  
  return true;
};

/**
 * Mark a location as discovered in the player's discovery record
 * 
 * @param {DiscoveryRecord} discoveryRecord - Player's discovery record
 * @param {string} locationId - ID of the location to discover
 * @returns {DiscoveryRecord} Updated discovery record
 */
export const discoverLocation = (
  discoveryRecord: DiscoveryRecord, 
  locationId: string
): DiscoveryRecord => {
  // Create new object to avoid mutation
  const newRecord: DiscoveryRecord = {
    ...discoveryRecord,
    locations: {
      ...discoveryRecord.locations,
      [locationId]: true
    },
    lastDiscovered: locationId,
  };
  
  // Update total discovered count
  newRecord.totalDiscovered = Object.values(newRecord.locations).filter(Boolean).length;
  
  return newRecord;
};

/**
 * Calculate the percentage of world discovered
 * 
 * @param {DiscoveryRecord} discoveryRecord - Player's discovery record
 * @param {Location[]} allLocations - All locations in the game
 * @returns {number} Percentage of world discovered (0-100)
 */
export const getDiscoveryPercentage = (
  discoveryRecord: DiscoveryRecord, 
  allLocations: Location[]
): number => {
  if (!discoveryRecord || !discoveryRecord.locations || !allLocations || !allLocations.length) {
    return 0;
  }
  
  const totalDiscovered = Object.values(discoveryRecord.locations).filter(Boolean).length;
  const totalLocations = allLocations.length;
  
  return Math.floor((totalDiscovered / totalLocations) * 100);
};

/**
 * Get all locations the player has discovered
 * 
 * @param {DiscoveryRecord} discoveryRecord - Player's discovery record
 * @param {Location[]} allLocations - All locations in the game
 * @returns {Location[]} List of discovered locations
 */
export const getDiscoveredLocations = (
  discoveryRecord: DiscoveryRecord, 
  allLocations: Location[]
): Location[] => {
  if (!discoveryRecord || !discoveryRecord.locations || !allLocations) {
    return [];
  }
  
  return allLocations.filter(location => 
    discoveryRecord.locations[location.id]
  );
};

/**
 * Check if discovering a location will unlock an achievement
 * 
 * @param {string} locationId - ID of the location discovered
 * @param {DiscoveryRecord} discoveryRecord - Player's discovery record
 * @param {Record<string, any>} achievements - Achievement definitions
 * @returns {string | null} ID of achievement unlocked, or null
 */
export const checkDiscoveryAchievement = (
  locationId: string, 
  discoveryRecord: DiscoveryRecord,
  achievements: Record<string, any>
): string | null => {
  // Updated discovery total including this new discovery
  const updatedTotal = (discoveryRecord.totalDiscovered || 0) + 1;
  
  // Check for total discovery achievements
  for (const [achievementId, achievement] of Object.entries(achievements)) {
    if (achievement.type === 'discover' && achievement.count <= updatedTotal) {
      // Check if already earned
      if (!discoveryRecord.achievements?.includes(achievementId)) {
        return achievementId;
      }
    }
    
    // Check for specific location discovery achievements
    if (achievement.type === 'discoverSpecific' && 
        achievement.locationId === locationId) {
      // Check if already earned
      if (!discoveryRecord.achievements?.includes(achievementId)) {
        return achievementId;
      }
    }
  }
  
  return null;
};
