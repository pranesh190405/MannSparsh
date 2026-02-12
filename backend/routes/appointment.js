const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const CounsellorSlot = require('../models/CounsellorSlot');
const auth = require('../middleware/authMiddleware');
const User = require('../models/User');

// Get Available Slots
router.get('/slots', auth, async (req, res) => {
    try {
        const slots = await CounsellorSlot.find({
            isBooked: false,
            date: { $gte: new Date() }
        }).populate('counsellorId', 'name department specialization');
        res.json(slots);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Create Slot (Counsellor only)
router.post('/slots', auth, async (req, res) => {
    if (req.user.user.role !== 'counsellor') {
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

        const appointment = new Appointment({
            studentId: req.user.user.id,
            counsellorId: slot.counsellorId,
            slotTime: slot.date,
            notes,
            status: 'pending'
        });

        await appointment.save();

        slot.isBooked = true;
        await slot.save();

        res.json(appointment);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Emergency Meeting Request (Student)
router.post('/emergency', auth, async (req, res) => {
    try {
        const { notes } = req.body;

        // Find any available counsellor
        const counsellors = await User.find({ role: 'counsellor' }).select('_id');

        if (counsellors.length === 0) {
            return res.status(404).json({ message: 'No counsellors available' });
        }

        // Create emergency appointment — not assigned to a specific counsellor yet
        const appointment = new Appointment({
            studentId: req.user.user.id,
            counsellorId: counsellors[0]._id, // Placeholder, any counsellor can accept
            slotTime: new Date(),
            notes: notes || 'Emergency meeting requested',
            status: 'pending',
            isEmergency: true
        });

        await appointment.save();

        const populated = await Appointment.findById(appointment._id)
            .populate('studentId', 'name email')
            .populate('counsellorId', 'name department');

        res.json(populated);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get Emergency Requests (for counsellors)
router.get('/emergency-requests', auth, async (req, res) => {
    try {
        if (req.user.user.role !== 'counsellor') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const emergencies = await Appointment.find({
            isEmergency: true,
            status: 'pending'
        })
            .populate('studentId', 'name email department year')
            .populate('counsellorId', 'name')
            .sort({ createdAt: -1 });

        res.json(emergencies);
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
            .populate('counsellorId', 'name department specialization')
            .sort({ createdAt: -1 });

        res.json(appointments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Approve Appointment (Counsellor)
router.post('/approve/:id', auth, async (req, res) => {
    try {
        if (req.user.user.role !== 'counsellor') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // For emergency meetings, any counsellor can accept
        // For regular meetings, only the assigned counsellor
        if (!appointment.isEmergency && appointment.counsellorId.toString() !== req.user.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // If emergency, assign this counsellor
        if (appointment.isEmergency) {
            appointment.counsellorId = req.user.user.id;
        }

        appointment.status = 'approved';
        appointment.meetingId = `meet_${appointment.id}_${Date.now()}`;
        await appointment.save();

        const populated = await Appointment.findById(appointment._id)
            .populate('studentId', 'name email')
            .populate('counsellorId', 'name department');

        res.json(populated);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
