import React from 'react';

interface Character {
  id: string;
  name: string;
  level?: number;
  health?: number;
  maxHealth?: number;
  status?: string;
  portrait?: string;
}

interface CompactCharacterPanelProps {
  characters: Character[];
  onCharacterClick?: (characterId: string) => void;
  title?: string;
}

/**
 * CompactCharacterPanel Component
 * 
 * A condensed panel showing character/minion information
 * 
 * @param {Character[]} characters - Array of character objects
 * @param {Function} onCharacterClick - Handler for character selection
 * @param {string} title - Panel title
 * @returns {JSX.Element} The rendered component
 */
const CompactCharacterPanel: React.FC<CompactCharacterPanelProps> = ({
  characters = [],
  onCharacterClick,
  title = "Characters"
}) => {
  return (
    <div className="compact-character-panel">
      <h4 className="panel-title">{title}</h4>
      <div className="characters-list">
        {characters.length === 0 ? (
          <p className="no-characters">No characters available</p>
        ) : (
          characters.map(character => (
            <div 
              key={character.id}
              className="character-item"
              onClick={() => onCharacterClick && onCharacterClick(character.id)}
            >
              {character.portrait && (
                <div className="character-portrait">
                  <img src={character.portrait} alt={character.name} />
                </div>
              )}
              <div className="character-info">
                <span className="character-name">{character.name}</span>
                {character.level && (
                  <span className="character-level">Lv. {character.level}</span>
                )}
                {character.health !== undefined && character.maxHealth !== undefined && (
                  <div className="character-health">
                    <div 
                      className="health-bar" 
                      style={{width: `${(character.health / character.maxHealth) * 100}%`}}
                    />
                    <span className="health-text">{character.health}/{character.maxHealth}</span>
                  </div>
                )}
                {character.status && (
                  <span className="character-status">{character.status}</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CompactCharacterPanel;
