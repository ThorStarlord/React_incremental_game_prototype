import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import GameContainer from '../../layout/components/GameContainer';
import BreadcrumbNav from '../../shared/components/ui/BreadcrumbNav';
import EssenceDisplay from '../../features/Essence/components/ui/EssenceDisplay';
import RelationshipNotification from '../../features/NPCs/components/RelationshipNotification';
import TraitEffectNotification from '../../features/Traits/components/containers/TraitEffectNotification';
import CharacterTabBar from '../../shared/components/ui/CharacterTabBar';
import CharacterManagementDrawer from '../../shared/components/ui/CharacterManagementDrawer';
import useEssenceGeneration from '../../features/Essence/hooks/useEssenceGeneration';
import useTraitNotifications from '../../features/Traits/hooks/useTraitNotifications';
import useMinionSimulation from '../../features/Minions/hooks/useMinionSimulation';

/**
 * Game layout component that wraps game-related routes with common UI elements
 * @returns Layout with common game UI and outlet for nested routes
 */
export const GameLayout: React.FC = () => {
  // Initialize hooks for game systems
  useEssenceGeneration();
  useTraitNotifications();
  useMinionSimulation();
  
  // Handle trait effect notification dismissal
  const handleDismissTraitEffect = () => {
    // Implement dismissal logic if needed
    console.log('Trait effect notification dismissed');
  };
  
  return (
    <GameContainer>
      <BreadcrumbNav />
      {/* Remove position prop as it's not part of EssenceDisplayProps */}
      <EssenceDisplay />
      <RelationshipNotification />
      <TraitEffectNotification onDismiss={handleDismissTraitEffect} />
      <Outlet /> {/* Nested routes will render here */}
    </GameContainer>
  );
};

/**
 * Character management layout with character tab bar
 * @returns Layout with character UI elements
 */
export const CharacterLayout: React.FC = () => {
  // State for character tab bar - using string IDs instead of numeric indices
  const [activeTab, setActiveTab] = useState('stats');
  const tabs = [
    { id: 'stats', label: 'Stats', icon: 'assessment' },
    { id: 'inventory', label: 'Inventory', icon: 'inventory_2' },
    { id: 'skills', label: 'Skills', icon: 'auto_awesome' }
  ];
  
  // State for character management drawer
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  // Updated to handle string tab IDs instead of numeric indices
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };
  
  return (
    <>
      <CharacterTabBar 
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
      <CharacterManagementDrawer 
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
      <Outlet />
    </>
  );
};
