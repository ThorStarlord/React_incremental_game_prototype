import React, { useState, MouseEvent } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Menu, 
  MenuItem, 
  Badge, 
  Tooltip, 
  useMediaQuery, 
  useTheme, 
  Box, 
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import PetsIcon from '@mui/icons-material/Pets';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import './styles/Header.css';

/**
 * Interface representing a navigation item
 */
interface NavigationItem {
  /** Display text for the navigation item */
  text: string;
  /** Route path for navigation */
  path: string;
  /** Icon component to display with the item */
  icon: React.ReactNode;
}

/**
 * Props for the Header component
 */
interface HeaderProps {
  /** Title displayed in the header */
  title?: string;
  /** Number of unread notifications */
  notificationCount?: number;
}

/**
 * Header Component
 * 
 * @component
 * @description
 * Main navigation header for the incremental RPG game. Provides access to different
 * game sections and features responsive design for various screen sizes.
 * 
 * @example
 * return (
 *   <Header title="My Game" notificationCount={5} />
 * )
 */
const Header: React.FC<HeaderProps> = ({ 
  title = 'Incremental RPG', 
  notificationCount = 0 
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const location = useLocation();
    
    // State for mobile drawer
    const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
    // State for notification menu
    const [notificationMenuAnchor, setNotificationMenuAnchor] = useState<HTMLElement | null>(null);
    // State for user profile menu
    const [userMenuAnchor, setUserMenuAnchor] = useState<HTMLElement | null>(null);
    
    const navigationItems: NavigationItem[] = [
        { text: 'Home', path: '/', icon: <HomeIcon /> },
        { text: 'Minions', path: '/minions', icon: <PetsIcon /> },
        { text: 'Traits', path: '/traits', icon: <AutoFixHighIcon /> },
        { text: 'Settings', path: '/settings', icon: <SettingsIcon /> }
    ];
    
    const handleDrawerToggle = (): void => {
        setDrawerOpen(!drawerOpen);
    };
    
    const handleNotificationMenuOpen = (event: MouseEvent<HTMLElement>): void => {
        setNotificationMenuAnchor(event.currentTarget);
    };
    
    const handleNotificationMenuClose = (): void => {
        setNotificationMenuAnchor(null);
    };
    
    const handleUserMenuOpen = (event: MouseEvent<HTMLElement>): void => {
        setUserMenuAnchor(event.currentTarget);
    };
    
    const handleUserMenuClose = (): void => {
        setUserMenuAnchor(null);
    };
    
    const isActive = (path: string): boolean => {
        return location.pathname === path;
    };
    
    // Mobile drawer content
    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ width: 250 }}>
            <Typography variant="h6" sx={{ my: 2, textAlign: 'center' }}>
                {title}
            </Typography>
            <Divider />
            <List>
                {navigationItems.map((item) => (
                    <ListItemButton 
                        component={Link} 
                        to={item.path} 
                        key={item.text}
                        selected={isActive(item.path)}
                    >
                        <ListItemIcon>
                            {item.icon}
                        </ListItemIcon>
                        <ListItemText primary={item.text} />
                    </ListItemButton>
                ))}
            </List>
        </Box>
    );
    
    return (
        <>
            <AppBar position="static" className="header">
                <Toolbar>
                    {isMobile && (
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}
                    
                    <Typography variant="h6" component="div" className="header-title" sx={{ flexGrow: 1 }}>
                        {title}
                    </Typography>
                    
                    {/* Desktop navigation */}
                    {!isMobile && (
                        <Box className="header-nav">
                            {navigationItems.map((item) => (
                                <Button 
                                    color="inherit" 
                                    component={Link} 
                                    to={item.path} 
                                    key={item.text}
                                    startIcon={item.icon}
                                    className={isActive(item.path) ? 'active-nav-link' : ''}
                                >
                                    {item.text}
                                </Button>
                            ))}
                        </Box>
                    )}
                    
                    {/* Notifications */}
                    <Box sx={{ display: 'flex' }}>
                        <Tooltip title="Notifications">
                            <IconButton 
                                color="inherit" 
                                onClick={handleNotificationMenuOpen}
                                aria-controls="notification-menu"
                                aria-haspopup="true"
                            >
                                <Badge badgeContent={notificationCount} color="secondary">
                                    <NotificationsIcon />
                                </Badge>
                            </IconButton>
                        </Tooltip>
                        
                        {/* User profile */}
                        <Tooltip title="User Profile">
                            <IconButton 
                                color="inherit" 
                                onClick={handleUserMenuOpen}
                                aria-controls="user-menu"
                                aria-haspopup="true"
                            >
                                <AccountCircleIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                    
                    {/* Notification Menu */}
                    <Menu
                        id="notification-menu"
                        anchorEl={notificationMenuAnchor}
                        keepMounted
                        open={Boolean(notificationMenuAnchor)}
                        onClose={handleNotificationMenuClose}
                    >
                        {notificationCount > 0 ? (
                            [...Array(notificationCount)].map((_, index) => (
                                <MenuItem key={index} onClick={handleNotificationMenuClose}>
                                    Notification {index + 1}
                                </MenuItem>
                            ))
                        ) : (
                            <MenuItem onClick={handleNotificationMenuClose}>No new notifications</MenuItem>
                        )}
                    </Menu>
                    
                    {/* User Menu */}
                    <Menu
                        id="user-menu"
                        anchorEl={userMenuAnchor}
                        keepMounted
                        open={Boolean(userMenuAnchor)}
                        onClose={handleUserMenuClose}
                    >
                        <MenuItem onClick={handleUserMenuClose}>Profile</MenuItem>
                        <MenuItem onClick={handleUserMenuClose}>My account</MenuItem>
                        <MenuItem onClick={handleUserMenuClose}>Logout</MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>
            
            {/* Mobile Drawer */}
            <Drawer
                variant="temporary"
                open={drawerOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true, // Better mobile performance
                }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
                }}
            >
                {drawer}
            </Drawer>
        </>
    );
};

export default Header;
