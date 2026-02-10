const mongoose = require('mongoose');

const screeningSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    testType: {
        type: String,
        enum: ['PHQ9', 'GAD7'],
        required: true
    },
    answers: {
        type: [Number],
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    severity: {
        type: String,
        enum: ['minimal', 'mild', 'moderate', 'severe'],
        required: true
    },
    completedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Screening', screeningSchema);
