/**
 * Relationship tier definitions with thresholds, colors, and gameplay benefits
 */
export const RELATIONSHIP_TIERS = {
  // Negative tiers
  NEMESIS: { 
    name: "Nemesis", 
    threshold: -100, 
    color: "#b71c1c", 
    benefits: ["Will actively sabotage you", "May send enemies to attack you", "Spreads negative rumors"]
  },
  ENEMY: { 
    name: "Enemy", 
    threshold: -60, 
    color: "#f44336", 
    benefits: ["Refuses most interactions", "Higher prices at shops", "May give false information"]
  },
  WARY: { 
    name: "Wary", 
    threshold: -30, 
    color: "#ff9800", 
    benefits: ["Limited dialogue options", "Basic trading only", "No special favors"]
  },
  
  // Neutral tier
  NEUTRAL: { 
    name: "Stranger", 
    threshold: 0, 
    color: "#9e9e9e", 
    benefits: ["Basic dialogue", "Standard prices", "No special benefits"]
  },
  
  // Positive tiers
  ACQUAINTANCE: { 
    name: "Acquaintance", 
    threshold: 20, 
    color: "#cddc39", 
    benefits: ["More dialogue options", "Minor discounts (5%)", "Basic information about quests"]
  },
  FRIEND: { 
    name: "Friend", 
    threshold: 40, 
    color: "#4caf50", 
    benefits: ["Access to most dialogue", "Better discounts (10%)", "May share common traits", "Occasional small gifts"]
  },
  ALLY: { 
    name: "Ally", 
    threshold: 60, 
    color: "#3f51b5", 
    benefits: ["Access to all standard dialogue", "Significant discounts (15%)", "Access to uncommon traits", "Occasional assistance"]
  },
  DEVOTED: { 
    name: "Devoted", 
    threshold: 80, 
    color: "#9c27b0", 
    benefits: ["Exclusive dialogue options", "Maximum discounts (20%)", "Access to rare traits", "Regular gifts", "Special quests"]
  }
};

/**
 * Map relationship value to interaction possibilities
 */
export const RELATIONSHIP_INTERACTIONS = {
  // Available even to enemies
  BASE: ["talk", "observe"],
  
  // Only available at neutral or higher
  NEUTRAL: ["trade", "ask_information"],
  
  // Friendly interactions
  FRIENDLY: ["request_help", "personal_questions", "small_favor"],
  
  // Close ally interactions
  ALLY: ["learn_common_trait", "borrow_items", "request_assistance"],
  
  // Devoted interactions
  DEVOTED: ["learn_rare_trait", "faction_recruitment", "special_quest"]
};

/**
 * Gets the relationship tier based on a relationship value
 * @param {number} value - The relationship value (-100 to 100)
 * @returns {object} The relationship tier object
 */
export const getRelationshipTier = (value) => {
  // Find the highest tier whose threshold is less than or equal to the value
  return Object.values(RELATIONSHIP_TIERS)
    .filter(tier => value >= tier.threshold)
    .reduce((highest, tier) => 
      tier.threshold > highest.threshold ? tier : highest, 
      RELATIONSHIP_TIERS.NEMESIS
    );
};

/**
 * Gets the simplified tier category (for broader gameplay mechanics)
 * Maps our 8-tier system down to the requested 5-tier system
 * @param {number} value - The relationship value (-100 to 100)
 * @returns {string} One of: "ENEMY", "STRANGER", "ACQUAINTANCE", "FRIEND", "ALLY"
 */
export const getSimplifiedTier = (value) => {
  if (value <= -30) return "ENEMY";
  if (value < 0) return "STRANGER";
  if (value < 40) return "ACQUAINTANCE";
  if (value < 60) return "FRIEND";
  return "ALLY";
};

/**
 * Get available interactions based on relationship tier
 * @param {number} relationshipValue - The relationship value (-100 to 100)
 * @returns {string[]} Array of available interaction types
 */
export const getAvailableInteractions = (relationshipValue) => {
  const tier = getSimplifiedTier(relationshipValue);
  
  // Base interactions available to all
  const interactions = ["talk"];
  
  // Add tier-specific interactions
  switch(tier) {
    case "ALLY":
      interactions.push("request_special_favor", "learn_rare_trait");
      // Fall through to include all lower tier interactions
    case "FRIEND":
      interactions.push("request_assistance", "learn_uncommon_trait", "gift_exchange");
      // Fall through
    case "ACQUAINTANCE":
      interactions.push("trade", "ask_information", "basic_quests");
      // Fall through
    case "STRANGER":
      interactions.push("introduce_self");
      break;
    case "ENEMY":
      // Enemies have limited interactions
      interactions.length = 0; // Clear array
      interactions.push("attempt_reconciliation", "defend_self");
      break;
  }
  
  return interactions;
};

/**
 * Get the tier-specific benefits for UI display
 * @param {number} relationshipValue - The relationship value (-100 to 100)
 * @returns {object} Object with benefits information
 */
export const getTierBenefits = (relationshipValue) => {
  const tier = getRelationshipTier(relationshipValue);
  return {
    name: tier.name,
    color: tier.color,
    benefits: tier.benefits,
    nextTier: getNextTierInfo(relationshipValue)
  };
};

/**
 * Get information about the next tier
 * @param {number} currentValue - Current relationship value
 * @returns {object|null} Information about next tier or null if at max
 */
const getNextTierInfo = (currentValue) => {
  const tiers = Object.values(RELATIONSHIP_TIERS).sort((a, b) => a.threshold - b.threshold);
  const nextTier = tiers.find(tier => tier.threshold > currentValue);
  
  if (!nextTier) return null;
  
  return {
    name: nextTier.name,
    threshold: nextTier.threshold,
    pointsNeeded: nextTier.threshold - currentValue,
    color: nextTier.color
  };
};

/**
 * Get discount percentage based on relationship
 */
export const getRelationshipDiscount = (relationshipValue) => {
  const tier = getRelationshipTier(relationshipValue);
  
  if (tier.threshold >= RELATIONSHIP_TIERS.DEVOTED.threshold) return 0.2; // 20%
  if (tier.threshold >= RELATIONSHIP_TIERS.ALLY.threshold) return 0.15; // 15%
  if (tier.threshold >= RELATIONSHIP_TIERS.FRIEND.threshold) return 0.1; // 10%
  if (tier.threshold >= RELATIONSHIP_TIERS.ACQUAINTANCE.threshold) return 0.05; // 5%
  
  // Penalties for negative relationships
  if (tier.threshold <= RELATIONSHIP_TIERS.WARY.threshold) return -0.1; // 10% markup
  if (tier.threshold <= RELATIONSHIP_TIERS.ENEMY.threshold) return -0.25; // 25% markup
  
  return 0; // No discount or penalty
};

/**
 * Check if a trait can be learned based on relationship
 */
export const canLearnTrait = (relationshipValue, traitRarity) => {
  const tier = getRelationshipTier(relationshipValue);
  
  switch(traitRarity) {
    case 'Common':
      return tier.threshold >= RELATIONSHIP_TIERS.FRIEND.threshold;
    case 'Uncommon':
      return tier.threshold >= RELATIONSHIP_TIERS.ALLY.threshold;
    case 'Rare':
      return tier.threshold >= RELATIONSHIP_TIERS.ALLY.threshold;
    case 'Epic':
    case 'Legendary':
      return tier.threshold >= RELATIONSHIP_TIERS.DEVOTED.threshold;
    default:
      return tier.threshold >= RELATIONSHIP_TIERS.FRIEND.threshold;
  }
};