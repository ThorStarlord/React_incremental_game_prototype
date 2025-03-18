import React from 'react';
import { type SavedGame } from '../../../hooks/useSavedGames';
import { formatPlaytime, formatSaveDate } from '../../../utils/saveGameUtils';

interface MainMenuButtonListProps {
  mostRecentSave: SavedGame | null;
  isLoading: boolean;
  onNewGame: () => void;
  onContinue: () => void;
  onLoadGame: () => void;
  onImport: () => void;
  onExport: () => void;
  onAbout: () => void;
}

export function MainMenuButtonList({
  mostRecentSave,
  isLoading,
  onNewGame,
  onContinue,
  onLoadGame,
  onImport,
  onExport,
  onAbout
}: MainMenuButtonListProps) {
  return (
    <div className="flex flex-col space-y-3 w-64 mx-auto">
      <button
        onClick={onNewGame}
        disabled={isLoading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        New Game
      </button>
      
      <button
        onClick={onContinue}
        disabled={isLoading || !mostRecentSave}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
      >
        {mostRecentSave ? (
          <>
            Continue
            <div className="text-xs mt-1 text-gray-200">
              {mostRecentSave.name} • {formatPlaytime(mostRecentSave.playtime)}
              <br />
              {formatSaveDate(mostRecentSave.timestamp)}
            </div>
          </>
        ) : (
          'Continue (No Saves)'
        )}
      </button>
      
      <button
        onClick={onLoadGame}
        disabled={isLoading}
        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
      >
        Load Game
      </button>
      
      <div className="flex space-x-2">
        <button
          onClick={onImport}
          disabled={isLoading}
          className="flex-1 px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
        >
          Import
        </button>
        
        <button
          onClick={onExport}
          disabled={isLoading || !mostRecentSave}
          className="flex-1 px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
        >
          Export
        </button>
      </div>
      
      <button
        onClick={onAbout}
        disabled={isLoading}
        className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50"
      >
        About
      </button>
    </div>
  );
}
