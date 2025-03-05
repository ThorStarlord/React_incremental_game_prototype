import React from 'react';
import './AchievementsList.css';

/**
 * Interface for Achievement objects
 */
interface Achievement {
    /** Unique identifier for the achievement */
    id: string;
    /** Title/name of the achievement */
    title: string;
    /** Detailed description of the achievement */
    description: string;
    /** Whether the achievement has been unlocked */
    unlocked: boolean;
    /** Optional icon to display with the achievement */
    icon?: string;
    /** Date when the achievement was unlocked (if applicable) */
    dateUnlocked?: string | Date;
    /** Progress towards unlocking (percentage, 0-100) */
    progress?: number;
}

/**
 * Props for the AchievementsList component
 */
interface AchievementsListProps {
    /** Array of achievement objects to display */
    achievements: Achievement[];
    /** Whether to display locked achievements */
    showLocked?: boolean;
}

/**
 * @component AchievementsList
 * @description Displays a list of player achievements with their details
 * 
 * @returns {JSX.Element} Rendered achievements list
 */
const AchievementsList: React.FC<AchievementsListProps> = ({ 
    achievements, 
    showLocked = true 
}) => {
    // Filter achievements based on showLocked preference
    const filteredAchievements = showLocked 
        ? achievements 
        : achievements.filter(achievement => achievement.unlocked);

    return (
        <div className="achievements-list">
            {filteredAchievements.length === 0 ? (
                <p className="no-achievements">No achievements to display</p>
            ) : (
                <ul>
                    {filteredAchievements.map(achievement => (
                        <li 
                            key={achievement.id} 
                            className={`achievement-item ${achievement.unlocked ? 'unlocked' : 'locked'}`}
                        >
                            <div className="achievement-icon">
                                {achievement.icon || '🏆'}
                            </div>
                            <div className="achievement-details">
                                <h4>{achievement.title}</h4>
                                <p>{achievement.description}</p>
                                {achievement.unlocked && achievement.dateUnlocked && (
                                    <span className="date-unlocked">
                                        Unlocked: {new Date(achievement.dateUnlocked).toLocaleDateString()}
                                    </span>
                                )}
                                {!achievement.unlocked && achievement.progress && (
                                    <div className="achievement-progress">
                                        <div 
                                            className="progress-indicator" 
                                            style={{ width: `${achievement.progress}%` }}
                                        />
                                        <span>{achievement.progress}%</span>
                                    </div>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AchievementsList;
