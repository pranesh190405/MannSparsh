// Simple rule-based mental health support chatbot
// No external API required

const responses = {
    greetings: [
        "Hello! I'm here to listen. How are you feeling today?",
        "Hi there! I'm glad you reached out. What's on your mind?",
        "Welcome! I'm here to support you. How can I help?"
    ],
    stress: [
        "I hear that you're feeling stressed. That's completely valid. Have you tried taking short breaks throughout your day? Even 5 minutes can help.",
        "Stress is tough. Remember to breathe deeply - try the 4-7-8 technique: breathe in for 4, hold for 7, out for 8.",
        "It sounds like you're under a lot of pressure. Consider talking to a counsellor - they can provide personalized strategies. You can book an appointment through our platform."
    ],
    anxiety: [
        "Anxiety can be overwhelming. Grounding techniques like the 5-4-3-2-1 method can help: name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste.",
        "I understand anxiety is difficult. Have you considered mindfulness or meditation? Even a few minutes daily can make a difference.",
        "Thank you for sharing. If your anxiety persists, please consider booking a session with one of our counsellors."
    ],
    depression: [
        "I'm sorry you're going through this. Please know that you're not alone, and it's brave of you to reach out.",
        "Depression is serious. I strongly encourage you to speak with a professional counsellor. Would you like to book an appointment?",
        "Your feelings are valid. Please consider reaching out to a counsellor or a trusted friend. Professional support can make a real difference."
    ],
    exams: [
        "Exam stress is very common. Try breaking your study into smaller chunks and taking regular breaks.",
        "Remember: your worth isn't defined by exam results. Do your best, but also take care of your mental health.",
        "Create a study schedule, get enough sleep, and don't hesitate to ask for help if you need it."
    ],
    default: [
        "I hear you. Can you tell me more about what you're experiencing?",
        "Thank you for sharing. How long have you been feeling this way?",
        "I'm here to listen. What would help you most right now?"
    ],
    crisis: [
        "It sounds like you might be in crisis. Please reach out to a counsellor immediately or contact emergency services. Your safety is the top priority.",
        "I'm concerned about what you've shared. Please speak to someone right away - a counsellor, trusted adult, or call a crisis helpline."
    ]
};

const keywords = {
    greetings: ['hello', 'hi', 'hey', 'good morning', 'good evening'],
    stress: ['stress', 'stressed', 'overwhelmed', 'pressure', 'workload', 'busy'],
    anxiety: ['anxiety', 'anxious', 'worried', 'nervous', 'panic', 'fear'],
    depression: ['depressed', 'sad', 'hopeless', 'empty', 'numb', 'worthless'],
    exams: ['exam', 'test', 'assignment', 'study', 'grade', 'marks'],
    crisis: ['suicide', 'kill myself', 'end it', 'die', 'hurt myself', 'self harm']
};

const getResponse = (userMessage) => {
    const message = userMessage.toLowerCase();

    // Check for crisis keywords first
    if (keywords.crisis.some(word => message.includes(word))) {
        return responses.crisis[Math.floor(Math.random() * responses.crisis.length)];
    }

    // Check other categories
    for (const [category, words] of Object.entries(keywords)) {
        if (category === 'crisis') continue; // Already handled
        if (words.some(word => message.includes(word))) {
            return responses[category][Math.floor(Math.random() * responses[category].length)];
        }
    }

    // Default response
    return responses.default[Math.floor(Math.random() * responses.default.length)];
};

module.exports = { getResponse };
