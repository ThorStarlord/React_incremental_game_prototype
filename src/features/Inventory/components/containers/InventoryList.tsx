import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Divider, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  TextField,
  IconButton,
  SelectChangeEvent
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';

import { Item, ItemCategory, ITEM_CATEGORIES } from '../../../../context/initialStates/itemsInitialState';
import { sortItems, filterItemsByCategory } from '../../utils/inventoryUtils';
import InventorySlot from '../presentation/InventorySlot';
import ItemDetailsDialog from '../presentation/ItemDetailsDialog';
import useInventory from '../../hooks/useInventory';

/**
 * Interface for InventoryList component props
 */
interface InventoryListProps {
  /** Optional title for the inventory list */
  title?: string;
  /** Callback when an item is selected */
  onItemSelected?: (item: Item) => void;
  /** Default category filter */
  defaultCategory?: ItemCategory;
  /** Whether to show all inventory management features */
  fullFeatures?: boolean;
  /** Custom styling */
  sx?: React.CSSProperties;
}

/**
 * InventoryList component displays a player's inventory with filtering and sorting options
 * 
 * @param {InventoryListProps} props Component props
 * @returns {JSX.Element} Rendered component
 */
const InventoryList: React.FC<InventoryListProps> = ({ 
  title = 'Inventory', 
  onItemSelected,
  defaultCategory,
  fullFeatures = true,
  sx 
}): JSX.Element => {
  // Get inventory data from hook
  const { items, inventory, removeItem } = useInventory();
  
  // Local state
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [showItemDetails, setShowItemDetails] = useState<boolean>(false);
  const [category, setCategory] = useState<ItemCategory | 'all'>(defaultCategory || 'all');
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<boolean>(true); // true = ascending
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Filter and sort items
  const displayedItems = React.useMemo(() => {
    // Start with all items
    let filteredItems = [...items];
    
    // Apply category filter
    if (category !== 'all') {
      filteredItems = filterItemsByCategory(filteredItems, category);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredItems = filteredItems.filter(item => 
        item.name.toLowerCase().includes(query) || 
        item.description.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    return sortItems(filteredItems, sortBy, sortDirection);
  }, [items, category, sortBy, sortDirection, searchQuery]);
  
  // Handle category change
  const handleCategoryChange = (event: SelectChangeEvent<string>): void => {
    setCategory(event.target.value as ItemCategory | 'all');
  };
  
  // Handle sort change
  const handleSortChange = (event: SelectChangeEvent<string>): void => {
    setSortBy(event.target.value);
  };
  
  // Handle sort direction toggle
  const toggleSortDirection = (): void => {
    setSortDirection(prevDirection => !prevDirection);
  };
  
  // Handle search input
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(event.target.value);
  };
  
  // Handle item click
  const handleItemClick = (item: Item | null): void => {
    if (!item) return;
    
    setSelectedItem(item);
    
    if (fullFeatures) {
      setShowItemDetails(true);
    }
    
    if (onItemSelected) {
      onItemSelected(item);
    }
  };
  
  // Handle item use
  const handleUseItem = (item: Item): void => {
    // Implement item usage logic here
    console.log(`Using item: ${item.name}`);
    
    // If consumable, remove after use
    if (item.consumable) {
      removeItem(item.id);
    }
    
    setShowItemDetails(false);
  };
  
  // Handle item drop
  const handleDropItem = (item: Item): void => {
    removeItem(item.id);
    setSelectedItem(null);
    setShowItemDetails(false);
  };
  
  // Handle equip/unequip
  const handleEquipItem = (item: Item): void => {
    // Implement equip logic here
    console.log(`Equipping item: ${item.name}`);
    
    setShowItemDetails(false);
  };
  
  return (
    <Paper elevation={2} sx={{ p: 2, ...sx }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="body2" color="text.secondary">
          {displayedItems.length}/{inventory.maxSlots} slots
        </Typography>
      </Box>
      
      {fullFeatures && (
        <Box sx={{ mb: 2 }}>
          <Grid container spacing={2} alignItems="center">
            {/* Category Filter */}
            <Grid item xs={12} sm={4}>
              <FormControl size="small" fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={category}
                  label="Category"
                  onChange={handleCategoryChange}
                >
                  <MenuItem value="all">All Items</MenuItem>
                  {Object.values(ITEM_CATEGORIES).map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            {/* Sort By */}
            <Grid item xs={8} sm={3}>
              <FormControl size="small" fullWidth>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  label="Sort By"
                  onChange={handleSortChange}
                >
                  <MenuItem value="name">Name</MenuItem>
                  <MenuItem value="value">Value</MenuItem>
                  <MenuItem value="rarity">Rarity</MenuItem>
                  {category !== 'all' && <MenuItem value="category">Category</MenuItem>}
                </Select>
              </FormControl>
            </Grid>
            
            {/* Sort Direction */}
            <Grid item xs={4} sm={1}>
              <IconButton onClick={toggleSortDirection}>
                <FilterListIcon sx={{ 
                  transform: sortDirection ? 'none' : 'rotate(180deg)',
                  transition: 'transform 0.3s'
                }} />
              </IconButton>
            </Grid>
            
            {/* Search */}
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search items..."
                value={searchQuery}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />
                }}
              />
            </Grid>
          </Grid>
        </Box>
      )}
      
      <Divider sx={{ my: 2 }} />
      
      {/* Item Grid */}
      <Box sx={{ mt: 2 }}>
        {displayedItems.length > 0 ? (
          <Grid container spacing={1}>
            {displayedItems.map((item) => (
              <Grid item xs={4} sm={3} md={2} key={`${item.id}-${item.quantity}`}>
                <InventorySlot
                  item={item}
                  isSelected={selectedItem?.id === item.id}
                  onClick={handleItemClick}
                  onUseItem={fullFeatures ? handleUseItem : undefined}
                  onDropItem={fullFeatures ? handleDropItem : undefined}
                  onEquipItem={fullFeatures ? handleEquipItem : undefined}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="text.secondary">
              {searchQuery ? 'No items match your search' : 'No items in inventory'}
            </Typography>
          </Box>
        )}
      </Box>
      
      {fullFeatures && (
        <ItemDetailsDialog
          item={selectedItem}
          open={showItemDetails}
          onClose={() => setShowItemDetails(false)}
          onUse={handleUseItem}
          onDrop={handleDropItem}
          onEquip={handleEquipItem}
        />
      )}
    </Paper>
  );
};

export default InventoryList;
