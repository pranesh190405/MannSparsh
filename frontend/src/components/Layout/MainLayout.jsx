import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
    AppBar, Toolbar, Typography, Drawer, List, ListItem,
    ListItemIcon, ListItemText, ListItemButton, IconButton, Box, Avatar,
    Menu, MenuItem, Container, Divider, Chip, Tooltip
} from '@mui/material';
import {
    Menu as MenuIcon, Dashboard, Psychology, VideoCall, Forum,
    Chat, ExitToApp, CalendarMonth, Settings, AdminPanelSettings,
    MedicalServices
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const drawerWidth = 260;

const MainLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
    const handleMenu = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);
    const handleLogout = () => { logout(); navigate('/login'); };

    const isCounsellor = user?.role === 'counsellor';

    const studentMenuItems = [
        { text: 'Dashboard', icon: <Dashboard />, path: '/', color: '#6366f1' },
        { text: 'Mental Health Check', icon: <Psychology />, path: '/screening', color: '#8b5cf6' },
        { text: 'AI Chat Support', icon: <Chat />, path: '/chat', color: '#ec4899' },
        { text: 'Appointments', icon: <CalendarMonth />, path: '/appointments', color: '#10b981' },
        { text: 'Peer Forum', icon: <Forum />, path: '/forum', color: '#f59e0b' },
    ];

    const counsellorMenuItems = [
        { text: 'Counsellor Hub', icon: <MedicalServices />, path: '/counsellor/dashboard', color: '#6366f1' },
        { text: 'My Availability', icon: <CalendarMonth />, path: '/counsellor/availability', color: '#10b981' },
        { text: 'Appointments', icon: <VideoCall />, path: '/appointments', color: '#3b82f6' },
        { text: 'Pro Forum', icon: <Forum />, path: '/counsellor/forum', color: '#f59e0b' },
    ];

    const menuItems = isCounsellor
        ? [...counsellorMenuItems, { divider: true }, ...studentMenuItems]
        : studentMenuItems;

    if (user?.role === 'admin') {
        menuItems.push({ text: 'Admin Panel', icon: <AdminPanelSettings />, path: '/admin', color: '#dc2626' });
    }

    const drawer = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Logo Section */}
            <Box sx={{
                p: 3, textAlign: 'center',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
            }}>
                <Psychology sx={{ fontSize: 40, color: 'white', mb: 0.5 }} />
                <Typography variant="h6" fontWeight="bold" color="white">
                    CampusCare
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    Mental Health Platform
                </Typography>
            </Box>

            {/* User Info */}
            <Box sx={{
                p: 2, display: 'flex', alignItems: 'center', gap: 1.5,
                borderBottom: '1px solid #e2e8f0'
            }}>
                <Avatar sx={{
                    width: 36, height: 36,
                    background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                    fontSize: '0.9rem'
                }}>
                    {user?.name?.[0]?.toUpperCase()}
                </Avatar>
                <Box>
                    <Typography variant="body2" fontWeight="bold">{user?.name}</Typography>
                    <Chip
                        label={isCounsellor ? 'Counsellor' : user?.role || 'Student'}
                        size="small"
                        sx={{
                            height: 20, fontSize: '0.65rem', fontWeight: 600,
                            bgcolor: isCounsellor ? '#10b98120' : '#6366f120',
                            color: isCounsellor ? '#10b981' : '#6366f1'
                        }}
                    />
                </Box>
            </Box>

            {/* Navigation */}
            <List sx={{ flex: 1, px: 1.5, py: 2 }}>
                {isCounsellor && (
                    <Typography variant="overline" sx={{ px: 2, color: 'text.secondary', fontSize: '0.65rem' }}>
                        Counsellor Tools
                    </Typography>
                )}
                {menuItems.map((item, index) => {
                    if (item.divider) {
                        return (
                            <Box key={`divider-${index}`}>
                                <Divider sx={{ my: 1.5 }} />
                                <Typography variant="overline" sx={{ px: 2, color: 'text.secondary', fontSize: '0.65rem' }}>
                                    Student Features
                                </Typography>
                            </Box>
                        );
                    }
                    const isActive = location.pathname === item.path;
                    return (
                        <ListItemButton
                            key={item.text}
                            onClick={() => {
                                navigate(item.path);
                                setMobileOpen(false);
                            }}
                            sx={{
                                borderRadius: 2, mb: 0.5, py: 1,
                                bgcolor: isActive ? `${item.color}12` : 'transparent',
                                color: isActive ? item.color : 'text.primary',
                                '&:hover': { bgcolor: `${item.color}08` },
                                transition: 'all 0.2s'
                            }}
                        >
                            <ListItemIcon sx={{
                                minWidth: 40,
                                color: isActive ? item.color : '#94a3b8'
                            }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.text}
                                primaryTypographyProps={{
                                    fontSize: '0.875rem',
                                    fontWeight: isActive ? 700 : 500
                                }}
                            />
                            {isActive && (
                                <Box sx={{
                                    width: 4, height: 24, borderRadius: 2,
                                    bgcolor: item.color
                                }} />
                            )}
                        </ListItemButton>
                    );
                })}
            </List>

            {/* Logout */}
            <Box sx={{ p: 2, borderTop: '1px solid #e2e8f0' }}>
                <ListItemButton
                    onClick={handleLogout}
                    sx={{
                        borderRadius: 2, color: '#ef4444',
                        '&:hover': { bgcolor: '#ef444408' }
                    }}
                >
                    <ListItemIcon sx={{ minWidth: 40, color: '#ef4444' }}>
                        <ExitToApp />
                    </ListItemIcon>
                    <ListItemText
                        primary="Sign Out"
                        primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 500 }}
                    />
                </ListItemButton>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                    bgcolor: 'rgba(255,255,255,0.8)',
                    backdropFilter: 'blur(20px)',
                    color: 'text.primary',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    borderBottom: '1px solid #e2e8f0'
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit" edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Box sx={{ flexGrow: 1 }} />
                    <Tooltip title="Account">
                        <IconButton onClick={handleMenu} size="small">
                            <Avatar sx={{
                                width: 36, height: 36,
                                background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                                fontSize: '0.9rem'
                            }}>
                                {user?.name?.[0]?.toUpperCase()}
                            </Avatar>
                        </IconButton>
                    </Tooltip>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                        PaperProps={{ sx: { borderRadius: 2, mt: 1, minWidth: 180 } }}
                    >
                        <Box sx={{ px: 2, py: 1 }}>
                            <Typography variant="subtitle2" fontWeight="bold">{user?.name}</Typography>
                            <Typography variant="caption" color="text.secondary">{user?.email}</Typography>
                        </Box>
                        <Divider />
                        <MenuItem onClick={handleLogout} sx={{ color: '#ef4444' }}>
                            <ListItemIcon><ExitToApp fontSize="small" sx={{ color: '#ef4444' }} /></ListItemIcon>
                            Sign Out
                        </MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>

            <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
                <Drawer
                    variant="temporary" open={mobileOpen} onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { width: drawerWidth, border: 'none' }
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': {
                            width: drawerWidth, border: 'none',
                            boxShadow: '2px 0 8px rgba(0,0,0,0.04)'
                        }
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>

            <Box
                component="main"
                sx={{
                    flexGrow: 1, width: { sm: `calc(100% - ${drawerWidth}px)` },
                    bgcolor: '#f8fafc', minHeight: '100vh'
                }}
            >
                <Toolbar />
                <Outlet />
            </Box>
        </Box>
    );
};

export default MainLayout;
