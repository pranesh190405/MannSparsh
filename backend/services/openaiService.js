const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/'
});

const SYSTEM_PROMPT = `
You are MannSparsh AI, a compassionate and supportive mental health first-aid assistant specifically designed for university students.

Your core responsibilities:
1. Listen with empathy and validate their feelings
2. Provide evidence-based coping strategies and self-care techniques
3. Recognize signs of distress and assess risk levels
4. Suggest professional resources when appropriate
5. Encourage healthy habits and positive thinking

Important guidelines:
- NEVER diagnose mental health disorders or prescribe medication
- NEVER claim to be a human counsellor or therapist
- ALWAYS maintain a warm, non-judgmental, and supportive tone
- Use age-appropriate language for university students
- Acknowledge the challenges of student life (exams, social pressure, etc.)

Crisis Detection Keywords:
- Self-harm, suicide, ending life, killing myself, want to die
- Severe hopelessness, worthlessness, unbearable pain
- Immediate danger to self or others

You MUST respond in valid JSON format with these fields:
{
  "emotion": "detected primary emotion (e.g., anxious, sad, stressed, hopeful)",
  "risk_level": "low" | "medium" | "high",
  "suggest_booking": boolean (true if professional help recommended),
  "suggest_screening": boolean (true if symptoms indicate depression/anxiety),
  "message": "your empathetic, helpful response (2-4 sentences, conversational tone)"
}

Risk Level Guidelines:
- HIGH: Mentions of self-harm, suicide, severe crisis, immediate danger
- MEDIUM: Persistent symptoms, overwhelming distress, significant impairment
- LOW: Normal stress, mild worry, general support needed

When risk_level is HIGH:
- Express immediate concern and care
- Provide crisis hotline information
- Strongly recommend booking a counsellor
- Reassure them that help is available

When suggesting professional help:
- Frame it positively (not as a failure)
- Emphasize that counsellors are trained to help
- Mention that many students benefit from counselling
`;

const CRISIS_KEYWORDS = [
    'suicide', 'kill myself', 'end my life', 'want to die', 'better off dead',
    'self harm', 'cut myself', 'hurt myself', 'no reason to live',
    'can\'t go on', 'unbearable', 'hopeless', 'worthless'
];

const getChatResponse = async (userMessage, history = []) => {
    try {
        const lowerMessage = userMessage.toLowerCase();
        const hasCrisisKeyword = CRISIS_KEYWORDS.some(keyword =>
            lowerMessage.includes(keyword)
        );

        const recentHistory = history.slice(-10);
        const messages = [
            { role: "system", content: SYSTEM_PROMPT },
            ...recentHistory.map(msg => ({
                role: msg.sender === 'user' ? 'user' : 'assistant',
                content: msg.content
            })),
            { role: "user", content: userMessage }
        ];

        const completion = await openai.chat.completions.create({
            model: "gemini-1.5-flash",
            messages: messages,
            temperature: 0.7,
            max_tokens: 300
        });

        const responseContent = completion.choices[0].message.content;

        // Parse JSON — handle markdown code fences that Gemini sometimes wraps
        let cleanJson = responseContent.trim();
        if (cleanJson.startsWith('```')) {
            cleanJson = cleanJson.replace(/^```(?:json)?\s*/, '').replace(/```\s*$/, '').trim();
        }
        const parsedResponse = JSON.parse(cleanJson);

        if (hasCrisisKeyword && parsedResponse.risk_level !== 'high') {
            parsedResponse.risk_level = 'high';
            parsedResponse.suggest_booking = true;
        }

        return parsedResponse;

    } catch (error) {
        console.error("AI Error:", error.message || error);
        return {
            emotion: "neutral",
            risk_level: "low",
            suggest_booking: false,
            suggest_screening: false,
            message: "I'm having trouble connecting right now, but I'm here to listen. Can you tell me more about what you're experiencing? If you're in crisis, please reach out to a counsellor or call a crisis hotline immediately."
        };
    }
};

module.exports = { getChatResponse };
