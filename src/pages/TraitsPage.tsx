import React from 'react';
// Update import path and name for the container component
import TraitSystemContainer from '../features/Traits/components/containers/TraitSystemContainer';

/**
 * TraitsPage Component
 *
 * This page serves as the entry point for the Traits feature.
 * It renders the TraitSystemContainer, which is the "smart" component
 * responsible for fetching data and handling all the logic for the trait system.
 *
 * This follows the Page/Feature-Container/UI-Component pattern.
 */
const TraitsPage: React.FC = () => {
  // The container component is self-sufficient and fetches its own data.
  return <TraitSystemContainer />;
};

export default TraitsPage;