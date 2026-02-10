const express = require('express');
const router = express.Router();
const CounsellorAvailability = require('../models/CounsellorAvailability');
const auth = require('../middleware/authMiddleware');

// Get counsellor's availability
router.get('/my-availability', auth, async (req, res) => {
    try {
        if (req.user.user.role !== 'counsellor') {
            return res.status(403).json({ message: 'Access denied. Counsellors only.' });
        }

        let availability = await CounsellorAvailability.findOne({ counsellorId: req.user.user.id });

        if (!availability) {
            // Create default empty availability
            availability = new CounsellorAvailability({
                counsellorId: req.user.user.id,
                weeklySchedule: [],
                blockedDates: []
            });
            await availability.save();
        }

        res.json(availability);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update counsellor's availability
router.put('/my-availability', auth, async (req, res) => {
    try {
        if (req.user.user.role !== 'counsellor') {
            return res.status(403).json({ message: 'Access denied. Counsellors only.' });
        }

        const { weeklySchedule, blockedDates } = req.body;

        let availability = await CounsellorAvailability.findOne({ counsellorId: req.user.user.id });

        if (!availability) {
            availability = new CounsellorAvailability({
                counsellorId: req.user.user.id,
                weeklySchedule: weeklySchedule || [],
                blockedDates: blockedDates || []
            });
        } else {
            if (weeklySchedule) availability.weeklySchedule = weeklySchedule;
            if (blockedDates) availability.blockedDates = blockedDates;
        }

        await availability.save();
        res.json(availability);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all counsellors with their availability (for students)
router.get('/counsellors', auth, async (req, res) => {
    try {
        const counsellors = await User.find({
            role: 'counsellor',
            isApproved: true
        }).select('-passwordHash');

        // Get availability for each counsellor
        const counsellorsWithAvailability = await Promise.all(
            counsellors.map(async (counsellor) => {
                const availability = await CounsellorAvailability.findOne({
                    counsellorId: counsellor._id
                });
                return {
                    ...counsellor.toObject(),
                    availability: availability || null
                };
            })
        );

        res.json(counsellorsWithAvailability);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
