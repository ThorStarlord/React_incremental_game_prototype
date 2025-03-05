/**
 * Interface for an NPC object
 */
interface NPC {
  id: string;
  name: string;
  relationship?: number;
  faction?: string;
  occupation?: string;
  personality?: string[];
  interests?: string[];
  dislikedTopics?: string[];
  inventory?: any[];
  quests?: string[];
  dialogueTree?: Record<string, any>;
  location?: string;
  schedule?: NPCSchedule;
  [key: string]: any;
}

/**
 * Interface for NPC schedule entry 
 */
interface ScheduleEntry {
  time: number;
  location: string;
  activity: string;
}

/**
 * Interface for NPC daily schedule 
 */
interface NPCSchedule {
  weekday?: ScheduleEntry[];
  weekend?: ScheduleEntry[];
  [key: string]: ScheduleEntry[] | undefined;
}

/**
 * Interface for relationship status object
 */
interface RelationshipStatus {
  level: string;
  color: string;
  minValue: number;
  benefits?: string[];
  description?: string;
}

/**
 * Predefined relationship status levels
 */
const RELATIONSHIP_LEVELS: RelationshipStatus[] = [
  { level: 'Hostile', color: '#f44336', minValue: -100 },
  { level: 'Unfriendly', color: '#ff9800', minValue: -30 },
  { level: 'Neutral', color: '#9e9e9e', minValue: -10 },
  { level: 'Warm', color: '#8bc34a', minValue: 20 },
  { level: 'Friendly', color: '#2196f3', minValue: 40 },
  { level: 'Trusted', color: '#4caf50', minValue: 60 },
  { level: 'Devoted', color: '#9c27b0', minValue: 80 },
];

/**
 * Calculate the relationship status based on relationship value
 * 
 * @param {number} relationshipValue - Numeric value of relationship
 * @returns {RelationshipStatus} The relationship status object
 */
export const getRelationshipStatus = (relationshipValue: number): RelationshipStatus => {
  // Default to neutral if no value provided
  if (relationshipValue === undefined || relationshipValue === null) {
    return RELATIONSHIP_LEVELS.find(level => level.level === 'Neutral') || 
      RELATIONSHIP_LEVELS[2]; // Fallback to index 2 (usually Neutral)
  }
  
  // Find highest matching level
  for (let i = RELATIONSHIP_LEVELS.length - 1; i >= 0; i--) {
    if (relationshipValue >= RELATIONSHIP_LEVELS[i].minValue) {
      return RELATIONSHIP_LEVELS[i];
    }
  }
  
  // Default to first/lowest level if nothing matches
  return RELATIONSHIP_LEVELS[0];
};

/**
 * Calculate how an NPC responds to a gift based on their interests
 * 
 * @param {NPC} npc - The NPC receiving the gift
 * @param {any} item - The item being gifted
 * @returns {number} Relationship points gained (-10 to +20)
 */
export const calculateGiftValue = (npc: NPC, item: any): number => {
  if (!npc || !item) return 0;
  
  // Default reaction
  let value = 2;
  
  // Check if item matches any interests
  if (npc.interests && Array.isArray(npc.interests) && item.tags) {
    const matchingInterests = npc.interests.filter(interest => 
      item.tags.includes(interest)
    );
    
    if (matchingInterests.length > 0) {
      value += 8 * matchingInterests.length;
    }
  }
  
  // Check if item matches any dislikes
  if (npc.dislikedTopics && Array.isArray(npc.dislikedTopics) && item.tags) {
    const matchingDislikes = npc.dislikedTopics.filter(dislike =>
      item.tags.includes(dislike)
    );
    
    if (matchingDislikes.length > 0) {
      value -= 10 * matchingDislikes.length;
    }
  }
  
  // Modify by item quality/rarity
  if (item.rarity) {
    const rarityValues: Record<string, number> = {
      common: 1,
      uncommon: 2,
      rare: 4,
      epic: 6,
      legendary: 10
    };
    
    value += rarityValues[item.rarity] || 0;
  }
  
  return Math.min(20, Math.max(-10, value));
};

/**
 * Get NPC's current location based on game time
 * 
 * @param {NPC} npc - The NPC to locate
 * @param {number} gameHour - Current hour in game (0-23)
 * @param {boolean} isWeekend - Whether it's a weekend in game
 * @returns {string} Location ID where the NPC can be found
 */
export const getNPCCurrentLocation = (
  npc: NPC, 
  gameHour: number, 
  isWeekend: boolean = false
): string => {
  // Default to NPC's base location if defined
  const defaultLocation = npc.location || 'unknown';
  
  if (!npc.schedule) {
    return defaultLocation;
  }
  
  // Get the appropriate schedule for the day
  const schedule = isWeekend && npc.schedule.weekend 
    ? npc.schedule.weekend
    : npc.schedule.weekday || [];
  
  // Find the latest schedule entry that applies
  let latestEntry: ScheduleEntry | undefined;
  
  for (const entry of schedule) {
    if (entry.time <= gameHour && 
        (!latestEntry || entry.time > latestEntry.time)) {
      latestEntry = entry;
    }
  }
  
  return latestEntry?.location || defaultLocation;
};

/**
 * Generate dialogue options based on NPC relationship level
 * 
 * @param {NPC} npc - The NPC to talk with
 * @returns {any[]} Array of dialogue options
 */
export const getDialogueOptions = (npc: NPC): any[] => {
  if (!npc || !npc.dialogueTree) return [];
  
  const relationshipValue = npc.relationship || 0;
  const relationshipStatus = getRelationshipStatus(relationshipValue);
  
  // Get base dialogue options
  let options = npc.dialogueTree.common || [];
  
  // Add relationship-specific options
  const relationshipOptions = npc.dialogueTree[relationshipStatus.level.toLowerCase()];
  if (relationshipOptions && Array.isArray(relationshipOptions)) {
    options = [...options, ...relationshipOptions];
  }
  
  // Filter out options that have requirements not met
  return options.filter(option => {
    if (!option.requires) return true;
    
    // For now just check relationship requirements
    if (option.requires.relationship && relationshipValue < option.requires.relationship) {
      return false;
    }
    
    return true;
  });
};

/**
 * Update NPC relationship points
 * 
 * @param {NPC} npc - The NPC to update
 * @param {number} points - Points to add (can be negative)
 * @param {boolean} [capped=true] - Whether to cap at min/max values
 * @returns {NPC} Updated NPC object
 */
export const updateNPCRelationship = (
  npc: NPC, 
  points: number,
  capped: boolean = true
): NPC => {
  if (!npc) return npc;
  
  const currentValue = npc.relationship || 0;
  let newValue = currentValue + points;
  
  // Apply caps if enabled
  if (capped) {
    newValue = Math.min(100, Math.max(-100, newValue));
  }
  
  // Create new object to avoid mutation
  return {
    ...npc,
    relationship: newValue
  };
};

/**
 * Find NPCs in a specific location
 * 
 * @param {NPC[]} allNpcs - All NPCs in the game
 * @param {string} locationId - Location to check
 * @param {number} gameHour - Current hour in game (0-23)
 * @param {boolean} isWeekend - Whether it's a weekend in game
 * @returns {NPC[]} NPCs in the location
 */
export const getNPCsAtLocation = (
  allNpcs: NPC[],
  locationId: string,
  gameHour: number,
  isWeekend: boolean = false
): NPC[] => {
  if (!allNpcs || !locationId) return [];
  
  return allNpcs.filter(npc => 
    getNPCCurrentLocation(npc, gameHour, isWeekend) === locationId
  );
};
