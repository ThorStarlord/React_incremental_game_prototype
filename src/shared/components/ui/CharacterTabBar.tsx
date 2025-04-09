import React from 'react';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface CharacterTabBarProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

/**
 * CharacterTabBar Component
 * 
 * A tab navigation bar for switching between character views
 * 
 * @param {Tab[]} tabs - Array of tab objects with id, label and optional icon
 * @param {string} activeTab - ID of the currently active tab
 * @param {Function} onTabChange - Handler for tab selection changes
 * @returns {JSX.Element} The rendered component
 */
const CharacterTabBar: React.FC<CharacterTabBarProps> = ({ 
  tabs = [], 
  activeTab = "", 
  onTabChange 
}) => {
  return (
    <div className="character-tab-bar">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.icon && <span className="tab-icon">{tab.icon}</span>}
          <span className="tab-label">{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

export default CharacterTabBar;
