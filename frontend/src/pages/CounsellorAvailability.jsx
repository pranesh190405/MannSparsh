import { useState, useEffect } from 'react';
import {
    Container, Box, Typography, Grid, Card, CardContent, Button,
    TextField, MenuItem, IconButton, Chip, Alert, Dialog,
    DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { Add, Delete, Save } from '@mui/icons-material';
import axios from 'axios';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const CounsellorAvailability = () => {
    const [weeklySchedule, setWeeklySchedule] = useState([]);
    const [blockedDates, setBlockedDates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saveMessage, setSaveMessage] = useState('');
    const [openBlockDialog, setOpenBlockDialog] = useState(false);
    const [blockDate, setBlockDate] = useState({ date: '', reason: '' });

    useEffect(() => {
        fetchAvailability();
    }, []);

    const fetchAvailability = async () => {
        try {
            const res = await axios.get('/api/counsellor-availability/my-availability');
            setWeeklySchedule(res.data.weeklySchedule || []);
            setBlockedDates(res.data.blockedDates || []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching availability:', error);
            setLoading(false);
        }
    };

    const addTimeSlot = () => {
        setWeeklySchedule([
            ...weeklySchedule,
            { day: 'Monday', startTime: '09:00', endTime: '10:00', isRecurring: true }
        ]);
    };

    const updateTimeSlot = (index, field, value) => {
        const updated = [...weeklySchedule];
        updated[index][field] = value;
        setWeeklySchedule(updated);
    };

    const removeTimeSlot = (index) => {
        setWeeklySchedule(weeklySchedule.filter((_, i) => i !== index));
    };

    const handleSave = async () => {
        try {
            await axios.put('/api/counsellor-availability/my-availability', {
                weeklySchedule,
                blockedDates
            });
            setSaveMessage('Availability saved successfully!');
            setTimeout(() => setSaveMessage(''), 3000);
        } catch (error) {
            console.error('Error saving availability:', error);
            setSaveMessage('Error saving availability. Please try again.');
        }
    };

    const handleBlockDate = () => {
        if (blockDate.date) {
            setBlockedDates([...blockedDates, blockDate]);
            setBlockDate({ date: '', reason: '' });
            setOpenBlockDialog(false);
        }
    };

    const removeBlockedDate = (index) => {
        setBlockedDates(blockedDates.filter((_, i) => i !== index));
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Box>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        Manage Availability
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Set your weekly schedule and block specific dates
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={handleSave}
                    size="large"
                >
                    Save Changes
                </Button>
            </Box>

            {saveMessage && (
                <Alert severity={saveMessage.includes('Error') ? 'error' : 'success'} sx={{ mb: 3 }}>
                    {saveMessage}
                </Alert>
            )}

            {/* Weekly Schedule */}
            <Card sx={{ mb: 4 }}>
                <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                        <Typography variant="h6" fontWeight="600">
                            Weekly Schedule
                        </Typography>
                        <Button
                            variant="outlined"
                            startIcon={<Add />}
                            onClick={addTimeSlot}
                        >
                            Add Time Slot
                        </Button>
                    </Box>

                    {weeklySchedule.length === 0 ? (
                        <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
                            No time slots added yet. Click "Add Time Slot" to get started.
                        </Typography>
                    ) : (
                        <Grid container spacing={2}>
                            {weeklySchedule.map((slot, index) => (
                                <Grid item xs={12} key={index}>
                                    <Card variant="outlined">
                                        <CardContent>
                                            <Grid container spacing={2} alignItems="center">
                                                <Grid item xs={12} sm={3}>
                                                    <TextField
                                                        select
                                                        fullWidth
                                                        label="Day"
                                                        value={slot.day}
                                                        onChange={(e) => updateTimeSlot(index, 'day', e.target.value)}
                                                    >
                                                        {days.map((day) => (
                                                            <MenuItem key={day} value={day}>
                                                                {day}
                                                            </MenuItem>
                                                        ))}
                                                    </TextField>
                                                </Grid>
                                                <Grid item xs={12} sm={3}>
                                                    <TextField
                                                        fullWidth
                                                        type="time"
                                                        label="Start Time"
                                                        value={slot.startTime}
                                                        onChange={(e) => updateTimeSlot(index, 'startTime', e.target.value)}
                                                        InputLabelProps={{ shrink: true }}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={3}>
                                                    <TextField
                                                        fullWidth
                                                        type="time"
                                                        label="End Time"
                                                        value={slot.endTime}
                                                        onChange={(e) => updateTimeSlot(index, 'endTime', e.target.value)}
                                                        InputLabelProps={{ shrink: true }}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={2}>
                                                    <Chip
                                                        label={slot.isRecurring ? 'Recurring' : 'One-time'}
                                                        color={slot.isRecurring ? 'primary' : 'default'}
                                                        size="small"
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={1}>
                                                    <IconButton
                                                        color="error"
                                                        onClick={() => removeTimeSlot(index)}
                                                    >
                                                        <Delete />
                                                    </IconButton>
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </CardContent>
            </Card>

            {/* Blocked Dates */}
            <Card>
                <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                        <Typography variant="h6" fontWeight="600">
                            Blocked Dates
                        </Typography>
                        <Button
                            variant="outlined"
                            startIcon={<Add />}
                            onClick={() => setOpenBlockDialog(true)}
                        >
                            Block Date
                        </Button>
                    </Box>

                    {blockedDates.length === 0 ? (
                        <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
                            No blocked dates. You can block specific dates when you're unavailable.
                        </Typography>
                    ) : (
                        <Grid container spacing={2}>
                            {blockedDates.map((blocked, index) => (
                                <Grid item xs={12} sm={6} md={4} key={index}>
                                    <Card variant="outlined">
                                        <CardContent>
                                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                                <Box>
                                                    <Typography variant="body1" fontWeight="600">
                                                        {new Date(blocked.date).toLocaleDateString()}
                                                    </Typography>
                                                    {blocked.reason && (
                                                        <Typography variant="body2" color="text.secondary">
                                                            {blocked.reason}
                                                        </Typography>
                                                    )}
                                                </Box>
                                                <IconButton
                                                    color="error"
                                                    size="small"
                                                    onClick={() => removeBlockedDate(index)}
                                                >
                                                    <Delete />
                                                </IconButton>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </CardContent>
            </Card>

            {/* Block Date Dialog */}
            <Dialog open={openBlockDialog} onClose={() => setOpenBlockDialog(false)}>
                <DialogTitle>Block a Date</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        type="date"
                        label="Date"
                        value={blockDate.date}
                        onChange={(e) => setBlockDate({ ...blockDate, date: e.target.value })}
                        InputLabelProps={{ shrink: true }}
                        sx={{ mt: 2, mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Reason (Optional)"
                        value={blockDate.reason}
                        onChange={(e) => setBlockDate({ ...blockDate, reason: e.target.value })}
                        placeholder="e.g., Conference, Personal leave"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenBlockDialog(false)}>Cancel</Button>
                    <Button onClick={handleBlockDate} variant="contained">
                        Block Date
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default CounsellorAvailability;
