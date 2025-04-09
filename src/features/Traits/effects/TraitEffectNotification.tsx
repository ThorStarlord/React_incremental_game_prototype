import React from 'react';
import './TraitEffectNotification.css';

/**
 * Props for the TraitEffectNotification component
 */
interface TraitEffectNotificationProps {
    /** The message to display in the notification */
    message: string;
    /** Whether the notification should be visible */
    isVisible: boolean;
}

/**
 * Component that displays a notification when trait effects are triggered
 * 
 * @param props Component props
 * @returns React component or null when not visible
 */
const TraitEffectNotification: React.FC<TraitEffectNotificationProps> = ({ message, isVisible }) => {
    if (!isVisible) return null;

    return (
        <div className="trait-effect-notification">
            {message}
        </div>
    );
};

export default TraitEffectNotification;
