import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Grid,
    Paper,
    Card,
    CardContent,
    CircularProgress
} from '@mui/material';
import {
    People,
    Warning,
    EventNote,
    Assessment
} from '@mui/icons-material';
import axios from 'axios';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await axios.get('/api/admin/stats');
            setStats(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <CircularProgress />;

    const statCards = [
        {
            title: 'Total Students',
            value: stats?.studentCount,
            icon: <People fontSize="large" color="primary" />,
            color: '#e3f2fd'
        },
        {
            title: 'High Risk Alerts',
            value: stats?.highRiskCount,
            icon: <Warning fontSize="large" color="error" />,
            color: '#ffebee'
        },
        {
            title: 'Pending Appointments',
            value: stats?.pendingAppointments,
            icon: <EventNote fontSize="large" color="warning" />,
            color: '#fff3e0'
        },
        {
            title: 'Avg Depression Score',
            value: stats?.avgDepression,
            icon: <Assessment fontSize="large" color="secondary" />,
            color: '#f3e5f5'
        }
    ];

    return (
        <Box>
            <Typography variant="h4" gutterBottom>Admin Overview</Typography>

            <Grid container spacing={3}>
                {statCards.map((stat, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Card sx={{ bgcolor: stat.color }}>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <Box sx={{ mb: 2 }}>{stat.icon}</Box>
                                <Typography variant="h5" fontWeight="bold">
                                    {stat.value}
                                </Typography>
                                <Typography color="textSecondary">
                                    {stat.title}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Graphs would go here (using Chart.js or Recharts) */}
            <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>Analytics Insights</Typography>
                <Paper sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
                    Real-time trend graphs (Depression/Anxiety over time) would be visualized here.
                </Paper>
            </Box>
        </Box>
    );
};

export default AdminDashboard;
