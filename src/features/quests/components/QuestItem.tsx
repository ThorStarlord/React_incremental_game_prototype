/**
 * @file QuestItem.tsx
 * @description Component for displaying an individual quest and its details
 * @module features/Quests/components
 */

import React from 'react';
import './QuestItem.css'; // You'll need to create this CSS file
import { Quest, QuestProgress, QuestObjective } from '../questsInitialState';

/**
 * Props for the QuestItem component
 */
interface QuestItemProps {
  /** The quest object to display */
  quest: Quest;
  /** The quest progress object */
  progress?: Partial<QuestProgress>;
  /** Function called when a quest is accepted */
  onAccept?: (id: string) => void;
  /** Function called when a quest is abandoned */
  onAbandon?: (id: string) => void;
  /** Function called when quest completion is attempted */
  onComplete?: (id: string) => void;
}

/**
 * QuestItem component displays a single quest with its details
 * 
 * @component
 * @returns {JSX.Element} The rendered component
 */
const QuestItem: React.FC<QuestItemProps> = ({ 
  quest, 
  progress = {}, 
  onAccept, 
  onAbandon, 
  onComplete 
}) => {
  const { 
    id, 
    title, 
    description, 
    objectives, 
    rewards, 
    status, 
    requirements 
  } = quest;

  /**
   * Calculate the overall completion percentage of quest objectives
   * @returns Percentage of completion (0-100)
   */
  const calculateProgress = (): number => {
    if (!progress.objectiveProgress || objectives.length === 0) return 0;
    
    const totalCompleted = objectives.reduce((sum, obj) => {
      const current = progress.objectiveProgress?.[obj.id] || 0;
      const completed = Math.min(current, obj.required);
      return sum + completed;
    }, 0);
    
    const totalRequired = objectives.reduce((sum, obj) => sum + obj.required, 0);
    
    return Math.floor((totalCompleted / totalRequired) * 100);
  };

  /**
   * Check if all requirements for the quest are met
   * @returns Whether all requirements are met
   */
  const areRequirementsMet = (): boolean => {
    // This would need to be implemented based on your game state
    // For now, assume true if there are no requirements or the quest is already active/completed
    return requirements.length === 0 || status !== 'not_started';
  };

  /**
   * Get CSS class name based on quest status
   * @returns CSS class name
   */
  const getStatusClass = (): string => {
    switch (status) {
      case 'active': return 'quest-active';
      case 'completed': return 'quest-completed';
      case 'failed': return 'quest-failed';
      default: return 'quest-not-started';
    }
  };

  return (
    <div className={`quest-item ${getStatusClass()}`}>
      <div className="quest-header">
        <h3 className="quest-title">{title}</h3>
        <div className="quest-status">{status.replace('_', ' ')}</div>
      </div>
      
      <div className="quest-description">{description}</div>
      
      {/* Requirements Section */}
      {requirements.length > 0 && (
        <div className="quest-requirements">
          <h4>Requirements</h4>
          <ul>
            {requirements.map((req, index) => (
              <li key={index} className="quest-requirement">
                {req.description}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Objectives Section */}
      <div className="quest-objectives">
        <h4>Objectives</h4>
        <ul>
          {objectives.map((obj) => {
            const currentProgress = (progress.objectiveProgress && progress.objectiveProgress[obj.id]) || 0;
            return (
              <li 
                key={obj.id} 
                className={`quest-objective ${obj.completed ? 'completed' : ''}`}
              >
                <div className="objective-description">{obj.description}</div>
                <div className="objective-progress">
                  {currentProgress} / {obj.required}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      
      {/* Rewards Section */}
      <div className="quest-rewards">
        <h4>Rewards</h4>
        <ul>
          {rewards.map((reward, index) => (
            <li key={index} className="quest-reward">
              {reward.type === 'experience' && `${reward.value} XP`}
              {reward.type === 'gold' && `${reward.value} Gold`}
              {reward.type === 'item' && `${reward.quantity || 1}x ${reward.value}`}
            </li>
          ))}
        </ul>
      </div>
      
      {/* Progress Bar */}
      {status === 'active' && (
        <div className="quest-progress-container">
          <div className="quest-progress-bar">
            <div 
              className="quest-progress-fill" 
              style={{ width: `${calculateProgress()}%` }}
            ></div>
          </div>
          <div className="quest-progress-text">
            {calculateProgress()}% Complete
          </div>
        </div>
      )}
      
      {/* Action Buttons */}
      <div className="quest-actions">
        {status === 'not_started' && areRequirementsMet() && (
          <button 
            className="quest-button accept-button" 
            onClick={() => onAccept && onAccept(id)}
          >
            Accept Quest
          </button>
        )}
        
        {status === 'active' && (
          <>
            <button 
              className="quest-button complete-button" 
              onClick={() => onComplete && onComplete(id)}
              disabled={calculateProgress() < 100}
            >
              Complete Quest
            </button>
            <button 
              className="quest-button abandon-button" 
              onClick={() => onAbandon && onAbandon(id)}
            >
              Abandon Quest
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default QuestItem;
