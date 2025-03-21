import React from 'react';
import TraitEffectDialog from '../containers/TraitEffectDialog';
import TraitEffectAnimation from '../containers/TraitEffectAnimation';
import { TraitEffect } from '../../hooks/useBattleEffects';

interface EffectsDisplayProps {
  traitEffect: TraitEffect | null;
  animationEffect: TraitEffect | null;
  mousePos: { x: number | string; y: number | string };
  onCloseDialog: () => void;
}

const EffectsDisplay: React.FC<EffectsDisplayProps> = ({
  traitEffect,
  animationEffect,
  mousePos,
  onCloseDialog
}) => {
  return (
    <>
      {/* Effect dialog */}
      <TraitEffectDialog 
        open={Boolean(traitEffect)}
        onClose={onCloseDialog}
        effect={traitEffect}
      />
      
      {/* Animated effect */}
      {animationEffect && (
        <TraitEffectAnimation 
          effect={animationEffect}
          position={mousePos}
        />
      )}
    </>
  );
};

export default EffectsDisplay;
