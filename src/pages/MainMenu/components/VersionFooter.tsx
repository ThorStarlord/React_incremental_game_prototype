import React from 'react';

interface VersionFooterProps {
  version: string;
  shortcuts?: Array<{
    key: string;
    description: string;
    modifiers?: string;
  }>;
}

export function VersionFooter({ version, shortcuts = [] }: VersionFooterProps) {
  return (
    <div className="text-center text-sm text-gray-500 mt-8">
      <div>Version {version}</div>
      
      {shortcuts.length > 0 && (
        <div className="mt-2">
          <div className="mb-1 text-xs">Keyboard Shortcuts:</div>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
            {shortcuts.map((shortcut, index) => (
              <div key={index} className="flex items-center">
                {shortcut.modifiers && (
                  <span className="mr-1">{shortcut.modifiers}+</span>
                )}
                <kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-gray-800 font-mono text-xs">
                  {shortcut.key}
                </kbd>
                <span className="ml-1">{shortcut.description}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
