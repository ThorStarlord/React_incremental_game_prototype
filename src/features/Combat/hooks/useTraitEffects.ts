import { useMemo } from 'react';
import { useGameState } from '../../../context/GameStateExports';
import '../../../constants/GameStateTypes'; // Import our type extensions

// Add interface for trait effects
interface TraitEffect {
  attackBonus?: number;
  defenseBonus?: number;
  dodgeChance?: number;
  criticalChance?: number;
  criticalDamage?: number;
  essenceSiphonChance?: number;
  xpMultiplier?: number;
  goldMultiplier?: number;
  [key: string]: number | undefined;
}

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
        // Convert trait.effects to the correct type - could be an array or object
        const effectsObj: TraitEffect = Array.isArray(trait.effects) 
          ? trait.effects.reduce((acc, effect) => ({ ...acc, ...effect }), {})
          : trait.effects as TraitEffect;
        
        // Now access properties from the correctly typed object
        if (effectsObj.attackBonus) mods.attackBonus += effectsObj.attackBonus;
        if (effectsObj.defenseBonus) mods.defenseBonus += effectsObj.defenseBonus;
        if (effectsObj.dodgeChance) mods.dodgeChance += effectsObj.dodgeChance;
        if (effectsObj.criticalChance) mods.criticalChance += effectsObj.criticalChance;
        if (effectsObj.criticalDamage) mods.criticalDamage += effectsObj.criticalDamage;
        if (effectsObj.essenceSiphonChance) mods.essenceSiphonChance += effectsObj.essenceSiphonChance;
        if (effectsObj.xpMultiplier) mods.xpMultiplier *= effectsObj.xpMultiplier;
        if (effectsObj.goldMultiplier) mods.goldMultiplier *= effectsObj.goldMultiplier;
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
