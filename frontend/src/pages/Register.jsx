import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
    Container, Box, Typography, TextField, Button, Alert,
    Paper, Grid, MenuItem, Divider, Stepper, Step, StepLabel
} from '@mui/material';
import { Psychology, School } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const formik = useFormik({
        initialValues: {
            universityId: '', name: '', email: '', password: '',
            confirmPassword: '', department: '', year: '', role: 'student'
        },
        validationSchema: Yup.object({
            universityId: Yup.string().required('Required'),
            name: Yup.string().required('Required'),
            email: Yup.string().email('Invalid email').required('Required'),
            password: Yup.string().min(6, 'Must be 6 characters or more').required('Required'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password'), null], 'Passwords must match')
                .required('Required'),
            department: Yup.string().required('Required'),
            year: Yup.string().required('Required'),
        }),
        onSubmit: async (values) => {
            try {
                setError('');
                const { confirmPassword, ...userData } = values;
                await register(userData);
                navigate('/');
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to register');
            }
        },
    });

    return (
        <Box sx={{
            minHeight: '100vh', display: 'flex',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            position: 'relative', overflow: 'hidden'
        }}>
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

            <Container maxWidth="md" sx={{ display: 'flex', alignItems: 'center', py: { xs: 2, sm: 4 } }}>
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
                            <School sx={{ fontSize: 36, color: 'white' }} />
                        </Box>
                        <Typography variant="h4" fontWeight="bold" color="primary">
                            Join MannSparsh
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Create your account and start your wellness journey
                        </Typography>
                    </Box>

                    {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

                    <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{
                        '& .MuiTextField-root': {
                            mb: 2,
                            '& .MuiInputBase-input': { color: '#333' },
                            '& .MuiInputLabel-root': { color: '#666' },
                            '& .MuiInputLabel-root.Mui-focused': { color: '#6366f1' },
                            '& .MuiOutlinedInput-root': {
                                background: 'rgba(0, 0, 0, 0.05)',
                                '& fieldset': { borderColor: 'rgba(0, 0, 0, 0.2)' },
                                '&:hover fieldset': { borderColor: '#6366f1' },
                                '&.Mui-focused fieldset': { borderColor: '#6366f1' },
                            }
                        },
                        '& .MuiMenuItem-root': { color: '#333' } // For select dropdowns if needed
                    }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    name="name" required fullWidth id="name"
                                    label="Full Name" autoFocus
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    error={formik.touched.name && Boolean(formik.errors.name)}
                                    helperText={formik.touched.name && formik.errors.name}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required fullWidth id="universityId"
                                    label="University ID / Roll No" name="universityId"
                                    value={formik.values.universityId}
                                    onChange={formik.handleChange}
                                    error={formik.touched.universityId && Boolean(formik.errors.universityId)}
                                    helperText={formik.touched.universityId && formik.errors.universityId}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required fullWidth id="email" label="University Email"
                                    name="email" autoComplete="email"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    error={formik.touched.email && Boolean(formik.errors.email)}
                                    helperText={formik.touched.email && formik.errors.email}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required fullWidth name="password" label="Password"
                                    type="password" id="password" autoComplete="new-password"
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    error={formik.touched.password && Boolean(formik.errors.password)}
                                    helperText={formik.touched.password && formik.errors.password}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required fullWidth name="confirmPassword"
                                    label="Confirm Password" type="password" id="confirmPassword"
                                    value={formik.values.confirmPassword}
                                    onChange={formik.handleChange}
                                    error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                                    helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required fullWidth name="department" label="Department"
                                    select id="department"
                                    value={formik.values.department}
                                    onChange={formik.handleChange}
                                    error={formik.touched.department && Boolean(formik.errors.department)}
                                    helperText={formik.touched.department && formik.errors.department}
                                >
                                    <MenuItem value="CSE">Computer Science</MenuItem>
                                    <MenuItem value="ECE">Electronics</MenuItem>
                                    <MenuItem value="MECH">Mechanical</MenuItem>
                                    <MenuItem value="CIVIL">Civil</MenuItem>
                                    <MenuItem value="EEE">Electrical</MenuItem>
                                    <MenuItem value="IT">Information Technology</MenuItem>
                                    <MenuItem value="OTHER">Other</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required fullWidth name="year" label="Year of Study"
                                    select id="year"
                                    value={formik.values.year}
                                    onChange={formik.handleChange}
                                    error={formik.touched.year && Boolean(formik.errors.year)}
                                    helperText={formik.touched.year && formik.errors.year}
                                >
                                    <MenuItem value="1">1st Year</MenuItem>
                                    <MenuItem value="2">2nd Year</MenuItem>
                                    <MenuItem value="3">3rd Year</MenuItem>
                                    <MenuItem value="4">4th Year</MenuItem>
                                    <MenuItem value="5">5th Year (Integrated)</MenuItem>
                                </TextField>
                            </Grid>
                        </Grid>

                        <Button
                            type="submit" fullWidth variant="contained" size="large"
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
                            Create Account
                        </Button>

                        <Box textAlign="center">
                            <Link to="/login" style={{ textDecoration: 'none', color: '#6366f1', fontWeight: 500 }}>
                                Already have an account? Sign in
                            </Link>
                        </Box>

                        <Divider sx={{ my: 2 }}>
                            <Typography variant="body2" color="text.secondary">OR</Typography>
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

export default Register;
