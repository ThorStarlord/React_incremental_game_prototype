import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { 
  selectFormattedAchievements,
  selectAchievementCategories,
  selectOverallCompletionPercentage
} from '../state/AchivementsSelectors';
import { AchievementCategory } from '../state/AchivementsTypes';
import './AchievementsList.css';

/**
 * Props for the AchievementsList component
 */
interface AchievementsListProps {
  /** Whether to display locked achievements */
  showLocked?: boolean;
  /** Optional category to filter by */
  categoryFilter?: AchievementCategory;
  /** Whether to show category filters */
  showFilters?: boolean;
}

/**
 * @component AchievementsList
 * @description Displays a list of player achievements with their details using Redux
 * 
 * @returns {JSX.Element} Rendered achievements list
 */
const AchievementsList: React.FC<AchievementsListProps> = ({ 
  showLocked = true,
  categoryFilter,
  showFilters = true
}) => {
  // Get achievements data from Redux store
  const achievements = useSelector(selectFormattedAchievements);
  const categories = useSelector(selectAchievementCategories);
  const completionPercentage = useSelector(selectOverallCompletionPercentage);
  
  // Local state for category filtering
  const [selectedCategory, setSelectedCategory] = useState<AchievementCategory | null>(
    categoryFilter || null
  );

  // Filter achievements based on preferences
  const filteredAchievements = achievements
    .filter(achievement => showLocked || achievement.unlocked)
    .filter(achievement => !selectedCategory || achievement.category === selectedCategory);

  return (
    <div className="achievements-list">
      {/* Overall completion percentage */}
      <div className="achievements-summary">
        <h3>Achievements Completion: {completionPercentage}%</h3>
        <div className="overall-progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>
      
      {/* Category filters */}
      {showFilters && (
        <div className="achievement-filters">
          <button 
            className={selectedCategory === null ? 'active' : ''}
            onClick={() => setSelectedCategory(null)}
          >
            All
          </button>
          
          {Object.entries(categories).map(([category, count]: [string, number]) => (
            <button 
              key={category}
              className={selectedCategory === category ? 'active' : ''}
              onClick={() => setSelectedCategory(category as AchievementCategory)}
            >
              {category} ({count})
            </button>
          ))}
        </div>
      )}
      
      {/* Achievements list */}
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
                
                {/* Show unlock date if unlocked */}
                {achievement.unlocked && achievement.dateUnlocked && (
                  <span className="date-unlocked">
                    Unlocked: {new Date(achievement.dateUnlocked).toLocaleDateString()}
                  </span>
                )}
                
                {/* Show progress bar if not unlocked */}
                {!achievement.unlocked && achievement.progress !== undefined && (
                  <div className="achievement-progress">
                    <div 
                      className="progress-indicator" 
                      style={{ width: `${achievement.progress}%` }}
                    />
                    <span>{achievement.progress}%</span>
                  </div>
                )}
                
                {/* Show rarity and category */}
                <div className="achievement-metadata">
                  <span className={`rarity ${achievement.rarity}`}>
                    {achievement.rarity}
                  </span>
                  <span className="category">{achievement.category}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AchievementsList;
