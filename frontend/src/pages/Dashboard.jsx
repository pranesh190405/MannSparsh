import React from 'react';
import {
    Typography,
    Grid,
    Paper,
    Box,
    Card,
    CardContent,
    CardActionArea,
    Button
} from '@mui/material';
import {
    Psychology,
    VideoCall,
    Chat,
    Forum
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const features = [
        {
            title: 'Mental Health Check',
            description: 'Take a gamified screening test to understand your emotional state.',
            icon: <Psychology fontSize="large" color="primary" />,
            path: '/screening',
            color: '#e3f2fd'
        },
        {
            title: 'Talk to CampusCare AI',
            description: 'Chat with our empathetic AI assistant for immediate support.',
            icon: <Chat fontSize="large" color="secondary" />,
            path: '/chat',
            color: '#fce4ec'
        },
        {
            title: 'Book Counselling',
            description: 'Schedule a video session with a university counsellor.',
            icon: <VideoCall fontSize="large" color="success" />,
            path: '/appointments',
            color: '#e8f5e9'
        },
        {
            title: 'Peer Support Forum',
            description: 'Connect anonymously with other students.',
            icon: <Forum fontSize="large" color="warning" />,
            path: '/forum',
            color: '#fff3e0'
        }
    ];

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" gutterBottom fontWeight="bold">
                    Welcome back, {user?.name?.split(' ')[0]}!
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    How are you feeling today? We're here to help you thrive.
                </Typography>
            </Box>

            <Grid container spacing={3}>
                {features.map((feature, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Card sx={{ height: '100%', bgcolor: feature.color }}>
                            <CardActionArea
                                sx={{ height: '100%', p: 2 }}
                                onClick={() => navigate(feature.path)}
                            >
                                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                                    {feature.icon}
                                </Box>
                                <CardContent sx={{ textAlign: 'center' }}>
                                    <Typography gutterBottom variant="h6" component="div" fontWeight="bold">
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

            <Box sx={{ mt: 6 }}>
                <Typography variant="h5" gutterBottom fontWeight="bold">
                    Daily Wellness Quote
                </Typography>
                <Paper sx={{ p: 3, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
                    <Typography variant="h6" fontStyle="italic">
                        "You don't have to control your thoughts. You just have to stop letting them control you."
                    </Typography>
                    <Typography variant="subtitle2" sx={{ mt: 1, opacity: 0.9 }}>
                        - Dan Millman
                    </Typography>
                </Paper>
            </Box>
        </Box>
    );
};

export default Dashboard;
