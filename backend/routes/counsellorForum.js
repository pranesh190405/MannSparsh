const express = require('express');
const router = express.Router();
const CounsellorForum = require('../models/CounsellorForum');
const auth = require('../middleware/authMiddleware');

// Middleware to check if user is counsellor
const isCounsellor = (req, res, next) => {
    if (req.user.user.role !== 'counsellor') {
        return res.status(403).json({ message: 'Access denied. Counsellors only.' });
    }
    next();
};

// Get all counsellor forum posts
router.get('/', auth, isCounsellor, async (req, res) => {
    try {
        const posts = await CounsellorForum.find({ status: 'active' })
            .sort({ isPinned: -1, createdAt: -1 })
            .populate('authorId', 'name specialization')
            .populate('comments.authorId', 'name specialization');

        res.json(posts);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create new post
router.post('/', auth, isCounsellor, async (req, res) => {
    try {
        const { title, content, category, tags } = req.body;

        const post = new CounsellorForum({
            authorId: req.user.user.id,
            title,
            content,
            category: category || 'discussion',
            tags: tags || []
        });

        await post.save();
        await post.populate('authorId', 'name specialization');
        res.json(post);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// Add comment to post
router.post('/:id/comment', auth, isCounsellor, async (req, res) => {
    try {
        const post = await CounsellorForum.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        const comment = {
            authorId: req.user.user.id,
            content: req.body.content
        };

        post.comments.push(comment);
        await post.save();
        await post.populate('comments.authorId', 'name specialization');
        res.json(post);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// Upvote post
router.post('/:id/upvote', auth, isCounsellor, async (req, res) => {
    try {
        const post = await CounsellorForum.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        const userId = req.user.user.id;
        const upvoteIndex = post.upvotes.indexOf(userId);

        if (upvoteIndex > -1) {
            // Remove upvote
            post.upvotes.splice(upvoteIndex, 1);
        } else {
            // Add upvote
            post.upvotes.push(userId);
        }

        await post.save();
        res.json({ upvotes: post.upvotes.length, hasUpvoted: upvoteIndex === -1 });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete post (author only)
router.delete('/:id', auth, isCounsellor, async (req, res) => {
    try {
        const post = await CounsellorForum.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        if (post.authorId.toString() !== req.user.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this post' });
        }

        post.status = 'deleted';
        await post.save();
        res.json({ message: 'Post deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
