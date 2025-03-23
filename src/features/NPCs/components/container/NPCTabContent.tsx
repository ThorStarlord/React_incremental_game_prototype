import React, { useState, useContext, useEffect } from 'react';
import { Box, Tabs, Tab, CircularProgress, Alert, Typography } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import HandshakeIcon from '@mui/icons-material/Handshake';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import HistoryIcon from '@mui/icons-material/History';
import { useGameState, useGameDispatch, EnhancedGameState } from '../../../../context/GameStateExports';

import TabContent from './TabContent';
import DialogueTab from '../../dialogue/DialogueTab';
import RelationshipTab from '../../relationship/RelationshipTab';
import TradeTab from '../../trade/TradeTab';
import QuestsTab from '../../quests/QuestsTab';
import HistoryTab from '../../history/HistoryTab';

// Extended GameState to include the properties we need
interface ExtendedGameState extends EnhancedGameState {
  npcs: NPC[];
  tutorial: TutorialState;
  traits: TraitSystem;
  showNotification: (message: string, type?: string) => void;
}

/**
 * Interface for an NPC object
 */
interface NPC {
  /** Unique identifier */
  id: string;
  /** Display name */
  name: string;
  /** Relationship level with player (0-100) */
  relationship?: number;
  /** Whether this NPC offers trading */
  canTrade?: boolean;
  /** Whether this NPC offers quests */
  hasQuests?: boolean;
  /** NPC traits available */
  traits?: Record<string, any>;
  /** Additional NPC properties */
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
  /** Whether NPCs have been introduced */
  npcIntroShown?: boolean;
  /** Whether relationship system has been explained */
  relationshipShown?: boolean;
  /** Whether trading system has been explained */
  tradingShown?: boolean;
  /** Whether quest system has been explained */
  questShown?: boolean;
  /** Additional tutorial flags */
  [key: string]: boolean | undefined;
}

/**
 * Interface for player state
 */
interface PlayerState {
  /** Player essence currency */
  essence?: number;
  /** Player acquired traits */
  acquiredTraits: string[];
  /** Player seen traits */
  seenTraits?: string[];
  /** Additional player properties */
  [key: string]: any;
}

/**
 * Interface for game state context
 */
interface GameState {
  /** Player data */
  player: PlayerState;
  /** NPC data */
  npcs: NPC[];
  /** Current tutorial state */
  tutorial: TutorialState;
  /** Trait definitions */
  traits: Record<string, any>;
  /** Function to show notifications */
  showNotification: (message: string, type?: string) => void;
  /** Additional game state properties */
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
  
  const gameState = useGameState() as unknown as ExtendedGameState;
  const dispatch = useGameDispatch();
  const { player, npcs, tutorial, traits, showNotification } = gameState;
  
  // Find the NPC data
  const npc = npcs.find(n => n.id === npcId);
  
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
          
          <TabContent value={activeTab} index={0}>
            <DialogueTab 
              npc={npc as NPC}
              player={player}
              dispatch={dispatch}
              essence={player.essence || 0}
              onRelationshipChange={(amount, source) => {
                // Adapt our function to match the expected signature
                handleRelationshipChange(npcId, amount);
              }}
              traits={traits}
            />
          </TabContent>
          
          <TabContent value={activeTab} index={1}>
            <RelationshipTab 
              npc={{
                ...npc,
                // Ensure relationship is a number, not undefined
                relationship: npc.relationship || 0
              }}
              player={player}
              onRelationshipChange={handleRelationshipChange}
              playerTraits={player.acquiredTraits || []}
              dispatch={dispatch}
              tutorial={tutorial}
              traits={traits.copyableTraits || {}}
            />
          </TabContent>
          
          <TabContent value={activeTab} index={2}>
            <HistoryTab npcId={npcId} />
          </TabContent>
          
          <TabContent value={activeTab} index={3}>
            {npc?.canTrade ? (
              <TradeTab 
                npc={npc as NPC}
                player={{
                  ...player,
                  // Fix inventory format to match the expected InventoryItem[] type
                  inventory: player.inventory || [],
                  gold: player.gold || 0
                }}
                dispatch={dispatch}
                currentRelationship={npc.relationship}
                essence={player.essence}
              />
            ) : (
              <Typography variant="body1" color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
                {npc?.name} doesn't have any items to trade.
              </Typography>
            )}
          </TabContent>
          
          <TabContent value={activeTab} index={4}>
            {npc?.hasQuests ? (
              <QuestsTab 
                npcId={npcId}
                playerLevel={player.level || 1}
                essence={player.essence || 0}
                showNotification={showNotification}
                dispatch={dispatch}
              />
            ) : (
              <Typography variant="body1" color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
                {npc?.name} doesn't have any quests available.
              </Typography>
            )}
          </TabContent>
        </>
      )}
    </Box>
  );
};

export default NPCTabContent;
