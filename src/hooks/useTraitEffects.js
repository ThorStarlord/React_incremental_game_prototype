import { useContext, useMemo } from 'react';
import { GameStateContext } from '../context/GameStateContext';

const useTraitEffects = () => {
  const { player, traits } = useContext(GameStateContext);

  const activeEffects = useMemo(() => {
    if (!player?.equippedTraits || !traits?.copyableTraits) return [];

    return player.equippedTraits.map(traitId => {
      const trait = traits.copyableTraits[traitId];
      if (!trait) return null;

      let effectDescription = '';

      switch(traitId) {
        case 'BargainingMaster':
          effectDescription = '5% Shop Discount';
          break;
        case 'QuickLearner':
          effectDescription = '10% More XP';
          break;
        case 'MentorsInsight':
          effectDescription = '+1 Stat Point on Level Up';
          break;
        case 'BattleHardened':
          effectDescription = '+10% Attack Damage, +5% Defense';
          break;
        case 'EssenceSiphon':
          effectDescription = '5% chance to gain essence on hit';
          break;
        default:
          effectDescription = trait?.description || '';
      }

      return {
        id: traitId,
        name: trait.name || '',
        description: trait.description || '',
        type: trait.type || 'Unknown',
        effect: effectDescription
      };
    }).filter(Boolean); // Remove null entries
  }, [player?.equippedTraits, traits?.copyableTraits]);

  const modifiers = useMemo(() => {
    const mods = {
      shopDiscount: 0,
      xpMultiplier: 1,
      statPointBonus: 0,
      attackBonus: 0,
      defenseBonus: 0,
      essenceSiphonChance: 0
    };

    if (!player?.equippedTraits) return mods;

    player.equippedTraits.forEach(traitId => {
      switch(traitId) {
        case 'BargainingMaster':
          mods.shopDiscount += 0.05;
          break;
        case 'QuickLearner':
          mods.xpMultiplier += 0.1;
          break;
        case 'MentorsInsight':
          mods.statPointBonus += 1;
          break;
        case 'BattleHardened':
          mods.attackBonus += 0.10;
          mods.defenseBonus += 0.05;
          break;
        case 'EssenceSiphon':
          mods.essenceSiphonChance += 0.05;
          break;
        default:
          break;
      }
    });

    return mods;
  }, [player?.equippedTraits]);

  const calculatedStats = useMemo(() => {
    return {
      attack: Math.floor((player?.attack || 0) * (1 + modifiers.attackBonus)),
      defense: Math.floor((player?.defense || 0) * (1 + modifiers.defenseBonus))
    };
  }, [player?.attack, player?.defense, modifiers.attackBonus, modifiers.defenseBonus]);

  return {
    activeEffects,
    modifiers,
    calculatedStats
  };
};

export default useTraitEffects;