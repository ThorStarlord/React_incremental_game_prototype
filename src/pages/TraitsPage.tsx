import React from 'react';
import { TraitSystemUI } from '../features/Traits';

/**
 * @fileoverview TraitsPage Component - Manages and displays character traits
 * @module TraitsPage
 */

/**
 * TraitsPage Component
 * 
 * @description Renders the trait management interface of the Incremental RPG game.
 * This component allows players to view available traits and assign them to trait slots.
 * Traits can modify various character attributes, abilities, or game mechanics.
 * 
 * The page is divided into two main sections:
 * 1. TraitSlots - Shows the active trait slots and currently equipped traits
 * 2. TraitListContainer - Displays all acquired traits that can be leveled up
 * 
 * @component
 * @example
 * return (
 *   <TraitsPage />
 * )
 * 
 * @returns {JSX.Element} A page displaying trait management interface using MUI
 */
const TraitsPage: React.FC = () => {
  return <TraitSystemUI />;
};

export default TraitsPage;
