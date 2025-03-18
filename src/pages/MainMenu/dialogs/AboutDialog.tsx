import React from 'react';

interface AboutDialogProps {
  isOpen: boolean;
  version: string;
  onClose: () => void;
}

export function AboutDialog({ isOpen, version, onClose }: AboutDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">About Incremental RPG</h2>
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
        
        <div className="text-center mb-4">
          <h3 className="text-xl font-semibold">Incremental RPG</h3>
          <p className="text-gray-500">Version {version}</p>
        </div>
        
        <p className="mb-3">
          Incremental RPG is a game that combines classic RPG elements with incremental game mechanics.
          Develop your character, build relationships with NPCs, and explore a rich fantasy world.
        </p>
        
        <h4 className="text-lg font-semibold mb-2">Credits</h4>
        <ul className="list-disc pl-5 mb-4 text-gray-700">
          <li>Game Design & Development: Game Developer Team</li>
          <li>Art Assets: Various Artists</li>
          <li>Music & Sound: Audio Creator Team</li>
        </ul>
        
        <h4 className="text-lg font-semibold mb-2">Special Thanks</h4>
        <p className="text-gray-700 mb-4">
          To all players who provided feedback and suggestions during development.
        </p>
        
        <div className="text-center mt-4">
          <p className="text-sm text-gray-500">
            © 2023 Incremental RPG Development Team. All rights reserved.
          </p>
        </div>
        
        <div className="flex justify-center mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
