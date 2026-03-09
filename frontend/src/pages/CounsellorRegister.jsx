import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Container, Box, Typography, TextField, Button, MenuItem,
    Paper, Alert, Grid, Divider
} from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../context/AuthContext';
import { MedicalServices } from '@mui/icons-material';

const validationSchema = Yup.object({
    name: Yup.string().required('Full name is required'),
    universityId: Yup.string().required('University ID is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Confirm password is required'),
    specialization: Yup.string().required('Specialization is required'),
    credentials: Yup.string().required('Credentials are required'),
    bio: Yup.string().max(500, 'Bio must be 500 characters or less')
});

const specializations = [
    { value: 'anxiety', label: 'Anxiety & Stress Management' },
    { value: 'depression', label: 'Depression & Mood Disorders' },
    { value: 'stress', label: 'Academic Stress' },
    { value: 'relationships', label: 'Relationships & Social Issues' },
    { value: 'academic', label: 'Academic Performance' },
    { value: 'general', label: 'General Counselling' }
];

const CounsellorRegister = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [error, setError] = useState('');

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            setError('');
            await register({
                ...values,
                role: 'counsellor'
            });
            navigate('/counsellor/dashboard');
        } catch (err) {
            console.error('Registration error:', err);
            setError(err.response?.data?.message || 'Failed to register. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #1e143c 0%, #170f2e 100%)', // matching the dark layout concept
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                overflow: 'hidden',
                py: { xs: 2, sm: 4 }
            }}
        >
            {/* Background Orbs (consistent with Login page) */}
            <Box sx={{
                position: 'absolute', width: 400, height: 400, borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(139,92,246,0.15), transparent 70%)',
                top: '-10%', left: '-10%',
                animation: 'orbFloat1 15s ease-in-out infinite',
                filter: 'blur(60px)',
            }} />
            <Box sx={{
                position: 'absolute', width: 350, height: 350, borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(236,72,153,0.1), transparent 70%)',
                bottom: '-5%', right: '-5%',
                animation: 'orbFloat2 18s ease-in-out infinite',
                filter: 'blur(60px)',
            }} />

            <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
                <Paper
                    elevation={6}
                    sx={{
                        p: { xs: 3, sm: 5 }, width: '100%', borderRadius: { xs: 3, sm: 4 },
                        background: 'rgba(30, 20, 60, 0.95)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255,255,255,0.05)',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
                    }}
                >
                    <Box textAlign="center" mb={3}>
                        <Box sx={{
                            width: 64, height: 64, borderRadius: 3, mx: 'auto', mb: 2,
                            background: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 8px 32px rgba(236, 72, 153, 0.4)',
                        }}>
                            <MedicalServices sx={{ fontSize: 36, color: 'white' }} />
                        </Box>
                        <Typography variant="h4" fontWeight="bold" sx={{ color: '#ffffff' }} gutterBottom>
                            Join as a Counsellor
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#d1d5db' }}>
                            Help students navigate their mental health journey
                        </Typography>
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Formik
                        initialValues={{
                            name: '',
                            universityId: '',
                            email: '',
                            password: '',
                            confirmPassword: '',
                            specialization: '',
                            credentials: '',
                            bio: ''
                        }}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ errors, touched, isSubmitting, values }) => (
                            <Form>
                                <Grid container spacing={2} sx={{
                                    '& .MuiTextField-root': { mb: 2 },
                                    '& .MuiInputBase-input': { color: '#ffffff', '&::placeholder': { color: 'rgba(255,255,255,0.4)', opacity: 1 } },
                                    '& .MuiOutlinedInput-root': {
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                                        '&:hover fieldset': { borderColor: '#f472b6' },
                                        '&.Mui-focused fieldset': { borderColor: '#f472b6' },
                                        '& svg': { color: '#ffffff' }
                                    },
                                    '& .MuiMenuItem-root': { color: '#333' }
                                }}>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle2" sx={{ color: '#e5e7eb', mb: 0.5, textAlign: 'left' }}>
                                            Full Name *
                                        </Typography>
                                        <Field
                                            as={TextField}
                                            fullWidth
                                            name="name"
                                            placeholder="Enter your full name"
                                            error={touched.name && Boolean(errors.name)}
                                            helperText={touched.name && errors.name}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle2" sx={{ color: '#e5e7eb', mb: 0.5, textAlign: 'left' }}>
                                            University ID / License No *
                                        </Typography>
                                        <Field
                                            as={TextField}
                                            fullWidth
                                            name="universityId"
                                            placeholder="Enter your license or ID"
                                            error={touched.universityId && Boolean(errors.universityId)}
                                            helperText={touched.universityId && errors.universityId}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle2" sx={{ color: '#e5e7eb', mb: 0.5, textAlign: 'left' }}>
                                            Professional Email *
                                        </Typography>
                                        <Field
                                            as={TextField}
                                            fullWidth
                                            name="email"
                                            type="email"
                                            placeholder="example@clinic.com"
                                            error={touched.email && Boolean(errors.email)}
                                            helperText={touched.email && errors.email}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle2" sx={{ color: '#e5e7eb', mb: 0.5, textAlign: 'left' }}>
                                            Password *
                                        </Typography>
                                        <Field
                                            as={TextField}
                                            fullWidth
                                            name="password"
                                            type="password"
                                            placeholder="Create a password"
                                            error={touched.password && Boolean(errors.password)}
                                            helperText={touched.password && errors.password}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle2" sx={{ color: '#e5e7eb', mb: 0.5, textAlign: 'left' }}>
                                            Confirm Password *
                                        </Typography>
                                        <Field
                                            as={TextField}
                                            fullWidth
                                            name="confirmPassword"
                                            type="password"
                                            placeholder="Confirm your password"
                                            error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                                            helperText={touched.confirmPassword && errors.confirmPassword}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle2" sx={{ color: '#e5e7eb', mb: 0.5, textAlign: 'left' }}>
                                            Specialization *
                                        </Typography>
                                        <Field
                                            as={TextField}
                                            select
                                            fullWidth
                                            displayEmpty
                                            name="specialization"
                                            error={touched.specialization && Boolean(errors.specialization)}
                                            helperText={touched.specialization && errors.specialization}
                                            sx={{ '& .MuiSelect-select': { color: values.specialization ? '#ffffff' : 'rgba(255,255,255,0.4)' } }}
                                        >
                                            <MenuItem value="" disabled>Select Specialization</MenuItem>
                                            {specializations.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </Field>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle2" sx={{ color: '#e5e7eb', mb: 0.5, textAlign: 'left' }}>
                                            Credentials & Qualifications *
                                        </Typography>
                                        <Field
                                            as={TextField}
                                            fullWidth
                                            name="credentials"
                                            placeholder="e.g., M.A. Clinical Psychology, Licensed Counsellor"
                                            error={touched.credentials && Boolean(errors.credentials)}
                                            helperText={touched.credentials && errors.credentials}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle2" sx={{ color: '#e5e7eb', mb: 0.5, textAlign: 'left' }}>
                                            Professional Bio (Optional)
                                        </Typography>
                                        <Field
                                            as={TextField}
                                            fullWidth
                                            multiline
                                            rows={3}
                                            name="bio"
                                            placeholder="Brief introduction about your experience and approach..."
                                            error={touched.bio && Boolean(errors.bio)}
                                            helperText={touched.bio && errors.bio}
                                        />
                                    </Grid>
                                </Grid>

                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    size="large"
                                    disabled={isSubmitting}
                                    sx={{
                                        mt: 3, mb: 2, py: 1.5,
                                        background: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
                                        fontSize: '1rem', fontWeight: 600,
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #db2777 0%, #e11d48 100%)',
                                            transform: 'translateY(-1px)',
                                            boxShadow: '0 8px 25px rgba(236, 72, 153, 0.4)'
                                        },
                                        transition: 'all 0.3s'
                                    }}
                                >
                                    {isSubmitting ? 'Registering...' : 'Register as Counsellor'}
                                </Button>

                                <Box textAlign="center">
                                    <Typography variant="body2" sx={{ color: '#d1d5db' }}>
                                        Already have an account?{' '}
                                        <Link to="/login" style={{ color: '#f472b6', textDecoration: 'none', fontWeight: 600 }}>
                                            Sign in
                                        </Link>
                                    </Typography>

                                    <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.2)' }}>
                                        <Typography variant="body2" sx={{ color: '#9ca3af' }}>OR</Typography>
                                    </Divider>

                                    <Typography variant="body2" sx={{ color: '#d1d5db' }}>
                                        Are you a student?{' '}
                                        <Link to="/register" style={{ color: '#8b5cf6', textDecoration: 'none', fontWeight: 600 }}>
                                            Student Registration
                                        </Link>
                                    </Typography>
                                </Box>

                                <Alert severity="info" sx={{ mt: 3, borderRadius: 2, bgcolor: 'rgba(56, 189, 248, 0.1)', color: '#bae6fd', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                                    Your account will be ready to use immediately after registration.
                                </Alert>
                            </Form>
                        )}
                    </Formik>
                </Paper>
            </Container>
        </Box>
    );
};

export default CounsellorRegister;
