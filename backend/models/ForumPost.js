const mongoose = require('mongoose');

const forumPostSchema = new mongoose.Schema({
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    tags: [String],
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
