const mongoose = require('mongoose');

const forumPostSchema = new mongoose.Schema({
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    tags: [String],
    category: {
        type: String,
        enum: ['Seeking Support', 'Sharing Experience', 'Tips & Advice', 'Resources', 'Vent/Rant'],
        default: 'Seeking Support'
    },
    mood: {
        type: String,
        enum: ['happy', 'neutral', 'sad', 'anxious', 'angry'],
        default: 'neutral'
    },
    urgency: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'low'
    },
    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    isAnonymous: {
        type: Boolean,
        default: true
    },
    status: {
        type: String,
        enum: ['active', 'flagged', 'removed'],
        default: 'active'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    comments: [{
        authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        content: String,
        createdAt: { type: Date, default: Date.now }
    }]
});

module.exports = mongoose.model('ForumPost', forumPostSchema);
