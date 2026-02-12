import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
    Container, Box, Typography, TextField, Button, Alert,
    Paper, Divider
} from '@mui/material';
import { Psychology, AutoAwesome } from '@mui/icons-material';
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
                if (userData?.role === 'counsellor') navigate('/counsellor/dashboard');
                else navigate('/');
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to login');
            }
        },
    });

    return (
        <Box sx={{
            minHeight: '100vh',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
            position: 'relative',
            overflow: 'hidden',
        }}>
            {/* Animated background orbs */}
            <Box sx={{
                position: 'absolute', width: 400, height: 400, borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(139,92,246,0.3), transparent 70%)',
                top: '-10%', left: '-10%',
                animation: 'orbFloat1 15s ease-in-out infinite',
                filter: 'blur(60px)',
            }} />
            <Box sx={{
                position: 'absolute', width: 350, height: 350, borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(236,72,153,0.25), transparent 70%)',
                bottom: '-5%', right: '-5%',
                animation: 'orbFloat2 18s ease-in-out infinite',
                filter: 'blur(60px)',
            }} />
            <Box sx={{
                position: 'absolute', width: 250, height: 250, borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(16,185,129,0.2), transparent 70%)',
                top: '40%', right: '20%',
                animation: 'orbFloat3 20s ease-in-out infinite',
                filter: 'blur(50px)',
            }} />

            <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
                <Paper
                    className="animate-scaleIn"
                    sx={{
                        p: { xs: 4, sm: 5 },
                        background: 'rgba(255,255,255,0.06)',
                        backdropFilter: 'blur(30px)',
                        WebkitBackdropFilter: 'blur(30px)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        borderRadius: 6,
                        boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                >
                    {/* Shimmer effect */}
                    <Box sx={{
                        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'linear-gradient(90deg, transparent 25%, rgba(255,255,255,0.03) 50%, transparent 75%)',
                        backgroundSize: '200% 100%',
                        animation: 'shimmer 4s linear infinite',
                        pointerEvents: 'none', borderRadius: 6,
                    }} />

                    <Box textAlign="center" mb={4} sx={{ position: 'relative', zIndex: 1 }}>
                        <Box sx={{
                            width: 72, height: 72, borderRadius: 4, mx: 'auto', mb: 2,
                            background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 8px 32px rgba(139,92,246,0.4)',
                            animation: 'float 3s ease-in-out infinite',
                        }}>
                            <Psychology sx={{ fontSize: 38, color: 'white' }} />
                        </Box>
                        <Typography sx={{
                            fontSize: '2rem', fontWeight: 800,
                            background: 'linear-gradient(135deg, #fff 0%, #a78bfa 50%, #ec4899 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            letterSpacing: '-0.02em',
                        }}>
                            MannSparsh
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', mt: 0.5 }}>
                            Your Campus Mental Health Companion
                        </Typography>
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{
                            mb: 2, bgcolor: 'rgba(239,68,68,0.1)',
                            color: '#f87171', border: '1px solid rgba(239,68,68,0.2)',
                            animation: 'fadeInDown 0.4s ease-out',
                        }}>
                            {error}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ position: 'relative', zIndex: 1 }}>
                        <TextField
                            margin="normal" required fullWidth
                            id="email" label="University Email" name="email"
                            autoComplete="email" autoFocus
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                            className="animate-fadeInUp delay-1"
                        />
                        <TextField
                            margin="normal" required fullWidth
                            name="password" label="Password" type="password"
                            id="password" autoComplete="current-password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            error={formik.touched.password && Boolean(formik.errors.password)}
                            helperText={formik.touched.password && formik.errors.password}
                            className="animate-fadeInUp delay-2"
                        />
                        <Button
                            type="submit" fullWidth variant="contained"
                            size="large"
                            className="animate-fadeInUp delay-3"
                            sx={{
                                mt: 3, mb: 2, py: 1.5,
                                fontSize: '1rem', fontWeight: 700,
                                background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 50%, #8b5cf6 100%)',
                                backgroundSize: '200% 200%',
                                animation: 'gradientShift 3s ease infinite, fadeInUp 0.6s ease-out 0.3s both',
                                boxShadow: '0 8px 30px rgba(139,92,246,0.4)',
                                '&:hover': {
                                    boxShadow: '0 12px 40px rgba(139,92,246,0.6)',
                                    transform: 'translateY(-3px)',
                                },
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            }}
                            startIcon={<AutoAwesome sx={{ animation: 'spin 3s linear infinite' }} />}
                        >
                            Sign In
                        </Button>

                        <Box textAlign="center" className="animate-fadeInUp delay-4">
                            <Link to="/register" style={{
                                textDecoration: 'none', color: '#a78bfa', fontWeight: 500,
                                fontSize: '0.9rem', transition: 'color 0.3s',
                            }}>
                                Don't have an account? <strong>Sign Up</strong>
                            </Link>
                        </Box>

                        <Divider sx={{ my: 3, '&::before, &::after': { borderColor: 'rgba(255,255,255,0.08)' } }}>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.3)' }}>OR</Typography>
                        </Divider>

                        <Box textAlign="center" className="animate-fadeInUp delay-5">
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)' }}>
                                Are you a counsellor?{' '}
                                <Link to="/counsellor/register" style={{
                                    textDecoration: 'none', color: '#f472b6', fontWeight: 600,
                                }}>
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
