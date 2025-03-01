import React, { useState, useEffect } from 'react';
import { usePlayerStats } from '../../hooks/usePlayerStats';
import StatDisplay from '../ui/StatDisplay';
import ProgressBar from '../ui/ProgressBar';
import AchievementsList from '../ui/AchievementsList';
import './Progression.css';

/**
 * @component Progression
 * @description A comprehensive player progression tracking component that displays:
 *  - Current player level and experience
 *  - Core stats with visual progress indicators
 *  - Recent stat improvements
 *  - Achievements and milestones
 *  - Historical progression data
 * 
 * This component serves as the central hub for viewing all player advancement
 * metrics and accomplishments throughout the game.
 * 
 * @returns {JSX.Element} The rendered progression tracking interface
 */
const Progression = () => {
    const { stats, level, experience, totalExperience, achievements } = usePlayerStats();
    const [showHistory, setShowHistory] = useState(false);
    const [selectedStat, setSelectedStat] = useState(null);
    
    // Calculate next level threshold (example formula)
    const nextLevelThreshold = Math.floor(1000 * Math.pow(1.2, level));
    const experienceProgress = (experience / nextLevelThreshold) * 100;
    
    /**
     * Toggles the historical view for a specific stat
     * @param {string} statId - The ID of the stat to show history for
     */
    const toggleStatHistory = (statId) => {
        setSelectedStat(selectedStat === statId ? null : statId);
    };

    /**
     * Formats the stat growth as a percentage or raw value
     * @param {Object} stat - The stat object containing growth data
     * @returns {string} Formatted growth representation
     */
    const formatStatGrowth = (stat) => {
        if (!stat.growth) return 'N/A';
        return stat.isPercentage ? `+${stat.growth}%` : `+${stat.growth}`;
    };

    return (
        <div className="progression-container">
            <h2>Player Progression</h2>
            
            {/* Level and XP Section */}
            <div className="level-section">
                <h3>Level {level}</h3>
                <ProgressBar 
                    progress={experienceProgress} 
                    label={`XP: ${experience}/${nextLevelThreshold}`} 
                />
                <p className="total-xp">Total XP earned: {totalExperience}</p>
            </div>
            
            {/* Stats Section with Enhanced Display */}
            <div className="stats-section">
                <h3>Character Stats</h3>
                <div className="stats-display">
                    {stats.map(stat => (
                        <div key={stat.id} className="stat-wrapper">
                            <StatDisplay stat={stat} />
                            {stat.growth > 0 && (
                                <div className="stat-growth" title="Recent improvement">
                                    {formatStatGrowth(stat)}
                                </div>
                            )}
                            <button 
                                className="history-toggle"
                                onClick={() => toggleStatHistory(stat.id)}
                            >
                                {selectedStat === stat.id ? 'Hide History' : 'Show History'}
                            </button>
                            
                            {selectedStat === stat.id && (
                                <div className="stat-history">
                                    {/* Would display historical progression chart/data */}
                                    <p>Historical progression would appear here</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Achievements Section */}
            {achievements && achievements.length > 0 && (
                <div className="achievements-section">
                    <h3>Milestones & Achievements</h3>
                    <AchievementsList achievements={achievements} />
                </div>
            )}
            
            <div className="progress-controls">
                <button 
                    className="toggle-history-btn"
                    onClick={() => setShowHistory(!showHistory)}
                >
                    {showHistory ? 'Hide Detailed History' : 'Show Detailed History'}
                </button>
            </div>
            
            {/* Detailed History View (conditionally rendered) */}
            {showHistory && (
                <div className="detailed-history">
                    <h3>Character Development History</h3>
                    <p>Detailed progression history would be displayed here</p>
                </div>
            )}
        </div>
    );
};

export default Progression;