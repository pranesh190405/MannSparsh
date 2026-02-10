const express = require('express');
const router = express.Router();
const ForumPost = require('../models/ForumPost');
const auth = require('../middleware/authMiddleware');

// Get All Posts
router.get('/', async (req, res) => {
    try {
        const posts = await ForumPost.find({ status: 'active' })
            .sort({ createdAt: -1 })
            .populate('authorId', 'name') // Be careful with anonymity
            .populate('comments.authorId', 'name');

        // If anonymous, mask the name in response
        const sanitizedPosts = posts.map(post => {
            const p = post.toObject();
            if (p.isAnonymous) p.authorId = { name: 'Anonymous Peer' };
            return p;
        });

        res.json(sanitizedPosts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Create Post
router.post('/', auth, async (req, res) => {
    try {
        const { content, tags, isAnonymous } = req.body;
        const post = new ForumPost({
            authorId: req.user.user.id,
            content,
            tags,
            isAnonymous
        });
        await post.save();
        res.json(post);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Add Comment
router.post('/:id/comment', auth, async (req, res) => {
    try {
        const post = await ForumPost.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        const comment = {
            authorId: req.user.user.id,
            content: req.body.content
        };

        post.comments.push(comment);
        await post.save();
        res.json(post);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
