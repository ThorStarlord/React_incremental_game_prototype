import React, { useState } from 'react';
import { useGameState } from '../../../../context/GameStateExports';
import { Faction as SystemFaction } from '../../../../context/types/gameStates/FactionGameStateTypes';
import './FactionOverview.css';

/**
 * Interface for Faction data used in our component
 */
interface Faction {
  id: string;
  name: string;
  description: string;
  relationship: number;
  reputation: number;
  unlocked: boolean;
  reputationTiers?: {
    threshold: number;
    name: string;
    benefits?: string[];
  }[];
  [key: string]: any;
}

/**
 * Interface for NextTierInfo
 */
interface NextTierInfo {
  name: string;
  current: number;
  target: number;
  progress: number;
}

/**
 * FactionOverview component
 * Shows information about all factions in the game
 */
const FactionOverview: React.FC = () => {
    // Use our context instead of Redux
    const gameState = useGameState();
    const [activeTab, setActiveTab] = useState<string>('overview');
    const [filter, setFilter] = useState<string>('all');
    const [sortBy, setSortBy] = useState<string>('name');
    
    // Get factions from game state - handle system faction type conversion
    const factions = gameState.factions?.factions || {};
    
    // Convert system factions to our component's faction type
    const factionsArray: Faction[] = Object.values(factions).map((systemFaction: SystemFaction): Faction => ({
        ...systemFaction, // Spread first to get all base properties
        relationship: 0, // Default value since relationship doesn't exist in SystemFaction
        reputation: 0, // Default value since reputation doesn't exist in SystemFaction
        unlocked: !systemFaction.hidden, // Use hidden property as inverse of unlocked
        // Add any other needed properties
    }));
    
    // Filter factions based on selected filter
    const filteredFactions = factionsArray.filter((faction: Faction) => {
        if (filter === 'all') return true;
        if (filter === 'unlocked') return faction.unlocked;
        if (filter === 'locked') return !faction.unlocked;
        return true;
    });
    
    // Apply sorting
    const sortedFactions = [...filteredFactions].sort((a: Faction, b: Faction) => {
        if (sortBy === 'name') {
            return a.name.localeCompare(b.name);
        } else if (sortBy === 'reputation') {
            return b.reputation - a.reputation;
        }
        return 0;
    });
    
    // Determine faction status for display
    const getFactionStatus = (faction: Faction): string => {
        if (!faction.unlocked) return 'Locked';
        
        const { reputationTiers } = faction;
        if (!reputationTiers || reputationTiers.length === 0) return 'Unknown';
        
        for (let i = reputationTiers.length - 1; i >= 0; i--) {
            if (faction.reputation >= reputationTiers[i].threshold) {
                return reputationTiers[i].name;
            }
        }
        
        return 'Unknown';
    };

    // Function to get next reputation tier and progress
    const getNextTier = (faction: Faction): NextTierInfo | null => {
        if (!faction.unlocked || !faction.reputationTiers) return null;
        
        const currentRep = faction.reputation;
        for (let i = 0; i < faction.reputationTiers.length; i++) {
            if (currentRep < faction.reputationTiers[i].threshold) {
                return {
                    name: faction.reputationTiers[i].name,
                    current: currentRep,
                    target: faction.reputationTiers[i].threshold,
                    progress: (currentRep / faction.reputationTiers[i].threshold) * 100
                };
            }
        }
        
        // Already at max tier
        return {
            name: 'Max Level',
            current: currentRep,
            target: currentRep,
            progress: 100
        };
    };

    // Calculate overall faction reputation score
    const calculateOverallScore = (): number => {
        const unlockedFactions = factionsArray.filter((f: Faction) => f.unlocked);
        if (unlockedFactions.length === 0) return 0;
        
        const totalRep = unlockedFactions.reduce((sum: number, f: Faction) => sum + Math.max(0, f.reputation), 0);
        return Math.floor(totalRep / unlockedFactions.length);
    };

    const renderOverviewTab = (): React.ReactElement => (
        <div className="factions-overview-tab">
            <div className="faction-overall-stats">
                <div className="overall-score">
                    <h3>Overall Reputation</h3>
                    <div className="score-value">{calculateOverallScore()}</div>
                </div>
                <div className="faction-stats">
                    <div className="stat-box">
                        <span className="stat-number">{factionsArray.filter((f: Faction) => f.unlocked).length}</span>
                        <span className="stat-label">Unlocked Factions</span>
                    </div>
                    <div className="stat-box">
                        <span className="stat-number">{factionsArray.filter((f: Faction) => !f.unlocked).length}</span>
                        <span className="stat-label">Locked Factions</span>
                    </div>
                    <div className="stat-box">
                        <span className="stat-number">
                            {factionsArray.filter((f: Faction) => f.unlocked && f.reputation >= 75).length}
                        </span>
                        <span className="stat-label">High Reputation</span>
                    </div>
                </div>
            </div>
            
            <h3>Factions</h3>
            <div className="sorting-filtering">
                {/* Sorting and Filtering controls */}
            </div>
            
            <div className="faction-cards">
                {/* Comment out FactionCard usage since it's not available */}
                {/*
                {sortedFactions.map((faction: Faction) => (
                    <FactionCard 
                        key={faction.id} 
                        faction={faction} 
                        status={getFactionStatus(faction)}
                        nextTier={getNextTier(faction)}
                    />
                ))}
                */}
                {/* Add a simple display of faction data instead */}
                {sortedFactions.map((faction: Faction) => (
                    <div key={faction.id} className="faction-card">
                        <h4>{faction.name}</h4>
                        <p>{faction.description}</p>
                        <p>Status: {getFactionStatus(faction)}</p>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderReputationTab = (): React.ReactElement => (
        <div className="faction-reputation-tab">
            <h3>Reputation Standings</h3>
            <table className="reputation-table">
                <thead>
                    <tr>
                        <th>Faction</th>
                        <th>Current</th>
                        <th>Standing</th>
                        <th>Next Tier</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedFactions.filter((f: Faction) => f.unlocked).map((faction: Faction) => {
                        const nextTier = getNextTier(faction);
                        return (
                            <tr key={faction.id}>
                                <td>{faction.name}</td>
                                <td>{faction.reputation}</td>
                                <td>{getFactionStatus(faction)}</td>
                                <td>
                                    {nextTier && nextTier.name !== 'Max Level' ? (
                                        <div className="next-tier-progress">
                                            <div className="progress-bar">
                                                <div 
                                                    className="progress-fill" 
                                                    style={{ width: `${nextTier.progress}%` }}
                                                ></div>
                                            </div>
                                            <span className="progress-text">
                                                {nextTier.current}/{nextTier.target} ({Math.floor(nextTier.progress)}%)
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="max-level">Max Level</span>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );

    const renderQuestsTab = (): React.ReactElement => (
        <div className="faction-quests-tab">
            <h3>Available Faction Quests</h3>
            <p className="placeholder-text">Faction quests will appear here as they become available.</p>
        </div>
    );

    return (
        <div className="faction-overview">
            <h2>Factions</h2>
            
            <div className="tab-navigation">
                <button 
                    className={activeTab === 'overview' ? 'active' : ''} 
                    onClick={() => setActiveTab('overview')}
                >
                    Overview
                </button>
                <button 
                    className={activeTab === 'reputation' ? 'active' : ''} 
                    onClick={() => setActiveTab('reputation')}
                >
                    Reputation
                </button>
                <button 
                    className={activeTab === 'quests' ? 'active' : ''} 
                    onClick={() => setActiveTab('quests')}
                >
                    Quests
                </button>
            </div>
            
            <div className="tab-content">
                {activeTab === 'overview' && renderOverviewTab()}
                {activeTab === 'reputation' && renderReputationTab()}
                {activeTab === 'quests' && renderQuestsTab()}
            </div>
        </div>
    );
};

export default FactionOverview;
