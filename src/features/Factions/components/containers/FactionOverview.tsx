import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import FactionCard from '../ui/FactionCard';
import './FactionOverview.css';

/**
 * Interface for a faction's reputation tier
 */
interface ReputationTier {
    name: string;
    threshold: number;
    benefits?: string[];
}

/**
 * Interface for Faction object
 */
interface Faction {
    id: string;
    name: string;
    description?: string;
    reputation: number;
    unlocked: boolean;
    reputationTiers?: ReputationTier[];
    [key: string]: any; // Additional faction properties
}

/**
 * Interface for the faction state in Redux
 */
interface FactionState {
    factions: Record<string, Faction>;
    config: Record<string, any>;
}

/**
 * Interface for the redux root state
 */
interface RootState {
    factions: FactionState;
}

/**
 * Interface for the next tier information
 */
interface NextTierInfo {
    name: string;
    current: number;
    target: number;
    progress: number;
}

/**
 * Filter types for faction display
 */
type FactionFilter = 'all' | 'unlocked' | 'locked';

/**
 * Sort options for faction display
 */
type FactionSortOption = 'name' | 'reputation';

/**
 * Tab options for the faction view
 */
type FactionTabOption = 'overview' | 'reputation' | 'quests';

const FactionOverview: React.FC = () => {
    // Access the factions data from Redux store based on the factionsInitialState structure
    const factionsData = useSelector((state: RootState) => state.factions?.factions || {});
    const factionsConfig = useSelector((state: RootState) => state.factions?.config || {});
    
    // States for filtering and sorting
    const [filter, setFilter] = useState<FactionFilter>('all');
    const [sortBy, setSortBy] = useState<FactionSortOption>('name');
    const [activeTab, setActiveTab] = useState<FactionTabOption>('overview');
    
    // Convert factions object to array for easier manipulation
    const factionsArray = Object.values(factionsData);
    
    // Apply filters
    const filteredFactions = factionsArray.filter(faction => {
        if (filter === 'all') return true;
        if (filter === 'unlocked') return faction.unlocked;
        if (filter === 'locked') return !faction.unlocked;
        return true;
    });
    
    // Apply sorting
    const sortedFactions = [...filteredFactions].sort((a, b) => {
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
        const unlockedFactions = factionsArray.filter(f => f.unlocked);
        if (unlockedFactions.length === 0) return 0;
        
        const totalRep = unlockedFactions.reduce((sum, f) => sum + Math.max(0, f.reputation), 0);
        return Math.floor(totalRep / unlockedFactions.length);
    };

    const renderOverviewTab = (): JSX.Element => (
        <div className="factions-overview-tab">
            <div className="faction-overall-stats">
                <div className="overall-score">
                    <h3>Overall Reputation</h3>
                    <div className="score-circle">
                        <span>{calculateOverallScore()}</span>
                    </div>
                </div>
                <div className="faction-stats">
                    <div className="stat-box">
                        <span className="stat-number">{factionsArray.filter(f => f.unlocked).length}</span>
                        <span className="stat-label">Unlocked Factions</span>
                    </div>
                    <div className="stat-box">
                        <span className="stat-number">{factionsArray.filter(f => !f.unlocked).length}</span>
                        <span className="stat-label">Locked Factions</span>
                    </div>
                    <div className="stat-box">
                        <span className="stat-number">
                            {factionsArray.filter(f => f.unlocked && f.reputation >= 75).length}
                        </span>
                        <span className="stat-label">High Reputation</span>
                    </div>
                </div>
            </div>

            <div className="faction-cards-grid">
                {sortedFactions.map(faction => (
                    <FactionCard 
                        key={faction.id} 
                        faction={faction} 
                        status={getFactionStatus(faction)}
                        nextTier={getNextTier(faction)}
                    />
                ))}
            </div>
        </div>
    );

    const renderReputationTab = (): JSX.Element => (
        <div className="faction-reputation-tab">
            <h3>Reputation Standings</h3>
            <table className="reputation-table">
                <thead>
                    <tr>
                        <th>Faction</th>
                        <th>Reputation</th>
                        <th>Status</th>
                        <th>Next Tier</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedFactions.filter(f => f.unlocked).map(faction => {
                        const nextTier = getNextTier(faction);
                        return (
                            <tr key={faction.id}>
                                <td>{faction.name}</td>
                                <td>{faction.reputation}</td>
                                <td>{getFactionStatus(faction)}</td>
                                <td>
                                    {nextTier && nextTier.name !== 'Max Level' ? (
                                        <div className="next-tier-progress">
                                            <span>{nextTier.name} ({nextTier.current}/{nextTier.target})</span>
                                            <div className="progress-bar">
                                                <div 
                                                    className="progress-fill" 
                                                    style={{width: `${nextTier.progress}%`}}
                                                ></div>
                                            </div>
                                        </div>
                                    ) : (
                                        <span>Maximum tier reached</span>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );

    const renderQuestsTab = (): JSX.Element => (
        <div className="faction-quests-tab">
            <h3>Available Faction Quests</h3>
            <p className="placeholder-text">Faction quests will appear here as they become available.</p>
            {/* This would be expanded with actual quest data when implemented */}
        </div>
    );

    return (
        <div className="faction-overview">
            <div className="faction-overview-header">
                <h2>Factions</h2>
                <div className="faction-controls">
                    <div className="filter-group">
                        <label>Show:</label>
                        <select 
                            value={filter} 
                            onChange={(e) => setFilter(e.target.value as FactionFilter)}
                        >
                            <option value="all">All Factions</option>
                            <option value="unlocked">Unlocked</option>
                            <option value="locked">Locked</option>
                        </select>
                    </div>
                    <div className="sort-group">
                        <label>Sort By:</label>
                        <select 
                            value={sortBy} 
                            onChange={(e) => setSortBy(e.target.value as FactionSortOption)}
                        >
                            <option value="name">Name</option>
                            <option value="reputation">Reputation</option>
                        </select>
                    </div>
                </div>
            </div>
            
            <div className="faction-tabs">
                <button 
                    className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
                    onClick={() => setActiveTab('overview')}
                >
                    Overview
                </button>
                <button 
                    className={`tab-button ${activeTab === 'reputation' ? 'active' : ''}`}
                    onClick={() => setActiveTab('reputation')}
                >
                    Reputation
                </button>
                <button 
                    className={`tab-button ${activeTab === 'quests' ? 'active' : ''}`}
                    onClick={() => setActiveTab('quests')}
                >
                    Quests
                </button>
            </div>
            
            <div className="faction-tab-content">
                {activeTab === 'overview' && renderOverviewTab()}
                {activeTab === 'reputation' && renderReputationTab()}
                {activeTab === 'quests' && renderQuestsTab()}
            </div>
            
            {factionsArray.length === 0 && (
                <div className="no-factions-message">
                    <p>No factions discovered yet. Continue your adventure to meet new groups.</p>
                </div>
            )}
        </div>
    );
};

export default FactionOverview;
