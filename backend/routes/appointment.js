const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const CounsellorSlot = require('../models/CounsellorSlot');
const auth = require('../middleware/authMiddleware');
const User = require('../models/User');

// Get Available Slots
router.get('/slots', auth, async (req, res) => {
    try {
        // Return all unbooked slots in the future
        const slots = await CounsellorSlot.find({
            isBooked: false,
            date: { $gte: new Date() }
        }).populate('counsellorId', 'name department');
        res.json(slots);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Create Slot (Counsellor only)
// TODO: Add role check middleware or check role in handler
router.post('/slots', auth, async (req, res) => {
    if (req.user.user.role !== 'counsellor' && req.user.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized' });
    }

    try {
        const { date, startTime, endTime } = req.body;
        const slot = new CounsellorSlot({
            counsellorId: req.user.user.id,
            date,
            startTime,
            endTime
        });
        await slot.save();
        res.json(slot);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Book Appointment
router.post('/book', auth, async (req, res) => {
    try {
        const { slotId, notes } = req.body;

        const slot = await CounsellorSlot.findById(slotId);
        if (!slot) {
            return res.status(404).json({ message: 'Slot not found' });
        }
        if (slot.isBooked) {
            return res.status(400).json({ message: 'Slot already booked' });
        }

        // Create Appointment
        // Combine date and startTime to get slotTime approximation or just use date
        const appointment = new Appointment({
            studentId: req.user.user.id,
            counsellorId: slot.counsellorId,
            slotTime: slot.date, // Simplification, strictly should combine date + time
            notes,
            status: 'pending'
        });

        await appointment.save();

        // Mark slot as booked
        slot.isBooked = true;
        await slot.save();

        res.json(appointment);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get My Appointments (Student & Counsellor)
router.get('/my-appointments', auth, async (req, res) => {
    try {
        let query = {};
        if (req.user.user.role === 'student') {
            query.studentId = req.user.user.id;
        } else if (req.user.user.role === 'counsellor') {
            query.counsellorId = req.user.user.id;
        }

        const appointments = await Appointment.find(query)
            .populate('studentId', 'name email')
            .populate('counsellorId', 'name department')
            .sort({ slotTime: 1 });

        res.json(appointments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Approve Appointment (Counsellor)
router.post('/approve/:id', auth, async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // Check if user is the assigned counsellor
        if (appointment.counsellorId.toString() !== req.user.user.id && req.user.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        appointment.status = 'approved';
        // Generate Meeting ID
        appointment.meetingId = `meet_${appointment.id}_${Date.now()}`;
        await appointment.save();

        res.json(appointment);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
