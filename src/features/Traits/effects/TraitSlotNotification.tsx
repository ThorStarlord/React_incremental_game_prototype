import React from 'react';
import './TraitSlotNotification.css';

/**
 * Props for the TraitSlotNotification component
 */
interface TraitSlotNotificationProps {
    /** The message to display in the notification */
    message: string;
    /** Whether the notification should be visible */
    isVisible: boolean;
}

/**
 * Component that displays a notification when trait slots change
 * 
 * @param props Component props
 * @returns React component or null when not visible
 */
const TraitSlotNotification: React.FC<TraitSlotNotificationProps> = ({ message, isVisible }) => {
    if (!isVisible) return null;

    return (
        <div className="trait-slot-notification">
            {message}
        </div>
    );
};

export default TraitSlotNotification;
