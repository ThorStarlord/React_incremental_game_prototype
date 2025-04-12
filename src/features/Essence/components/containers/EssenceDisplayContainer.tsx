/**
 * @file EssenceDisplayContainer.tsx
 * @description Container component for displaying player essence.
 * Connects to the Redux store to fetch essence data and passes it to the EssenceDisplay UI component.
 */
import React from 'react';
import { useAppSelector } from '../../../../app/hooks';
import { selectCurrentEssence, selectMaxEssence } from '../../state/EssenceSelectors'; // Assuming these selectors exist
import EssenceDisplay from '../ui/EssenceDisplay'; // Import the UI component

/**
 * EssenceDisplayContainer Component
 *
 * Fetches current and max essence from the Redux store and renders the
 * EssenceDisplay component with the fetched data.
 */
const EssenceDisplayContainer: React.FC = () => {
  // Select the necessary data from the Redux store
  // Ensure these selectors are correctly defined in EssenceSelectors.ts
  const currentEssence = useAppSelector(selectCurrentEssence);
  const maxEssence = useAppSelector(selectMaxEssence);

  // Render the UI component, passing the data as props
  return <EssenceDisplay currentEssence={currentEssence} maxEssence={maxEssence} />;
};

export default EssenceDisplayContainer;
