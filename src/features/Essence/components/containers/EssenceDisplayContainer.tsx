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
 * Fetches current and max essence from the Redux store and renders the
 * EssenceDisplayUI component with the fetched data.
 */
const EssenceDisplayContainer: React.FC = React.memo(() => {
  // Sync generation rate and start auto-generation interval
  useEssenceGeneration();
  // useAutoGenerateEssence(); // Auto-generation is now handled within useEssenceGeneration
  
  // Select the current essence amount from the Redux store
  const currentEssence = useAppSelector(selectCurrentEssence);
  
  // Since there's no maxEssence in the current system, use a reasonable default
  // or remove the maxEssence prop if EssenceDisplayUI doesn't need it
  const maxEssence = 1000; // Default max for display purposes

  // Render the UI component, passing the data as props
  return <EssenceDisplayUI currentEssence={currentEssence} maxEssence={maxEssence} />;
});

EssenceDisplayContainer.displayName = 'EssenceDisplayContainer';

export default EssenceDisplayContainer;
