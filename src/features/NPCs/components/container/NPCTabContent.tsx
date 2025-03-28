import React, { useState, useEffect } from 'react';
import { Box, Tabs, Tab, CircularProgress, Alert, Typography } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import HandshakeIcon from '@mui/icons-material/Handshake';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import HistoryIcon from '@mui/icons-material/History';
import { useGameState, useGameDispatch } from '../../../../context/GameStateExports';

import TabContent from './TabContent';
import DialogueTab from '../../dialogue/DialogueTab';
import RelationshipTab from '../../relationship/RelationshipTab';
import TradeTab from '../../trade/TradeTab';
import QuestsTab from '../../quests/QuestsTab';
import HistoryTab from '../../history/HistoryTab';

/**
 * Interface for a trade item in a shop
 */
interface TradeItem {
  /** Unique identifier for the item */
  id: string;
  /** Display name of the item */
  name: string;
  /** Description of what the item does */
  description?: string;
  /** Base price of the item in essence */
  price: number;
  /** Path to the item's icon image */
  icon?: string;
  /** Rarity classification (common, rare, etc.) */
  rarity?: string;
  /** Price when selling this item back to NPCs */
  sellPrice?: number;
  /** Whether this item can be sold */
  sellable?: boolean;
  /** Quantity of item when dealing with inventory */
  quantity?: number;
}

/**
 * Interface for a player's inventory item
 */
interface InventoryItem extends TradeItem {
  /** Quantity of the item in player's inventory */
  quantity: number;
}

/**
 * Interface for an NPC in the game
 */
interface NPC {
  /** Unique identifier of the NPC */
  id: string; // Changed from optional to required
  /** Display name of the NPC */
  name: string;
  /** Relationship level with the player */
  relationship?: number;
  /** Whether this NPC can trade with the player */
  canTrade?: boolean;
  /** Whether this NPC has quests available */
  hasQuests?: boolean;
  /** NPC traits/characteristics */
  traits?: string[];
  /** Other properties */
  [key: string]: any;
}

/**
 * Interface for an NPC that trades
 */
interface TradingNPC {
  /** Unique identifier of the NPC */
  id?: string;
  /** Display name of the NPC */
  name: string;
  /** Items this NPC sells */
  trades?: TradeItem[];
  /** Dialogue options for different trading scenarios */
  dialogues?: Record<string, string>;
  /** Relationship level with the player */
  relationship?: number;
  /** Other properties */
  [key: string]: any;
}

/**
 * Interface for a simplified player object
 */
interface Player {
  /** Player's inventory items */
  inventory?: InventoryItem[];
  /** Player's gold currency */
  gold?: number;
  /** Player's acquired traits */
  acquiredTraits: string[];
  /** Player's seen traits */
  seenTraits?: string[];
  /** Additional player properties */
  [key: string]: any;
}

/**
 * Interface for a trait in the game
 */
interface Trait {
  id: string;
  name: string;
  description?: string;
  [key: string]: any;
}

/**
 * Interface for the trait system
 */
interface TraitSystem {
  copyableTraits: Record<string, Trait>;
  [key: string]: any;
}

/**
 * Interface for tutorial state
 */
interface TutorialState {
  completed: string[];
  currentStep?: string;
  [key: string]: any;
}

/**
 * Interface for NPCTabContent component props
 */
interface NPCTabContentProps {
  /** ID of the NPC to display */
  npcId: string;
  /** Custom tab initializer */
  initialTab?: number;
}

/**
 * Component that manages NPC interaction tabs and their content
 * 
 * @param props - Component props
 * @returns NPC interaction tab content component
 */
