/**
 * @file EssenceDisplayContainer.tsx
 * @description Container component for displaying player essence.
 * Connects to the Redux store to fetch essence data and passes it to the EssenceDisplayUI UI component.
 */
import React from 'react';
import { useAppSelector } from '../../../../app/hooks';
import { selectCurrentEssence } from '../../state/EssenceSelectors'; 
import EssenceDisplayUI from '../ui/EssenceDisplayUI';
import useEssenceGeneration from '../../hooks/useEssenceGeneration';

/**
 * EssenceDisplayContainer Component
 *
 * Fetches the uncapped current Essence amount and renders the UI without
 * inventing a maximum not present in the canonical Essence state.
 */
const EssenceDisplayContainer: React.FC = React.memo(() => {
  // Sync generation rate and start auto-generation interval
  useEssenceGeneration();
  // useAutoGenerateEssence(); // Auto-generation is now handled within useEssenceGeneration
  
  // Select the current essence amount from the Redux store
  const currentEssence = useAppSelector(selectCurrentEssence);
  

  // Render the UI component, passing the data as props
  return <EssenceDisplayUI currentEssence={currentEssence} />;
});

EssenceDisplayContainer.displayName = 'EssenceDisplayContainer';

export default EssenceDisplayContainer;
