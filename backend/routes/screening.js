const express = require('express');
const router = express.Router();
const Screening = require('../models/Screening');
const auth = require('../middleware/authMiddleware');

// Submit Screening Result
router.post('/submit', auth, async (req, res) => {
    try {
        const { testType, answers, score, severity } = req.body;

        const screening = new Screening({
            userId: req.user.user.id,
            testType,
            answers,
            score,
            severity
        });

        await screening.save();
        res.json(screening);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get User Screenings
router.get('/my-results', auth, async (req, res) => {
    try {
        const screenings = await Screening.find({ userId: req.user.user.id }).sort({ completedAt: -1 });
        res.json(screenings);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
