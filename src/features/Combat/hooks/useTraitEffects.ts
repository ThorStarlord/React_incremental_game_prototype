import { useMemo } from 'react';
import { useGameState } from '../../../context/GameStateExports';
import '../../../constants/GameStateTypes'; // Import our type extensions

/**
 * Hook to calculate trait effects for combat
 */
const useTraitEffects = () => {
  const { player, traits } = useGameState();

  // Calculate modifiers based on equipped traits
  const modifiers = useMemo(() => {
    const mods = {
      attackBonus: 0,
      defenseBonus: 0,
      dodgeChance: 0,
      criticalChance: 0,
      criticalDamage: 0,
      essenceSiphonChance: 0,
      xpMultiplier: 1,
      goldMultiplier: 1
    };
    
    // If no equipped traits, return default modifiers
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
      // Fix the type by using a type assertion or indexing with a safe approach
      const trait = traits.copyableTraits[traitId as keyof typeof traits.copyableTraits];
      if (!trait) return;
      
      // Apply effects from trait
      if (trait.effects) {
        if (trait.effects.attackBonus) mods.attackBonus += trait.effects.attackBonus;
        if (trait.effects.defenseBonus) mods.defenseBonus += trait.effects.defenseBonus;
        if (trait.effects.dodgeChance) mods.dodgeChance += trait.effects.dodgeChance;
        if (trait.effects.criticalChance) mods.criticalChance += trait.effects.criticalChance;
        if (trait.effects.criticalDamage) mods.criticalDamage += trait.effects.criticalDamage;
        if (trait.effects.essenceSiphonChance) mods.essenceSiphonChance += trait.effects.essenceSiphonChance;
        if (trait.effects.xpMultiplier) mods.xpMultiplier *= trait.effects.xpMultiplier;
        if (trait.effects.goldMultiplier) mods.goldMultiplier *= trait.effects.goldMultiplier;
      }
    });
    
    return mods;
  }, [player?.equippedTraits, player?.permanentTraits, traits?.copyableTraits]);

  // Calculate player's combat stats including trait bonuses
  const calculatedStats = useMemo(() => {
    // Base stats
    const baseAttack = player?.stats?.attack || 10;
    const baseDefense = player?.stats?.defense || 5;
    
    // Apply trait modifiers
    return {
      attack: Math.floor(baseAttack * (1 + modifiers.attackBonus)),
      defense: Math.floor(baseDefense * (1 + modifiers.defenseBonus))
    };
  }, [player?.stats, modifiers]);

  return {
    modifiers,
    calculatedStats
  };
};

export default useTraitEffects;
