import React from 'react';

interface ImportDialogProps {
  isOpen: boolean;
  importCode: string;
  setImportCode: (code: string) => void;
  isLoading: boolean;
  onImport: () => void;
  onClose: () => void;
}

export function ImportDialog({
  isOpen,
  importCode,
  setImportCode,
  isLoading,
  onImport,
  onClose
}: ImportDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Import Save</h2>
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
        
        <p className="mb-3 text-gray-700">
          Paste your save code below to import:
        </p>
        
        <textarea
          className="w-full h-32 p-2 border border-gray-300 rounded bg-gray-50 font-mono text-sm mb-4"
          value={importCode}
          onChange={(e) => setImportCode(e.target.value)}
          placeholder="Paste your import code here..."
        />
        
        <div className="flex justify-end space-x-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onImport}
            disabled={isLoading || !importCode.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Importing...' : 'Import'}
          </button>
        </div>
      </div>
    </div>
  );
}
