import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Tabs, Tab, Paper, Button, Chip, Grid, Card,
    CardContent, CardActions, Container, Avatar, Fade, Dialog,
    DialogTitle, DialogContent, DialogActions, TextField
} from '@mui/material';
import {
    VideoCall, EventAvailable, Person, CalendarMonth,
    CheckCircle, Schedule, Cancel, Star
} from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const statusConfig = {
    approved: { color: '#10b981', bg: '#10b98115', icon: <CheckCircle sx={{ fontSize: 16 }} /> },
    pending: { color: '#f59e0b', bg: '#f59e0b15', icon: <Schedule sx={{ fontSize: 16 }} /> },
    cancelled: { color: '#ef4444', bg: '#ef444415', icon: <Cancel sx={{ fontSize: 16 }} /> },
    completed: { color: '#6366f1', bg: '#6366f115', icon: <CheckCircle sx={{ fontSize: 16 }} /> }
};

const Appointments = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [tab, setTab] = useState(0);
    const [appointments, setAppointments] = useState([]);
    const [slots, setSlots] = useState([]);

    useEffect(() => {
        fetchAppointments();
        if (tab === 1) fetchSlots();
    }, [tab]);

    const fetchAppointments = async () => {
        try {
            const res = await axios.get('/api/appointments/my-appointments');
            setAppointments(res.data);
        } catch (err) { console.error(err); }
    };

    const fetchSlots = async () => {
        try {
            const res = await axios.get('/api/appointments/slots');
            setSlots(res.data);
        } catch (err) { console.error(err); }
    };

    const handleBook = async (slotId) => {
        try {
            await axios.post('/api/appointments/book', { slotId, notes: "Requested via Dashboard" });
            setTab(0);
            fetchAppointments();
        } catch (err) {
            alert(err.response?.data?.message || "Booking failed");
        }
    };

    const handleJoin = (meetingId) => { navigate(`/video/${meetingId}`); };

    const handleApprove = async (id) => {
        try {
            await axios.post(`/api/appointments/approve/${id}`);
            fetchAppointments();
        } catch (err) { console.error(err); }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 2, mb: 4 }}>
            {/* Header */}
            <Box sx={{
                background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
                borderRadius: 4, p: 4, mb: 4, color: 'white',
                position: 'relative', overflow: 'hidden'
            }}>
                <Box sx={{
                    position: 'absolute', top: -40, right: -40,
                    width: 160, height: 160, borderRadius: '50%',
                    background: 'rgba(255,255,255,0.1)'
                }} />
                <CalendarMonth sx={{ fontSize: 48, mb: 1, opacity: 0.9 }} />
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Counselling Sessions
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    Book and manage your counselling appointments
                </Typography>
            </Box>

            {/* Tabs */}
            <Paper sx={{ mb: 3, borderRadius: 2 }}>
                <Tabs
                    value={tab}
                    onChange={(e, v) => setTab(v)}
                    sx={{
                        '& .MuiTab-root': { fontWeight: 600, textTransform: 'none', fontSize: '1rem' },
                        '& .Mui-selected': { color: '#10b981' },
                        '& .MuiTabs-indicator': { backgroundColor: '#10b981' }
                    }}
                >
                    <Tab label="📋 My Appointments" />
                    <Tab label="📅 Book New Session" />
                </Tabs>
            </Paper>

            {/* My Appointments */}
            {tab === 0 && (
                <Box>
                    {appointments.length === 0 ? (
                        <Box textAlign="center" py={6}>
                            <CalendarMonth sx={{ fontSize: 60, color: '#e2e8f0', mb: 2 }} />
                            <Typography variant="h6" color="text.secondary" gutterBottom>
                                No appointments yet
                            </Typography>
                            <Typography variant="body2" color="text.secondary" mb={3}>
                                Book your first session with a counsellor
                            </Typography>
                            <Button
                                variant="contained"
                                onClick={() => setTab(1)}
                                sx={{
                                    background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
                                    borderRadius: 2, px: 4
                                }}
                            >
                                Book a Session
                            </Button>
                        </Box>
                    ) : (
                        <Grid container spacing={2}>
                            {appointments.map((appt) => {
                                const status = statusConfig[appt.status] || statusConfig.pending;
                                return (
                                    <Grid item xs={12} md={6} key={appt._id}>
                                        <Fade in={true}>
                                            <Card sx={{
                                                borderRadius: 3,
                                                border: `1px solid ${status.color}30`,
                                                transition: 'all 0.2s',
                                                '&:hover': { boxShadow: `0 4px 20px ${status.color}15` }
                                            }}>
                                                <CardContent sx={{ p: 3 }}>
                                                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                                                        <Box display="flex" alignItems="center" gap={1.5}>
                                                            <Avatar sx={{
                                                                background: `linear-gradient(135deg, ${status.color}40 0%, ${status.color}20 100%)`,
                                                                color: status.color
                                                            }}>
                                                                <Person />
                                                            </Avatar>
                                                            <Box>
                                                                <Typography variant="subtitle1" fontWeight="bold">
                                                                    {user?.role === 'student'
                                                                        ? appt.counsellorId?.name || 'Counsellor'
                                                                        : appt.studentId?.name || 'Student'}
                                                                </Typography>
                                                                <Typography variant="caption" color="text.secondary">
                                                                    {user?.role === 'student' ? 'Counsellor' : 'Student'}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                        <Chip
                                                            icon={status.icon}
                                                            label={appt.status}
                                                            size="small"
                                                            sx={{
                                                                bgcolor: status.bg,
                                                                color: status.color,
                                                                fontWeight: 600,
                                                                textTransform: 'capitalize'
                                                            }}
                                                        />
                                                    </Box>

                                                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                                                        <EventAvailable sx={{ fontSize: 18, color: 'text.secondary' }} />
                                                        <Typography variant="body2" color="text.secondary">
                                                            {new Date(appt.slotTime).toLocaleDateString('en-US', {
                                                                weekday: 'short', month: 'short', day: 'numeric'
                                                            })}
                                                        </Typography>
                                                        <Typography variant="body2" fontWeight="bold">
                                                            {new Date(appt.slotTime).toLocaleTimeString([], {
                                                                hour: '2-digit', minute: '2-digit'
                                                            })}
                                                        </Typography>
                                                    </Box>

                                                    {appt.notes && (
                                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                                            📝 {appt.notes}
                                                        </Typography>
                                                    )}
                                                </CardContent>
                                                <CardActions sx={{ px: 3, pb: 2 }}>
                                                    {appt.status === 'approved' && (
                                                        <Button
                                                            variant="contained" startIcon={<VideoCall />}
                                                            onClick={() => handleJoin(appt.meetingId)}
                                                            sx={{
                                                                borderRadius: 2,
                                                                background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
                                                                textTransform: 'none'
                                                            }}
                                                        >
                                                            Join Video Call
                                                        </Button>
                                                    )}
                                                    {user?.role === 'counsellor' && appt.status === 'pending' && (
                                                        <Button
                                                            variant="contained" onClick={() => handleApprove(appt._id)}
                                                            sx={{
                                                                borderRadius: 2, textTransform: 'none',
                                                                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
                                                            }}
                                                        >
                                                            Approve Session
                                                        </Button>
                                                    )}
                                                </CardActions>
                                            </Card>
                                        </Fade>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    )}
                </Box>
            )}

            {/* Book New Session */}
            {tab === 1 && (
                <Box>
                    {slots.length === 0 ? (
                        <Box textAlign="center" py={6}>
                            <Schedule sx={{ fontSize: 60, color: '#e2e8f0', mb: 2 }} />
                            <Typography variant="h6" color="text.secondary">
                                No available slots right now
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Check back later or contact the counselling office
                            </Typography>
                        </Box>
                    ) : (
                        <Grid container spacing={2}>
                            {slots.map((slot) => (
                                <Grid item xs={12} sm={6} md={4} key={slot._id}>
                                    <Fade in={true}>
                                        <Card sx={{
                                            borderRadius: 3,
                                            transition: 'all 0.3s',
                                            '&:hover': {
                                                transform: 'translateY(-4px)',
                                                boxShadow: '0 12px 24px rgba(0,0,0,0.08)'
                                            }
                                        }}>
                                            <Box sx={{
                                                background: 'linear-gradient(135deg, #10b98115 0%, #34d39905 100%)',
                                                p: 2, textAlign: 'center'
                                            }}>
                                                <Avatar sx={{
                                                    width: 56, height: 56, mx: 'auto',
                                                    background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)'
                                                }}>
                                                    <Person />
                                                </Avatar>
                                            </Box>
                                            <CardContent sx={{ textAlign: 'center' }}>
                                                <Typography variant="h6" fontWeight="bold">
                                                    {slot.counsellorId?.name || 'Counsellor'}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                                    {slot.counsellorId?.specialization || slot.counsellorId?.department}
                                                </Typography>
                                                <Chip
                                                    icon={<EventAvailable sx={{ fontSize: 16 }} />}
                                                    label={`${new Date(slot.date).toLocaleDateString('en-US', {
                                                        month: 'short', day: 'numeric'
                                                    })} at ${slot.startTime}`}
                                                    size="small"
                                                    sx={{ mt: 1, bgcolor: '#10b98115', color: '#10b981', fontWeight: 600 }}
                                                />
                                            </CardContent>
                                            <CardActions sx={{ p: 2, pt: 0 }}>
                                                <Button
                                                    fullWidth variant="contained"
                                                    onClick={() => handleBook(slot._id)}
                                                    sx={{
                                                        borderRadius: 2, textTransform: 'none',
                                                        background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
                                                        '&:hover': { background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)' }
                                                    }}
                                                >
                                                    Book This Slot
                                                </Button>
                                            </CardActions>
                                        </Card>
                                    </Fade>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Box>
            )}
        </Container>
    );
};

export default Appointments;
