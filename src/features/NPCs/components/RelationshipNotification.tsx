import React from 'react';

interface RelationshipNotificationProps {
  npcName?: string;
  oldLevel?: string;
  newLevel?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

/**
 * RelationshipNotification Component
 * 
 * Displays notifications about relationship changes with NPCs
 * 
 * @param {string} npcName - Name of the NPC
 * @param {string} oldLevel - Previous relationship level
 * @param {string} newLevel - New relationship level
 * @param {boolean} isOpen - Whether the notification is visible
 * @param {Function} onClose - Function to call when notification is closed
 * @returns {JSX.Element} The rendered component
 */
const RelationshipNotification: React.FC<RelationshipNotificationProps> = ({
  npcName = "",
  oldLevel = "",
  newLevel = "",
  isOpen = false,
  onClose = () => {}
}) => {
  if (!isOpen) return null;
  
  return (
    <div className="relationship-notification">
      <div className="notification-content">
        <h4>Relationship Level Up!</h4>
        <p>Your relationship with <strong>{npcName}</strong> has improved from <em>{oldLevel}</em> to <em>{newLevel}</em>!</p>
        <button onClick={onClose}>Acknowledge</button>
      </div>
    </div>
  );
};

export default RelationshipNotification;
