import React, { useMemo } from 'react';
import { Box, Typography, Chip } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import ChatIcon from '@mui/icons-material/Chat';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ExtensionIcon from '@mui/icons-material/Extension';

import { TabContainer } from '../../../../shared/components/Tabs';
import { useTabs } from '../../../../shared/hooks/useTabs';
import { useAppSelector } from '../../../../app/hooks';
import type { NpcState } from '../../state/NpcTypes';

import NPCHeader from './NPCHeader';
import NPCOverviewTab from './tabs/NPCOverviewTab';
import NPCDialogueTab from './tabs/NPCDialogueTab';
import NPCTradeTab from './tabs/NPCTradeTab';
import NPCQuestsTab from './tabs/NPCQuestsTab';
import NPCTraitsTab from './tabs/NPCTraitsTab';

interface NPCPanelProps {
  npc: NpcState;
}

const NPCPanel: React.FC<NPCPanelProps> = ({ npc }) => {
  const playerLevel = useAppSelector(state => state.player.level);

  // Define available tabs based on relationship level
  const availableTabs = useMemo(() => {
    const allTabs = [
      {
        id: 'overview',
        label: 'Overview',
        icon: PersonIcon,
        disabled: false,
        tooltip: 'Basic NPC information'
      },
      {
        id: 'dialogue',
        label: 'Dialogue',
        icon: ChatIcon,
        disabled: npc.relationshipValue < 1,
        tooltip: npc.relationshipValue < 1 ? 'Requires relationship level 1+' : 'Conversation interface'
      },
      {
        id: 'trade',
        label: 'Trade',
        icon: ShoppingCartIcon,
        disabled: npc.relationshipValue < 2,
        tooltip: npc.relationshipValue < 2 ? 'Requires relationship level 2+' : 'Commerce and trading'
      },
      {
        id: 'quests',
        label: 'Quests',
        icon: AssignmentIcon,
        disabled: npc.relationshipValue < 3,
        tooltip: npc.relationshipValue < 3 ? 'Requires relationship level 3+' : 'Quest-related interactions'
      },
      {
        id: 'traits',
        label: 'Traits',
        icon: ExtensionIcon,
        disabled: npc.relationshipValue < 4,
        tooltip: npc.relationshipValue < 4 ? 'Requires relationship level 4+' : 'Trait sharing and acquisition'
      }
    ];

    return allTabs;
  }, [npc.relationshipValue]);

  const { activeTab, setActiveTab } = useTabs({
    defaultTab: 'overview',
    tabs: availableTabs,
    persistKey: `npc_panel_tabs_${npc.id}`
  });

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* NPC Header with basic info */}
      <NPCHeader npc={npc} />

      {/* Relationship Level Indicator */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Relationship Level:
          </Typography>
          <Chip
            label={`Level ${npc.relationshipValue}`}
            size="small"
            color={npc.relationshipValue >= 3 ? 'success' : npc.relationshipValue >= 1 ? 'warning' : 'default'}
          />
        </Box>
        {npc.connectionDepth !== undefined && (
          <Typography variant="body2" color="text.secondary">
            Connection Depth: {npc.connectionDepth.toFixed(1)}
          </Typography>
        )}
      </Box>

      {/* Tabbed Content */}
      <TabContainer
        tabs={availableTabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabsProps={{
          variant: 'scrollable',
          scrollButtons: 'auto',
          'aria-label': `${npc.name} Interaction Tabs`
        }}
        sx={{ flexGrow: 1 }}
      >
        {/* Overview Tab - Always available */}
        {activeTab === 'overview' && <NPCOverviewTab npc={npc} />}
        
        {/* Dialogue Tab - Relationship 1+ */}
        {activeTab === 'dialogue' && npc.relationshipValue >= 1 && (
          <NPCDialogueTab npc={npc} />
        )}
        
        {/* Trade Tab - Relationship 2+ */}
        {activeTab === 'trade' && npc.relationshipValue >= 2 && (
          <NPCTradeTab npc={npc} />
        )}
        
        {/* Quests Tab - Relationship 3+ */}
        {activeTab === 'quests' && npc.relationshipValue >= 3 && (
          <NPCQuestsTab npc={npc} />
        )}
        
        {/* Traits Tab - Relationship 4+ */}
        {activeTab === 'traits' && npc.relationshipValue >= 4 && (
          <NPCTraitsTab npc={npc} />
        )}
      </TabContainer>
    </Box>
  );
};

export default React.memo(NPCPanel);
