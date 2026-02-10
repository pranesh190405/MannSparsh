const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Screening = require('../models/Screening');
const Appointment = require('../models/Appointment');
const ChatLog = require('../models/ChatLog');
const auth = require('../middleware/authMiddleware');

// Middleware to check admin role
const adminAuth = (req, res, next) => {
    if (req.user.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    next();
};

router.use(auth, adminAuth);

// Get Dashboard Stats
router.get('/stats', async (req, res) => {
    try {
        // 1. Student Count
        const studentCount = await User.countDocuments({ role: 'student' });

        // 2. High Risk Students (from latest chat logs or screening)
        // Simplified: Count users with high risk chat logs
        const highRiskCount = await ChatLog.distinct('userId', { riskLevel: 'high' }).countDocuments();

        // 3. Appointments Stats
        const totalAppointments = await Appointment.countDocuments();
        const pendingAppointments = await Appointment.countDocuments({ status: 'pending' });

        // 4. Screening Averages
        const screenings = await Screening.find();

        let phqSum = 0, phqCount = 0;
        let gadSum = 0, gadCount = 0;

        screenings.forEach(s => {
            if (s.testType === 'PHQ9') {
                phqSum += s.score;
                phqCount++;
            } else if (s.testType === 'GAD7') {
                gadSum += s.score;
                gadCount++;
            }
        });

        const avgDepression = phqCount ? (phqSum / phqCount).toFixed(1) : 0;
        const avgAnxiety = gadCount ? (gadSum / gadCount).toFixed(1) : 0;

        res.json({
            studentCount,
            highRiskCount,
            totalAppointments,
            pendingAppointments,
            avgDepression,
            avgAnxiety
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
