import React from 'react';
import './AchievementsList.css';

/**
 * @component AchievementsList
 * @description Displays a list of player achievements with their details
 * 
 * @param {Object} props - Component props
 * @param {Array} props.achievements - Array of achievement objects
 * @param {boolean} [props.showLocked=true] - Whether to display locked achievements
 * 
 * @returns {JSX.Element} Rendered achievements list
 */
const AchievementsList = ({ achievements, showLocked = true }) => {
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
