import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import PropTypes from 'prop-types';
import { getAvailableInteractions } from '../../../../utils/relationshipUtils';

// Import tab content components
import DialogueTab from '../presentation/DialogueTab';
import RelationshipTab from '../presentation/RelationshipTab';
import TradeTab from '../presentation/TradeTab';

/**
 * NPCTabContent - Container component for different NPC interaction tabs
 * 
 * This component manages the display of various interaction screens with NPCs based on the selected tab.
 * It dynamically renders appropriate content based on the player's relationship level with the NPC,
 * showing either the actual interaction interface or a placeholder for locked features.
 * 
 * @param {Object} props - Component props
 * @param {string} props.activeTab - The currently active tab identifier ('dialogue', 'relationship', 'trade')
 * @param {Object} props.npc - The NPC data object containing properties like name, dialogue options, inventory, etc.
 * @param {string} props.npcId - The NPC's unique identifier used for dispatch actions and state updates
 * @param {Object} props.currentDialogue - Current dialogue object containing text, options, and progression logic
 * @param {Function} props.setCurrentDialogue - Function to update the current dialogue state
 * @param {Object} props.player - Player data including inventory, stats, and relationship values with NPCs
 * @param {Object} props.essence - Game essence data for resource management and trades
 * @param {Array} props.traits - Player character traits that may affect interactions
 * @param {Function} props.dispatch - Redux dispatch function to update game state
 * @param {Function} props.handleRelationshipChange - Function to update relationship values between player and NPC
 * @param {Function} props.showNotification - Function to display game notifications to the player
 * @returns {JSX.Element} Rendered content for the selected tab
 */
const NPCTabContent = ({
  activeTab,
  npc,
  npcId,
  currentDialogue,
  setCurrentDialogue,
  player,
  essence,
  traits,
  dispatch,
  handleRelationshipChange,
  showNotification
}) => {
  // Safety check if NPC data is not available
  if (!npc) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="body1" color="error">
          NPC data could not be loaded. Please try again later.
        </Typography>
      </Box>
    );
  }
  
  // Get available interactions based on relationship level
  // Higher relationship levels unlock more interaction types
  const availableInteractions = getAvailableInteractions(npc.relationship || 0);
  
  /**
   * Tab panel wrapper component for accessibility and conditional rendering
   * 
   * @param {Object} props - TabPanel props
   * @param {React.ReactNode} props.children - Content to display in the tab panel
   * @param {string} props.value - Current active tab value
   * @param {string} props.index - This tab's index/identifier
   * @returns {JSX.Element} Rendered tab panel
   */
  const TabPanel = ({ children, value, index }) => {
    return (
      <div 
        role="tabpanel" 
        hidden={value !== index} 
        id={`npc-tabpanel-${index}`} 
        aria-labelledby={`npc-tab-${index}`}
        data-testid={`npc-${index}-panel`}
      >
        {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
      </div>
    );
  };

  /**
   * Placeholder component for features that aren't yet available
   * 
   * @param {Object} props - PlaceholderContent props
   * @param {string} props.feature - Name of the unavailable feature
   * @returns {JSX.Element} Placeholder UI element
   */
  const PlaceholderContent = ({ feature }) => (
    <Paper 
      elevation={1} 
      sx={{ 
        p: 2, 
        textAlign: 'center', 
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: 1
      }}
    >
      <Typography variant="body1">
        {feature} feature will be available in future updates or when your relationship with {npc.name} improves.
      </Typography>
    </Paper>
  );

  return (
    <Box sx={{ mt: 2 }} role="region" aria-live="polite">
      <TabPanel value={activeTab} index="dialogue">
        <DialogueTab 
          currentDialogue={currentDialogue}
          setCurrentDialogue={setCurrentDialogue}
          npc={npc}
          npcId={npcId}
          player={player}
          dispatch={dispatch}
          handleRelationshipChange={handleRelationshipChange}
        />
      </TabPanel>
      
      <TabPanel value={activeTab} index="relationship">
        {availableInteractions.includes('relationship') ? (
          <RelationshipTab 
            npc={npc}
            player={player}
            traits={traits}
            handleRelationshipChange={handleRelationshipChange}
            dispatch={dispatch}
            showNotification={showNotification}
          />
        ) : (
          <PlaceholderContent feature="Relationship interactions" />
        )}
      </TabPanel>
      
      <TabPanel value={activeTab} index="trade">
        {availableInteractions.includes('trade') ? (
          <TradeTab 
            npc={npc}
            player={player}
            essence={essence}
            dispatch={dispatch}
            showNotification={showNotification}
          />
        ) : (
          <PlaceholderContent feature="Trading" />
        )}
      </TabPanel>
      
      {/* QuestsTab panel removed */}
    </Box>
  );
};

// PropTypes validation for better development experience and documentation
NPCTabContent.propTypes = {
  activeTab: PropTypes.string.isRequired,
  npc: PropTypes.shape({
    name: PropTypes.string.isRequired,
    relationship: PropTypes.number,
    dialogues: PropTypes.object,
  }),
  npcId: PropTypes.string.isRequired,
  currentDialogue: PropTypes.object,
  setCurrentDialogue: PropTypes.func.isRequired,
  player: PropTypes.object.isRequired,
  essence: PropTypes.object,
  traits: PropTypes.array,
  dispatch: PropTypes.func.isRequired,
  handleRelationshipChange: PropTypes.func.isRequired,
  showNotification: PropTypes.func.isRequired
};

// Default props for optional props
NPCTabContent.defaultProps = {
  traits: [],
  essence: {},
  currentDialogue: null
};

export default NPCTabContent;