const NPCTabContent: React.FC<NPCTabContentProps> = ({ npcId, initialTab = 0 }) => {
  const [activeTab, setActiveTab] = useState<number>(initialTab);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const gameState = useGameState();
  const dispatch = useGameDispatch();
  
  // Safely access state properties
  const player = gameState.player || {};
  const npcs = Array.isArray(gameState.npcs) ? gameState.npcs : [];
  const tutorial = gameState.tutorial || { completed: [] };
  const traits = gameState.traits || { copyableTraits: {} };
  const essence = gameState.essence?.amount || 0;
  const showNotification = gameState.showNotification || (() => {});
  
  // Find the NPC data
  const npc = npcs.find(n => n?.id === npcId);
  
  // Load NPC data
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate loading data
    const timer = setTimeout(() => {
      if (!npc) {
        setError('NPC not found');
      }
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [npcId, npc]);
  
  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };
  
  // Handle relationship change
  const handleRelationshipChange = (npcId: string, amount: number) => {
    if (npcId) {
      dispatch({
        type: 'UPDATE_NPC_RELATIONSHIP',
        payload: {
          npcId,
          amount,
          source: 'interaction'  // Default source
        }
      });
      
      // Show notification for significant changes
      if (Math.abs(amount) >= 5) {
        showNotification(
          `${amount > 0 ? 'Gained' : 'Lost'} ${Math.abs(amount)} relationship with ${npc?.name}`,
          amount > 0 ? 'success' : 'warning'
        );
      }
    }
  };
  
  // Handle rendering for NPC tabs safely
  const renderTabContent = () => {
    if (!npc) return null;
    
    return (
      <>
        <TabContent value={activeTab} index={0}>
          <DialogueTab 
            npc={{
              id: npcId, // Ensure id is always a string (not undefined)
              name: npc.name,
              relationship: npc.relationship || 0,
              ...(npc as Omit<typeof npc, 'id'>), // Spread the rest of npc properties
            }}
            player={player}
            dispatch={dispatch}
            essence={essence}
            onRelationshipChange={(amount, source) => {
              // Adapt our function to match the expected signature
              handleRelationshipChange(npcId, amount);
            }}
            traits={traits.copyableTraits || {}} // Pass just the copyableTraits to match Record<string, Trait>
          />
        </TabContent>
          
        <TabContent value={activeTab} index={1}>
          <RelationshipTab 
            npc={{
              id: npcId, // Ensure id is always defined
              name: npc.name || "Unknown",
              relationship: npc.relationship || 0
              // Removed 'traits' property as it doesn't exist in the expected NPC interface
            }}
            player={player}
            onRelationshipChange={handleRelationshipChange}
            playerTraits={player.acquiredTraits || []}
            dispatch={dispatch}
            tutorial={tutorial}
            traits={traits.copyableTraits || {}} // Pass just the copyableTraits to match Record<string, Trait>
          />
        </TabContent>
        
        <TabContent value={activeTab} index={2}>
          <HistoryTab npcId={npcId} />
        </TabContent>
          
        <TabContent value={activeTab} index={3}>
          {npc.canTrade ? (
            <TradeTab 
              npc={{
                id: npcId, // Ensure id is always defined
                name: npc.name || "Unknown",
                trades: npc.trades || []
              }}
              player={{
                // Fix inventory format to match the expected InventoryItem[] type
                inventory: player.inventory || []
                // Removed 'acquiredTraits' as it doesn't exist in the expected Player interface
              }}
              dispatch={dispatch}
              currentRelationship={npc.relationship || 0} // Pass as separate prop instead
              essence={essence}
            />
          ) : (
            <Typography variant="body1" color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
              This NPC doesn't trade.
            </Typography>
          )}
        </TabContent>
          
        <TabContent value={activeTab} index={4}>
          {npc.hasQuests ? (
            <QuestsTab 
              npcId={npcId}
              essence={essence}
              showNotification={showNotification}
              dispatch={dispatch}
            />
          ) : (
            <Typography variant="body1" color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
              This NPC doesn't have quests.
            </Typography>
          )}
        </TabContent>
      </>
    );
  };

  // If NPC data not found after loading
  if (!isLoading && !npc) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">NPC with ID "{npcId}" not found</Alert>
      </Box>
    );
  }
  
  return (
    <Box sx={{ width: '100%' }}>
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange} 
              variant="scrollable" 
              scrollButtons="auto"
              aria-label="NPC interaction tabs"
            >
              <Tab icon={<ChatIcon />} iconPosition="start" label="Talk" />
              <Tab icon={<HandshakeIcon />} iconPosition="start" label="Relationship" />
              <Tab icon={<HistoryIcon />} iconPosition="start" label="History" />
              <Tab 
                icon={<ShoppingCartIcon />} 
                iconPosition="start" 
                label="Trade" 
                disabled={!npc?.canTrade}
              />
              <Tab 
                icon={<EmojiEventsIcon />} 
                iconPosition="start" 
                label="Quests" 
                disabled={!npc?.hasQuests}
              />
            </Tabs>
          </Box>
          
          {/* Use the safe rendering method */}
          {renderTabContent()}
        </>
      )}
    </Box>
  );
};

export default NPCTabContent;
