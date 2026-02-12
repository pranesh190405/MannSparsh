import React, { useState, useEffect, useRef } from 'react';
import {
    Box, Paper, TextField, IconButton, Typography, Avatar,
    Chip, Button, Container
} from '@mui/material';
import {
    Send, SmartToy, Person, Psychology, CalendarMonth,
    Warning, SentimentSatisfied, AutoAwesome
} from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Chat = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    useEffect(() => { fetchHistory(); }, []);
    useEffect(() => { scrollToBottom(); }, [messages]);

    const fetchHistory = async () => {
        try { const res = await axios.get('/api/chat/history'); setMessages(res.data || []); }
        catch (err) { console.error(err); }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        const userMsg = { sender: 'user', content: input, timestamp: new Date() };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);
        try {
            const res = await axios.post('/api/chat/message', { message: userMsg.content });
            const botResponse = res.data;
            setMessages(prev => [...prev, {
                sender: 'bot', content: botResponse.message,
                emotion: botResponse.emotion, risk_level: botResponse.risk_level,
                suggest_booking: botResponse.suggest_booking,
                suggest_screening: botResponse.suggest_screening,
                timestamp: new Date()
            }]);
        } catch (err) {
            console.error(err);
            setMessages(prev => [...prev, {
                sender: 'bot',
                content: "I'm having trouble connecting. If you're in crisis, please call a crisis helpline.",
                timestamp: new Date()
            }]);
        } finally { setLoading(false); }
    };

    const getRiskColor = (level) => {
        if (level === 'high') return '#ef4444';
        if (level === 'medium') return '#f59e0b';
        return '#10b981';
    };

    const quickPrompts = [
        "I'm feeling stressed about exams",
        "I can't concentrate on studies",
        "I feel lonely at college",
        "I'm having trouble sleeping"
    ];

    return (
        <Container maxWidth="md" sx={{
            height: { xs: 'calc(100vh - 80px)', sm: 'calc(100vh - 100px)' },
            display: 'flex', flexDirection: 'column', py: { xs: 1, sm: 2 },
            position: 'relative'
        }}>
            {/* Header */}
            <Box className="animate-fadeInDown" sx={{
                display: 'flex', alignItems: 'center', gap: 2, mb: 2,
                pb: 2, borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}>
                <Avatar sx={{
                    background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                    width: 48, height: 48,
                    boxShadow: '0 4px 20px rgba(139,92,246,0.4)',
                    animation: 'float 3s ease-in-out infinite',
                }}>
                    <SmartToy sx={{ fontSize: 24 }} />
                </Avatar>
                <Box>
                    <Typography sx={{
                        fontSize: '1.3rem', fontWeight: 700,
                        background: 'linear-gradient(135deg, #fff, #a78bfa)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}>
                        MannSparsh AI
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>
                        Your compassionate mental health companion
                    </Typography>
                </Box>
                <Box sx={{ ml: 'auto' }}>
                    <AutoAwesome sx={{
                        color: '#8b5cf6', fontSize: 20,
                        animation: 'spin 4s linear infinite',
                    }} />
                </Box>
            </Box>

            {/* Messages Area */}
            <Box sx={{
                flexGrow: 1, mb: 2, p: 2, overflowY: 'auto',
                borderRadius: 5,
                background: 'rgba(255,255,255,0.03)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.06)',
            }}>
                {messages.length === 0 && (
                    <Box textAlign="center" sx={{ mt: 6, animation: 'fadeInUp 0.8s ease-out' }}>
                        <Box sx={{
                            width: 80, height: 80, borderRadius: '50%', mx: 'auto', mb: 2,
                            background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(236,72,153,0.1))',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            animation: 'float 4s ease-in-out infinite',
                            border: '1px solid rgba(139,92,246,0.2)',
                        }}>
                            <Psychology sx={{ fontSize: 40, color: '#8b5cf6' }} />
                        </Box>
                        <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600, mb: 0.5 }}>
                            How can I help you today?
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)', mb: 3 }}>
                            Everything shared is confidential. I'm here to listen.
                        </Typography>
                        <Box display="flex" flexWrap="wrap" justifyContent="center" gap={1}>
                            {quickPrompts.map((prompt, idx) => (
                                <Chip
                                    key={idx} label={prompt}
                                    variant="outlined"
                                    onClick={() => setInput(prompt)}
                                    sx={{
                                        cursor: 'pointer',
                                        borderColor: 'rgba(139,92,246,0.3)',
                                        color: 'rgba(255,255,255,0.6)',
                                        backdropFilter: 'blur(10px)',
                                        background: 'rgba(139,92,246,0.06)',
                                        fontSize: '0.78rem',
                                        transition: 'all 0.3s ease',
                                        animation: 'fadeInUp 0.5s ease-out both',
                                        animationDelay: `${0.3 + idx * 0.1}s`,
                                        '&:hover': {
                                            bgcolor: 'rgba(139,92,246,0.15)',
                                            borderColor: '#8b5cf6',
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 4px 12px rgba(139,92,246,0.2)',
                                        },
                                    }}
                                />
                            ))}
                        </Box>
                    </Box>
                )}

                {messages.map((msg, index) => (
                    <Box key={index} sx={{
                        display: 'flex',
                        justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                        mb: 2,
                        animation: msg.sender === 'user' ? 'fadeInRight 0.4s ease-out' : 'fadeInLeft 0.4s ease-out',
                    }}>
                        {msg.sender === 'bot' && (
                            <Avatar sx={{
                                width: 32, height: 32, mr: 1, mt: 0.5,
                                background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
                                boxShadow: '0 2px 8px rgba(139,92,246,0.3)',
                            }}>
                                <SmartToy sx={{ fontSize: 16 }} />
                            </Avatar>
                        )}
                        <Box sx={{ maxWidth: '75%' }}>
                            <Paper sx={{
                                p: 2,
                                background: msg.sender === 'user'
                                    ? 'linear-gradient(135deg, #8b5cf6, #6366f1)'
                                    : 'rgba(255,255,255,0.06)',
                                backdropFilter: msg.sender === 'bot' ? 'blur(20px)' : 'none',
                                border: msg.sender === 'bot'
                                    ? '1px solid rgba(255,255,255,0.08)'
                                    : 'none',
                                borderRadius: msg.sender === 'user'
                                    ? '16px 16px 4px 16px'
                                    : '16px 16px 16px 4px',
                                boxShadow: msg.sender === 'user'
                                    ? '0 4px 16px rgba(139,92,246,0.3)'
                                    : '0 4px 16px rgba(0,0,0,0.2)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'scale(1.01)',
                                    boxShadow: msg.sender === 'user'
                                        ? '0 6px 24px rgba(139,92,246,0.4)'
                                        : '0 6px 24px rgba(0,0,0,0.3)',
                                },
                            }}>
                                <Typography variant="body1" sx={{
                                    whiteSpace: 'pre-wrap', lineHeight: 1.7, fontSize: '0.9rem',
                                    color: msg.sender === 'user' ? '#fff' : 'rgba(255,255,255,0.85)',
                                }}>
                                    {msg.content}
                                </Typography>
                            </Paper>

                            {msg.sender === 'bot' && (msg.emotion || msg.risk_level) && (
                                <Box display="flex" gap={0.5} mt={0.5} flexWrap="wrap">
                                    {msg.emotion && (
                                        <Chip
                                            icon={<SentimentSatisfied sx={{ fontSize: 13 }} />}
                                            label={msg.emotion} size="small" variant="outlined"
                                            sx={{
                                                height: 22, fontSize: '0.68rem',
                                                borderColor: 'rgba(255,255,255,0.1)',
                                                color: 'rgba(255,255,255,0.5)',
                                            }}
                                        />
                                    )}
                                    {msg.risk_level && msg.risk_level !== 'low' && (
                                        <Chip
                                            icon={<Warning sx={{ fontSize: 13 }} />}
                                            label={`Risk: ${msg.risk_level}`} size="small"
                                            sx={{
                                                height: 22, fontSize: '0.68rem', fontWeight: 600,
                                                bgcolor: getRiskColor(msg.risk_level) + '20',
                                                color: getRiskColor(msg.risk_level),
                                                border: '1px solid ' + getRiskColor(msg.risk_level) + '30',
                                            }}
                                        />
                                    )}
                                </Box>
                            )}

                            {msg.sender === 'bot' && (msg.suggest_booking || msg.suggest_screening) && (
                                <Box display="flex" gap={1} mt={1}>
                                    {msg.suggest_booking && (
                                        <Button size="small" variant="outlined"
                                            startIcon={<CalendarMonth sx={{ fontSize: 14 }} />}
                                            onClick={() => navigate('/appointments')}
                                            sx={{ fontSize: '0.73rem' }}
                                        >
                                            Book Counsellor
                                        </Button>
                                    )}
                                    {msg.suggest_screening && (
                                        <Button size="small" variant="outlined"
                                            startIcon={<Psychology sx={{ fontSize: 14 }} />}
                                            onClick={() => navigate('/screening')}
                                            sx={{ fontSize: '0.73rem' }}
                                        >
                                            Take Screening
                                        </Button>
                                    )}
                                </Box>
                            )}
                        </Box>
                        {msg.sender === 'user' && (
                            <Avatar sx={{
                                width: 32, height: 32, ml: 1, mt: 0.5,
                                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                                boxShadow: '0 2px 8px rgba(99,102,241,0.3)',
                            }}>
                                <Person sx={{ fontSize: 16 }} />
                            </Avatar>
                        )}
                    </Box>
                ))}

                {loading && (
                    <Box display="flex" alignItems="center" gap={1.5} sx={{
                        ml: 5, animation: 'fadeInLeft 0.3s ease-out',
                    }}>
                        <Box sx={{
                            display: 'flex', gap: 0.5, p: 2,
                            background: 'rgba(255,255,255,0.06)',
                            backdropFilter: 'blur(20px)',
                            borderRadius: 3,
                            border: '1px solid rgba(255,255,255,0.08)',
                        }}>
                            {[0, 1, 2].map(i => (
                                <Box key={i} sx={{
                                    width: 8, height: 8, borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                                    animation: 'pulse 1.4s infinite',
                                    animationDelay: `${i * 0.2}s`,
                                }} />
                            ))}
                        </Box>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)' }}>
                            Thinking...
                        </Typography>
                    </Box>
                )}
                <div ref={messagesEndRef} />
            </Box>

            {/* Input Area */}
            <Paper
                component="form"
                onSubmit={handleSend}
                className="animate-slideInBottom"
                sx={{
                    p: 1.5, display: 'flex', alignItems: 'center',
                    background: 'rgba(255,255,255,0.06)',
                    backdropFilter: 'blur(30px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 4,
                    transition: 'all 0.3s ease',
                    '&:focus-within': {
                        border: '1px solid rgba(139,92,246,0.4)',
                        boxShadow: '0 0 30px rgba(139,92,246,0.15)',
                    },
                }}
            >
                <TextField
                    sx={{
                        ml: 1, flex: 1,
                        '& .MuiInputBase-root': { background: 'transparent' },
                    }}
                    placeholder="Type how you're feeling..."
                    variant="standard"
                    InputProps={{
                        disableUnderline: true,
                        sx: { fontSize: '0.9rem', color: '#fff' }
                    }}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={loading}
                    autoComplete="off"
                />
                <IconButton
                    type="submit"
                    disabled={loading || !input.trim()}
                    sx={{
                        width: 42, height: 42, ml: 1,
                        background: input.trim()
                            ? 'linear-gradient(135deg, #8b5cf6, #6366f1)'
                            : 'rgba(255,255,255,0.06)',
                        color: 'white',
                        boxShadow: input.trim() ? '0 4px 16px rgba(139,92,246,0.4)' : 'none',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                            background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                            transform: 'scale(1.1) rotate(-12deg)',
                            boxShadow: '0 6px 24px rgba(139,92,246,0.5)',
                        },
                        '&.Mui-disabled': {
                            color: 'rgba(255,255,255,0.2)',
                            background: 'rgba(255,255,255,0.04)',
                        },
                    }}
                >
                    <Send sx={{ fontSize: 18 }} />
                </IconButton>
            </Paper>
        </Container>
    );
};

export default Chat;
