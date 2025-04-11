// src/routes/components/Layouts.tsx (Refactored GameLayout - minor changes)
import React, { useState } from 'react'; // Import useState for CharacterLayout
import { Outlet } from 'react-router-dom';
import { Box, Tabs, Tab, AppBar, Button, Typography, Toolbar } from '@mui/material'; // Ensure necessary MUI imports
import GameContainer from '../../layout/components/GameContainer'; // Assuming this uses MUI now

// Assuming these components are now MUI-based or compatible
import BreadcrumbNav from '../../shared/components/ui/BreadcrumbNav';
import EssenceDisplay from '../../features/Essence/components/ui/EssenceDisplay';
import TraitEffectNotification from '../../features/Traits/components/containers/TraitEffectNotification'; // Uses MUI Snackbar/Alert

// Hooks remain the same
import useEssenceGeneration from '../../features/Essence/hooks/useEssenceGeneration'; // Check path
import useTraitNotifications from '../../features/Traits/hooks/useTraitNotifications'; // Check path

// Import specific MUI icons if needed for CharacterLayout
import AssessmentIcon from '@mui/icons-material/Assessment';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
// Import CharacterManagementDrawer if it's used and MUI-based
import CharacterManagementDrawer from '../../shared/components/ui/CharacterManagementDrawer';

export const GameLayout: React.FC = () => {
    // Hooks
    useEssenceGeneration();
    const { notifications, dismissNotification } = useTraitNotifications(); // Get state/functions needed by children

    const handleDismissTraitEffect = (id: string) => {
        dismissNotification(id); // Call the actual dismiss function from the hook
        console.log(`Trait effect notification dismissed: ${id}`);
    };

    return (
        // GameContainer already provides the main structure
        <GameContainer>
            {/* Header content is likely handled within GameContainer now */}
            {/* <BreadcrumbNav /> */}
            {/* <EssenceDisplay /> */}

            {/* Outlet renders the specific page content */}
            <Outlet />

            {/* Notifications might be positioned globally or within GameContainer */}
            {/* TraitEffectNotification might be rendered globally or within GameContainer */}
            {/* <TraitEffectNotification
                 notifications={notifications}
                 onDismiss={handleDismissTraitEffect}
             /> */}
        </GameContainer>
    );
};

// --- CharacterLayout Refactoring ---
// (Assuming CharacterTabBar and CharacterManagementDrawer are custom or need refactoring)

export const CharacterLayout: React.FC = () => {
    const [activeTab, setActiveTab] = useState('stats'); // Keep string IDs
    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
        setActiveTab(newValue);
    };

    // Example Refactor of CharacterTabBar using MUI Tabs
    // This might live in its own component file
    const RenderMuiCharacterTabBar = () => (
        <AppBar position="static" color="default" elevation={1}>
            <Toolbar variant="dense">
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth" // or "standard" / "scrollable"
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
    // This would likely be its own component using MUI <Drawer> internally
    const RenderMuiCharacterDrawer = () => (
        <CharacterManagementDrawer // Keep using your wrapper if it internally uses MUI Drawer
            isOpen={drawerOpen}
            onClose={() => setDrawerOpen(false)}
        >
            {/* Drawer Content Goes Here */}
            <Typography>Character Details/Management</Typography>
        </CharacterManagementDrawer>
    );

    return (
        // Assume the parent route provides the main layout (like GameContainer)
        // This layout component adds the specific Character UI on top
        <>
            {/* Main character management interface */}
            <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                height: '100%', 
                overflow: 'hidden' 
            }}>
                {/* Tab navigation */}
                {RenderMuiCharacterTabBar()}

                {/* Content area that displays based on selected tab */}
                <Box sx={{ 
                    flex: 1, 
                    overflow: 'auto', 
                    p: 2,
                    bgcolor: 'background.default' 
                }}>
                    {activeTab === 'stats' && (
                        <Box>
                            {/* Stats content would go here */}
                            <Typography variant="h6">Character Statistics</Typography>
                            <Outlet />
                        </Box>
                    )}
                    {activeTab === 'inventory' && (
                        <Box>
                            {/* Inventory content would go here */}
                            <Typography variant="h6">Character Inventory</Typography>
                            <Outlet />
                        </Box>
                    )}
                    {activeTab === 'skills' && (
                        <Box>
                            {/* Skills content would go here */}
                            <Typography variant="h6">Character Skills</Typography>
                            <Outlet />
                        </Box>
                    )}
                </Box>

                {/* Character management button */}
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

            {/* Character management drawer */}
            {RenderMuiCharacterDrawer()}
        </>
    );
};