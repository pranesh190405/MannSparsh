const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Screening = require('../models/Screening');
const ChatLog = require('../models/ChatLog');
const Appointment = require('../models/Appointment');

// Middleware to check if user is counsellor
const isCounsellor = (req, res, next) => {
    // Depending on how token was signed, role might be in req.user.role or req.user.user.role
    const userRole = req.user?.role || req.user?.user?.role;

    if (userRole !== 'counsellor') {
        return res.status(403).json({ message: 'Access denied. Counsellor only.' });
    }
    next();
};

// 1. Mental Health Status Report (Aggregated Screenings)
router.get('/mental-health-status', auth, isCounsellor, async (req, res) => {
    try {
        const stats = await Screening.aggregate([
            {
                $group: {
                    _id: '$severity',
                    count: { $sum: 1 }
                }
            }
        ]);

        const formattedStats = {
            minimal: 0,
            mild: 0,
            moderate: 0,
            severe: 0
        };

        stats.forEach(stat => {
            if (formattedStats[stat._id] !== undefined) {
                formattedStats[stat._id] = stat.count;
            }
        });

        res.json(formattedStats);
    } catch (err) {
        console.error('Mental Health Stats Error:', err);
        res.status(500).send('Server error');
    }
});

// 2. High-Risk Student Identification
router.get('/high-risk-students', auth, isCounsellor, async (req, res) => {
    try {
        // Find recent high-risk chats
        const highRiskChats = await ChatLog.find({ riskLevel: 'high' })
            .sort({ timestamp: -1 })
            .limit(20)
            .populate('userId', 'name email universityId department');

        const studentsMap = new Map();

        highRiskChats.forEach(chat => {
            if (chat.userId && !studentsMap.has(chat.userId._id.toString())) {
                studentsMap.set(chat.userId._id.toString(), {
                    student: chat.userId,
                    reason: 'High Risk Chat Conversation',
                    date: chat.timestamp
                });
            }
        });

        // Find severe screenings
        const severeScreenings = await Screening.find({ severity: 'severe' })
            .sort({ completedAt: -1 })
            .limit(20)
            .populate('userId', 'name email universityId department');

        severeScreenings.forEach(screening => {
            if (screening.userId && !studentsMap.has(screening.userId._id.toString())) {
                studentsMap.set(screening.userId._id.toString(), {
                    student: screening.userId,
                    reason: `Severe Screening Score (${screening.score})`,
                    date: screening.completedAt
                });
            }
        });

        res.json(Array.from(studentsMap.values()).sort((a, b) => b.date - a.date));
    } catch (err) {
        console.error('High-Risk Students Error:', err);
        res.status(500).send('Server error');
    }
});

// 3. Appointment Utilization Report
router.get('/appointment-utilization', auth, isCounsellor, async (req, res) => {
    try {
        // Get appointments for the logged-in counsellor
        const counsellorId = req.user.user.id;

        const appointments = await Appointment.find({ counsellorId });

        const stats = {
            total: appointments.length,
            completed: 0,
            pending: 0,
            cancelled: 0,
            approved: 0,
            emergency: 0
        };

        appointments.forEach(app => {
            if (stats[app.status] !== undefined) {
                stats[app.status]++;
            }
            if (app.isEmergency) {
                stats.emergency++;
            }
        });

        res.json(stats);
    } catch (err) {
        console.error('Appointment Utilization Error:', err);
        res.status(500).send('Server error');
    }
});

// 4. Screenings Over Time
router.get('/screenings-over-time', auth, isCounsellor, async (req, res) => {
    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const screenings = await Screening.aggregate([
            {
                $match: {
                    completedAt: { $gte: thirtyDaysAgo }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$completedAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        const formattedScreenings = screenings.map(s => ({
            date: s._id,
            count: s.count
        }));

        res.json(formattedScreenings);
    } catch (err) {
        console.error('Screenings Over Time Error:', err);
        res.status(500).send('Server error');
    }
});

// 5. Department Alert Heatmap
router.get('/department-heatmap', auth, isCounsellor, async (req, res) => {
    try {
        // Collect high risk student IDs from chat logs
        const highRiskChats = await ChatLog.find({ riskLevel: 'high' }).populate('userId', 'department');

        // Collect severe screenings
        const severeScreenings = await Screening.find({ severity: 'severe' }).populate('userId', 'department');

        const deptCounts = {};

        const addDept = (user) => {
            if (user && user.department) {
                deptCounts[user.department] = (deptCounts[user.department] || 0) + 1;
            }
        };

        highRiskChats.forEach(chat => addDept(chat.userId));
        severeScreenings.forEach(screening => addDept(screening.userId));

        const formattedStats = Object.keys(deptCounts).map(dept => ({
            department: dept,
            highRiskCount: deptCounts[dept]
        })).sort((a, b) => b.highRiskCount - a.highRiskCount);

        res.json(formattedStats);
    } catch (err) {
        console.error('Department Heatmap Error:', err);
        res.status(500).send('Server error');
    }
});

module.exports = router;
