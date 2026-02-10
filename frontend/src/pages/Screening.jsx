import React, { useState } from 'react';
import {
    Box,
    Button,
    Typography,
    Paper,
    LinearProgress,
    Card,
    CardContent,
    CardMedia,
    Alert,
    Fade
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SCENARIOS = [
    // PHQ-9 Scenarios (Subset for demo, full 9 in production)
    {
        id: 1,
        testType: 'PHQ9',
        questionIndex: 0,
        title: "The Weekend Plans",
        image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
        text: "It's Friday evening. Your friends are buzzing about a movie night. Usually, you'd be the first to join, but lately...",
        options: [
            { text: "I'm totally in! Can't wait.", score: 0 },
            { text: "I guess I'll go, but I'm not feeling it much.", score: 1 },
            { text: "I'd rather just stay home and do nothing.", score: 2 },
            { text: "I haven't enjoyed anything in weeks. I'm staying in bed.", score: 3 }
        ]
    },
    {
        id: 2,
        testType: 'PHQ9',
        questionIndex: 1,
        title: "The Morning Alarm",
        image: "https://images.unsplash.com/photo-1541480601022-2308c0f02487?auto=format&fit=crop&w=800&q=80",
        text: "Your alarm rings at 7 AM for morning lectures. You wake up feeling down, depressed, or hopeless about the day ahead.",
        options: [
            { text: "Nope, I'm ready to tackle the day!", score: 0 },
            { text: "Happens sometimes, but I shake it off.", score: 1 },
            { text: "It's becoming a struggle more often than not.", score: 2 },
            { text: "Every single day feels heavy and pointless.", score: 3 }
        ]
    },
    // GAD-7 Scenarios
    {
        id: 3,
        testType: 'GAD7',
        questionIndex: 0,
        title: "The Upcoming Exam",
        image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80",
        text: "Exams are approaching. You feel nervous, anxious, or on edge.",
        options: [
            { text: "Just normal exam jitters. I'm fine.", score: 0 },
            { text: "I feel a bit anxious now and then.", score: 1 },
            { text: "I'm constantly worried, more than usual.", score: 2 },
            { text: "I'm a nervous wreck almost all day, every day.", score: 3 }
        ]
    },
    // ... Add more scenarios here
];

const Screening = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState({ PHQ9: [], GAD7: [] });
    const [completed, setCompleted] = useState(false);
    const [result, setResult] = useState(null);

    const handleAnswer = (score) => {
        const scenario = SCENARIOS[currentStep];
        const newAnswers = { ...answers };
        newAnswers[scenario.testType].push(score);
        setAnswers(newAnswers);

        if (currentStep < SCENARIOS.length - 1) {
            setCurrentStep(curr => curr + 1);
        } else {
            finishTest(newAnswers);
        }
    };

    const finishTest = async (finalAnswers) => {
        // Calculate Score (Simple sum for demo)
        const phqScore = finalAnswers.PHQ9.reduce((a, b) => a + b, 0);
        const gadScore = finalAnswers.GAD7.reduce((a, b) => a + b, 0);

        // Determine Severity (Clinical thresholds)
        let severity = 'minimal';
        let type = 'PHQ9';
        let score = phqScore;

        // Prioritize showing the worse score or combine
        if (gadScore > phqScore) {
            type = 'GAD7';
            score = gadScore;
        }

        if (score >= 20) severity = 'severe';
        else if (score >= 15) severity = 'moderate'; // Actually 15-19 is moderately severe
        else if (score >= 10) severity = 'moderate';
        else if (score >= 5) severity = 'mild';

        setResult({ score, severity, type });
        setCompleted(true);

        // Save to backend
        try {
            await axios.post('/api/screening/submit', {
                testType: type,
                answers: finalAnswers[type],
                score,
                severity
            });
        } catch (err) {
            console.error("Failed to save result", err);
        }
    };

    if (completed) {
        return (
            <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Assessment Complete
                </Typography>
                <Paper sx={{ p: 4, maxWidth: 600, mx: 'auto', mt: 3, borderRadius: 4 }}>
                    <Typography variant="h6" color="textSecondary" gutterBottom>
                        Your Results
                    </Typography>
                    <Typography variant="h3" color={result.severity === 'minimal' ? 'green' : 'secondary'} fontWeight="bold">
                        {result.severity.toUpperCase()}
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 2 }}>
                        Based on your answers, you seem to be experiencing {result.severity} symptoms of {result.type === 'PHQ9' ? 'Depression' : 'Anxiety'}.
                    </Typography>

                    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
                        <Button variant="outlined" onClick={() => navigate('/')}>
                            Back to Dashboard
                        </Button>
                        {result.severity !== 'minimal' && (
                            <Button variant="contained" color="primary" onClick={() => navigate('/appointments')}>
                                Book a Counsellor
                            </Button>
                        )}
                    </Box>
                </Paper>
            </Box>
        );
    }

    const scenario = SCENARIOS[currentStep];

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
            <Typography variant="h6" color="textSecondary" gutterBottom>
                Student Life Simulator
            </Typography>
            <LinearProgress
                variant="determinate"
                value={(currentStep / SCENARIOS.length) * 100}
                sx={{ mb: 4, height: 10, borderRadius: 5 }}
            />

            <Fade in={true} key={currentStep}>
                <Card sx={{ borderRadius: 4, overflow: 'hidden', boxShadow: 3 }}>
                    <CardMedia
                        component="img"
                        height="250"
                        image={scenario.image}
                        alt={scenario.title}
                    />
                    <CardContent sx={{ p: 4 }}>
                        <Typography variant="h4" gutterBottom fontWeight="bold">
                            {scenario.title}
                        </Typography>
                        <Typography variant="body1" fontSize="1.2rem" sx={{ mb: 4 }}>
                            {scenario.text}
                        </Typography>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {scenario.options.map((option, idx) => (
                                <Button
                                    key={idx}
                                    variant="outlined"
                                    size="large"
                                    onClick={() => handleAnswer(option.score)}
                                    sx={{
                                        justifyContent: 'flex-start',
                                        textAlign: 'left',
                                        py: 2,
                                        borderColor: 'divider',
                                        color: 'text.primary',
                                        '&:hover': {
                                            bgcolor: 'primary.light',
                                            borderColor: 'primary.main',
                                            color: 'primary.contrastText'
                                        }
                                    }}
                                >
                                    {option.text}
                                </Button>
                            ))}
                        </Box>
                    </CardContent>
                </Card>
            </Fade>
        </Box>
    );
};

export default Screening;
