const express = require('express');
const router = express.Router();
const CounsellorAvailability = require('../models/CounsellorAvailability');
const CounsellorSlot = require('../models/CounsellorSlot');
const User = require('../models/User');
const auth = require('../middleware/authMiddleware');

// Helper: generate slots for the next N weeks from weekly schedule
const generateSlotsFromSchedule = async (counsellorId, weeklySchedule, weeksAhead = 2) => {
    // Remove old unbooked slots for this counsellor (future only)
    await CounsellorSlot.deleteMany({
        counsellorId,
        isBooked: false,
        date: { $gte: new Date() }
    });

    const dayMap = {
        'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3,
        'Thursday': 4, 'Friday': 5, 'Saturday': 6
    };

    const slots = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let week = 0; week < weeksAhead; week++) {
        for (const entry of weeklySchedule) {
            const targetDay = dayMap[entry.day];
            if (targetDay === undefined) continue;

            // Find the next occurrence of this day
            const date = new Date(today);
            date.setDate(date.getDate() + (week * 7) + ((targetDay - today.getDay() + 7) % 7));

            // Skip dates in the past
            if (date < today) continue;

            slots.push({
                counsellorId,
                date,
                startTime: entry.startTime,
                endTime: entry.endTime,
                isBooked: false
            });
        }
    }

    if (slots.length > 0) {
        await CounsellorSlot.insertMany(slots);
    }

    return slots;
};

// Get counsellor's availability
router.get('/my-availability', auth, async (req, res) => {
    try {
        if (req.user.user.role !== 'counsellor') {
            return res.status(403).json({ message: 'Access denied. Counsellors only.' });
        }

        let availability = await CounsellorAvailability.findOne({ counsellorId: req.user.user.id });

        if (!availability) {
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

        // Auto-generate bookable slots from the weekly schedule
        if (weeklySchedule && weeklySchedule.length > 0) {
            await generateSlotsFromSchedule(req.user.user.id, weeklySchedule);
        }

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
            role: 'counsellor'
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
