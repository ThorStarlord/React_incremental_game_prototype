// src/routes/components/Layouts.tsx (Refactored GameLayout)
import React, { useState } from 'react'; 
import { Outlet } from 'react-router-dom';
// Add missing MUI imports: AppBar, Toolbar, Tabs, Tab, Button
import { Box, Typography, AppBar, Toolbar, Tabs, Tab, Button } from '@mui/material'; 
import MainGameLayout from '../../layout/components/MainGameLayout'; 

// Hooks remain the same if needed globally, otherwise move them
import useEssenceGeneration from '../../features/Essence/hooks/useEssenceGeneration'; 
import useTraitNotifications from '../../features/Traits/hooks/useTraitNotifications'; 

// Ensure icons are imported for CharacterLayout
import AssessmentIcon from '@mui/icons-material/Assessment';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CharacterManagementDrawer from '../../shared/components/ui/CharacterManagementDrawer';

export const GameLayout: React.FC = () => {
    // Hooks can remain if they manage global effects triggered within this layout
    useEssenceGeneration(); 

    // Render MainGameLayout, which contains the structure and renders the <Outlet /> internally
    return (
        <MainGameLayout />
    );
};

// --- CharacterLayout Refactoring ---
// Keep CharacterLayout as is, assuming it's used by different routes
export const CharacterLayout: React.FC = () => {
    const [activeTab, setActiveTab] = useState('stats'); 
    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
        setActiveTab(newValue);
    };

    // Example Refactor of CharacterTabBar using MUI Tabs
    const RenderMuiCharacterTabBar = () => (
        <AppBar position="static" color="default" elevation={1}>
            <Toolbar variant="dense">
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                    aria-label="Character Management Tabs"
                >
                    <Tab icon={<AssessmentIcon />} iconPosition="start" label="Stats" value="stats" />
                    <Tab icon={<Inventory2Icon />} iconPosition="start" label="Inventory" value="inventory" />
                    <Tab icon={<AutoAwesomeIcon />} iconPosition="start" label="Skills" value="skills" />
                </Tabs>
            </Toolbar>
        </AppBar>
    );

    // Refactor CharacterManagementDrawer using MUI Drawer
    const RenderMuiCharacterDrawer = () => (
        <CharacterManagementDrawer
            isOpen={drawerOpen}
            onClose={() => setDrawerOpen(false)}
        >
            <Typography>Character Details/Management</Typography>
        </CharacterManagementDrawer>
    );

    return (
        <>
            <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                height: '100%', 
                overflow: 'hidden' 
            }}>
                {RenderMuiCharacterTabBar()}

                <Box sx={{ 
                    flex: 1, 
                    overflow: 'auto', 
                    p: 2,
                    bgcolor: 'background.default' 
                }}>
                    {activeTab === 'stats' && (
                        <Box>
                            <Typography variant="h6">Character Statistics</Typography>
                            <Outlet />
                        </Box>
                    )}
                    {activeTab === 'inventory' && (
                        <Box>
                            <Typography variant="h6">Character Inventory</Typography>
                            <Outlet />
                        </Box>
                    )}
                    {activeTab === 'skills' && (
                        <Box>
                            <Typography variant="h6">Character Skills</Typography>
                            <Outlet />
                        </Box>
                    )}
                </Box>

                <Box sx={{ position: 'absolute', bottom: 16, right: 16 }}>
                    <Button 
                        variant="contained" 
                        color="primary"
                        onClick={() => setDrawerOpen(true)}
                    >
                        Character Details
                    </Button>
                </Box>
            </Box>

            {RenderMuiCharacterDrawer()}
        </>
    );
};