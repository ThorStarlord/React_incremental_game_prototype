import React from 'react';
import { type SavedGame } from '../../../hooks/useSavedGames';
// Update import path for formatting functions
import { formatPlaytime, formatSaveDate } from '../../../shared/utils/formatUtils';

// Internal reusable button component
interface MenuButtonProps {
  onClick: () => void;
  disabled: boolean;
  className?: string;
  children: React.ReactNode;
}

const MenuButton: React.FC<MenuButtonProps> = ({ onClick, disabled, className = '', children }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2 rounded disabled:opacity-50 transition-colors ${className}`}
  >
    {children}
  </button>
);

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
      <MenuButton
        onClick={onNewGame}
        disabled={isLoading}
        className="bg-blue-600 text-white hover:bg-blue-700"
      >
        New Game
      </MenuButton>

      <MenuButton
        onClick={onContinue}
        disabled={isLoading || !mostRecentSave}
        className="bg-green-600 text-white hover:bg-green-700"
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
      </MenuButton>

      <MenuButton
        onClick={onLoadGame}
        disabled={isLoading}
        className="bg-indigo-600 text-white hover:bg-indigo-700"
      >
        Load Game
      </MenuButton>

      <div className="flex space-x-2">
        <MenuButton
          onClick={onImport}
          disabled={isLoading}
          className="flex-1 px-3 py-2 bg-purple-600 text-white hover:bg-purple-700" // Adjusted padding for flex items
        >
          Import
        </MenuButton>

        <MenuButton
          onClick={onExport}
          disabled={isLoading || !mostRecentSave}
          className="flex-1 px-3 py-2 bg-purple-600 text-white hover:bg-purple-700" // Adjusted padding for flex items
        >
          Export
        </MenuButton>
      </div>

      <MenuButton
        onClick={onAbout}
        disabled={isLoading}
        className="bg-gray-600 text-white hover:bg-gray-700"
      >
        About
      </MenuButton>
    </div>
  );
}
