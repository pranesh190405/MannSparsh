const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { chatWithGemini } = require('../controllers/aiController');

router.post('/chat', protect, chatWithGemini);

module.exports = router;
