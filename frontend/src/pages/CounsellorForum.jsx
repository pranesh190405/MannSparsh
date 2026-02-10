import { useState, useEffect } from 'react';
import {
    Container, Box, Typography, Card, CardContent, Button,
    TextField, MenuItem, Chip, Grid, Avatar, IconButton,
    Dialog, DialogTitle, DialogContent, DialogActions, Divider
} from '@mui/material';
import { Add, ThumbUp, Comment, Delete } from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const categories = [
    { value: 'case-study', label: 'Case Study' },
    { value: 'best-practice', label: 'Best Practice' },
    { value: 'question', label: 'Question' },
    { value: 'resource', label: 'Resource' },
    { value: 'discussion', label: 'Discussion' }
];

const CounsellorForum = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [newPost, setNewPost] = useState({ title: '', content: '', category: 'discussion', tags: '' });
    const [commentDialogs, setCommentDialogs] = useState({});
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const res = await axios.get('/api/counsellor-forum');
            setPosts(res.data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    const handleCreatePost = async () => {
        try {
            const postData = {
                ...newPost,
                tags: newPost.tags.split(',').map(t => t.trim()).filter(t => t)
            };
            await axios.post('/api/counsellor-forum', postData);
            setNewPost({ title: '', content: '', category: 'discussion', tags: '' });
            setOpenDialog(false);
            fetchPosts();
        } catch (error) {
            console.error('Error creating post:', error);
        }
    };

    const handleUpvote = async (postId) => {
        try {
            await axios.post(`/api/counsellor-forum/${postId}/upvote`);
            fetchPosts();
        } catch (error) {
            console.error('Error upvoting:', error);
        }
    };

    const handleAddComment = async (postId) => {
        try {
            await axios.post(`/api/counsellor-forum/${postId}/comment`, { content: newComment });
            setNewComment('');
            setCommentDialogs({ ...commentDialogs, [postId]: false });
            fetchPosts();
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const getCategoryColor = (category) => {
        const colors = {
            'case-study': '#3b82f6',
            'best-practice': '#10b981',
            'question': '#f59e0b',
            'resource': '#8b5cf6',
            'discussion': '#6366f1'
        };
        return colors[category] || '#6366f1';
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Box>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        Counsellor Forum
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Professional discussions and knowledge sharing
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => setOpenDialog(true)}
                >
                    New Post
                </Button>
            </Box>

            {posts.length === 0 ? (
                <Card>
                    <CardContent>
                        <Typography variant="body1" color="text.secondary" textAlign="center" py={4}>
                            No posts yet. Be the first to start a discussion!
                        </Typography>
                    </CardContent>
                </Card>
            ) : (
                <Grid container spacing={3}>
                    {posts.map((post) => (
                        <Grid item xs={12} key={post._id}>
                            <Card>
                                <CardContent>
                                    <Box display="flex" alignItems="flex-start" mb={2}>
                                        <Avatar sx={{ mr: 2, bgcolor: getCategoryColor(post.category) }}>
                                            {post.authorId?.name?.[0] || 'C'}
                                        </Avatar>
                                        <Box flexGrow={1}>
                                            <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                                                <Typography variant="h6" fontWeight="600">
                                                    {post.title}
                                                </Typography>
                                                <Chip
                                                    label={post.category}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: getCategoryColor(post.category) + '20',
                                                        color: getCategoryColor(post.category),
                                                        fontWeight: 600
                                                    }}
                                                />
                                                {post.isPinned && (
                                                    <Chip label="Pinned" size="small" color="primary" />
                                                )}
                                            </Box>
                                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                                by {post.authorId?.name} • {post.authorId?.specialization}
                                            </Typography>
                                            <Typography variant="body1" sx={{ mt: 2, mb: 2 }}>
                                                {post.content}
                                            </Typography>
                                            {post.tags && post.tags.length > 0 && (
                                                <Box display="flex" gap={0.5} mb={2}>
                                                    {post.tags.map((tag, idx) => (
                                                        <Chip key={idx} label={tag} size="small" variant="outlined" />
                                                    ))}
                                                </Box>
                                            )}
                                            <Divider sx={{ my: 2 }} />
                                            <Box display="flex" gap={2} alignItems="center">
                                                <Button
                                                    size="small"
                                                    startIcon={<ThumbUp />}
                                                    onClick={() => handleUpvote(post._id)}
                                                >
                                                    {post.upvotes?.length || 0} Helpful
                                                </Button>
                                                <Button
                                                    size="small"
                                                    startIcon={<Comment />}
                                                    onClick={() => setCommentDialogs({ ...commentDialogs, [post._id]: true })}
                                                >
                                                    {post.comments?.length || 0} Comments
                                                </Button>
                                            </Box>

                                            {/* Comments */}
                                            {post.comments && post.comments.length > 0 && (
                                                <Box mt={3}>
                                                    {post.comments.map((comment, idx) => (
                                                        <Box key={idx} display="flex" gap={2} mb={2}>
                                                            <Avatar sx={{ width: 32, height: 32 }}>
                                                                {comment.authorId?.name?.[0]}
                                                            </Avatar>
                                                            <Box flexGrow={1}>
                                                                <Typography variant="body2" fontWeight="600">
                                                                    {comment.authorId?.name}
                                                                </Typography>
                                                                <Typography variant="body2" color="text.secondary">
                                                                    {comment.content}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    ))}
                                                </Box>
                                            )}
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>

                            {/* Comment Dialog */}
                            <Dialog
                                open={commentDialogs[post._id] || false}
                                onClose={() => setCommentDialogs({ ...commentDialogs, [post._id]: false })}
                                maxWidth="sm"
                                fullWidth
                            >
                                <DialogTitle>Add Comment</DialogTitle>
                                <DialogContent>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={3}
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder="Share your thoughts..."
                                        sx={{ mt: 1 }}
                                    />
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={() => setCommentDialogs({ ...commentDialogs, [post._id]: false })}>
                                        Cancel
                                    </Button>
                                    <Button onClick={() => handleAddComment(post._id)} variant="contained">
                                        Post Comment
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Create Post Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>Create New Post</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Title"
                        value={newPost.title}
                        onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                        sx={{ mt: 2, mb: 2 }}
                    />
                    <TextField
                        select
                        fullWidth
                        label="Category"
                        value={newPost.category}
                        onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                        sx={{ mb: 2 }}
                    >
                        {categories.map((cat) => (
                            <MenuItem key={cat.value} value={cat.value}>
                                {cat.label}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        fullWidth
                        multiline
                        rows={6}
                        label="Content"
                        value={newPost.content}
                        onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Tags (comma-separated)"
                        value={newPost.tags}
                        onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                        placeholder="e.g., anxiety, cbt, mindfulness"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={handleCreatePost} variant="contained">
                        Create Post
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default CounsellorForum;
