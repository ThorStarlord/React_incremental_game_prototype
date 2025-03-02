import React from 'react';
import PropTypes from 'prop-types';
import './TraitPanel.css'; // Updated CSS import

/**
 * TraitPanel component displays individual trait information and upgrade controls
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.trait - The trait object with all its properties
 * @param {Function} props.onUpgrade - Function to call when trait is upgraded
 * @param {number} props.availablePoints - Number of trait points available to spend
 * @param {boolean} props.showRequirements - Whether to show unlock requirements (for locked traits)
 */
const TraitPanel = ({ trait, onUpgrade, availablePoints, showRequirements = true }) => {
  const { 
    id, name, description, category, level, maxLevel, 
    costPerLevel, effect, effects, unlocked, requirements, icon 
  } = trait;

  // Calculate if the trait can be upgraded based on available points and max level
  const canUpgrade = unlocked && level < maxLevel && availablePoints >= costPerLevel;
  
  // Helper function to render effect description
  const renderEffectDescription = (effect) => {
    const value = effect.value * 100; // Convert decimal to percentage
    return `${value}% ${formatEffectType(effect.type)}`;
  };

  // Format effect type for display (convert SNAKE_CASE to readable text)
  const formatEffectType = (type) => {
    return type
      .split('_')
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Render requirements for locked traits
  const renderRequirements = () => {
    if (!requirements || Object.keys(requirements).length === 0) return null;
    
    return (
      <div className="trait-requirements">
        <h5>Requirements:</h5>
        <ul>
          {Object.entries(requirements).map(([req, value]) => (
            <li key={req}>
              {req === 'totalTraitPoints' 
                ? `Total Trait Points: ${value}` 
                : `${req.charAt(0).toUpperCase() + req.slice(1)}: Level ${value}`}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className={`trait-card ${category} ${!unlocked ? 'locked' : ''}`}>
      <div className="trait-header">
        <div className="trait-icon">
          <i className={`icon-${icon}`}></i>
        </div>
        <div className="trait-name-level">
          <h3>{name}</h3>
          <div className="trait-level">
            <span className="level-text">Level {level}/{maxLevel}</span>
            <div className="level-bar">
              <div 
                className="level-progress" 
                style={{ width: `${(level / maxLevel) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="trait-description">
        <p>{description}</p>
      </div>

      <div className="trait-effects">
        {effect && (
          <div className="effect">
            <span>{renderEffectDescription(effect)}</span>
          </div>
        )}
        {effects && effects.map((e, i) => (
          <div className="effect" key={i}>
            <span>{renderEffectDescription(e)}</span>
          </div>
        ))}
        
        <div className="current-total-bonus">
          {level > 0 && effect && (
            <p>Current total: {(effect.value * level * 100).toFixed(0)}% {formatEffectType(effect.type)}</p>
          )}
        </div>
      </div>

      {!unlocked && showRequirements && renderRequirements()}

      <div className="trait-footer">
        <div className="trait-cost">
          Cost: {costPerLevel} {costPerLevel === 1 ? 'point' : 'points'}
        </div>
        <button 
          className="upgrade-button" 
          onClick={() => onUpgrade(id)}
          disabled={!canUpgrade}
        >
          {unlocked 
            ? (canUpgrade ? 'Upgrade' : (level >= maxLevel ? 'Maxed' : 'Not enough points')) 
            : 'Locked'}
        </button>
      </div>
    </div>
  );
};

TraitPanel.propTypes = {
  trait: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    level: PropTypes.number.isRequired,
    maxLevel: PropTypes.number.isRequired,
    costPerLevel: PropTypes.number.isRequired,
    effect: PropTypes.object,
    effects: PropTypes.array,
    unlocked: PropTypes.bool.isRequired,
    requirements: PropTypes.object,
    icon: PropTypes.string.isRequired
  }).isRequired,
  onUpgrade: PropTypes.func.isRequired,
  availablePoints: PropTypes.number.isRequired,
  showRequirements: PropTypes.bool
};

export default TraitPanel;