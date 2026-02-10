import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Alert,
    Paper,
    Grid,
    MenuItem
} from '@mui/material';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const formik = useFormik({
        initialValues: {
            universityId: '',
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            department: '',
            year: '',
            role: 'student' // Default role
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
                // Remove confirmPassword from values sent to API
                const { confirmPassword, ...userData } = values;
                await register(userData);
                navigate('/');
            } catch (err) {
                console.error('Registration failed:', err.response); // Debug log
                setError(err.response?.data?.message || 'Failed to register');
            }
        },
    });

    return (
        <Container component="main" maxWidth="md">
            <Box
                sx={{
                    marginTop: 8,
                    marginBottom: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Paper elevation={3} sx={{ p: 4, width: '100%', borderRadius: 4 }}>
                    <Typography component="h1" variant="h4" align="center" gutterBottom color="primary">
                        Join CampusCare
                    </Typography>
                    <Typography component="h2" variant="h6" align="center" gutterBottom color="textSecondary">
                        Create your account
                    </Typography>

                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    name="name"
                                    required
                                    fullWidth
                                    id="name"
                                    label="Full Name"
                                    autoFocus
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    error={formik.touched.name && Boolean(formik.errors.name)}
                                    helperText={formik.touched.name && formik.errors.name}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    id="universityId"
                                    label="University ID / Roll No"
                                    name="universityId"
                                    value={formik.values.universityId}
                                    onChange={formik.handleChange}
                                    error={formik.touched.universityId && Boolean(formik.errors.universityId)}
                                    helperText={formik.touched.universityId && formik.errors.universityId}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="University Email"
                                    name="email"
                                    autoComplete="email"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    error={formik.touched.email && Boolean(formik.errors.email)}
                                    helperText={formik.touched.email && formik.errors.email}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="new-password"
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    error={formik.touched.password && Boolean(formik.errors.password)}
                                    helperText={formik.touched.password && formik.errors.password}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    name="confirmPassword"
                                    label="Confirm Password"
                                    type="password"
                                    id="confirmPassword"
                                    value={formik.values.confirmPassword}
                                    onChange={formik.handleChange}
                                    error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                                    helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    name="department"
                                    label="Department"
                                    select
                                    id="department"
                                    value={formik.values.department}
                                    onChange={formik.handleChange}
                                    error={formik.touched.department && Boolean(formik.errors.department)}
                                    helperText={formik.touched.department && formik.errors.department}
                                >
                                    <MenuItem value="CSE">CSE</MenuItem>
                                    <MenuItem value="ECE">ECE</MenuItem>
                                    <MenuItem value="MECH">MECH</MenuItem>
                                    <MenuItem value="CIVIL">CIVIL</MenuItem>
                                    <MenuItem value="OTHER">Other</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    name="year"
                                    label="Year of Study"
                                    select
                                    id="year"
                                    value={formik.values.year}
                                    onChange={formik.handleChange}
                                    error={formik.touched.year && Boolean(formik.errors.year)}
                                    helperText={formik.touched.year && formik.errors.year}
                                >
                                    <MenuItem value="1">1st Year</MenuItem>
                                    <MenuItem value="2">2nd Year</MenuItem>
                                    <MenuItem value="3">3rd Year</MenuItem>
                                    <MenuItem value="4">4th Year</MenuItem>
                                </TextField>
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2, py: 1.5 }}
                        >
                            Sign Up
                        </Button>
                        <Grid container justifyContent="center">
                            <Grid item>
                                <Link to="/login" style={{ textDecoration: 'none', color: '#4361ee' }}>
                                    Already have an account? Sign in
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default Register;
