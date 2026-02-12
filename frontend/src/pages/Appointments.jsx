import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Tabs, Tab, Paper, Button, Chip, Grid, Card,
    CardContent, CardActions, Container, Avatar, Dialog,
    DialogTitle, DialogContent, DialogActions, TextField, Alert, Badge
} from '@mui/material';
import {
    VideoCall, EventAvailable, Person, CalendarMonth,
    CheckCircle, Schedule, Cancel, Warning, Bolt
} from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const sConf = {
    approved: { color: '#10b981', icon: <CheckCircle sx={{ fontSize: 16 }} /> },
    pending: { color: '#f59e0b', icon: <Schedule sx={{ fontSize: 16 }} /> },
    cancelled: { color: '#ef4444', icon: <Cancel sx={{ fontSize: 16 }} /> },
    completed: { color: '#8b5cf6', icon: <CheckCircle sx={{ fontSize: 16 }} /> }
};

const Appointments = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [tab, setTab] = useState(0);
    const [appointments, setAppointments] = useState([]);
    const [slots, setSlots] = useState([]);
    const [emergReqs, setEmergReqs] = useState([]);
    const [emergOpen, setEmergOpen] = useState(false);
    const [emergNotes, setEmergNotes] = useState('');
    const [emergLoading, setEmergLoading] = useState(false);
    const [emergSuccess, setEmergSuccess] = useState('');
    const isC = user?.role === 'counsellor';

    useEffect(() => {
        fetchAppt();
        if (tab === 1) fetchSlots();
        if (tab === 2 && isC) fetchEmerg();
    }, [tab]);

    const fetchAppt = async () => {
        try { const r = await axios.get('/api/appointments/my-appointments'); setAppointments(r.data); } catch { }
    };
    const fetchSlots = async () => {
        try { const r = await axios.get('/api/appointments/slots'); setSlots(r.data); } catch { }
    };
    const fetchEmerg = async () => {
        try { const r = await axios.get('/api/appointments/emergency-requests'); setEmergReqs(r.data); } catch { }
    };
    const handleBook = async (id) => {
        try { await axios.post('/api/appointments/book', { slotId: id, notes: "Requested via Dashboard" }); setTab(0); fetchAppt(); }
        catch (e) { alert(e.response?.data?.message || "Failed"); }
    };
    const handleJoin = (id) => navigate(`/video/${id}`);
    const handleApprove = async (id) => {
        try { await axios.post(`/api/appointments/approve/${id}`); fetchAppt(); if (isC) fetchEmerg(); } catch { }
    };
    const handleEmerg = async () => {
        setEmergLoading(true);
        try {
            await axios.post('/api/appointments/emergency', { notes: emergNotes });
            setEmergOpen(false); setEmergNotes('');
            setEmergSuccess('Emergency request sent! A counsellor will respond shortly.');
            setTimeout(() => setEmergSuccess(''), 5000); fetchAppt();
        } catch (e) { alert(e.response?.data?.message || 'Failed'); }
        finally { setEmergLoading(false); }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 2, mb: 4, position: 'relative' }}>
            <Box sx={{ position: 'absolute', width: 250, height: 250, borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.2), transparent 70%)', top: -60, right: -40, animation: 'orbFloat1 14s ease-in-out infinite', filter: 'blur(50px)', pointerEvents: 'none' }} />

            {/* Header */}
            <Box className="animate-fadeInUp" sx={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 5, p: { xs: 3, md: 4 }, mb: 4, position: 'relative', overflow: 'hidden' }}>
                <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent, rgba(16,185,129,0.05), transparent)', backgroundSize: '200% 100%', animation: 'shimmer 3s linear infinite', pointerEvents: 'none' }} />
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={2} sx={{ position: 'relative', zIndex: 1 }}>
                    <Box>
                        <Box sx={{ width: 48, height: 48, borderRadius: 3, background: 'linear-gradient(135deg, #10b981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(16,185,129,0.3)', animation: 'float 3s ease-in-out infinite', mb: 1 }}>
                            <CalendarMonth sx={{ fontSize: 26, color: 'white' }} />
                        </Box>
                        <Typography sx={{ fontSize: { xs: '1.4rem', md: '1.75rem' }, fontWeight: 800, background: 'linear-gradient(135deg, #fff, #34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            Counselling Sessions
                        </Typography>
                        <Typography sx={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)' }}>Book and manage your sessions</Typography>
                    </Box>
                    {!isC && (
                        <Button variant="contained" color="error" startIcon={<Bolt sx={{ animation: 'pulse 1.5s ease-in-out infinite' }} />}
                            onClick={() => setEmergOpen(true)} sx={{ px: 3, py: 1.3, fontWeight: 700, borderRadius: 3 }}>
                            Emergency Meeting
                        </Button>
                    )}
                </Box>
            </Box>

            {emergSuccess && <Alert severity="success" sx={{ mb: 3, bgcolor: 'rgba(16,185,129,0.1)', color: '#34d399', border: '1px solid rgba(16,185,129,0.2)', animation: 'fadeInDown 0.5s ease-out' }}>{emergSuccess}</Alert>}

            <Paper sx={{ mb: 3, px: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }} className="animate-fadeInUp delay-1">
                <Tabs value={tab} onChange={(e, v) => setTab(v)}>
                    <Tab label="My Appointments" />
                    <Tab label="Book New Session" />
                    {isC && <Tab label={<Badge badgeContent={emergReqs.length} color="error">Emergency</Badge>} />}
                </Tabs>
            </Paper>

            {tab === 0 && (
                appointments.length === 0 ? (
                    <Box textAlign="center" py={8} sx={{ animation: 'fadeInUp 0.6s ease-out' }}>
                        <Box sx={{ width: 80, height: 80, borderRadius: '50%', mx: 'auto', mb: 2, background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'float 4s ease-in-out infinite', border: '1px solid rgba(16,185,129,0.2)' }}>
                            <CalendarMonth sx={{ fontSize: 36, color: '#10b981' }} />
                        </Box>
                        <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.6)' }}>No appointments yet</Typography>
                        <Button variant="contained" color="success" onClick={() => setTab(1)} sx={{ mt: 2, borderRadius: 3 }}>Book a Session</Button>
                    </Box>
                ) : (
                    <Grid container spacing={2.5}>
                        {appointments.map((a, i) => {
                            const s = sConf[a.status] || sConf.pending;
                            return (
                                <Grid item xs={12} md={6} key={a._id}>
                                    <Card className="animate-fadeInUp" sx={{ animationDelay: `${i * 0.1}s`, borderLeft: `3px solid ${a.isEmergency ? '#ef4444' : s.color}`, position: 'relative', overflow: 'hidden' }}>
                                        <Box sx={{ position: 'absolute', inset: 0, background: `linear-gradient(90deg, transparent, ${s.color}08, transparent)`, backgroundSize: '200% 100%', animation: 'shimmer 4s linear infinite', pointerEvents: 'none' }} />
                                        <CardContent sx={{ p: 2.5, position: 'relative', zIndex: 1 }}>
                                            {a.isEmergency && <Chip icon={<Warning sx={{ fontSize: 14 }} />} label="EMERGENCY" size="small" sx={{ bgcolor: 'rgba(239,68,68,0.15)', color: '#f87171', fontWeight: 700, mb: 1.5, fontSize: '0.65rem', border: '1px solid rgba(239,68,68,0.2)', animation: 'pulse 2s ease-in-out infinite' }} />}
                                            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                                                <Box display="flex" alignItems="center" gap={1.5}>
                                                    <Avatar sx={{ background: `linear-gradient(135deg, ${s.color}, ${s.color}cc)`, width: 42, height: 42, boxShadow: `0 4px 12px ${s.color}40` }}><Person /></Avatar>
                                                    <Box>
                                                        <Typography variant="subtitle1" fontWeight={600}>
                                                            {user?.role === 'student' ? a.counsellorId?.name || 'Counsellor' : a.studentId?.name || 'Student'}
                                                        </Typography>
                                                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>
                                                            {user?.role === 'student' ? (a.counsellorId?.specialization || 'Counsellor') : 'Student'}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                                <Chip icon={s.icon} label={a.status} size="small" sx={{ bgcolor: s.color + '15', color: s.color, fontWeight: 600, textTransform: 'capitalize', fontSize: '0.73rem', border: '1px solid ' + s.color + '25' }} />
                                            </Box>
                                            <Box display="flex" alignItems="center" gap={1}>
                                                <EventAvailable sx={{ fontSize: 16, color: 'rgba(255,255,255,0.4)' }} />
                                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                                                    {new Date(a.slotTime).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                                </Typography>
                                                <Typography variant="body2" fontWeight={600}>
                                                    {new Date(a.slotTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </Typography>
                                            </Box>
                                        </CardContent>
                                        <CardActions sx={{ px: 2.5, pb: 2, position: 'relative', zIndex: 1 }}>
                                            {a.status === 'approved' && <Button variant="contained" color="success" startIcon={<VideoCall />} onClick={() => handleJoin(a.meetingId)} sx={{ borderRadius: 3, fontWeight: 600 }}>Join Video Call</Button>}
                                            {isC && a.status === 'pending' && <Button variant="contained" onClick={() => handleApprove(a._id)} sx={{ borderRadius: 3, fontWeight: 600 }}>Approve</Button>}
                                        </CardActions>
                                    </Card>
                                </Grid>
                            );
                        })}
                    </Grid>
                )
            )}

            {tab === 1 && (
                slots.length === 0 ? (
                    <Box textAlign="center" py={8} sx={{ animation: 'fadeInUp 0.6s ease-out' }}>
                        <Box sx={{ width: 80, height: 80, borderRadius: '50%', mx: 'auto', mb: 2, background: 'rgba(139,92,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'float 4s ease-in-out infinite', border: '1px solid rgba(139,92,246,0.2)' }}>
                            <Schedule sx={{ fontSize: 36, color: '#8b5cf6' }} />
                        </Box>
                        <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.6)' }}>No slots available</Typography>
                    </Box>
                ) : (
                    <Grid container spacing={2.5}>
                        {slots.map((sl, i) => (
                            <Grid item xs={12} sm={6} md={4} key={sl._id}>
                                <Card className="animate-fadeInUp" sx={{ animationDelay: `${i * 0.1}s` }}>
                                    <Box sx={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(16,185,129,0.05))', p: 2.5, textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                                        <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent)', backgroundSize: '200% 100%', animation: 'shimmer 3s linear infinite' }} />
                                        <Avatar sx={{ width: 56, height: 56, mx: 'auto', background: 'linear-gradient(135deg, #10b981, #059669)', boxShadow: '0 4px 16px rgba(16,185,129,0.3)', animation: 'float 3s ease-in-out infinite', animationDelay: `${i * 0.2}s` }}><Person sx={{ fontSize: 28 }} /></Avatar>
                                    </Box>
                                    <CardContent sx={{ textAlign: 'center' }}>
                                        <Typography variant="h6" fontWeight={700} sx={{ fontSize: '1rem' }}>{sl.counsellorId?.name || 'Counsellor'}</Typography>
                                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)' }} gutterBottom>{sl.counsellorId?.specialization || 'General'}</Typography>
                                        <Chip icon={<EventAvailable sx={{ fontSize: 14 }} />} label={`${new Date(sl.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at ${sl.startTime}`} size="small" sx={{ mt: 1, bgcolor: 'rgba(16,185,129,0.1)', color: '#34d399', fontWeight: 600, fontSize: '0.73rem', border: '1px solid rgba(16,185,129,0.2)' }} />
                                    </CardContent>
                                    <CardActions sx={{ p: 2, pt: 0 }}>
                                        <Button fullWidth variant="contained" color="success" onClick={() => handleBook(sl._id)} sx={{ borderRadius: 3, fontWeight: 600 }}>Book This Slot</Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )
            )}

            {tab === 2 && isC && (
                emergReqs.length === 0 ? (
                    <Box textAlign="center" py={8} sx={{ animation: 'fadeInUp 0.6s ease-out' }}>
                        <CheckCircle sx={{ fontSize: 48, color: '#10b981', mb: 2 }} />
                        <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.6)' }}>No pending requests</Typography>
                    </Box>
                ) : (
                    <Grid container spacing={2.5}>
                        {emergReqs.map((r, i) => (
                            <Grid item xs={12} md={6} key={r._id}>
                                <Card className="animate-fadeInUp" sx={{ animationDelay: `${i * 0.1}s`, borderLeft: '3px solid #ef4444' }}>
                                    <CardContent sx={{ p: 2.5 }}>
                                        <Box display="flex" alignItems="center" gap={1} mb={2}>
                                            <Bolt sx={{ color: '#ef4444', animation: 'pulse 1.5s ease-in-out infinite' }} />
                                            <Typography variant="subtitle1" fontWeight={700} color="#f87171">Emergency</Typography>
                                        </Box>
                                        <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                                            <Avatar sx={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}><Person /></Avatar>
                                            <Box>
                                                <Typography variant="subtitle1" fontWeight={600}>{r.studentId?.name || 'Student'}</Typography>
                                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>{r.studentId?.department}</Typography>
                                            </Box>
                                        </Box>
                                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>{r.notes}</Typography>
                                    </CardContent>
                                    <CardActions sx={{ px: 2.5, pb: 2 }}>
                                        <Button fullWidth variant="contained" color="error" onClick={() => handleApprove(r._id)} sx={{ borderRadius: 3, fontWeight: 700 }}>Accept Session</Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )
            )}

            <Dialog open={emergOpen} onClose={() => setEmergOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 700 }}>
                    <Box display="flex" alignItems="center" gap={1}>
                        <Bolt sx={{ color: '#ef4444', animation: 'pulse 1.5s ease-in-out infinite' }} />
                        Emergency Meeting
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Alert severity="warning" sx={{ mb: 2, mt: 1, bgcolor: 'rgba(245,158,11,0.1)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.2)' }}>
                        For urgent situations only. A counsellor will be notified immediately.
                    </Alert>
                    <TextField fullWidth multiline rows={3} label="Brief description" value={emergNotes} onChange={(e) => setEmergNotes(e.target.value)} />
                </DialogContent>
                <DialogActions sx={{ p: 3, pt: 0 }}>
                    <Button onClick={() => setEmergOpen(false)} variant="outlined">Cancel</Button>
                    <Button variant="contained" color="error" onClick={handleEmerg} disabled={emergLoading} sx={{ borderRadius: 3, fontWeight: 700 }}>
                        {emergLoading ? 'Sending...' : 'Send Request'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Appointments;
