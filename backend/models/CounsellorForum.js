const mongoose = require('mongoose');

const counsellorForumSchema = new mongoose.Schema({
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        maxlength: 200
    },
    content: {
        type: String,
        required: true,
        maxlength: 5000
    },
    category: {
        type: String,
        enum: ['case-study', 'best-practice', 'question', 'resource', 'discussion'],
        default: 'discussion'
    },
    tags: [String],
    comments: [{
        authorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        content: {
            type: String,
            maxlength: 2000
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    upvotes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    isPinned: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['active', 'archived', 'deleted'],
        default: 'active'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('CounsellorForum', counsellorForumSchema);
