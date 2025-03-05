import React from 'react';

interface WorldMapProps {
  onTownSelect?: (townId: string) => void;
  onDungeonSelect?: (dungeonId: string, regionId: string) => void;
}

declare const WorldMap: React.FC<WorldMapProps>;

export default WorldMap;
