import React, { useState } from 'react';

interface ExportDialogProps {
  isOpen: boolean;
  exportCode: string;
  onClose: () => void;
  onCopyToClipboard: () => void;
}

export function ExportDialog({
  isOpen,
  exportCode,
  onClose,
  onCopyToClipboard
}: ExportDialogProps) {
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    onCopyToClipboard();
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Export Save</h2>
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
          Copy this code to back up your save or transfer it to another device:
        </p>
        
        <div className="relative">
          <textarea
            className="w-full h-32 p-2 border border-gray-300 rounded bg-gray-50 font-mono text-sm"
            value={exportCode}
            readOnly
          />
          
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 p-1 bg-gray-200 hover:bg-gray-300 rounded text-sm"
          >
            {isCopied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        
        <div className="flex justify-end mt-4">
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
