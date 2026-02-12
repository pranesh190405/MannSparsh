import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#8b5cf6',
            light: '#a78bfa',
            dark: '#7c3aed',
        },
        secondary: {
            main: '#ec4899',
            light: '#f472b6',
            dark: '#db2777',
        },
        success: {
            main: '#10b981',
            light: '#34d399',
            dark: '#059669',
        },
        warning: {
            main: '#f59e0b',
            light: '#fbbf24',
            dark: '#d97706',
        },
        error: {
            main: '#ef4444',
            light: '#f87171',
            dark: '#dc2626',
        },
        background: {
            default: 'transparent',
            paper: 'rgba(255, 255, 255, 0.06)',
        },
        text: {
            primary: '#ffffff',
            secondary: 'rgba(255, 255, 255, 0.6)',
        },
        divider: 'rgba(255, 255, 255, 0.08)',
    },
    typography: {
        fontFamily: '"Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        h1: { fontWeight: 800, fontSize: '2.5rem', letterSpacing: '-0.02em' },
        h2: { fontWeight: 700, fontSize: '2rem', letterSpacing: '-0.02em' },
        h3: { fontWeight: 700, fontSize: '1.5rem', letterSpacing: '-0.01em' },
        h4: { fontWeight: 700, fontSize: '1.25rem' },
        h5: { fontWeight: 600, fontSize: '1.1rem' },
        h6: { fontWeight: 600, fontSize: '0.95rem' },
        body1: { fontSize: '0.938rem', lineHeight: 1.7 },
        body2: { fontSize: '0.85rem', lineHeight: 1.6 },
        caption: { fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' },
    },
    shape: {
        borderRadius: 16,
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
                    backgroundAttachment: 'fixed',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 14,
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    padding: '10px 24px',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: '-100%',
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
                        transition: 'left 0.5s ease',
                    },
                    '&:hover::before': {
                        left: '100%',
                    },
                    '&:hover': {
                        transform: 'translateY(-2px)',
                    },
                    '&:active': {
                        transform: 'translateY(0) scale(0.98)',
                    },
                },
                containedPrimary: {
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 50%, #8b5cf6 100%)',
                    backgroundSize: '200% 200%',
                    animation: 'gradientShift 3s ease infinite',
                    boxShadow: '0 4px 20px rgba(139, 92, 246, 0.4)',
                    '&:hover': {
                        boxShadow: '0 6px 30px rgba(139, 92, 246, 0.6)',
                    },
                },
                containedSecondary: {
                    background: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 50%, #ec4899 100%)',
                    backgroundSize: '200% 200%',
                    animation: 'gradientShift 3s ease infinite',
                    boxShadow: '0 4px 20px rgba(236, 72, 153, 0.4)',
                    '&:hover': {
                        boxShadow: '0 6px 30px rgba(236, 72, 153, 0.6)',
                    },
                },
                containedSuccess: {
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #10b981 100%)',
                    backgroundSize: '200% 200%',
                    animation: 'gradientShift 3s ease infinite',
                    boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)',
                    '&:hover': {
                        boxShadow: '0 6px 30px rgba(16, 185, 129, 0.6)',
                    },
                },
                containedError: {
                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #ef4444 100%)',
                    backgroundSize: '200% 200%',
                    animation: 'gradientShift 3s ease infinite',
                    boxShadow: '0 4px 20px rgba(239, 68, 68, 0.4)',
                    '&:hover': {
                        boxShadow: '0 6px 30px rgba(239, 68, 68, 0.6)',
                    },
                },
                containedWarning: {
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #f59e0b 100%)',
                    backgroundSize: '200% 200%',
                    animation: 'gradientShift 3s ease infinite',
                    boxShadow: '0 4px 20px rgba(245, 158, 11, 0.4)',
                    color: '#000',
                    '&:hover': {
                        boxShadow: '0 6px 30px rgba(245, 158, 11, 0.6)',
                    },
                },
                outlined: {
                    borderWidth: '1.5px',
                    borderColor: 'rgba(139, 92, 246, 0.4)',
                    color: '#a78bfa',
                    backdropFilter: 'blur(10px)',
                    background: 'rgba(139, 92, 246, 0.06)',
                    '&:hover': {
                        borderColor: '#8b5cf6',
                        background: 'rgba(139, 92, 246, 0.15)',
                        borderWidth: '1.5px',
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    background: 'rgba(255, 255, 255, 0.06)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    borderRadius: 20,
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    background: 'rgba(255, 255, 255, 0.06)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    borderRadius: 20,
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                    overflow: 'hidden',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                        border: '1px solid rgba(139, 92, 246, 0.3)',
                        boxShadow: '0 12px 48px rgba(139, 92, 246, 0.15), 0 8px 32px rgba(0,0,0,0.3)',
                        transform: 'translateY(-4px)',
                    },
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    fontWeight: 500,
                    fontSize: '0.78rem',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        transform: 'scale(1.05)',
                    },
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 14,
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.3s ease',
                        '& fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.1)',
                            transition: 'all 0.3s ease',
                        },
                        '&:hover fieldset': {
                            borderColor: 'rgba(139, 92, 246, 0.4)',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#8b5cf6',
                            boxShadow: '0 0 20px rgba(139, 92, 246, 0.2)',
                        },
                    },
                    '& .MuiInputLabel-root': {
                        color: 'rgba(255, 255, 255, 0.5)',
                    },
                    '& .MuiInputBase-input': {
                        color: '#fff',
                    },
                },
            },
        },
        MuiAvatar: {
            styleOverrides: {
                root: {
                    fontWeight: 600,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        transform: 'scale(1.1)',
                        boxShadow: '0 6px 20px rgba(139, 92, 246, 0.3)',
                    },
                },
            },
        },
        MuiDialog: {
            styleOverrides: {
                paper: {
                    background: 'rgba(30, 30, 60, 0.9)',
                    backdropFilter: 'blur(30px)',
                    WebkitBackdropFilter: 'blur(30px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 24,
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
                },
            },
        },
        MuiTab: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    color: 'rgba(255,255,255,0.5)',
                    transition: 'all 0.3s ease',
                    '&.Mui-selected': {
                        color: '#a78bfa',
                    },
                    '&:hover': {
                        color: '#fff',
                    },
                },
            },
        },
        MuiTabs: {
            styleOverrides: {
                indicator: {
                    backgroundColor: '#8b5cf6',
                    height: 3,
                    borderRadius: 2,
                    boxShadow: '0 0 10px rgba(139, 92, 246, 0.5)',
                },
            },
        },
        MuiFab: {
            styleOverrides: {
                root: {
                    background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
                    boxShadow: '0 8px 24px rgba(139, 92, 246, 0.4)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                        transform: 'scale(1.1) rotate(90deg)',
                        boxShadow: '0 12px 36px rgba(139, 92, 246, 0.6)',
                    },
                },
            },
        },
        MuiAlert: {
            styleOverrides: {
                root: {
                    borderRadius: 14,
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                },
            },
        },
        MuiDivider: {
            styleOverrides: {
                root: {
                    borderColor: 'rgba(255, 255, 255, 0.06)',
                },
            },
        },
        MuiListItemButton: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                        transform: 'translateX(4px)',
                    },
                },
            },
        },
    },
});

export default theme;
