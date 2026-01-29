const User = require('../models/User');

// @desc    Get all verified counsellors
// @route   GET /api/users/counsellors
// @access  Private
const getCounsellors = async (req, res) => {
    try {
        const counsellors = await User.find({ role: 'counsellor', isVerified: true }).select('-password');
        res.json(counsellors);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getCounsellors,
};
