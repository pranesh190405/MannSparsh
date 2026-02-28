const express = require('express');
const router = express.Router();
const ForumPost = require('../models/ForumPost');
const auth = require('../middleware/authMiddleware');

// Get All Posts
router.get('/posts', async (req, res) => {
    try {
        const posts = await ForumPost.find({ status: 'active' })
            .sort({ createdAt: -1 })
            .populate('authorId', 'name') // Be careful with anonymity
            .populate('comments.authorId', 'name');

        // If anonymous, mask the name in response
        const sanitizedPosts = posts.map(post => {
            const p = post.toObject();
            p.userId = (p.authorId._id || p.authorId).toString();
            if (p.isAnonymous) p.authorId = { name: 'Anonymous Peer' };

            p.comments = p.comments.map(c => {
                c.userId = (c.authorId._id || c.authorId).toString();
                if (p.isAnonymous) c.authorId = { name: 'Anonymous Peer' };
                return c;
            });
            return p;
        });

        res.json(sanitizedPosts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Create Post
router.post('/posts', auth, async (req, res) => {
    try {
        const { title, content, tags, isAnonymous, category, mood, urgency } = req.body;
        const post = new ForumPost({
            authorId: req.user.user.id,
            title,
            content,
            tags,
            isAnonymous,
            category,
            mood,
            urgency
        });
        await post.save();
        res.json(post);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Update Post
router.put('/posts/:id', auth, async (req, res) => {
    try {
        const { title, content, tags, category, mood, urgency } = req.body;
        let post = await ForumPost.findById(req.params.id);

        if (!post) return res.status(404).json({ message: 'Post not found' });

        // Ensure user owns the post
        if (post.authorId.toString() !== req.user.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        if (title) post.title = title;
        if (content) post.content = content;
        if (tags) post.tags = tags;
        if (category) post.category = category;
        if (mood) post.mood = mood;
        if (urgency) post.urgency = urgency;

        await post.save();
        res.json(post);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Delete Post
router.delete('/posts/:id', auth, async (req, res) => {
    try {
        const post = await ForumPost.findById(req.params.id);

        if (!post) return res.status(404).json({ message: 'Post not found' });

        // Ensure user owns the post
        if (post.authorId.toString() !== req.user.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        post.status = 'removed';
        await post.save();

        res.json({ message: 'Post removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Add Comment
router.post('/posts/:id/comment', auth, async (req, res) => {
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

// Upvote Post
router.post('/posts/:id/upvote', auth, async (req, res) => {
    try {
        const post = await ForumPost.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        const userId = req.user.user.id;
        if (!post.upvotes) post.upvotes = [];

        const upvoteIndex = post.upvotes.indexOf(userId);

        if (upvoteIndex > -1) {
            // Remove upvote
            post.upvotes.splice(upvoteIndex, 1);
        } else {
            // Add upvote
            post.upvotes.push(userId);
        }

        await post.save();
        res.json(post);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
