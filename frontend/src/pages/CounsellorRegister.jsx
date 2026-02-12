import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Container, Box, Typography, TextField, Button, MenuItem,
    Paper, Alert, Grid
} from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../context/AuthContext';

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
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                py: 4
            }}
        >
            <Container maxWidth="md">
                <Paper
                    elevation={6}
                    sx={{
                        p: 4,
                        borderRadius: 3,
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(10px)'
                    }}
                >
                    <Box textAlign="center" mb={3}>
                        <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
                            Join as a Counsellor
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Help students navigate their mental health journey
                        </Typography>
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
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
                        {({ errors, touched, isSubmitting }) => (
                            <Form>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <Field
                                            as={TextField}
                                            fullWidth
                                            name="name"
                                            label="Full Name *"
                                            error={touched.name && Boolean(errors.name)}
                                            helperText={touched.name && errors.name}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Field
                                            as={TextField}
                                            fullWidth
                                            name="universityId"
                                            label="University ID / License No *"
                                            error={touched.universityId && Boolean(errors.universityId)}
                                            helperText={touched.universityId && errors.universityId}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Field
                                            as={TextField}
                                            fullWidth
                                            name="email"
                                            label="Professional Email *"
                                            type="email"
                                            error={touched.email && Boolean(errors.email)}
                                            helperText={touched.email && errors.email}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Field
                                            as={TextField}
                                            fullWidth
                                            name="password"
                                            label="Password *"
                                            type="password"
                                            error={touched.password && Boolean(errors.password)}
                                            helperText={touched.password && errors.password}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Field
                                            as={TextField}
                                            fullWidth
                                            name="confirmPassword"
                                            label="Confirm Password *"
                                            type="password"
                                            error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                                            helperText={touched.confirmPassword && errors.confirmPassword}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Field
                                            as={TextField}
                                            select
                                            fullWidth
                                            name="specialization"
                                            label="Specialization *"
                                            error={touched.specialization && Boolean(errors.specialization)}
                                            helperText={touched.specialization && errors.specialization}
                                        >
                                            {specializations.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </Field>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Field
                                            as={TextField}
                                            fullWidth
                                            name="credentials"
                                            label="Credentials & Qualifications *"
                                            placeholder="e.g., M.A. Clinical Psychology, Licensed Counsellor"
                                            error={touched.credentials && Boolean(errors.credentials)}
                                            helperText={touched.credentials && errors.credentials}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Field
                                            as={TextField}
                                            fullWidth
                                            multiline
                                            rows={3}
                                            name="bio"
                                            label="Professional Bio (Optional)"
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
                                    sx={{ mt: 3, mb: 2, py: 1.5 }}
                                >
                                    {isSubmitting ? 'Registering...' : 'Register as Counsellor'}
                                </Button>

                                <Box textAlign="center">
                                    <Typography variant="body2" color="text.secondary">
                                        Already have an account?{' '}
                                        <Link to="/login" style={{ color: '#4361ee', textDecoration: 'none' }}>
                                            Sign in
                                        </Link>
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                        Are you a student?{' '}
                                        <Link to="/register" style={{ color: '#4361ee', textDecoration: 'none' }}>
                                            Student Registration
                                        </Link>
                                    </Typography>
                                </Box>

                                <Alert severity="success" sx={{ mt: 2 }}>
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
