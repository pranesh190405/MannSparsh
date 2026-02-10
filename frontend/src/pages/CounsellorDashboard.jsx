import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container, Box, Typography, Grid, Card, CardContent, Button,
    Avatar, Chip, LinearProgress, Alert
} from '@mui/material';
import {
    CalendarMonth, People, VideoCall, Forum,
    TrendingUp, CheckCircle, Schedule
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const CounsellorDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalSessions: 0,
        upcomingAppointments: 0,
        pendingRequests: 0,
        rating: 0
    });
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [appointmentsRes, userRes] = await Promise.all([
                axios.get('/api/appointments/my-appointments'),
                axios.get('/api/auth/me')
            ]);

            const appts = appointmentsRes.data;
            const userData = userRes.data;

            setAppointments(appts.slice(0, 5)); // Show only 5 recent
            setStats({
                totalSessions: userData.totalSessions || 0,
                upcomingAppointments: appts.filter(a => a.status === 'approved' && new Date(a.slotTime) > new Date()).length,
                pendingRequests: appts.filter(a => a.status === 'pending').length,
                rating: userData.rating || 0
            });
            setLoading(false);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setLoading(false);
        }
    };

    if (!user?.isApproved) {
        return (
            <Container maxWidth="md" sx={{ mt: 8 }}>
                <Alert severity="warning">
                    <Typography variant="h6" gutterBottom>
                        Account Pending Approval
                    </Typography>
                    <Typography variant="body2">
                        Your counsellor account is currently under review by our administrators.
                        You will receive an email once your account is approved. Thank you for your patience!
                    </Typography>
                </Alert>
            </Container>
        );
    }

    const statCards = [
        {
            title: 'Total Sessions',
            value: stats.totalSessions,
            icon: <CheckCircle sx={{ fontSize: 40, color: '#10b981' }} />,
            color: '#10b981'
        },
        {
            title: 'Upcoming',
            value: stats.upcomingAppointments,
            icon: <Schedule sx={{ fontSize: 40, color: '#3b82f6' }} />,
            color: '#3b82f6'
        },
        {
            title: 'Pending Requests',
            value: stats.pendingRequests,
            icon: <People sx={{ fontSize: 40, color: '#f59e0b' }} />,
            color: '#f59e0b'
        },
        {
            title: 'Rating',
            value: stats.rating.toFixed(1),
            icon: <TrendingUp sx={{ fontSize: 40, color: '#ec4899' }} />,
            color: '#ec4899'
        }
    ];

    const quickActions = [
        {
            title: 'Manage Availability',
            description: 'Set your weekly schedule and block dates',
            icon: <CalendarMonth />,
            action: () => navigate('/counsellor/availability'),
            color: '#6366f1'
        },
        {
            title: 'View Appointments',
            description: 'See all your scheduled sessions',
            icon: <VideoCall />,
            action: () => navigate('/counsellor/appointments'),
            color: '#8b5cf6'
        },
        {
            title: 'Counsellor Forum',
            description: 'Discuss with other professionals',
            icon: <Forum />,
            action: () => navigate('/counsellor/forum'),
            color: '#ec4899'
        }
    ];

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {/* Welcome Section */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Welcome back, {user?.name}! 👋
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Here's an overview of your counselling activities
                </Typography>
            </Box>

            {loading && <LinearProgress sx={{ mb: 3 }} />}

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {statCards.map((stat, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Card
                            sx={{
                                height: '100%',
                                background: `linear-gradient(135deg, ${stat.color}15 0%, ${stat.color}05 100%)`,
                                border: `1px solid ${stat.color}30`,
                                transition: 'transform 0.2s',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: 4
                                }
                            }}
                        >
                            <CardContent>
                                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                                    <Box>
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                            {stat.title}
                                        </Typography>
                                        <Typography variant="h4" fontWeight="bold">
                                            {stat.value}
                                        </Typography>
                                    </Box>
                                    {stat.icon}
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Quick Actions */}
            <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 2 }}>
                Quick Actions
            </Typography>
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {quickActions.map((action, index) => (
                    <Grid item xs={12} md={4} key={index}>
                        <Card
                            sx={{
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: 6
                                }
                            }}
                            onClick={action.action}
                        >
                            <CardContent>
                                <Box display="flex" alignItems="center" mb={2}>
                                    <Avatar sx={{ bgcolor: action.color, mr: 2 }}>
                                        {action.icon}
                                    </Avatar>
                                    <Typography variant="h6" fontWeight="600">
                                        {action.title}
                                    </Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary">
                                    {action.description}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Recent Appointments */}
            <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 2 }}>
                Recent Appointments
            </Typography>
            {appointments.length === 0 ? (
                <Card>
                    <CardContent>
                        <Typography variant="body1" color="text.secondary" textAlign="center" py={4}>
                            No appointments yet. Students will be able to book sessions once you set your availability.
                        </Typography>
                    </CardContent>
                </Card>
            ) : (
                <Grid container spacing={2}>
                    {appointments.map((appointment) => (
                        <Grid item xs={12} key={appointment._id}>
                            <Card>
                                <CardContent>
                                    <Box display="flex" justifyContent="space-between" alignItems="center">
                                        <Box>
                                            <Typography variant="h6" gutterBottom>
                                                {appointment.studentId?.name || 'Student'}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {new Date(appointment.slotTime).toLocaleString()}
                                            </Typography>
                                            {appointment.notes && (
                                                <Typography variant="body2" sx={{ mt: 1 }}>
                                                    Note: {appointment.notes}
                                                </Typography>
                                            )}
                                        </Box>
                                        <Box textAlign="right">
                                            <Chip
                                                label={appointment.status}
                                                color={
                                                    appointment.status === 'approved' ? 'success' :
                                                        appointment.status === 'pending' ? 'warning' : 'default'
                                                }
                                                sx={{ mb: 1 }}
                                            />
                                            {appointment.status === 'approved' && appointment.meetingId && (
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    startIcon={<VideoCall />}
                                                    onClick={() => navigate(`/video/${appointment.meetingId}`)}
                                                >
                                                    Join Call
                                                </Button>
                                            )}
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
};

export default CounsellorDashboard;
