const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getCounsellors } = require('../controllers/userController');

router.get('/counsellors', protect, getCounsellors);

module.exports = router;
