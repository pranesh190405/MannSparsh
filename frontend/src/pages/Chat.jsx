import React, { useState, useEffect, useRef } from 'react';
import {
    Box, Paper, TextField, IconButton, Typography, Avatar,
    CircularProgress, Chip, Button, Container, Fade
} from '@mui/material';
import {
    Send, SmartToy, Person, Psychology, CalendarMonth,
    Warning, SentimentSatisfied
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

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchHistory = async () => {
        try {
            const res = await axios.get('/api/chat/history');
            setMessages(res.data || []);
        } catch (err) {
            console.error(err);
        }
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
            const botMsg = {
                sender: 'bot',
                content: botResponse.message,
                emotion: botResponse.emotion,
                risk_level: botResponse.risk_level,
                suggest_booking: botResponse.suggest_booking,
                suggest_screening: botResponse.suggest_screening,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botMsg]);
        } catch (err) {
            console.error(err);
            const errorMsg = {
                sender: 'bot',
                content: "I'm having trouble connecting right now. If you're in crisis, please reach out to a counsellor or call a crisis helpline immediately.",
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setLoading(false);
        }
    };

    const getRiskColor = (level) => {
        if (level === 'high') return '#dc2626';
        if (level === 'medium') return '#f59e0b';
        return '#10b981';
    };

    const quickPrompts = [
        "I'm feeling stressed about exams",
        "I can't concentrate on my studies",
        "I feel lonely at college",
        "I'm having trouble sleeping"
    ];

    return (
        <Container maxWidth="md" sx={{ height: { xs: 'calc(100vh - 80px)', sm: 'calc(100vh - 100px)' }, display: 'flex', flexDirection: 'column', py: { xs: 1, sm: 2 } }}>
            {/* Header */}
            <Box sx={{
                display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 2 }, mb: 2,
                pb: 2, borderBottom: '1px solid #e2e8f0'
            }}>
                <Avatar sx={{
                    bgcolor: '#6366f1',
                    background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                    width: { xs: 40, sm: 48 }, height: { xs: 40, sm: 48 }
                }}>
                    <SmartToy />
                </Avatar>
                <Box>
                    <Typography sx={{ fontSize: { xs: '1.1rem', sm: '1.5rem' }, fontWeight: 'bold' }}>
                        MannSparsh AI
                    </Typography>
                    <Typography sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' }, color: 'text.secondary', display: { xs: 'none', sm: 'block' } }}>
                        Your compassionate mental health companion • Always here for you
                    </Typography>
                </Box>
            </Box>

            {/* Messages Area */}
            <Paper
                elevation={0}
                sx={{
                    flexGrow: 1, mb: 2, p: 2, overflowY: 'auto',
                    borderRadius: 3, bgcolor: '#f8fafc',
                    border: '1px solid #e2e8f0'
                }}
            >
                {messages.length === 0 && (
                    <Box textAlign="center" sx={{ mt: 6 }}>
                        <Psychology sx={{ fontSize: 60, color: '#6366f140', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                            How can I help you today?
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            I'm here to listen, support, and guide you. Everything shared is confidential.
                        </Typography>
                        <Box display="flex" flexWrap="wrap" justifyContent="center" gap={1}>
                            {quickPrompts.map((prompt, idx) => (
                                <Chip
                                    key={idx}
                                    label={prompt}
                                    variant="outlined"
                                    onClick={() => setInput(prompt)}
                                    sx={{
                                        cursor: 'pointer', borderColor: '#6366f140',
                                        '&:hover': { bgcolor: '#6366f110', borderColor: '#6366f1' }
                                    }}
                                />
                            ))}
                        </Box>
                    </Box>
                )}

                {messages.map((msg, index) => (
                    <Fade in={true} key={index}>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                            mb: 2
                        }}>
                            {msg.sender === 'bot' && (
                                <Avatar sx={{
                                    width: 32, height: 32, mr: 1, mt: 0.5,
                                    background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)'
                                }}>
                                    <SmartToy sx={{ fontSize: 18 }} />
                                </Avatar>
                            )}
                            <Box sx={{ maxWidth: '75%' }}>
                                <Paper sx={{
                                    p: 2,
                                    bgcolor: msg.sender === 'user'
                                        ? '#6366f1'
                                        : 'white',
                                    color: msg.sender === 'user' ? 'white' : 'text.primary',
                                    borderRadius: msg.sender === 'user'
                                        ? '16px 16px 4px 16px'
                                        : '16px 16px 16px 4px',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                                }}>
                                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                                        {msg.content}
                                    </Typography>
                                </Paper>

                                {/* Bot metadata */}
                                {msg.sender === 'bot' && (msg.emotion || msg.risk_level) && (
                                    <Box display="flex" gap={0.5} mt={0.5} flexWrap="wrap">
                                        {msg.emotion && (
                                            <Chip
                                                icon={<SentimentSatisfied sx={{ fontSize: 14 }} />}
                                                label={msg.emotion}
                                                size="small"
                                                variant="outlined"
                                                sx={{ height: 22, fontSize: '0.7rem' }}
                                            />
                                        )}
                                        {msg.risk_level && msg.risk_level !== 'low' && (
                                            <Chip
                                                icon={<Warning sx={{ fontSize: 14 }} />}
                                                label={`Risk: ${msg.risk_level}`}
                                                size="small"
                                                sx={{
                                                    height: 22, fontSize: '0.7rem',
                                                    bgcolor: getRiskColor(msg.risk_level) + '15',
                                                    color: getRiskColor(msg.risk_level),
                                                    fontWeight: 600
                                                }}
                                            />
                                        )}
                                    </Box>
                                )}

                                {/* Action suggestions */}
                                {msg.sender === 'bot' && (msg.suggest_booking || msg.suggest_screening) && (
                                    <Box display="flex" gap={1} mt={1}>
                                        {msg.suggest_booking && (
                                            <Button
                                                size="small" variant="outlined"
                                                startIcon={<CalendarMonth />}
                                                onClick={() => navigate('/appointments')}
                                                sx={{ borderRadius: 2, textTransform: 'none', fontSize: '0.75rem' }}
                                            >
                                                Book Counsellor
                                            </Button>
                                        )}
                                        {msg.suggest_screening && (
                                            <Button
                                                size="small" variant="outlined"
                                                startIcon={<Psychology />}
                                                onClick={() => navigate('/screening')}
                                                sx={{ borderRadius: 2, textTransform: 'none', fontSize: '0.75rem' }}
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
                                    bgcolor: '#6366f1'
                                }}>
                                    <Person sx={{ fontSize: 18 }} />
                                </Avatar>
                            )}
                        </Box>
                    </Fade>
                ))}

                {loading && (
                    <Box display="flex" alignItems="center" gap={1} sx={{ ml: 5 }}>
                        <Box sx={{
                            display: 'flex', gap: 0.5, p: 1.5, bgcolor: 'white',
                            borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                        }}>
                            {[0, 1, 2].map(i => (
                                <Box key={i}
                                    sx={{
                                        width: 8, height: 8, borderRadius: '50%',
                                        bgcolor: '#6366f1',
                                        animation: 'pulse 1.4s infinite',
                                        animationDelay: `${i * 0.2}s`,
                                        '@keyframes pulse': {
                                            '0%, 80%, 100%': { opacity: 0.3, transform: 'scale(0.8)' },
                                            '40%': { opacity: 1, transform: 'scale(1.2)' }
                                        }
                                    }}
                                />
                            ))}
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                            MannSparsh AI is thinking...
                        </Typography>
                    </Box>
                )}
                <div ref={messagesEndRef} />
            </Paper>

            {/* Input Area */}
            <Paper
                component="form"
                onSubmit={handleSend}
                sx={{
                    p: 1, display: 'flex', alignItems: 'center',
                    borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    border: '1px solid #e2e8f0'
                }}
            >
                <TextField
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Type how you're feeling..."
                    variant="standard"
                    InputProps={{ disableUnderline: true }}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={loading}
                    autoComplete="off"
                />
                <IconButton
                    type="submit"
                    disabled={loading || !input.trim()}
                    sx={{
                        background: input.trim() ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' : '#e2e8f0',
                        color: 'white', ml: 1,
                        '&:hover': { background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' },
                        '&.Mui-disabled': { color: '#94a3b8', background: '#e2e8f0' }
                    }}
                >
                    <Send />
                </IconButton>
            </Paper>
        </Container>
    );
};

export default Chat;
