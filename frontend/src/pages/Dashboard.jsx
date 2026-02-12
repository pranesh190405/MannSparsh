import React, { useState, useEffect } from 'react';
import {
    Typography, Grid, Box, Card, CardContent, CardActionArea,
    Avatar, Container, Chip
} from '@mui/material';
import {
    Psychology, VideoCall, Chat, Forum, TrendingUp,
    SelfImprovement, EmojiEvents, Favorite, ArrowForward,
    AutoAwesome, Spa
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const quotes = [
    { text: "You don't have to control your thoughts. You just have to stop letting them control you.", author: "Dan Millman" },
    { text: "It's okay to not be okay. What matters is you don't give up.", author: "Unknown" },
    { text: "Your mental health is a priority. Your happiness is essential.", author: "Unknown" },
    { text: "You are not your illness. You have an individual story to tell.", author: "Julian Seifter" },
    { text: "The strongest people are those who win battles we know nothing about.", author: "Unknown" },
    { text: "Be gentle with yourself. You're doing the best you can.", author: "Unknown" }
];

// Floating orb component
const FloatingOrb = ({ size, color, top, left, delay, animName }) => (
    <Box sx={{
        position: 'absolute',
        width: size, height: size,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        top, left,
        animation: `${animName} ${12 + delay}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
        filter: 'blur(40px)',
        opacity: 0.4,
        pointerEvents: 'none',
    }} />
);

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
            if (screeningRes.data?.length > 0) setLatestScreening(screeningRes.data[screeningRes.data.length - 1]);
            setAppointmentCount(appointmentRes.data?.length || 0);
        } catch (err) { console.error(err); }
    };

    const features = [
        {
            title: 'Mental Health Check',
            description: 'Take a screening test with scenario-based questions for your wellbeing.',
            icon: <Psychology sx={{ fontSize: 36 }} />,
            path: '/screening',
            gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
            tag: 'PHQ-9 + GAD-7'
        },
        {
            title: 'AI Support Chat',
            description: 'Chat with our empathetic AI assistant for immediate, confidential support.',
            icon: <Chat sx={{ fontSize: 36 }} />,
            path: '/chat',
            gradient: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
            tag: '24/7 Available'
        },
        {
            title: 'Book Counselling',
            description: 'Schedule a video session with a certified university counsellor.',
            icon: <VideoCall sx={{ fontSize: 36 }} />,
            path: '/appointments',
            gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            tag: 'Video Sessions'
        },
        {
            title: 'Peer Forum',
            description: 'Connect anonymously. Share and support each other.',
            icon: <Forum sx={{ fontSize: 36 }} />,
            path: '/forum',
            gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            tag: 'Anonymous'
        }
    ];

    const wellnessTips = [
        { icon: <SelfImprovement />, text: "Try 5 minutes of deep breathing today" },
        { icon: <Favorite />, text: "Reach out to one friend today" },
        { icon: <EmojiEvents />, text: "Celebrate one small win this week" },
        { icon: <Spa />, text: "Take a 10-minute walk without your phone" }
    ];

    const isCounsellor = user?.role === 'counsellor';

    return (
        <Container maxWidth="lg" sx={{ mt: 2, mb: 4, position: 'relative' }}>
            {/* Floating Orbs */}
            <FloatingOrb size={300} color="rgba(139,92,246,0.3)" top="-80px" left="-100px" delay={0} animName="orbFloat1" />
            <FloatingOrb size={200} color="rgba(236,72,153,0.2)" top="200px" left="80%" delay={2} animName="orbFloat2" />
            <FloatingOrb size={250} color="rgba(16,185,129,0.2)" top="500px" left="10%" delay={4} animName="orbFloat3" />

            {/* Welcome Hero */}
            <Box className="animate-fadeInUp" sx={{
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 5,
                p: { xs: 3, md: 5 }, mb: 4,
                position: 'relative', overflow: 'hidden',
                animation: 'fadeInUp 0.8s ease-out, pulseGlow 4s ease-in-out infinite 1s',
            }}>
                {/* Shimmer overlay */}
                <Box sx={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'linear-gradient(90deg, transparent 25%, rgba(255,255,255,0.03) 50%, transparent 75%)',
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 3s linear infinite',
                    pointerEvents: 'none',
                }} />

                <Box display="flex" alignItems="center" gap={2} mb={2} sx={{ position: 'relative', zIndex: 1 }}>
                    <Avatar sx={{
                        width: 56, height: 56,
                        background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                        fontSize: '1.5rem',
                        animation: 'float 3s ease-in-out infinite',
                    }}>
                        {user?.name?.[0]?.toUpperCase() || '👤'}
                    </Avatar>
                    <Box>
                        <Typography sx={{
                            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.25rem' },
                            fontWeight: 800,
                            background: 'linear-gradient(135deg, #fff 0%, #a78bfa 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            letterSpacing: '-0.02em',
                        }}>
                            Welcome back, {user?.name?.split(' ')[0]} ✨
                        </Typography>
                        <Typography sx={{ fontSize: '1rem', color: 'rgba(255,255,255,0.6)' }}>
                            How are you feeling today? We're here to support you.
                        </Typography>
                    </Box>
                </Box>

                {isCounsellor && (
                    <Chip
                        label="Go to Counsellor Dashboard"
                        icon={<ArrowForward sx={{ fontSize: 16 }} />}
                        onClick={() => navigate('/counsellor/dashboard')}
                        sx={{
                            mt: 1,
                            bgcolor: 'rgba(139,92,246,0.2)',
                            color: '#a78bfa',
                            fontWeight: 600,
                            cursor: 'pointer',
                            border: '1px solid rgba(139,92,246,0.3)',
                            transition: 'all 0.3s',
                            '&:hover': {
                                bgcolor: 'rgba(139,92,246,0.3)',
                                transform: 'translateX(8px)',
                                boxShadow: '0 4px 20px rgba(139,92,246,0.3)',
                            }
                        }}
                    />
                )}
            </Box>

            {/* Quick Stats */}
            <Grid container spacing={2.5} sx={{ mb: 4 }}>
                {[
                    { label: 'Last Screening', value: latestScreening?.severity || 'Not taken', icon: <TrendingUp />, gradient: 'linear-gradient(135deg, #8b5cf6, #6366f1)' },
                    { label: 'Appointments', value: appointmentCount, icon: <VideoCall />, gradient: 'linear-gradient(135deg, #10b981, #059669)' },
                    { label: 'Wellness', value: 'Keep going!', icon: <Favorite />, gradient: 'linear-gradient(135deg, #ec4899, #f43f5e)' },
                ].map((stat, idx) => (
                    <Grid item xs={12} sm={4} key={idx}>
                        <Card className="animate-fadeInUp" sx={{ animationDelay: `${0.1 + idx * 0.15}s` }}>
                            <CardContent sx={{ p: 2.5 }}>
                                <Box display="flex" alignItems="center" gap={2}>
                                    <Avatar sx={{
                                        background: stat.gradient,
                                        width: 48, height: 48,
                                        animation: 'float 4s ease-in-out infinite',
                                        animationDelay: `${idx * 0.5}s`,
                                    }}>
                                        {stat.icon}
                                    </Avatar>
                                    <Box>
                                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>{stat.label}</Typography>
                                        <Typography variant="h6" fontWeight={700} sx={{ fontSize: '1.05rem' }}>{stat.value}</Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Feature Cards */}
            <Box className="animate-fadeInUp" sx={{ animationDelay: '0.3s' }}>
                <Typography variant="h5" fontWeight={700} gutterBottom sx={{ mb: 2.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AutoAwesome sx={{ color: '#8b5cf6', animation: 'spin 4s linear infinite' }} />
                    What would you like to do?
                </Typography>
            </Box>
            <Grid container spacing={2.5} sx={{ mb: 4 }}>
                {features.map((feature, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Card
                            className="animate-fadeInUp"
                            sx={{
                                height: '100%',
                                cursor: 'pointer',
                                animationDelay: `${0.4 + index * 0.1}s`,
                            }}
                        >
                            <CardActionArea
                                sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 0 }}
                                onClick={() => navigate(feature.path)}
                            >
                                <Box sx={{
                                    background: feature.gradient,
                                    width: '100%', py: 3,
                                    display: 'flex', justifyContent: 'center',
                                    color: 'white',
                                    position: 'relative',
                                    overflow: 'hidden',
                                }}>
                                    {/* Shimmer on icon area */}
                                    <Box sx={{
                                        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
                                        backgroundSize: '200% 100%',
                                        animation: 'shimmer 2s linear infinite',
                                        animationDelay: `${index * 0.3}s`,
                                    }} />
                                    <Box sx={{ animation: 'float 3s ease-in-out infinite', animationDelay: `${index * 0.2}s` }}>
                                        {feature.icon}
                                    </Box>
                                </Box>
                                <CardContent sx={{ textAlign: 'center', pt: 2, px: 2, pb: 2.5 }}>
                                    <Chip
                                        label={feature.tag} size="small"
                                        sx={{
                                            mb: 1, fontSize: '0.68rem', height: 22,
                                            bgcolor: 'rgba(139,92,246,0.15)',
                                            color: '#a78bfa', fontWeight: 600,
                                            border: '1px solid rgba(139,92,246,0.2)',
                                        }}
                                    />
                                    <Typography variant="h6" fontWeight={700} gutterBottom sx={{ fontSize: '0.95rem' }}>
                                        {feature.title}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>
                                        {feature.description}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Wellness Tips & Quote */}
            <Grid container spacing={2.5}>
                <Grid item xs={12} md={7}>
                    <Card className="animate-fadeInLeft" sx={{ animationDelay: '0.6s', p: 3 }}>
                        <Typography variant="h6" fontWeight={700} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Spa sx={{ color: '#10b981', animation: 'pulse 2s ease-in-out infinite' }} />
                            Daily Wellness
                        </Typography>
                        {wellnessTips.map((tip, idx) => (
                            <Box key={idx} display="flex" alignItems="center" gap={2}
                                sx={{
                                    mb: idx < wellnessTips.length - 1 ? 2 : 0,
                                    p: 1.5, borderRadius: 3,
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        bgcolor: 'rgba(255,255,255,0.04)',
                                        transform: 'translateX(8px)',
                                    }
                                }}>
                                <Avatar sx={{
                                    bgcolor: 'rgba(16,185,129,0.15)', color: '#10b981',
                                    width: 38, height: 38,
                                }}>
                                    {tip.icon}
                                </Avatar>
                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>{tip.text}</Typography>
                            </Box>
                        ))}
                    </Card>
                </Grid>
                <Grid item xs={12} md={5}>
                    <Card className="animate-fadeInRight" sx={{
                        animationDelay: '0.7s',
                        p: 3, height: '100%',
                        display: 'flex', flexDirection: 'column', justifyContent: 'center',
                        background: 'linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(236,72,153,0.1) 100%)',
                        border: '1px solid rgba(139,92,246,0.2)',
                        position: 'relative', overflow: 'hidden',
                    }}>
                        <Box sx={{
                            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent)',
                            backgroundSize: '200% 100%',
                            animation: 'shimmer 4s linear infinite',
                        }} />
                        <Typography variant="body1" fontStyle="italic" sx={{
                            lineHeight: 1.8, mb: 2, fontSize: '1rem',
                            color: 'rgba(255,255,255,0.85)', position: 'relative', zIndex: 1,
                        }}>
                            "{quote.text}"
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#a78bfa', fontWeight: 600, position: 'relative', zIndex: 1 }}>
                            — {quote.author}
                        </Typography>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Dashboard;
