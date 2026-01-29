const { GoogleGenerativeAI } = require('@google/generative-ai');
const { getResponse } = require('../utils/ruleBothat');

// @desc    Chat with AI Counsellor
// @route   POST /api/ai/chat
// @access  Private
const chatWithGemini = async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ message: 'Prompt is required' });
    }

    // If no API key, use rule-based fallback
    if (!process.env.GEMINI_API_KEY) {
        const reply = getResponse(prompt);
        return res.json({ reply });
    }

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: "Act as a compassionate mental health counsellor named 'CampusMind AI'. Be supportive, empathetic, and professional. Provide brief, helpful advice. If the user seems in danger, advise them to seek immediate help." }],
                },
                {
                    role: "model",
                    parts: [{ text: "Hello! I am CampusMind AI. I'm here to listen and support you. How are you feeling today?" }],
                },
            ],
        });

        const result = await chat.sendMessage(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ reply: text });
    } catch (error) {
        console.error('Gemini API Error:', error.message);
        // Fallback to rule-based bot
        const reply = getResponse(prompt);
        res.json({ reply: reply + " (Note: Using fallback mode)" });
    }
};

module.exports = {
    chatWithGemini,
};
