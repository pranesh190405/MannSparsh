import React, { useState, useEffect } from 'react';
import {
    Box, Typography, TextField, Button, Card, CardContent, Chip,
    Avatar, Container, Fab, Dialog, DialogTitle,
    DialogContent, DialogActions, IconButton, Grid, InputAdornment,
    FormControl, InputLabel, Select, MenuItem, Switch, FormControlLabel
} from '@mui/material';
import {
    Add, ThumbUp, Comment, Search, Send, Forum as ForumIcon,
    Person, AutoAwesome, Edit, Delete
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const tagColors = {
    anxiety: '#8b5cf6', depression: '#ec4899', stress: '#f59e0b',
    loneliness: '#06b6d4', academic: '#10b981', relationships: '#f43f5e',
    'self-care': '#a78bfa', general: '#6366f1',
};

const categories = ['Seeking Support', 'Sharing Experience', 'Tips & Advice', 'Resources', 'Vent/Rant'];

const moods = [
    { value: 'happy', emoji: '😊', label: 'Happy' },
    { value: 'neutral', emoji: '😐', label: 'Neutral' },
    { value: 'sad', emoji: '😢', label: 'Sad' },
    { value: 'anxious', emoji: '😰', label: 'Anxious' },
    { value: 'angry', emoji: '😤', label: 'Angry' },
];

const urgencyLevels = [
    { value: 'low', label: 'Low', color: '#10b981' },
    { value: 'medium', label: 'Medium', color: '#f59e0b' },
    { value: 'high', label: 'High', color: '#ef4444' },
];

const anonNames = ['Kind Panda', 'Brave Fox', 'Gentle Bear', 'Calm Owl', 'Wise Tiger', 'Happy Seal', 'Quiet Deer', 'Strong Eagle'];
const getAnon = (id) => anonNames[id?.charCodeAt(0) % anonNames.length] || 'Anonymous';
const getColor = (id) => {
    const c = ['#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#06b6d4', '#6366f1', '#f43f5e', '#a78bfa'];
    return c[id?.charCodeAt(0) % c.length] || c[0];
};

const Forum = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [search, setSearch] = useState('');
    const [selTag, setSelTag] = useState('all');
    const [dlgOpen, setDlgOpen] = useState(false);
    const [commentTexts, setCommentTexts] = useState({});

    // Create form state
    const [newTitle, setNewTitle] = useState('');
    const [newContent, setNewContent] = useState('');
    const [newCategory, setNewCategory] = useState('Seeking Support');
    const [newMood, setNewMood] = useState('neutral');
    const [newUrgency, setNewUrgency] = useState('low');
    const [newTags, setNewTags] = useState([]);
    const [newAnonymous, setNewAnonymous] = useState(true);

    // Edit form state
    const [editDlgOpen, setEditDlgOpen] = useState(false);
    const [editPostId, setEditPostId] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editContent, setEditContent] = useState('');
    const [editCategory, setEditCategory] = useState('Seeking Support');
    const [editMood, setEditMood] = useState('neutral');
    const [editUrgency, setEditUrgency] = useState('low');
    const [editTags, setEditTags] = useState([]);
    const [editAnonymous, setEditAnonymous] = useState(true);

    useEffect(() => { fetchPosts(); }, []);

    const fetchPosts = async () => {
        try { const r = await axios.get('/api/forum/posts'); setPosts(r.data); } catch { }
    };

    const handleCreate = async () => {
        if (!newTitle.trim() || !newContent.trim()) return;
        try {
            await axios.post('/api/forum/posts', {
                title: newTitle, content: newContent, tags: newTags,
                category: newCategory, mood: newMood, urgency: newUrgency,
                isAnonymous: newAnonymous
            });
            setDlgOpen(false);
            setNewTitle(''); setNewContent(''); setNewTags([]);
            setNewCategory('Seeking Support'); setNewMood('neutral'); setNewUrgency('low'); setNewAnonymous(true);
            fetchPosts();
        } catch { }
    };

    const handleUpvote = async (id) => {
        try { await axios.post(`/api/forum/posts/${id}/upvote`); fetchPosts(); } catch { }
    };
    const handleComment = async (id) => {
        if (!commentTexts[id]?.trim()) return;
        try {
            await axios.post(`/api/forum/posts/${id}/comment`, { content: commentTexts[id] });
            setCommentTexts(p => ({ ...p, [id]: '' })); fetchPosts();
        } catch { }
    };

    const handleEditOpen = (post) => {
        setEditPostId(post._id);
        setEditTitle(post.title || '');
        setEditContent(post.content || '');
        setEditCategory(post.category || 'Seeking Support');
        setEditMood(post.mood || 'neutral');
        setEditUrgency(post.urgency || 'low');
        setEditTags(post.tags || []);
        setEditAnonymous(post.isAnonymous !== undefined ? post.isAnonymous : true);
        setEditDlgOpen(true);
    };

    const handleUpdate = async () => {
        if (!editTitle.trim() || !editContent.trim()) return;
        try {
            await axios.put(`/api/forum/posts/${editPostId}`, {
                title: editTitle, content: editContent, tags: editTags,
                category: editCategory, mood: editMood, urgency: editUrgency,
                isAnonymous: editAnonymous
            });
            setEditDlgOpen(false);
            fetchPosts();
        } catch { }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this post?")) return;
        try {
            await axios.delete(`/api/forum/posts/${id}`);
            fetchPosts();
        } catch { }
    };

    const tags = ['all', ...Object.keys(tagColors)];
    const filtered = posts.filter(p =>
        (selTag === 'all' || p.tags?.includes(selTag)) &&
        (!search || p.title?.toLowerCase().includes(search.toLowerCase()) || p.content?.toLowerCase().includes(search.toLowerCase()))
    );

    // Reusable form fields component for both Create & Edit dialogs
    const renderFormFields = (mode) => {
        const isCreate = mode === 'create';
        const title = isCreate ? newTitle : editTitle;
        const setTitle = isCreate ? setNewTitle : setEditTitle;
        const content = isCreate ? newContent : editContent;
        const setContent = isCreate ? setNewContent : setEditContent;
        const category = isCreate ? newCategory : editCategory;
        const setCategory = isCreate ? setNewCategory : setEditCategory;
        const mood = isCreate ? newMood : editMood;
        const setMood = isCreate ? setNewMood : setEditMood;
        const urgency = isCreate ? newUrgency : editUrgency;
        const setUrgency = isCreate ? setNewUrgency : setEditUrgency;
        const formTags = isCreate ? newTags : editTags;
        const setFormTags = isCreate ? setNewTags : setEditTags;
        const anonymous = isCreate ? newAnonymous : editAnonymous;
        const setAnonymous = isCreate ? setNewAnonymous : setEditAnonymous;

        return (
            <>
                {/* 1. Title */}
                <TextField
                    fullWidth label="Title" value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    sx={{ mb: 2, mt: isCreate ? 0 : 1 }}
                />

                {/* 2. Content */}
                <TextField
                    fullWidth multiline rows={3} label="What's on your mind?"
                    value={content} onChange={(e) => setContent(e.target.value)}
                    sx={{ mb: 2 }}
                />

                {/* 3. Category */}
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Category</InputLabel>
                    <Select
                        value={category} label="Category"
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        {categories.map(c => (
                            <MenuItem key={c} value={c}>{c}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* 4. Mood */}
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)', mb: 1 }}>
                    How are you feeling?
                </Typography>
                <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
                    {moods.map(m => (
                        <Chip
                            key={m.value}
                            label={`${m.emoji} ${m.label}`}
                            size="small"
                            onClick={() => setMood(m.value)}
                            sx={{
                                cursor: 'pointer', fontSize: '0.82rem', fontWeight: mood === m.value ? 700 : 500,
                                bgcolor: mood === m.value ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.04)',
                                color: mood === m.value ? '#a78bfa' : 'rgba(255,255,255,0.5)',
                                border: '1px solid',
                                borderColor: mood === m.value ? 'rgba(139,92,246,0.4)' : 'rgba(255,255,255,0.06)',
                                transition: 'all 0.3s', '&:hover': { transform: 'scale(1.08)' },
                            }}
                        />
                    ))}
                </Box>

                {/* 5. Urgency */}
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)', mb: 1 }}>
                    Urgency Level
                </Typography>
                <Box display="flex" gap={1} mb={2}>
                    {urgencyLevels.map(u => (
                        <Chip
                            key={u.value}
                            label={u.label}
                            size="small"
                            onClick={() => setUrgency(u.value)}
                            sx={{
                                cursor: 'pointer', fontWeight: urgency === u.value ? 700 : 500,
                                bgcolor: urgency === u.value ? u.color + '25' : 'rgba(255,255,255,0.04)',
                                color: urgency === u.value ? u.color : 'rgba(255,255,255,0.5)',
                                border: '1px solid',
                                borderColor: urgency === u.value ? u.color + '40' : 'rgba(255,255,255,0.06)',
                                transition: 'all 0.3s', '&:hover': { transform: 'scale(1.08)' },
                            }}
                        />
                    ))}
                </Box>

                {/* 6. Tags */}
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)', mb: 1 }}>
                    Tags
                </Typography>
                <Box display="flex" gap={0.8} flexWrap="wrap" mb={2}>
                    {Object.keys(tagColors).map(t => (
                        <Chip key={t} label={t} size="small"
                            onClick={() => setFormTags(p => p.includes(t) ? p.filter(x => x !== t) : [...p, t])}
                            sx={{
                                cursor: 'pointer', textTransform: 'capitalize',
                                bgcolor: formTags.includes(t) ? tagColors[t] + '25' : 'rgba(255,255,255,0.04)',
                                color: formTags.includes(t) ? tagColors[t] : 'rgba(255,255,255,0.4)',
                                border: '1px solid',
                                borderColor: formTags.includes(t) ? tagColors[t] + '40' : 'rgba(255,255,255,0.06)',
                                transition: 'all 0.3s', '&:hover': { transform: 'scale(1.08)' },
                            }}
                        />
                    ))}
                </Box>

                {/* 7. Anonymous toggle */}
                <FormControlLabel
                    control={
                        <Switch
                            checked={anonymous}
                            onChange={(e) => setAnonymous(e.target.checked)}
                            sx={{
                                '& .MuiSwitch-switchBase.Mui-checked': { color: '#8b5cf6' },
                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#8b5cf6' },
                            }}
                        />
                    }
                    label={
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                            Post Anonymously
                        </Typography>
                    }
                />
            </>
        );
    };

    return (
        <Container maxWidth="md" sx={{ mt: 2, mb: 4, position: 'relative' }}>
            {/* Orb */}
            <Box sx={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.15), transparent 70%)', top: -40, left: -50, animation: 'orbFloat2 16s ease-in-out infinite', filter: 'blur(40px)', pointerEvents: 'none' }} />

            {/* Header */}
            <Box className="animate-fadeInUp" sx={{
                background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 5, p: { xs: 3, md: 4 }, mb: 3, position: 'relative', overflow: 'hidden'
            }}>
                <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.04), transparent)', backgroundSize: '200% 100%', animation: 'shimmer 3s linear infinite', pointerEvents: 'none' }} />
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                        <Box sx={{ width: 48, height: 48, borderRadius: 3, background: 'linear-gradient(135deg, #f59e0b, #d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(245,158,11,0.3)', animation: 'float 3s ease-in-out infinite' }}>
                            <ForumIcon sx={{ fontSize: 26, color: 'white' }} />
                        </Box>
                    </Box>
                    <Typography sx={{ fontSize: { xs: '1.4rem', md: '1.75rem' }, fontWeight: 800, background: 'linear-gradient(135deg, #fff, #fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Peer Support Forum
                    </Typography>
                    <Typography sx={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)' }}>Share anonymously. Support each other.</Typography>
                </Box>
            </Box>

            {/* Search & Tags */}
            <Box className="animate-fadeInUp delay-1" sx={{ mb: 3 }}>
                <TextField
                    fullWidth placeholder="Search posts..." size="small"
                    value={search} onChange={(e) => setSearch(e.target.value)}
                    InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ color: 'rgba(255,255,255,0.3)' }} /></InputAdornment> }}
                    sx={{ mb: 2 }}
                />
                <Box display="flex" gap={0.8} flexWrap="wrap">
                    {tags.map((t) => (
                        <Chip key={t} label={t} size="small"
                            onClick={() => setSelTag(t)}
                            sx={{
                                fontSize: '0.73rem', fontWeight: selTag === t ? 700 : 500,
                                bgcolor: selTag === t ? (tagColors[t] || '#8b5cf6') + '25' : 'rgba(255,255,255,0.04)',
                                color: selTag === t ? (tagColors[t] || '#8b5cf6') : 'rgba(255,255,255,0.5)',
                                border: '1px solid',
                                borderColor: selTag === t ? (tagColors[t] || '#8b5cf6') + '40' : 'rgba(255,255,255,0.06)',
                                textTransform: 'capitalize', cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                '&:hover': { transform: 'scale(1.05)', bgcolor: (tagColors[t] || '#8b5cf6') + '15' },
                            }}
                        />
                    ))}
                </Box>
            </Box>

            {/* Posts */}
            {filtered.length === 0 ? (
                <Box textAlign="center" py={8} sx={{ animation: 'fadeInUp 0.6s ease-out' }}>
                    <Box sx={{ width: 80, height: 80, borderRadius: '50%', mx: 'auto', mb: 2, background: 'rgba(245,158,11,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'float 4s ease-in-out infinite', border: '1px solid rgba(245,158,11,0.2)' }}>
                        <ForumIcon sx={{ fontSize: 36, color: '#f59e0b' }} />
                    </Box>
                    <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.6)' }}>No posts yet</Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.3)' }}>Be the first to share!</Typography>
                </Box>
            ) : (
                filtered.map((post, idx) => {
                    const moodObj = moods.find(m => m.value === post.mood);
                    const urgObj = urgencyLevels.find(u => u.value === post.urgency);
                    return (
                        <Card key={post._id} className="animate-fadeInUp" sx={{ mb: 2.5, animationDelay: `${idx * 0.08}s` }}>
                            <CardContent sx={{ p: 3 }}>
                                <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                                    <Avatar sx={{
                                        width: 36, height: 36, fontSize: '0.8rem', fontWeight: 700,
                                        background: `linear-gradient(135deg, ${getColor(post.userId)}, ${getColor(post.userId)}cc)`,
                                        boxShadow: `0 2px 8px ${getColor(post.userId)}30`,
                                    }}>
                                        {getAnon(post.userId)?.[0]}
                                    </Avatar>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="body2" fontWeight={600} sx={{ fontSize: '0.85rem' }}>{getAnon(post.userId)}</Typography>
                                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)' }}>
                                            {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        </Typography>
                                    </Box>
                                    {/* Category & Mood & Urgency badges */}
                                    {post.category && (
                                        <Chip label={post.category} size="small" sx={{
                                            height: 22, fontSize: '0.65rem', fontWeight: 600,
                                            bgcolor: 'rgba(99,102,241,0.15)', color: '#818cf8',
                                            border: '1px solid rgba(99,102,241,0.25)',
                                        }} />
                                    )}
                                    {moodObj && (
                                        <Chip label={`${moodObj.emoji} ${moodObj.label}`} size="small" sx={{
                                            height: 22, fontSize: '0.65rem', fontWeight: 600,
                                            bgcolor: 'rgba(139,92,246,0.12)', color: '#a78bfa',
                                            border: '1px solid rgba(139,92,246,0.2)',
                                        }} />
                                    )}
                                    {urgObj && post.urgency !== 'low' && (
                                        <Chip label={`🔔 ${urgObj.label}`} size="small" sx={{
                                            height: 22, fontSize: '0.65rem', fontWeight: 600,
                                            bgcolor: urgObj.color + '18', color: urgObj.color,
                                            border: '1px solid ' + urgObj.color + '30',
                                        }} />
                                    )}
                                    {post.tags?.map(t => (
                                        <Chip key={t} label={t} size="small" sx={{
                                            height: 22, fontSize: '0.65rem', fontWeight: 600,
                                            bgcolor: (tagColors[t] || '#6366f1') + '15',
                                            color: tagColors[t] || '#6366f1',
                                            border: '1px solid ' + (tagColors[t] || '#6366f1') + '25',
                                        }} />
                                    ))}
                                </Box>
                                <Typography variant="h6" fontWeight={700} gutterBottom sx={{ fontSize: '1.05rem' }}>{post.title}</Typography>
                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 2, lineHeight: 1.7 }}>{post.content}</Typography>

                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={post.comments?.length > 0 ? 2 : 0}>
                                    <Box display="flex" gap={2} alignItems="center">
                                        <Button size="small" startIcon={<ThumbUp sx={{ fontSize: 15 }} />}
                                            onClick={() => handleUpvote(post._id)}
                                            sx={{
                                                fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)',
                                                transition: 'all 0.3s ease',
                                                '&:hover': { color: '#8b5cf6', transform: 'scale(1.05)' },
                                            }}>
                                            {post.upvotes?.length || 0}
                                        </Button>
                                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <Comment sx={{ fontSize: 15 }} /> {post.comments?.length || 0}
                                        </Typography>
                                    </Box>

                                    {post.userId === (user?.id || user?._id) && (
                                        <Box display="flex" gap={1}>
                                            <IconButton size="small" onClick={() => handleEditOpen(post)} sx={{ color: 'rgba(255,255,255,0.5)', '&:hover': { color: '#3b82f6', transform: 'scale(1.1)' } }}>
                                                <Edit sx={{ fontSize: 18 }} />
                                            </IconButton>
                                            <IconButton size="small" onClick={() => handleDelete(post._id)} sx={{ color: 'rgba(255,255,255,0.5)', '&:hover': { color: '#ef4444', transform: 'scale(1.1)' } }}>
                                                <Delete sx={{ fontSize: 18 }} />
                                            </IconButton>
                                        </Box>
                                    )}
                                </Box>

                                {post.comments?.length > 0 && (
                                    <Box sx={{ pl: 2, borderLeft: '2px solid rgba(139,92,246,0.15)', mt: 1 }}>
                                        {post.comments.slice(-3).map((c, ci) => (
                                            <Box key={ci} sx={{ mb: 1.5, animation: 'fadeInLeft 0.3s ease-out', animationDelay: `${ci * 0.05}s` }}>
                                                <Box display="flex" alignItems="center" gap={1} mb={0.3}>
                                                    <Avatar sx={{ width: 22, height: 22, fontSize: '0.6rem', background: `linear-gradient(135deg, ${getColor(c.userId)}, ${getColor(c.userId)}cc)` }}>
                                                        {getAnon(c.userId)?.[0]}
                                                    </Avatar>
                                                    <Typography variant="caption" fontWeight={600}>{getAnon(c.userId)}</Typography>
                                                </Box>
                                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', ml: 4, fontSize: '0.82rem' }}>{c.content}</Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                )}

                                <Box display="flex" gap={1} mt={2} alignItems="center">
                                    <TextField size="small" fullWidth placeholder="Add support..."
                                        value={commentTexts[post._id] || ''}
                                        onChange={(e) => setCommentTexts(p => ({ ...p, [post._id]: e.target.value }))}
                                        onKeyDown={(e) => e.key === 'Enter' && handleComment(post._id)}
                                        variant="outlined"
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, height: 38 } }}
                                    />
                                    <IconButton onClick={() => handleComment(post._id)}
                                        disabled={!commentTexts[post._id]?.trim()}
                                        sx={{
                                            width: 38, height: 38,
                                            background: commentTexts[post._id]?.trim() ? 'linear-gradient(135deg, #8b5cf6, #6366f1)' : 'rgba(255,255,255,0.04)',
                                            color: 'white',
                                            transition: 'all 0.3s',
                                            '&:hover': { transform: 'scale(1.1) rotate(-12deg)' },
                                        }}>
                                        <Send sx={{ fontSize: 16 }} />
                                    </IconButton>
                                </Box>
                            </CardContent>
                        </Card>
                    );
                })
            )}

            {/* FAB */}
            <Fab color="primary" onClick={() => setDlgOpen(true)}
                sx={{ position: 'fixed', bottom: 24, right: 24 }}>
                <Add />
            </Fab>

            {/* Create Dialog */}
            <Dialog open={dlgOpen} onClose={() => setDlgOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 700 }}>
                    <Box display="flex" alignItems="center" gap={1}>
                        <AutoAwesome sx={{ color: '#f59e0b', animation: 'spin 3s linear infinite' }} />
                        Share Something
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)', mb: 2 }}>Your identity stays anonymous by default</Typography>
                    {renderFormFields('create')}
                </DialogContent>
                <DialogActions sx={{ p: 3, pt: 0 }}>
                    <Button onClick={() => setDlgOpen(false)} variant="outlined">Cancel</Button>
                    <Button variant="contained" onClick={handleCreate} disabled={!newTitle.trim() || !newContent.trim()}
                        sx={{ borderRadius: 3, fontWeight: 700 }}>
                        {newAnonymous ? 'Post Anonymously' : 'Post as Myself'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={editDlgOpen} onClose={() => setEditDlgOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 700 }}>
                    <Box display="flex" alignItems="center" gap={1}>
                        <Edit sx={{ color: '#3b82f6' }} />
                        Edit Post
                    </Box>
                </DialogTitle>
                <DialogContent>
                    {renderFormFields('edit')}
                </DialogContent>
                <DialogActions sx={{ p: 3, pt: 0 }}>
                    <Button onClick={() => setEditDlgOpen(false)} variant="outlined">Cancel</Button>
                    <Button variant="contained" onClick={handleUpdate} disabled={!editTitle.trim() || !editContent.trim()}
                        sx={{ borderRadius: 3, fontWeight: 700, bgcolor: '#3b82f6', '&:hover': { bgcolor: '#2563eb' } }}>
                        Save Changes
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Forum;
