import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Chip,
    Fab,
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    Button,
    Divider,
    IconButton,
    Collapse
} from '@mui/material';
import { Add, Comment, Person, LocalOffer } from '@mui/icons-material';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const Forum = () => {
    const [posts, setPosts] = useState([]);
    const [open, setOpen] = useState(false);
    const [expandedPost, setExpandedPost] = useState(null);
    const [commentInput, setCommentInput] = useState('');

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const res = await axios.get('/api/forum');
            setPosts(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCreatePost = async (values) => {
        try {
            await axios.post('/api/forum', {
                content: values.content,
                tags: values.tags.split(',').map(t => t.trim()),
                isAnonymous: values.isAnonymous
            });
            setOpen(false);
            fetchPosts();
        } catch (err) {
            console.error(err);
        }
    };

    const formik = useFormik({
        initialValues: {
            content: '',
            tags: '',
            isAnonymous: true
        },
        validationSchema: Yup.object({
            content: Yup.string().required('Required'),
        }),
        onSubmit: handleCreatePost
    });

    const handleComment = async (postId) => {
        if (!commentInput.trim()) return;
        try {
            await axios.post(`/api/forum/${postId}/comment`, { content: commentInput });
            setCommentInput('');
            fetchPosts();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>Peer Support Forum</Typography>
            <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                A safe space to share and support each other anonymously.
            </Typography>

            <List sx={{ mt: 3 }}>
                {posts.map((post) => (
                    <Paper key={post._id} sx={{ mb: 2, borderRadius: 2, overflow: 'hidden' }}>
                        <ListItem alignItems="flex-start">
                            <ListItemAvatar>
                                <Avatar sx={{ bgcolor: 'secondary.main' }}>
                                    <Person />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography variant="subtitle2" fontWeight="bold">
                                            {post.isAnonymous ? 'Anonymous Peer' : post.authorId?.name}
                                        </Typography>
                                        <Typography variant="caption" color="textSecondary">
                                            {new Date(post.createdAt).toLocaleDateString()}
                                        </Typography>
                                    </Box>
                                }
                                secondary={
                                    <Box>
                                        <Typography variant="body1" color="textPrimary" sx={{ my: 1 }}>
                                            {post.content}
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                                            {post.tags.map((tag, idx) => (
                                                <Chip key={idx} label={tag} size="small" icon={<LocalOffer />} />
                                            ))}
                                        </Box>
                                    </Box>
                                }
                            />
                        </ListItem>
                        <Divider />
                        <Box sx={{ p: 1, display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                                startIcon={<Comment />}
                                onClick={() => setExpandedPost(expandedPost === post._id ? null : post._id)}
                            >
                                {post.comments.length} Comments
                            </Button>
                        </Box>
                        <Collapse in={expandedPost === post._id}>
                            <Box sx={{ p: 2, bgcolor: '#f9f9f9' }}>
                                <List dense>
                                    {post.comments.map((comment, idx) => (
                                        <ListItem key={idx}>
                                            <ListItemText
                                                primary={comment.content}
                                                secondary={new Date(comment.createdAt).toLocaleTimeString()}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        placeholder="Write a supportive comment..."
                                        value={commentInput}
                                        onChange={(e) => setCommentInput(e.target.value)}
                                    />
                                    <Button variant="contained" onClick={() => handleComment(post._id)}>Reply</Button>
                                </Box>
                            </Box>
                        </Collapse>
                    </Paper>
                ))}
            </List>

            <Fab
                color="primary"
                sx={{ position: 'fixed', bottom: 32, right: 32 }}
                onClick={() => setOpen(true)}
            >
                <Add />
            </Fab>

            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>Create New Post</DialogTitle>
                <DialogContent>
                    <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label="Share your thoughts..."
                            name="content"
                            value={formik.values.content}
                            onChange={formik.handleChange}
                            error={formik.touched.content && Boolean(formik.errors.content)}
                            helperText={formik.touched.content && formik.errors.content}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Tags (comma separated, e.g. stress, academic)"
                            name="tags"
                            value={formik.values.tags}
                            onChange={formik.handleChange}
                            margin="normal"
                        />
                        {/* Anonymity toggle could go here, defaulting to true for now */}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={formik.handleSubmit} variant="contained">Post</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Forum;
