const express = require('express');
const router = express.Router();
const ChatLog = require('../models/ChatLog');
const auth = require('../middleware/authMiddleware');
const { getChatResponse } = require('../services/openaiService');
const localAgent = require('../services/localAgent');

// Send Message
router.post('/message', auth, async (req, res) => {
    try {
        const { message } = req.body;
        const userId = req.user.user.id;

        // 1. Get or Create Chat Log for today/session
        // For simplicity, we append to a single log or create new one per day
        // Let's assume one main chat log per user for now, or fetch recent context
        let chatLog = await ChatLog.findOne({ userId }).sort({ timestamp: -1 });

        if (!chatLog) {
            chatLog = new ChatLog({ userId, messages: [] });
        }

        // 2. Add User Message
        chatLog.messages.push({ sender: 'user', content: message });

        // 3. Call Cloud AI (OpenAI)
        // Pass recent history context (last 5 messages)
        const history = chatLog.messages.slice(-5);
        const aiResponse = await getChatResponse(message, history);

        // 4. Update Chat Log with AI analysis
        if (aiResponse.risk_level === 'high') {
            chatLog.riskLevel = 'high';
            // Trigger Local Agent Action
            await localAgent.processAction('FLAG_HIGH_RISK', userId);
        }

        // 5. Check for Action Triggers (Local Agent)
        let agentMessage = "";
        if (aiResponse.suggest_booking) {
            const slotsInfo = await localAgent.processAction('SUGGEST_BOOKING', userId);
            agentMessage = `\n\nI found some available slots: ${slotsInfo}`;
        }

        // 6. Add AI Response to Log
        const fullResponse = aiResponse.message + agentMessage;
        chatLog.messages.push({ sender: 'bot', content: fullResponse });
        await chatLog.save();

        res.json({
            message: fullResponse,
            analysis: aiResponse
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get Chat History
router.get('/history', auth, async (req, res) => {
    try {
        const chatLog = await ChatLog.findOne({ userId: req.user.user.id }).sort({ timestamp: -1 });
        res.json(chatLog ? chatLog.messages : []);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
