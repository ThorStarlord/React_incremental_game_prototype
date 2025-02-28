import React from 'react';
import Panel from '../../../../shared/components/layout/Panel';

const CharactersPanel = ({ characters }) => {
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