import { useContext, useMemo } from 'react';
import { GameStateContext } from '../context/GameStateContext';

/**
 * A custom hook that calculates and provides trait effects based on equipped traits
 * @returns {Object} Object containing modifiers and helper functions
 */
const useTraitEffects = () => {
  const { player, traits } = useContext(GameStateContext);

  // Calculate trait modifiers using memoization for performance
  const modifiers = useMemo(() => {
    // Initialize default modifiers
    const mods = { 
      // Combat modifiers
      attackBonus: 0,
      defenseBonus: 0,
      dodgeChance: 0,
      criticalChance: 0,
      criticalDamage: 0,
      
      // Resource modifiers
      goldMultiplier: 1,
      essenceGainMultiplier: 1,
      xpMultiplier: 1,
      shopDiscount: 0,
      
      // Social modifiers
      relationshipGainMultiplier: 1,
      
      // Special effects
      essenceSiphonChance: 0,
      statPointBonus: 0
    };
    
    // If no equipped traits or trait data, return default modifiers
    if (!player?.equippedTraits || !traits?.copyableTraits) {
      return mods;
    }
    
    // Get all active traits (equipped and permanent)
    const allTraits = [
      ...(player.equippedTraits || []),
      ...(player.permanentTraits || [])
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
          mods.attackBonus += levelBonus;
          break;
          
        case 'QuickLearner':
          // XP bonus increases with player level
          mods.xpMultiplier += (player.level || 1) * 0.005;
          break;
          
        case 'EssenceSiphon':
          // Essence siphon chance increases with essence gained
          if (player.totalEssenceEarned > 1000) {
            mods.essenceSiphonChance += 0.02;
          }
          break;
          
        case 'RelationshipSage':
          // Better at higher relationship levels
          const hasHighRelationship = player.highestRelationship > 70;
          if (hasHighRelationship) {
            mods.relationshipGainMultiplier += 0.1;
          }
          break;
          
        case 'EssenceFlow':
          // Better with more traits
          const traitCount = allTraits.length;
          if (traitCount > 3) {
            mods.essenceGainMultiplier += (traitCount - 3) * 0.02;
          }
          break;
          
        case 'BargainingMaster':
          // Shop discount increases with gold owned
          if (player.gold > 1000) {
            mods.shopDiscount += 0.02;
          }
          break;
          
        default:
          // No special handling for other traits
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
        result *= (1 + modifiers.attackBonus);
        break;
      case 'defense':
        result *= (1 + modifiers.defenseBonus);
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
          attackBonus: modifiers.attackBonus,
          defenseBonus: modifiers.defenseBonus,
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

// Example usage in a Combat component
import React from 'react';
import useTraitEffects from '../hooks/useTraitEffects';

const Combat = () => {
  const { modifiers, checkTraitEffectTrigger, getModifiedStat } = useTraitEffects();
  
  const handleAttack = () => {
    // Check if player dodges based on trait effects
    if (checkTraitEffectTrigger('dodge')) {
      console.log('You dodged the attack!');
    }
    
    // Apply attack bonus from traits
    const baseAttack = 10;
    const modifiedAttack = getModifiedStat('attack', baseAttack);
    console.log(`Attack power: ${baseAttack} → ${modifiedAttack}`);
  };
  
  return (
    <div>
      <h2>Combat</h2>
      {modifiers.dodgeChance > 0 && (
        <p>Dodge chance: {(modifiers.dodgeChance * 100).toFixed(1)}%</p>
      )}
      <button onClick={handleAttack}>Attack</button>
    </div>
  );
};

// Example usage in a LevelUp component
import React from 'react';
import useTraitEffects from '../hooks/useTraitEffects';

const LevelUp = () => {
  const { getAdditionalStatPoints } = useTraitEffects();
  const baseStatPoints = 3;
  const additionalPoints = getAdditionalStatPoints();
  
  return (
    <div>
      <h2>Level Up!</h2>
      <p>
        Stat Points Available: {baseStatPoints}
        {additionalPoints > 0 && (
          <span style={{ color: 'green' }}> +{additionalPoints} (from traits)</span>
        )}
      </p>
    </div>
  );
};