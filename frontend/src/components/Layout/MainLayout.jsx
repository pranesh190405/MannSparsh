import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
    AppBar, Toolbar, Typography, Drawer, List,
    ListItemIcon, ListItemText, ListItemButton, IconButton, Box, Avatar,
    Menu, MenuItem, Divider, Chip, Tooltip
} from '@mui/material';
import {
    Menu as MenuIcon, Dashboard, Psychology, VideoCall, Forum,
    Chat, ExitToApp, CalendarMonth, MedicalServices, AutoAwesome
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const drawerWidth = 264;

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
        { text: 'Dashboard', icon: <Dashboard />, path: '/', color: '#8b5cf6' },
        { text: 'Mental Health Check', icon: <Psychology />, path: '/screening', color: '#a78bfa' },
        { text: 'AI Chat Support', icon: <Chat />, path: '/chat', color: '#ec4899' },
        { text: 'Appointments', icon: <CalendarMonth />, path: '/appointments', color: '#10b981' },
        { text: 'Peer Forum', icon: <Forum />, path: '/forum', color: '#f59e0b' },
    ];

    const counsellorMenuItems = [
        { text: 'Counsellor Hub', icon: <MedicalServices />, path: '/counsellor/dashboard', color: '#8b5cf6' },
        { text: 'My Availability', icon: <CalendarMonth />, path: '/counsellor/availability', color: '#10b981' },
        { text: 'Appointments', icon: <VideoCall />, path: '/appointments', color: '#06b6d4' },
        { text: 'Pro Forum', icon: <Forum />, path: '/counsellor/forum', color: '#f59e0b' },
    ];

    const menuItems = isCounsellor
        ? [...counsellorMenuItems, { divider: true }, ...studentMenuItems]
        : studentMenuItems;

    const drawer = (
        <Box sx={{
            height: '100%', display: 'flex', flexDirection: 'column',
            background: 'rgba(15, 12, 41, 0.95)',
            backdropFilter: 'blur(30px)',
            WebkitBackdropFilter: 'blur(30px)',
        }}>
            {/* Logo */}
            <Box sx={{
                p: 2.5, display: 'flex', alignItems: 'center', gap: 1.5,
                animation: 'fadeInLeft 0.6s ease-out',
            }}>
                <Box sx={{
                    width: 40, height: 40, borderRadius: 3,
                    background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 20px rgba(139,92,246,0.4)',
                    animation: 'float 3s ease-in-out infinite',
                }}>
                    <Psychology sx={{ fontSize: 24, color: 'white' }} />
                </Box>
                <Box>
                    <Typography sx={{
                        fontWeight: 800, fontSize: '1.1rem', lineHeight: 1.2,
                        background: 'linear-gradient(135deg, #fff, #a78bfa)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}>
                        MannSparsh
                    </Typography>
                    <Typography sx={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>
                        Mental Health Platform
                    </Typography>
                </Box>
            </Box>

            <Divider />

            {/* User Info */}
            <Box sx={{
                px: 2.5, py: 2, display: 'flex', alignItems: 'center', gap: 1.5,
                animation: 'fadeInLeft 0.7s ease-out',
            }}>
                <Avatar sx={{
                    width: 38, height: 38,
                    background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
                    fontSize: '0.9rem',
                    boxShadow: '0 4px 12px rgba(139,92,246,0.3)',
                }}>
                    {user?.name?.[0]?.toUpperCase()}
                </Avatar>
                <Box sx={{ minWidth: 0 }}>
                    <Typography variant="body2" fontWeight={600} noWrap>{user?.name}</Typography>
                    <Chip
                        label={isCounsellor ? 'Counsellor' : user?.role || 'Student'}
                        size="small"
                        sx={{
                            height: 20, fontSize: '0.6rem', fontWeight: 600,
                            bgcolor: isCounsellor
                                ? 'rgba(16,185,129,0.15)'
                                : 'rgba(139,92,246,0.15)',
                            color: isCounsellor ? '#34d399' : '#a78bfa',
                            border: '1px solid',
                            borderColor: isCounsellor
                                ? 'rgba(16,185,129,0.3)'
                                : 'rgba(139,92,246,0.3)',
                        }}
                    />
                </Box>
            </Box>

            <Divider />

            {/* Navigation */}
            <List sx={{ flex: 1, px: 1.5, py: 1.5 }}>
                {isCounsellor && (
                    <Typography variant="overline" sx={{
                        px: 1.5, color: 'rgba(255,255,255,0.3)', fontSize: '0.58rem',
                        fontWeight: 700, letterSpacing: '0.1em',
                    }}>
                        Counsellor Tools
                    </Typography>
                )}
                {menuItems.map((item, index) => {
                    if (item.divider) {
                        return (
                            <Box key={`divider-${index}`}>
                                <Divider sx={{ my: 1.5 }} />
                                <Typography variant="overline" sx={{
                                    px: 1.5, color: 'rgba(255,255,255,0.3)', fontSize: '0.58rem',
                                    fontWeight: 700, letterSpacing: '0.1em',
                                }}>
                                    Student Features
                                </Typography>
                            </Box>
                        );
                    }
                    const isActive = location.pathname === item.path;
                    return (
                        <ListItemButton
                            key={item.text}
                            onClick={() => { navigate(item.path); setMobileOpen(false); }}
                            sx={{
                                borderRadius: 3, mb: 0.5, py: 1,
                                bgcolor: isActive
                                    ? `rgba(139,92,246,0.12)`
                                    : 'transparent',
                                border: isActive
                                    ? '1px solid rgba(139,92,246,0.2)'
                                    : '1px solid transparent',
                                '&:hover': {
                                    bgcolor: 'rgba(255,255,255,0.05)',
                                    transform: 'translateX(6px)',
                                },
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                animation: 'fadeInLeft 0.5s ease-out both',
                                animationDelay: `${0.1 + index * 0.05}s`,
                            }}
                        >
                            <ListItemIcon sx={{
                                minWidth: 38,
                                color: isActive ? item.color : 'rgba(255,255,255,0.4)',
                                transition: 'all 0.3s ease',
                            }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.text}
                                primaryTypographyProps={{
                                    fontSize: '0.85rem',
                                    fontWeight: isActive ? 600 : 500,
                                    color: isActive ? '#fff' : 'rgba(255,255,255,0.7)',
                                }}
                            />
                            {isActive && (
                                <Box sx={{
                                    width: 4, height: 22, borderRadius: 2,
                                    background: `linear-gradient(180deg, ${item.color}, transparent)`,
                                    boxShadow: `0 0 10px ${item.color}`,
                                    animation: 'pulseGlow 2s ease-in-out infinite',
                                }} />
                            )}
                        </ListItemButton>
                    );
                })}
            </List>

            {/* Logout */}
            <Box sx={{ p: 1.5, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <ListItemButton
                    onClick={handleLogout}
                    sx={{
                        borderRadius: 3,
                        '&:hover': {
                            bgcolor: 'rgba(239,68,68,0.1)',
                            '& .MuiListItemIcon-root, & .MuiListItemText-root span': {
                                color: '#f87171',
                            },
                        },
                        transition: 'all 0.3s ease',
                    }}
                >
                    <ListItemIcon sx={{ minWidth: 38, color: 'rgba(255,255,255,0.3)', transition: 'all 0.3s' }}>
                        <ExitToApp />
                    </ListItemIcon>
                    <ListItemText
                        primary="Sign Out"
                        primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: 500, color: 'rgba(255,255,255,0.5)' }}
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
                    background: 'rgba(15, 12, 41, 0.7)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    boxShadow: 'none',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
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
                        <IconButton onClick={handleMenu} size="small" sx={{
                            transition: 'all 0.3s',
                            '&:hover': { transform: 'scale(1.1)' },
                        }}>
                            <Avatar sx={{
                                width: 36, height: 36,
                                background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                                fontSize: '0.85rem',
                                boxShadow: '0 4px 12px rgba(139,92,246,0.3)',
                            }}>
                                {user?.name?.[0]?.toUpperCase()}
                            </Avatar>
                        </IconButton>
                    </Tooltip>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                        PaperProps={{
                            sx: {
                                mt: 1, minWidth: 200,
                                background: 'rgba(30, 30, 60, 0.95)',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255,255,255,0.1)',
                            }
                        }}
                    >
                        <Box sx={{ px: 2, py: 1 }}>
                            <Typography variant="subtitle2" fontWeight={600}>{user?.name}</Typography>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>{user?.email}</Typography>
                        </Box>
                        <Divider />
                        <MenuItem onClick={handleLogout} sx={{
                            color: '#f87171',
                            '&:hover': { bgcolor: 'rgba(239,68,68,0.1)' },
                        }}>
                            <ListItemIcon><ExitToApp fontSize="small" sx={{ color: '#f87171' }} /></ListItemIcon>
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
                        '& .MuiDrawer-paper': {
                            width: drawerWidth, border: 'none',
                            background: 'transparent',
                        }
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
                            background: 'transparent',
                            borderRight: '1px solid rgba(255,255,255,0.06)',
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
                    minHeight: '100vh',
                    background: 'transparent',
                }}
            >
                <Toolbar />
                <Outlet />
            </Box>
        </Box>
    );
};

export default MainLayout;
