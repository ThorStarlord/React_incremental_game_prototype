import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import FactionCard from '../ui/FactionCard';
import './FactionOverview.css';

const FactionOverview = () => {
    // Access the factions data from Redux store based on the factionsInitialState structure
    const factionsData = useSelector(state => state.factions?.factions || {});
    const factionsConfig = useSelector(state => state.factions?.config || {});
    
    // States for filtering and sorting
    const [filter, setFilter] = useState('all'); // 'all', 'unlocked', 'locked'
    const [sortBy, setSortBy] = useState('name'); // 'name', 'reputation'
    const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'reputation', 'quests'
    
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
    const getFactionStatus = (faction) => {
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
    const getNextTier = (faction) => {
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
    const calculateOverallScore = () => {
        const unlockedFactions = factionsArray.filter(f => f.unlocked);
        if (unlockedFactions.length === 0) return 0;
        
        const totalRep = unlockedFactions.reduce((sum, f) => sum + Math.max(0, f.reputation), 0);
        return Math.floor(totalRep / unlockedFactions.length);
    };

    const renderOverviewTab = () => (
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

    const renderReputationTab = () => (
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

    const renderQuestsTab = () => (
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
                        <select value={filter} onChange={e => setFilter(e.target.value)}>
                            <option value="all">All Factions</option>
                            <option value="unlocked">Unlocked</option>
                            <option value="locked">Locked</option>
                        </select>
                    </div>
                    <div className="sort-group">
                        <label>Sort By:</label>
                        <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
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