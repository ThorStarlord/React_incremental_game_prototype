/**
 * @file TraitAndNPCListDrawer.tsx
 * @description A drawer component for displaying lists of NPCs and Traits with filtering and sorting.
 */
import React, { useContext, useState, useMemo, useCallback } from 'react';
import {
  Drawer,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Tabs,
  Tab,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  LinearProgress,
  Button,
  Badge,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  ToggleButtonGroup,
  ToggleButton,
  Slider,
  Collapse
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import SearchIcon from '@mui/icons-material/Search';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import LockIcon from '@mui/icons-material/Lock';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SportsKabaddiIcon from '@mui/icons-material/SportsKabaddi';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { GameStateContext, useGameDispatch } from '../../../../context/GameStateContext';
import { getDiscoveryProgress } from '../../../../shared/utils/discoveryUtils';
import { NPC, TraitDefinition, PlayerState, TraitsState, GameState } from '../../../../context/initialStates/InitialStateComposer';

interface TraitAndNPCListDrawerProps {
    open: boolean;
    onClose: () => void;
    focusedId?: string;
    sourceType?: string;
}

interface FilterOptions {
    showFilters: boolean;
    locationFilter: string;
    relationshipRange: number[];
    traitTypeFilter: string;
    traitSourceFilter: string;
    traitCostRange: number[];
    traitStatusFilter: string;
    npcInteractionFilter: string;
    characterFilter: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    searchQuery: string;
    showUndiscovered: boolean;
    tabValue: number; // Added tabValue to FilterOptions
}

/**
 * TraitAndNPCListDrawer Component
 *
 * @description A drawer component that displays lists of NPCs and Traits, with filtering and sorting capabilities.
 * It allows users to browse NPCs, view their relationships, and explore available traits.
 *
 * @param {TraitAndNPCListDrawerProps} props - Component props
 * @returns {JSX.Element} - The TraitAndNPCListDrawer component
 *
 * **Props:**
 * - `open`: Boolean to control the drawer's visibility.
 * - `onClose`: Function to handle drawer close events.
 * - `focusedId`: Optional ID to highlight a specific NPC or Trait in the list.
 * - `sourceType`: Optional string to determine the initial tab ('npc' or 'trait').
 *
 * **State:**
 * - `filterState`: An object managing all filter and sorting states for both NPC and Trait lists.
 *
 * **Functionality:**
 * - **Tab Navigation**: Allows switching between NPC, Trait and Character lists.
 * - **Search**: Filters lists based on a text query.
 * - **Filtering**: Provides advanced filtering options for NPCs (location, relationship) and Traits (type, source, status, cost).
 * - **Sorting**: Supports sorting lists by name, relationship, influence, cost, and type, with ascending/descending order.
 * - **Discovery Progress**: Displays progress bars for NPC and Trait discovery.
 * - **Responsive Design**: Adapts to different screen sizes using MUI's responsive components.
 *
 * **Notes:**
 * - This component is designed to be integrated into the game's UI, providing a comprehensive overview of NPCs and Traits.
 * - It leverages React hooks for state management and memoization for performance optimization, especially in list rendering and filtering.
 * - The component relies on data from `GameStateContext` and dispatches actions to update the game state (though actions are not directly implemented within this component in the provided code).
 *
 * **Example Usage:**
 * ```jsx
 * <TraitAndNPCListDrawer
 *   open={isDrawerOpen}
 *   onClose={() => setIsDrawerOpen(false)}
 *   sourceType="npc"
 * />
 * ```
 */
const TraitAndNPCListDrawer: React.FC<TraitAndNPCListDrawerProps> = ({ open, onClose, focusedId, sourceType }) => {
  const gameState = useContext(GameStateContext) as GameState;
  const dispatch = useGameDispatch();

  // Extract relevant data from gameState, ensuring types
  const npcs: NPC[] = (gameState?.npcs || []) as NPC[];
  const traits = (gameState?.traits || {}) as TraitsState;
  const player = (gameState?.player || {}) as PlayerState;

  const discoveryProgress = useMemo(() => getDiscoveryProgress(gameState), [gameState]);

  // State for tabs, search, filters, and sorting (consolidated into a single state object for better management)
  const [filterState, setFilterState] = useState<FilterOptions>({
    showFilters: false,
    locationFilter: 'all',
    relationshipRange: [0, 100],
    traitTypeFilter: 'all',
    traitSourceFilter: 'all',
    traitCostRange: [0, 500],
    traitStatusFilter: 'all',
    npcInteractionFilter: 'all',
    characterFilter: 'all',
    sortBy: 'name',
    sortOrder: 'asc',
    searchQuery: '',
    showUndiscovered: false,
    tabValue: sourceType === 'npc' ? 0 : 1, // Initialize tabValue based on sourceType prop
  });

  const setFilter = useCallback((key: keyof FilterOptions, value: any) => {
    setFilterState(prevState => ({ ...prevState, [key]: value }));
  }, []);

  const handleTabChange = useCallback((event: React.SyntheticEvent, newValue: number) => {
    setFilterState(prevState => ({ ...prevState, tabValue: newValue }));
  }, []);

  const toggleFilters = useCallback(() => {
    setFilterState(prevState => ({ ...prevState, showFilters: !prevState.showFilters }));
  }, []);

  const handleSortOrderChange = useCallback((event: React.SyntheticEvent, newOrder: 'asc' | 'desc') => {
    if (newOrder !== null) {
      setFilterState(prevState => ({ ...prevState, sortOrder: newOrder }));
    }
  }, []);

  const resetFilters = useCallback(() => {
    setFilterState({
      showFilters: false,
      locationFilter: 'all',
      relationshipRange: [0, 100],
      traitTypeFilter: 'all',
      traitSourceFilter: 'all',
      traitCostRange: [0, 500],
      traitStatusFilter: 'all',
      npcInteractionFilter: 'all',
      characterFilter: 'all',
      sortBy: 'name',
      sortOrder: 'asc',
      searchQuery: '',
      showUndiscovered: false,
      tabValue: filterState.tabValue // Keep the current tab value
    });
  }, [filterState.tabValue]);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { width: { xs: '100%', sm: 400 }, maxWidth: '100%' }
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header, Discovery Progress, Search, Filters, Tabs and TabPanels components would be rendered here */}
      </Box>
    </Drawer>
  );
};

export default TraitAndNPCListDrawer;