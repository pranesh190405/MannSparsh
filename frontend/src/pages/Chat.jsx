import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Paper,
    TextField,
    IconButton,
    Typography,
    List,
    ListItem,
    ListItemText,
    Avatar,
    CircularProgress,
    Chip
} from '@mui/material';
import { Send, SmartToy, Person } from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Chat = () => {
    const { user } = useAuth();
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
            setMessages(res.data);
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
            const botMsg = {
                sender: 'bot',
                content: res.data.message,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botMsg]);
        } catch (err) {
            console.error(err);
            const errorMsg = { sender: 'bot', content: "Sorry, I'm having trouble connecting right now." };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h4" gutterBottom>
                CampusCare AI Support
            </Typography>

            <Paper
                elevation={3}
                sx={{
                    flexGrow: 1,
                    mb: 2,
                    p: 2,
                    overflowY: 'auto',
                    borderRadius: 4,
                    bgcolor: '#f5f7fa'
                }}
            >
                <List>
                    {messages.length === 0 && (
                        <Typography variant="body1" align="center" color="textSecondary" sx={{ mt: 4 }}>
                            Start a conversation. I'm here to listen.
                        </Typography>
                    )}
                    {messages.map((msg, index) => (
                        <ListItem
                            key={index}
                            sx={{
                                flexDirection: 'column',
                                alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                mb: 1
                            }}
                        >
                            <Box sx={{ display: 'flex', flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row', alignItems: 'center', mb: 0.5 }}>
                                <Avatar
                                    sx={{
                                        bgcolor: msg.sender === 'user' ? 'primary.main' : 'secondary.main',
                                        width: 32, height: 32,
                                        ml: msg.sender === 'user' ? 1 : 0,
                                        mr: msg.sender === 'bot' ? 1 : 0
                                    }}
                                >
                                    {msg.sender === 'user' ? <Person fontSize="small" /> : <SmartToy fontSize="small" />}
                                </Avatar>
                                <Typography variant="caption" color="textSecondary">
                                    {msg.sender === 'user' ? 'You' : 'CampusCare AI'}
                                </Typography>
                            </Box>

                            <Paper
                                sx={{
                                    p: 2,
                                    bgcolor: msg.sender === 'user' ? 'primary.main' : 'white',
                                    color: msg.sender === 'user' ? 'white' : 'text.primary',
                                    borderRadius: 2,
                                    maxWidth: '80%',
                                    boxShadow: 1
                                }}
                            >
                                <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</Typography>
                            </Paper>
                        </ListItem>
                    ))}
                    {loading && (
                        <ListItem sx={{ alignItems: 'flex-start' }}>
                            <CircularProgress size={20} />
                        </ListItem>
                    )}
                    <div ref={messagesEndRef} />
                </List>
            </Paper>

            <Paper
                component="form"
                onSubmit={handleSend}
                sx={{
                    p: '2px 4px',
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: 30,
                    boxShadow: 3
                }}
            >
                <TextField
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Type your message here..."
                    variant="standard"
                    InputProps={{ disableUnderline: true }}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={loading}
                />
                <IconButton type="submit" color="primary" sx={{ p: '10px' }} disabled={loading}>
                    <Send />
                </IconButton>
            </Paper>
        </Box>
    );
};

export default Chat;
