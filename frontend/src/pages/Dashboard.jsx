import React, { useState, useEffect } from 'react';
import {
    Typography, Grid, Box, Card, CardContent, CardActionArea,
    Avatar, Container, Chip, Paper, LinearProgress
} from '@mui/material';
import {
    Psychology, VideoCall, Chat, Forum, TrendingUp,
    SelfImprovement, EmojiEvents, Favorite
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const quotes = [
    { text: "You don't have to control your thoughts. You just have to stop letting them control you.", author: "Dan Millman" },
    { text: "It's okay to not be okay. What matters is you don't give up.", author: "Unknown" },
    { text: "Your mental health is a priority. Your happiness is essential. Your self-care is a necessity.", author: "Unknown" },
    { text: "You are not your illness. You have an individual story to tell.", author: "Julian Seifter" },
    { text: "The strongest people are those who win battles we know nothing about.", author: "Unknown" },
    { text: "Be gentle with yourself. You're doing the best you can.", author: "Unknown" }
];

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [latestScreening, setLatestScreening] = useState(null);
    const [appointmentCount, setAppointmentCount] = useState(0);
    const [quote] = useState(quotes[Math.floor(Math.random() * quotes.length)]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [screeningRes, appointmentRes] = await Promise.all([
                axios.get('/api/screening/history').catch(() => ({ data: [] })),
                axios.get('/api/appointments/my-appointments').catch(() => ({ data: [] }))
            ]);
            if (screeningRes.data?.length > 0) {
                setLatestScreening(screeningRes.data[screeningRes.data.length - 1]);
            }
            setAppointmentCount(appointmentRes.data?.length || 0);
        } catch (err) {
            console.error(err);
        }
    };

    const features = [
        {
            title: 'Mental Health Check',
            description: 'Take a gamified screening test with 16 scenarios to understand your wellbeing.',
            icon: <Psychology sx={{ fontSize: 40 }} />,
            path: '/screening',
            gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            tag: '📊 PHQ-9 + GAD-7'
        },
        {
            title: 'AI Support Chat',
            description: 'Chat with our empathetic AI assistant for immediate, confidential support.',
            icon: <Chat sx={{ fontSize: 40 }} />,
            path: '/chat',
            gradient: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)',
            tag: '🤖 24/7 Available'
        },
        {
            title: 'Book Counselling',
            description: 'Schedule a video session with a certified university counsellor.',
            icon: <VideoCall sx={{ fontSize: 40 }} />,
            path: '/appointments',
            gradient: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
            tag: '📅 Video Sessions'
        },
        {
            title: 'Peer Forum',
            description: 'Connect anonymously with fellow students. Share and support each other.',
            icon: <Forum sx={{ fontSize: 40 }} />,
            path: '/forum',
            gradient: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
            tag: '🤝 Anonymous'
        }
    ];

    const wellnessTips = [
        { icon: <SelfImprovement />, text: "Try 5 minutes of deep breathing today", color: '#6366f1' },
        { icon: <Favorite />, text: "Reach out to one friend today", color: '#ec4899' },
        { icon: <EmojiEvents />, text: "Celebrate one small win from this week", color: '#f59e0b' }
    ];

    const isCounsellor = user?.role === 'counsellor';

    return (
        <Container maxWidth="lg" sx={{ mt: 2, mb: 4 }}>
            {/* Hero Welcome Section */}
            <Box sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: 4, p: 4, mb: 4, color: 'white',
                position: 'relative', overflow: 'hidden'
            }}>
                <Box sx={{
                    position: 'absolute', top: -50, right: -50,
                    width: 200, height: 200, borderRadius: '50%',
                    background: 'rgba(255,255,255,0.1)'
                }} />
                <Box sx={{
                    position: 'absolute', bottom: -30, left: '50%',
                    width: 150, height: 150, borderRadius: '50%',
                    background: 'rgba(255,255,255,0.05)'
                }} />
                <Typography variant="h3" fontWeight="bold" gutterBottom>
                    Welcome back, {user?.name?.split(' ')[0]}! 👋
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9, mb: 2 }}>
                    How are you feeling today? We're here to help you thrive.
                </Typography>
                {isCounsellor && (
                    <Chip
                        label="Go to Counsellor Dashboard →"
                        onClick={() => navigate('/counsellor/dashboard')}
                        sx={{
                            bgcolor: 'rgba(255,255,255,0.2)', color: 'white',
                            fontWeight: 600, cursor: 'pointer',
                            '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
                        }}
                    />
                )}
            </Box>

            {/* Quick Stats */}
            <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={4}>
                    <Card sx={{
                        background: 'linear-gradient(135deg, #6366f115 0%, #6366f105 100%)',
                        border: '1px solid #6366f130'
                    }}>
                        <CardContent>
                            <Box display="flex" alignItems="center" gap={2}>
                                <Avatar sx={{ bgcolor: '#6366f120', color: '#6366f1' }}>
                                    <TrendingUp />
                                </Avatar>
                                <Box>
                                    <Typography variant="body2" color="text.secondary">Last Screening</Typography>
                                    <Typography variant="h6" fontWeight="bold">
                                        {latestScreening ? latestScreening.severity : 'Not taken'}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card sx={{
                        background: 'linear-gradient(135deg, #10b98115 0%, #10b98105 100%)',
                        border: '1px solid #10b98130'
                    }}>
                        <CardContent>
                            <Box display="flex" alignItems="center" gap={2}>
                                <Avatar sx={{ bgcolor: '#10b98120', color: '#10b981' }}>
                                    <VideoCall />
                                </Avatar>
                                <Box>
                                    <Typography variant="body2" color="text.secondary">Appointments</Typography>
                                    <Typography variant="h6" fontWeight="bold">{appointmentCount}</Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card sx={{
                        background: 'linear-gradient(135deg, #ec489915 0%, #ec489905 100%)',
                        border: '1px solid #ec489930'
                    }}>
                        <CardContent>
                            <Box display="flex" alignItems="center" gap={2}>
                                <Avatar sx={{ bgcolor: '#ec489920', color: '#ec4899' }}>
                                    <Favorite />
                                </Avatar>
                                <Box>
                                    <Typography variant="body2" color="text.secondary">Mood Streak</Typography>
                                    <Typography variant="h6" fontWeight="bold">Keep going! 💪</Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Feature Cards */}
            <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 2 }}>
                What would you like to do?
            </Typography>
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {features.map((feature, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Card sx={{
                            height: '100%',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer',
                            '&:hover': {
                                transform: 'translateY(-8px)',
                                boxShadow: '0 20px 40px rgba(0,0,0,0.12)'
                            }
                        }}>
                            <CardActionArea
                                sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 0 }}
                                onClick={() => navigate(feature.path)}
                            >
                                <Box sx={{
                                    background: feature.gradient,
                                    width: '100%', py: 3,
                                    display: 'flex', justifyContent: 'center',
                                    color: 'white'
                                }}>
                                    {feature.icon}
                                </Box>
                                <CardContent sx={{ textAlign: 'center', pt: 2 }}>
                                    <Chip label={feature.tag} size="small" sx={{ mb: 1, fontSize: '0.7rem' }} />
                                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                                        {feature.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {feature.description}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Wellness Tips & Quote */}
            <Grid container spacing={3}>
                <Grid item xs={12} md={7}>
                    <Card sx={{ p: 3 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            ✨ Daily Wellness Tips
                        </Typography>
                        {wellnessTips.map((tip, idx) => (
                            <Box key={idx} display="flex" alignItems="center" gap={2} sx={{ mb: 2 }}>
                                <Avatar sx={{ bgcolor: tip.color + '15', color: tip.color, width: 36, height: 36 }}>
                                    {tip.icon}
                                </Avatar>
                                <Typography variant="body2">{tip.text}</Typography>
                            </Box>
                        ))}
                    </Card>
                </Grid>
                <Grid item xs={12} md={5}>
                    <Card sx={{
                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        color: 'white', p: 3, height: '100%',
                        display: 'flex', flexDirection: 'column', justifyContent: 'center'
                    }}>
                        <Typography variant="h6" fontStyle="italic" gutterBottom>
                            "{quote.text}"
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                            — {quote.author}
                        </Typography>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Dashboard;
