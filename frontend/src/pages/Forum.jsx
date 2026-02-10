import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Paper, Avatar, Chip, Fab, Dialog, DialogTitle,
    DialogContent, TextField, DialogActions, Button, Divider,
    Collapse, Container, Card, CardContent, Grid, IconButton,
    ToggleButton, ToggleButtonGroup, Fade
} from '@mui/material';
import {
    Add, Comment, Person, LocalOffer, ThumbUp, Share,
    Forum as ForumIcon, Search, FilterList
} from '@mui/icons-material';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const tagColors = {
    stress: '#6366f1', anxiety: '#ec4899', academic: '#f59e0b',
    relationships: '#10b981', loneliness: '#8b5cf6', sleep: '#3b82f6',
    default: '#64748b'
};

const Forum = () => {
    const [posts, setPosts] = useState([]);
    const [open, setOpen] = useState(false);
    const [expandedPost, setExpandedPost] = useState(null);
    const [commentInput, setCommentInput] = useState('');
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => { fetchPosts(); }, []);

    const fetchPosts = async () => {
        try {
            const res = await axios.get('/api/forum');
            setPosts(res.data);
        } catch (err) { console.error(err); }
    };

    const handleCreatePost = async (values) => {
        try {
            await axios.post('/api/forum', {
                content: values.content,
                tags: values.tags.split(',').map(t => t.trim()).filter(Boolean),
                isAnonymous: true
            });
            setOpen(false);
            formik.resetForm();
            fetchPosts();
        } catch (err) { console.error(err); }
    };

    const formik = useFormik({
        initialValues: { content: '', tags: '' },
        validationSchema: Yup.object({ content: Yup.string().required('Share your thoughts...') }),
        onSubmit: handleCreatePost
    });

    const handleComment = async (postId) => {
        if (!commentInput.trim()) return;
        try {
            await axios.post(`/api/forum/${postId}/comment`, { content: commentInput });
            setCommentInput('');
            fetchPosts();
        } catch (err) { console.error(err); }
    };

    const handleUpvote = async (postId) => {
        try {
            await axios.post(`/api/forum/${postId}/upvote`);
            fetchPosts();
        } catch (err) { console.error(err); }
    };

    const filteredPosts = posts.filter(post => {
        if (filter !== 'all' && !post.tags?.includes(filter)) return false;
        if (searchTerm && !post.content?.toLowerCase().includes(searchTerm.toLowerCase())) return false;
        return true;
    });

    const popularTags = ['all', 'stress', 'anxiety', 'academic', 'relationships', 'loneliness', 'sleep'];

    return (
        <Container maxWidth="md" sx={{ mt: 2, mb: 4 }}>
            {/* Header */}
            <Box sx={{
                background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
                borderRadius: 4, p: 4, mb: 4, color: 'white',
                position: 'relative', overflow: 'hidden'
            }}>
                <Box sx={{
                    position: 'absolute', top: -40, right: -40,
                    width: 160, height: 160, borderRadius: '50%',
                    background: 'rgba(255,255,255,0.1)'
                }} />
                <ForumIcon sx={{ fontSize: 48, mb: 1, opacity: 0.9 }} />
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Peer Support Forum
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    A safe, anonymous space to share your thoughts and support each other 💛
                </Typography>
            </Box>

            {/* Search & Filters */}
            <Card sx={{ mb: 3, p: 2 }}>
                <TextField
                    fullWidth size="small" placeholder="Search posts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                    sx={{ mb: 2 }}
                />
                <Box display="flex" gap={1} flexWrap="wrap">
                    {popularTags.map(tag => (
                        <Chip
                            key={tag}
                            label={tag === 'all' ? '🏷️ All' : `#${tag}`}
                            onClick={() => setFilter(tag)}
                            variant={filter === tag ? 'filled' : 'outlined'}
                            sx={{
                                bgcolor: filter === tag ? (tagColors[tag] || tagColors.default) + '20' : 'transparent',
                                borderColor: tagColors[tag] || tagColors.default,
                                color: tagColors[tag] || tagColors.default,
                                fontWeight: filter === tag ? 700 : 400,
                                cursor: 'pointer'
                            }}
                        />
                    ))}
                </Box>
            </Card>

            {/* Posts */}
            {filteredPosts.length === 0 && (
                <Box textAlign="center" py={6}>
                    <ForumIcon sx={{ fontSize: 60, color: '#e2e8f0', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                        {searchTerm || filter !== 'all' ? 'No matching posts found' : 'Be the first to share!'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Click the + button to create a post
                    </Typography>
                </Box>
            )}

            {filteredPosts.map((post) => (
                <Fade in={true} key={post._id}>
                    <Card sx={{
                        mb: 2, borderRadius: 3, overflow: 'hidden',
                        transition: 'all 0.2s',
                        '&:hover': { boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }
                    }}>
                        <CardContent sx={{ p: 3 }}>
                            {/* Author */}
                            <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                                <Avatar sx={{
                                    width: 40, height: 40,
                                    background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)'
                                }}>
                                    <Person />
                                </Avatar>
                                <Box>
                                    <Typography variant="subtitle2" fontWeight="bold">
                                        {post.isAnonymous ? 'Anonymous Peer' : post.authorId?.name}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {new Date(post.createdAt).toLocaleDateString('en-US', {
                                            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                        })}
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Content */}
                            <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.7 }}>
                                {post.content}
                            </Typography>

                            {/* Tags */}
                            {post.tags?.length > 0 && (
                                <Box display="flex" gap={0.5} mb={2} flexWrap="wrap">
                                    {post.tags.map((tag, idx) => (
                                        <Chip
                                            key={idx} label={`#${tag}`} size="small"
                                            sx={{
                                                bgcolor: (tagColors[tag] || tagColors.default) + '15',
                                                color: tagColors[tag] || tagColors.default,
                                                fontWeight: 600, fontSize: '0.75rem'
                                            }}
                                        />
                                    ))}
                                </Box>
                            )}

                            {/* Actions */}
                            <Box display="flex" gap={1}>
                                <Button
                                    size="small" startIcon={<ThumbUp sx={{ fontSize: 16 }} />}
                                    onClick={() => handleUpvote(post._id)}
                                    sx={{ textTransform: 'none', color: 'text.secondary' }}
                                >
                                    {post.upvotes?.length || 0} Support
                                </Button>
                                <Button
                                    size="small" startIcon={<Comment sx={{ fontSize: 16 }} />}
                                    onClick={() => setExpandedPost(expandedPost === post._id ? null : post._id)}
                                    sx={{ textTransform: 'none', color: 'text.secondary' }}
                                >
                                    {post.comments?.length || 0} Comments
                                </Button>
                            </Box>
                        </CardContent>

                        {/* Comments Section */}
                        <Collapse in={expandedPost === post._id}>
                            <Box sx={{ px: 3, pb: 3, pt: 0 }}>
                                <Divider sx={{ mb: 2 }} />
                                {post.comments?.map((comment, idx) => (
                                    <Box key={idx} display="flex" gap={1.5} mb={1.5}>
                                        <Avatar sx={{ width: 28, height: 28, bgcolor: '#e2e8f0' }}>
                                            <Person sx={{ fontSize: 16, color: '#64748b' }} />
                                        </Avatar>
                                        <Box sx={{
                                            bgcolor: '#f1f5f9', borderRadius: 2, p: 1.5, flex: 1
                                        }}>
                                            <Typography variant="body2">{comment.content}</Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </Typography>
                                        </Box>
                                    </Box>
                                ))}
                                <Box display="flex" gap={1} mt={2}>
                                    <TextField
                                        fullWidth size="small" placeholder="Write a supportive comment..."
                                        value={commentInput}
                                        onChange={(e) => setCommentInput(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleComment(post._id)}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                    />
                                    <Button
                                        variant="contained" onClick={() => handleComment(post._id)}
                                        sx={{
                                            borderRadius: 2, textTransform: 'none',
                                            background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)'
                                        }}
                                    >
                                        Reply
                                    </Button>
                                </Box>
                            </Box>
                        </Collapse>
                    </Card>
                </Fade>
            ))}

            {/* FAB */}
            <Fab
                sx={{
                    position: 'fixed', bottom: 32, right: 32,
                    background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
                    color: 'white',
                    '&:hover': { background: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)' }
                }}
                onClick={() => setOpen(true)}
            >
                <Add />
            </Fab>

            {/* Create Post Dialog */}
            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm"
                PaperProps={{ sx: { borderRadius: 3 } }}>
                <DialogTitle sx={{ fontWeight: 'bold' }}>
                    Share with the Community
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary" mb={2}>
                        Your post will be shared anonymously. Be kind and supportive. 💛
                    </Typography>
                    <TextField
                        fullWidth multiline rows={4}
                        placeholder="What's on your mind? Share your thoughts, ask for advice, or just vent..."
                        name="content"
                        value={formik.values.content}
                        onChange={formik.handleChange}
                        error={formik.touched.content && Boolean(formik.errors.content)}
                        helperText={formik.touched.content && formik.errors.content}
                        margin="normal"
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                    <TextField
                        fullWidth
                        label="Tags (comma separated: stress, anxiety, academic...)"
                        name="tags"
                        value={formik.values.tags}
                        onChange={formik.handleChange}
                        margin="normal"
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                </DialogContent>
                <DialogActions sx={{ p: 3, pt: 0 }}>
                    <Button onClick={() => setOpen(false)} sx={{ borderRadius: 2 }}>Cancel</Button>
                    <Button
                        onClick={formik.handleSubmit} variant="contained"
                        sx={{
                            borderRadius: 2, px: 4,
                            background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)'
                        }}
                    >
                        Post Anonymously
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Forum;
