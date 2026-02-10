const mongoose = require('mongoose');

const chatLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    riskLevel: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'low'
    },
    summary: {
        type: String
    },
    messages: [{
        sender: { type: String, enum: ['user', 'bot'] },
        content: String,
        timestamp: { type: Date, default: Date.now }
    }],
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('ChatLog', chatLogSchema);
