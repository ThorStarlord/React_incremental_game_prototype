import React, { useState } from 'react';
import { type SavedGame } from '../../../hooks/useSavedGames';
import { formatPlaytime, formatSaveDate } from '../../../shared/utils/formatUtils';

interface LoadGameDialogProps {
  isOpen: boolean;
  savedGames: SavedGame[];
  isLoading: boolean;
  onLoad: (saveId: string) => void;
  onDelete: (saveId: string) => void;
  onClose: () => void;
}

export function LoadGameDialog({
  isOpen,
  savedGames,
  isLoading,
  onLoad,
  onDelete,
  onClose
}: LoadGameDialogProps) {
  const [selectedSaveId, setSelectedSaveId] = useState<string | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Load Game</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
        
        {savedGames.length === 0 ? (
          <div className="text-center py-8 text-gray-600">
            No saved games found.
          </div>
        ) : (
          <div className="max-h-80 overflow-y-auto">
            <div className="space-y-2">
              {savedGames.map(save => (
                <div 
                  key={save.id}
                  className={`p-3 border rounded cursor-pointer hover:bg-gray-50 transition-colors
                    ${selectedSaveId === save.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                  onClick={() => setSelectedSaveId(save.id)}
                >
                  <div className="font-medium">{save.name}</div>
                  <div className="text-sm text-gray-600">
                    Played for {formatPlaytime(save.playtime)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatSaveDate(save.timestamp)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex justify-between mt-6">
          <button
            onClick={() => selectedSaveId && onDelete(selectedSaveId)}
            disabled={!selectedSaveId || isLoading}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
          >
            Delete
          </button>
          
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            
            <button
              onClick={() => selectedSaveId && onLoad(selectedSaveId)}
              disabled={!selectedSaveId || isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Load
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
