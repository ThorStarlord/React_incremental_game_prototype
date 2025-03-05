import React from 'react';
import Panel from '../../../../shared/components/layout/Panel';

/**
 * Interface defining the structure of a character object
 */
interface Character {
  /** Unique identifier for the character */
  id: string | number;
  /** Character's display name */
  name: string;
  /** Character's current level */
  level: number;
}

/**
 * Interface for CharactersPanel component props
 */
interface CharactersPanelProps {
  /** Array of character objects to display */
  characters?: Character[];
}

/**
 * Component that displays a list of characters in a panel
 * 
 * @param characters - Array of character objects with id, name and level properties
 * @returns A panel component containing the list of characters
 */
const CharactersPanel: React.FC<CharactersPanelProps> = ({ characters }) => {
  return (
    <Panel title="Characters">
      <div>
        {characters?.map(character => (
          <div key={character.id}>
            {character.name} - Level {character.level}
          </div>
        ))}
      </div>
    </Panel>
  );
};

export default CharactersPanel;
