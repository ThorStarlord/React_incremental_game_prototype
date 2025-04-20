/**
 * @file EssenceDisplayContainer.tsx
 * @description Container component for displaying player essence.
 * Connects to the Redux store to fetch essence data and passes it to the EssenceDisplay UI component.
 */
import React from 'react';
import { useAppSelector } from '../../../../app/hooks';
// Correct the imported selector names
import { selectEssenceAmount, selectEssenceMaxAmount } from '../../state/EssenceSelectors'; 
import EssenceDisplay from '../ui/EssenceDisplay'; // Import the UI component
import useEssenceGeneration, { useAutoGenerateEssence } from '../../hooks/useEssenceGeneration';

/**
 * EssenceDisplayContainer Component
 *
 * Fetches current and max essence from the Redux store and renders the
 * EssenceDisplay component with the fetched data.
 */
const EssenceDisplayContainer: React.FC = () => {
  // Sync generation rate and start auto-generation interval
  useEssenceGeneration();
  useAutoGenerateEssence();
  
  // Select the necessary data from the Redux store
  const currentEssence = useAppSelector(selectEssenceAmount);
  const maxEssence = useAppSelector(selectEssenceMaxAmount);

  // Render the UI component, passing the data as props
  // Provide a default value (e.g., 1000) for maxEssence if it's undefined
  return <EssenceDisplay currentEssence={currentEssence} maxEssence={maxEssence ?? 1000} />;
};

export default EssenceDisplayContainer;
