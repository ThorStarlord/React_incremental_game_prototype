import { useContext, useMemo } from 'react';
import { useGameState } from '../../context';

/**
 * A custom hook that calculates and provides trait effects based on equipped traits
 * @returns {Object} Object containing modifiers and helper functions
 */
const useTraitEffects = () => {
  const { player, traits } = useGameState();

  // Calculate trait modifiers using memoization for performance
  const modifiers = useMemo(() => {
    // Initialize mods with default values
    const mods = {
      attackPower: 0,
      defense: 0,
      healthRegen: 0,
      critChance: 0,
      dodgeChance: 0,
      // Add other default modifiers as needed
    };
    
    // If no equipped traits or trait data, return default modifiers
    if (!player?.equippedTraits || !traits?.copyableTraits) {
      return mods;
    }
    
    // Get all active traits (equipped and permanent)
    const allTraits = [
      ...(Array.isArray(player.equippedTraits) ? player.equippedTraits : []),
      ...(Array.isArray(player.permanentTraits) ? player.permanentTraits : [])
    ];
    
    // Process each trait
    allTraits.forEach(traitId => {
      const trait = traits.copyableTraits[traitId];
      if (!trait) return; // Skip if trait doesn't exist
      
      // Apply standard effects from trait definition
      if (trait.effects) {
        Object.entries(trait.effects).forEach(([key, value]) => {
          if (mods[key] !== undefined) {
            mods[key] += value;
          }
        });
      }
      
      // Apply special trait effects based on trait ID
      switch (traitId) {
        case 'Stealth':
          // Stealth adds dodge chance
          mods.dodgeChance += 0.15;
          break;
          
        case 'BattleHardened':
          // Additional attack bonus based on player level
          const levelBonus = (player.level || 1) * 0.01;
          mods.attackPower += levelBonus;
          break;
          
        default:
          // No special effect for this trait
          break;
      }
    });
    
    return mods;
  }, [player?.equippedTraits, player?.permanentTraits, player?.level, player?.gold, player?.totalEssenceEarned, player?.highestRelationship, traits?.copyableTraits]);
  
  /**
   * Calculates the modified value for a stat based on applicable modifiers
   * @param {string} statType - Type of stat to modify
   * @param {number} baseValue - Original value of the stat
   * @returns {number} - Modified value after applying traits
   */
  const getModifiedStat = (statType, baseValue) => {
    if (baseValue === undefined || baseValue === null) return 0;
    
    let result = baseValue;
    
    switch (statType) {
      case 'attack':
        result *= (1 + modifiers.attackPower);
        break;
      case 'defense':
        result *= (1 + modifiers.defense);
        break;
      case 'xpGain':
        result *= modifiers.xpMultiplier;
        break;
      case 'goldGain':
        result *= modifiers.goldMultiplier;
        break;
      case 'essenceGain':
        result *= modifiers.essenceGainMultiplier;
        break;
      case 'relationshipGain':
        result *= modifiers.relationshipGainMultiplier;
        break;
      case 'shopPrice':
        result *= (1 - modifiers.shopDiscount);
        break;
      default:
        // No modification for unknown stat types
        break;
    }
    
    // Round to 2 decimal places for display purposes
    return Math.round(result * 100) / 100;
  };
  
  /**
   * Checks if a trait effect triggers based on chance
   * @param {string} effectType - Type of effect to check
   * @returns {boolean} - Whether the effect triggers
   */
  const checkTraitEffectTrigger = (effectType) => {
    switch (effectType) {
      case 'dodge':
        return Math.random() < modifiers.dodgeChance;
      case 'criticalHit':
        return Math.random() < modifiers.criticalChance;
      case 'essenceSiphon':
        return Math.random() < modifiers.essenceSiphonChance;
      default:
        return false;
    }
  };
  
  /**
   * Gets effects relevant for a particular game scenario
   * @param {string} scenario - Game scenario (combat, shop, etc.)
   * @returns {Object} - Relevant modifiers for that scenario
   */
  const getEffectsForScenario = (scenario) => {
    switch (scenario) {
      case 'combat':
        return {
          attackBonus: modifiers.attackPower,
          defenseBonus: modifiers.defense,
          dodgeChance: modifiers.dodgeChance,
          criticalChance: modifiers.criticalChance,
          criticalDamage: modifiers.criticalDamage,
          essenceSiphonChance: modifiers.essenceSiphonChance
        };
      case 'shop':
        return {
          discount: modifiers.shopDiscount
        };
      case 'social':
        return {
          relationshipGainMultiplier: modifiers.relationshipGainMultiplier
        };
      case 'rewards':
        return {
          goldMultiplier: modifiers.goldMultiplier,
          xpMultiplier: modifiers.xpMultiplier,
          essenceGainMultiplier: modifiers.essenceGainMultiplier
        };
      default:
        return modifiers;
    }
  };
  
  /**
   * Gets additional stat points from traits
   * @returns {number} - Number of additional stat points
   */
  const getAdditionalStatPoints = () => {
    return modifiers.statPointBonus;
  };
  
  // Return the hook's API
  return {
    modifiers,
    getModifiedStat,
    checkTraitEffectTrigger,
    getEffectsForScenario,
    getAdditionalStatPoints
  };
};

export default useTraitEffects;