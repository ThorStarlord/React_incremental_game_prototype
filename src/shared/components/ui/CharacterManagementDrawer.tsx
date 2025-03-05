import React from 'react';

interface CharacterManagementDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  title?: string;
}

/**
 * CharacterManagementDrawer Component
 * 
 * A sidebar drawer for character management screens
 * 
 * @param {boolean} isOpen - Whether the drawer is visible
 * @param {Function} onClose - Handler for closing the drawer
 * @param {ReactNode} children - Content to display inside the drawer
 * @param {string} title - Optional title for the drawer
 * @returns {JSX.Element} The rendered component
 */
const CharacterManagementDrawer: React.FC<CharacterManagementDrawerProps> = ({
  isOpen,
  onClose,
  children,
  title = "Character Management"
}) => {
  if (!isOpen) return null;
  
  return (
    <div className="character-management-drawer">
      <div className="drawer-backdrop" onClick={onClose} />
      <div className="drawer-content">
        <div className="drawer-header">
          <h3>{title}</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="drawer-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default CharacterManagementDrawer;
