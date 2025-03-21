import { useState } from 'react';

// Define the TraitEffect interface
export interface TraitEffect {
  traitName: string;
  description: string;
  value: string | number;
}

/**
 * Hook to manage battle effects and animations
 */
export const useBattleEffects = () => {
  const [traitEffect, setTraitEffect] = useState<TraitEffect | null>(null);
  const [animationEffect, setAnimationEffect] = useState<TraitEffect | null>(null);
  const [mousePos, setMousePos] = useState<{x: number | string, y: number | string}>({ x: '50%', y: '50%' });

  /**
   * Show a trait effect with animation
   */
  const showTraitEffect = (effect: TraitEffect) => {
    setTraitEffect(effect);
    setAnimationEffect(effect);
    setTimeout(() => setAnimationEffect(null), 1500);
  };

  /**
   * Track mouse position for animations
   */
  const updateMousePosition = (x: number | string, y: number | string) => {
    setMousePos({ x, y });
  };

  return {
    traitEffect,
    animationEffect,
    mousePos,
    showTraitEffect,
    setTraitEffect,
    updateMousePosition
  };
};

export default useBattleEffects;
