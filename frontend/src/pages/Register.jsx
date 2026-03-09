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
                    background: 'rgba(30, 20, 60, 0.95)',
                    backdropFilter: 'blur(20px)'
                }}>
                    {/* Logo */}
                    <Box textAlign="center" mb={3}>
                        <Box sx={{
                            width: 64, height: 64, borderRadius: 3, mx: 'auto', mb: 2,
                            background: 'linear-gradient(135deg, #818cf8 0%, #c084fc 100%)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <School sx={{ fontSize: 36, color: 'white' }} />
                        </Box>
                        <Typography variant="h4" fontWeight="bold" sx={{ color: '#ffffff' }}>
                            Join MannSparsh
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#d1d5db' }}>
                            Create your account and start your wellness journey
                        </Typography>
                    </Box>

                    {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

                    <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{
                        '& .MuiTextField-root': {
                            mb: 2,
                            '& .MuiInputBase-input': { color: '#ffffff', '&::placeholder': { color: 'rgba(255,255,255,0.4)', opacity: 1 } },
                            '& .MuiOutlinedInput-root': {
                                background: 'rgba(255, 255, 255, 0.08)',
                                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                                '&:hover fieldset': { borderColor: '#a78bfa' },
                                '&.Mui-focused fieldset': { borderColor: '#a78bfa' },
                                '& svg': { color: '#ffffff' }
                            }
                        },
                        '& .MuiMenuItem-root': { color: '#333' }
                    }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle2" sx={{ color: '#e5e7eb', mb: 0.5, textAlign: 'left' }}>
                                    Full Name *
                                </Typography>
                                <TextField
                                    name="name" required fullWidth id="name"
                                    placeholder="Enter your full name" autoFocus
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    error={formik.touched.name && Boolean(formik.errors.name)}
                                    helperText={formik.touched.name && formik.errors.name}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle2" sx={{ color: '#e5e7eb', mb: 0.5, textAlign: 'left' }}>
                                    University ID / Roll No *
                                </Typography>
                                <TextField
                                    required fullWidth id="universityId"
                                    placeholder="Enter University ID" name="universityId"
                                    value={formik.values.universityId}
                                    onChange={formik.handleChange}
                                    error={formik.touched.universityId && Boolean(formik.errors.universityId)}
                                    helperText={formik.touched.universityId && formik.errors.universityId}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" sx={{ color: '#e5e7eb', mb: 0.5, textAlign: 'left' }}>
                                    University Email *
                                </Typography>
                                <TextField
                                    required fullWidth id="email" placeholder="example@university.edu"
                                    name="email" autoComplete="email"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    error={formik.touched.email && Boolean(formik.errors.email)}
                                    helperText={formik.touched.email && formik.errors.email}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle2" sx={{ color: '#e5e7eb', mb: 0.5, textAlign: 'left' }}>
                                    Password *
                                </Typography>
                                <TextField
                                    required fullWidth name="password" placeholder="Create a password"
                                    type="password" id="password" autoComplete="new-password"
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    error={formik.touched.password && Boolean(formik.errors.password)}
                                    helperText={formik.touched.password && formik.errors.password}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle2" sx={{ color: '#e5e7eb', mb: 0.5, textAlign: 'left' }}>
                                    Confirm Password *
                                </Typography>
                                <TextField
                                    required fullWidth name="confirmPassword"
                                    placeholder="Confirm your password" type="password" id="confirmPassword"
                                    value={formik.values.confirmPassword}
                                    onChange={formik.handleChange}
                                    error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                                    helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle2" sx={{ color: '#e5e7eb', mb: 0.5, textAlign: 'left' }}>
                                    Department *
                                </Typography>
                                <TextField
                                    required fullWidth name="department" displayEmpty
                                    select id="department"
                                    value={formik.values.department}
                                    onChange={formik.handleChange}
                                    error={formik.touched.department && Boolean(formik.errors.department)}
                                    helperText={formik.touched.department && formik.errors.department}
                                    sx={{ '& .MuiSelect-select': { color: formik.values.department ? '#ffffff' : 'rgba(255,255,255,0.4)' } }}
                                >
                                    <MenuItem value="" disabled>Select Department</MenuItem>
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
                                <Typography variant="subtitle2" sx={{ color: '#e5e7eb', mb: 0.5, textAlign: 'left' }}>
                                    Year of Study *
                                </Typography>
                                <TextField
                                    required fullWidth name="year" displayEmpty
                                    select id="year"
                                    value={formik.values.year}
                                    onChange={formik.handleChange}
                                    error={formik.touched.year && Boolean(formik.errors.year)}
                                    helperText={formik.touched.year && formik.errors.year}
                                    sx={{ '& .MuiSelect-select': { color: formik.values.year ? '#ffffff' : 'rgba(255,255,255,0.4)' } }}
                                >
                                    <MenuItem value="" disabled>Select Year</MenuItem>
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
                                background: 'linear-gradient(135deg, #818cf8 0%, #c084fc 100%)',
                                fontSize: '1rem', fontWeight: 600,
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                                    transform: 'translateY(-1px)',
                                    boxShadow: '0 8px 25px rgba(139, 92, 246, 0.4)'
                                },
                                transition: 'all 0.3s'
                            }}
                        >
                            Create Account
                        </Button>

                        <Box textAlign="center">
                            <Link to="/login" style={{ textDecoration: 'none', color: '#a78bfa', fontWeight: 500 }}>
                                Already have an account? Sign in
                            </Link>
                        </Box>

                        <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.2)' }}>
                            <Typography variant="body2" sx={{ color: '#9ca3af' }}>OR</Typography>
                        </Divider>

                        <Box textAlign="center">
                            <Typography variant="body2" sx={{ color: '#d1d5db' }}>
                                Are you a counsellor?{' '}
                                <Link to="/counsellor/register" style={{ textDecoration: 'none', color: '#f472b6', fontWeight: 600 }}>
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
