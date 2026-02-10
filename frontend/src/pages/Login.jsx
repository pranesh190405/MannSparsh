import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
    Container, Box, Typography, TextField, Button, Alert,
    Paper, Grid, Divider
} from '@mui/material';
import { Psychology } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const formik = useFormik({
        initialValues: { email: '', password: '' },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email address').required('Required'),
            password: Yup.string().required('Required'),
        }),
        onSubmit: async (values) => {
            try {
                setError('');
                const userData = await login(values.email, values.password);
                if (userData?.role === 'counsellor') {
                    navigate('/counsellor/dashboard');
                } else if (userData?.role === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/');
                }
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to login');
            }
        },
    });

    return (
        <Box sx={{
            minHeight: '100vh',
            display: 'flex',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            position: 'relative', overflow: 'hidden'
        }}>
            {/* Decorative circles */}
            <Box sx={{
                position: 'absolute', top: -120, right: -120,
                width: 400, height: 400, borderRadius: '50%',
                background: 'rgba(255,255,255,0.06)'
            }} />
            <Box sx={{
                position: 'absolute', bottom: -80, left: -80,
                width: 300, height: 300, borderRadius: '50%',
                background: 'rgba(255,255,255,0.04)'
            }} />

            <Container maxWidth="sm" sx={{ display: 'flex', alignItems: 'center', py: { xs: 2, sm: 4 } }}>
                <Paper elevation={6} sx={{
                    p: { xs: 3, sm: 5 }, width: '100%', borderRadius: { xs: 3, sm: 4 },
                    background: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(20px)'
                }}>
                    {/* Logo */}
                    <Box textAlign="center" mb={3}>
                        <Box sx={{
                            width: 64, height: 64, borderRadius: 3, mx: 'auto', mb: 2,
                            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <Psychology sx={{ fontSize: 36, color: 'white' }} />
                        </Box>
                        <Typography variant="h4" fontWeight="bold" color="primary">
                            MannSparsh
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            Your Campus Mental Health Companion
                        </Typography>
                    </Box>

                    {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

                    <Box component="form" onSubmit={formik.handleSubmit} noValidate>
                        <TextField
                            margin="normal" required fullWidth
                            id="email" label="University Email" name="email"
                            autoComplete="email" autoFocus
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                        />
                        <TextField
                            margin="normal" required fullWidth
                            name="password" label="Password" type="password"
                            id="password" autoComplete="current-password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            error={formik.touched.password && Boolean(formik.errors.password)}
                            helperText={formik.touched.password && formik.errors.password}
                        />
                        <Button
                            type="submit" fullWidth variant="contained"
                            size="large"
                            sx={{
                                mt: 3, mb: 2, py: 1.5,
                                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                fontSize: '1rem', fontWeight: 600,
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                                    transform: 'translateY(-1px)',
                                    boxShadow: '0 8px 25px rgba(99, 102, 241, 0.3)'
                                },
                                transition: 'all 0.3s'
                            }}
                        >
                            Sign In
                        </Button>

                        <Box textAlign="center">
                            <Link to="/register" style={{ textDecoration: 'none', color: '#6366f1', fontWeight: 500 }}>
                                Don't have an account? Sign Up
                            </Link>
                        </Box>

                        <Divider sx={{ my: 3 }}>
                            <Typography variant="body2" color="text.secondary">
                                OR
                            </Typography>
                        </Divider>

                        <Box textAlign="center">
                            <Typography variant="body2" color="text.secondary">
                                Are you a counsellor?{' '}
                                <Link to="/counsellor/register" style={{ textDecoration: 'none', color: '#ec4899', fontWeight: 600 }}>
                                    Register as Counsellor
                                </Link>
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default Login;
