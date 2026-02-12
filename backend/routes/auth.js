const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Register User
router.post('/register', async (req, res) => {
    try {
        const { universityId, name, email, password, role, department, year, specialization, bio, credentials } = req.body;

        // Check if user exists
        let user = await User.findOne({ $or: [{ email }, { universityId }] });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Validate counsellor-specific fields
        if (role === 'counsellor') {
            if (!specialization) {
                return res.status(400).json({ message: 'Specialization is required for counsellors' });
            }
            if (!credentials) {
                return res.status(400).json({ message: 'Credentials are required for counsellors' });
            }
        }

        // Create user
        const userData = {
            universityId,
            name,
            email,
            passwordHash: password, // Will be hashed
            role: role || 'student',
            department,
            year
        };

        // Add counsellor-specific fields if role is counsellor
        if (role === 'counsellor') {
            userData.specialization = specialization;
            userData.bio = bio || '';
            userData.credentials = credentials;
        }

        user = new User(userData);
        await user.save();

        // Create JWT
        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '5d' },
            (err, token) => {
                if (err) throw err;
                res.json({
                    token,
                    user: {
                        id: user.id,
                        name: user.name,
                        role: user.role
                    }
                });
            }
        );

    } catch (err) {
        console.error(err.message);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

// Login User
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        // Match password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        // Create JWT
        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '5d' },
            (err, token) => {
                if (err) throw err;
                res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get Current User
router.get('/me', require('../middleware/authMiddleware'), async (req, res) => {
    try {
        const user = await User.findById(req.user.user.id).select('-passwordHash');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
