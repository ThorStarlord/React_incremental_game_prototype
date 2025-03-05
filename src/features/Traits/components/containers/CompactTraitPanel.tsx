import React from 'react';

interface Trait {
  id: string;
  name: string;
  description: string;
  level?: number;
  maxLevel?: number;
  icon?: string;
}

interface CompactTraitPanelProps {
  traits: Trait[];
  onTraitClick?: (traitId: string) => void;
  title?: string;
}

/**
 * CompactTraitPanel Component
 * 
 * A condensed panel showing character traits
 * 
 * @param {Trait[]} traits - Array of trait objects
 * @param {Function} onTraitClick - Handler for trait selection
 * @param {string} title - Panel title
 * @returns {JSX.Element} The rendered component
 */
const CompactTraitPanel: React.FC<CompactTraitPanelProps> = ({
  traits = [],
  onTraitClick,
  title = "Traits"
}) => {
  return (
    <div className="compact-trait-panel">
      <h4 className="panel-title">{title}</h4>
      <div className="traits-list">
        {traits.length === 0 ? (
          <p className="no-traits">No traits acquired</p>
        ) : (
          traits.map(trait => (
            <div 
              key={trait.id}
              className="trait-item"
              onClick={() => onTraitClick && onTraitClick(trait.id)}
            >
              {trait.icon && <span className="trait-icon">{trait.icon}</span>}
              <div className="trait-info">
                <span className="trait-name">{trait.name}</span>
                {trait.level && trait.maxLevel && (
                  <span className="trait-level">Lv. {trait.level}/{trait.maxLevel}</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CompactTraitPanel;
