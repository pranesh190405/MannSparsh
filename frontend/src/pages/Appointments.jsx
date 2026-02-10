import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Tabs,
    Tab,
    Paper,
    List,
    ListItem,
    ListItemText,
    Button,
    Chip,
    Grid,
    Card,
    CardContent,
    CardActions
} from '@mui/material';
import { VideoCall, EventAvailable } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Appointments = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [tab, setTab] = useState(0);
    const [appointments, setAppointments] = useState([]);
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchAppointments();
        if (tab === 1) fetchSlots();
    }, [tab]);

    const fetchAppointments = async () => {
        try {
            const res = await axios.get('/api/appointments/my-appointments');
            setAppointments(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchSlots = async () => {
        try {
            const res = await axios.get('/api/appointments/slots');
            setSlots(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleBook = async (slotId) => {
        try {
            await axios.post('/api/appointments/book', { slotId, notes: "Requested via Dashboard" });
            setTab(0);
            fetchAppointments();
            alert("Appointment requested!");
        } catch (err) {
            alert(err.response?.data?.message || "Booking failed");
        }
    };

    const handleJoin = (meetingId) => {
        navigate(`/video/${meetingId}`);
    };

    const handleApprove = async (id) => {
        try {
            await axios.post(`/api/appointments/approve/${id}`);
            fetchAppointments();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>Counselling Sessions</Typography>

            <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mb: 3 }}>
                <Tab label="My Appointments" />
                <Tab label="Book New Session" />
            </Tabs>

            {tab === 0 && (
                <Grid container spacing={2}>
                    {appointments.length === 0 && <Typography sx={{ m: 2 }}>No appointments found.</Typography>}
                    {appointments.map((appt) => (
                        <Grid item xs={12} md={6} key={appt._id}>
                            <Paper sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box>
                                    <Typography variant="h6">
                                        {user.role === 'student' ? `Counsellor: ${appt.counsellorId?.name}` : `Student: ${appt.studentId?.name}`}
                                    </Typography>
                                    <Typography color="textSecondary">
                                        {new Date(appt.slotTime).toLocaleString()}
                                    </Typography>
                                    <Chip
                                        label={appt.status}
                                        color={appt.status === 'approved' ? 'success' : appt.status === 'pending' ? 'warning' : 'default'}
                                        size="small"
                                        sx={{ mt: 1 }}
                                    />
                                </Box>
                                <Box>
                                    {appt.status === 'approved' && (
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            startIcon={<VideoCall />}
                                            onClick={() => handleJoin(appt.meetingId)}
                                        >
                                            Join
                                        </Button>
                                    )}
                                    {user.role === 'counsellor' && appt.status === 'pending' && (
                                        <Button onClick={() => handleApprove(appt._id)}>Approve</Button>
                                    )}
                                </Box>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            )}

            {tab === 1 && (
                <Grid container spacing={2}>
                    {slots.length === 0 && <Typography sx={{ m: 2 }}>No slots available right now.</Typography>}
                    {slots.map((slot) => (
                        <Grid item xs={12} sm={6} md={4} key={slot._id}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" color="primary">{slot.counsellorId?.name}</Typography>
                                    <Typography color="textSecondary">{slot.counsellorId?.department}</Typography>
                                    <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <EventAvailable color="action" />
                                        <Typography>
                                            {new Date(slot.date).toLocaleDateString()} at {slot.startTime}
                                        </Typography>
                                    </Box>
                                </CardContent>
                                <CardActions>
                                    <Button size="small" variant="contained" fullWidth onClick={() => handleBook(slot._id)}>
                                        Book Slot
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
};

export default Appointments;
