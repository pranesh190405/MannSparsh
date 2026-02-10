import React, { useState } from 'react';
import {
    Box, Button, Typography, Paper, LinearProgress, Card, CardContent,
    Fade, Chip, Avatar, Stepper, Step, StepLabel, Container, Grid
} from '@mui/material';
import {
    Psychology, SentimentDissatisfied, SentimentSatisfied,
    SentimentVeryDissatisfied, Warning, CheckCircle, LocalHospital
} from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SCENARIOS = [
    // ===== PHQ-9: 9 Depression Questions =====
    {
        id: 1, testType: 'PHQ9', questionIndex: 0,
        title: "The Weekend Plans",
        emoji: "🎬",
        text: "It's Friday evening. Your friends are buzzing about a movie night. Usually, you'd be the first to join, but lately things feel different...",
        question: "How often have you had little interest or pleasure in doing things?",
        options: [
            { text: "I'm totally in! Can't wait to go.", score: 0 },
            { text: "I guess I'll go, but I'm not really feeling it.", score: 1 },
            { text: "I'd rather just stay home and do nothing.", score: 2 },
            { text: "I haven't enjoyed anything in weeks. I'm staying in bed.", score: 3 }
        ]
    },
    {
        id: 2, testType: 'PHQ9', questionIndex: 1,
        title: "The Morning Alarm",
        emoji: "⏰",
        text: "Your alarm rings at 7 AM for morning lectures. You open your eyes and the first thought hits you...",
        question: "How often have you been feeling down, depressed, or hopeless?",
        options: [
            { text: "Ready to tackle the day! Let's go.", score: 0 },
            { text: "Happens sometimes, but I shake it off.", score: 1 },
            { text: "It's becoming a daily struggle to get up.", score: 2 },
            { text: "Every single day feels heavy and pointless.", score: 3 }
        ]
    },
    {
        id: 3, testType: 'PHQ9', questionIndex: 2,
        title: "The Late Night",
        emoji: "🌙",
        text: "It's 2 AM and you're lying in bed. Your mind won't shut off. You toss and turn, or maybe you've been sleeping way too much lately...",
        question: "How often have you had trouble falling asleep, staying asleep, or sleeping too much?",
        options: [
            { text: "I sleep like a baby, 7-8 hours every night.", score: 0 },
            { text: "A few restless nights here and there.", score: 1 },
            { text: "Most nights I either can't sleep or oversleep.", score: 2 },
            { text: "My sleep is completely messed up – I barely function.", score: 3 }
        ]
    },
    {
        id: 4, testType: 'PHQ9', questionIndex: 3,
        title: "The Energy Meter",
        emoji: "🔋",
        text: "You have a full day ahead – lectures, assignments, maybe a gym session. But your body feels like it's running on empty...",
        question: "How often have you been feeling tired or having little energy?",
        options: [
            { text: "I've got plenty of energy for everything!", score: 0 },
            { text: "Sometimes I feel tired, but coffee fixes it.", score: 1 },
            { text: "I'm dragging myself through most days.", score: 2 },
            { text: "I'm exhausted all the time, even doing nothing.", score: 3 }
        ]
    },
    {
        id: 5, testType: 'PHQ9', questionIndex: 4,
        title: "The Dining Hall",
        emoji: "🍽️",
        text: "Lunch time at the mess hall. Your friend saved you a spot, but when you look at the food...",
        question: "How often have you had poor appetite or been overeating?",
        options: [
            { text: "Normal appetite – I eat well and enjoy meals.", score: 0 },
            { text: "My appetite fluctuates a bit, nothing major.", score: 1 },
            { text: "I've been eating way too much or barely at all.", score: 2 },
            { text: "Food has lost all meaning. I skip meals or binge constantly.", score: 3 }
        ]
    },
    {
        id: 6, testType: 'PHQ9', questionIndex: 5,
        title: "The Mirror Moment",
        emoji: "🪞",
        text: "You catch your reflection while walking past a glass door on campus. A thought crosses your mind about yourself...",
        question: "How often have you felt bad about yourself, or that you're a failure, or have let yourself or your family down?",
        options: [
            { text: "I'm doing my best, and that's enough.", score: 0 },
            { text: "Sometimes I feel I could do better.", score: 1 },
            { text: "I often feel like I'm failing at everything.", score: 2 },
            { text: "I'm a complete failure. I've let everyone down.", score: 3 }
        ]
    },
    {
        id: 7, testType: 'PHQ9', questionIndex: 6,
        title: "The Study Session",
        emoji: "📚",
        text: "You sit down to study for an important exam tomorrow. You open your textbook and try to focus, but...",
        question: "How often have you had trouble concentrating on things like reading or watching TV?",
        options: [
            { text: "I can focus well when I need to.", score: 0 },
            { text: "My mind wanders a bit, but I manage.", score: 1 },
            { text: "I read the same line 10 times and nothing registers.", score: 2 },
            { text: "I can't concentrate on anything at all anymore.", score: 3 }
        ]
    },
    {
        id: 8, testType: 'PHQ9', questionIndex: 7,
        title: "The Group Project",
        emoji: "🐢",
        text: "Your teammates are discussing the project deadline. Everyone seems to be moving at normal speed, but you...",
        question: "How often have you been moving or speaking so slowly that others noticed? Or the opposite – being fidgety or restless?",
        options: [
            { text: "I'm moving at my normal pace, no issues.", score: 0 },
            { text: "I feel a bit sluggish or restless sometimes.", score: 1 },
            { text: "People have started noticing I'm different.", score: 2 },
            { text: "I feel stuck in slow motion – or can't sit still at all.", score: 3 }
        ]
    },
    {
        id: 9, testType: 'PHQ9', questionIndex: 8,
        title: "The Dark Thought",
        emoji: "💭",
        text: "It's a quiet night. You're alone with your thoughts. Sometimes an intrusive thought creeps in...",
        question: "How often have you had thoughts that you would be better off dead, or of hurting yourself?",
        options: [
            { text: "Never. Life has its ups and downs, but I'm okay.", score: 0 },
            { text: "Very rarely – a passing thought I quickly dismiss.", score: 1 },
            { text: "These thoughts come up more than I'd like to admit.", score: 2 },
            { text: "I think about it often. I need help.", score: 3 }
        ]
    },

    // ===== GAD-7: 7 Anxiety Questions =====
    {
        id: 10, testType: 'GAD7', questionIndex: 0,
        title: "The Exam Hall",
        emoji: "📝",
        text: "Exams are approaching. You're sitting in the library and your heart starts racing just thinking about it...",
        question: "How often have you been feeling nervous, anxious, or on edge?",
        options: [
            { text: "Just normal exam jitters. I'm fine.", score: 0 },
            { text: "I feel a bit anxious now and then.", score: 1 },
            { text: "I'm constantly worried, way more than usual.", score: 2 },
            { text: "I'm a nervous wreck almost all day, every day.", score: 3 }
        ]
    },
    {
        id: 11, testType: 'GAD7', questionIndex: 1,
        title: "The Worry Loop",
        emoji: "🔄",
        text: "You're trying to relax, but your brain has other plans. It keeps bringing up worries – grades, future, relationships, everything...",
        question: "How often have you not been able to stop or control worrying?",
        options: [
            { text: "I can usually manage my worries just fine.", score: 0 },
            { text: "Sometimes worries get a bit sticky.", score: 1 },
            { text: "I often get caught in worry spirals I can't escape.", score: 2 },
            { text: "My mind is a constant storm of uncontrollable worry.", score: 3 }
        ]
    },
    {
        id: 12, testType: 'GAD7', questionIndex: 2,
        title: "The Overthinking Marathon",
        emoji: "🧠",
        text: "A friend didn't reply to your message in 3 hours. Your brain starts constructing worst-case scenarios...",
        question: "How often have you been worrying too much about different things?",
        options: [
            { text: "I can stop and see things rationally.", score: 0 },
            { text: "I overthink a little, but nothing serious.", score: 1 },
            { text: "I worry excessively about multiple things daily.", score: 2 },
            { text: "Everything is a potential disaster in my mind.", score: 3 }
        ]
    },
    {
        id: 13, testType: 'GAD7', questionIndex: 3,
        title: "The Restless Night",
        emoji: "😰",
        text: "You're watching a movie to unwind, but you can't sit still. There's this restless energy inside you that won't calm down...",
        question: "How often have you had trouble relaxing?",
        options: [
            { text: "I relax easily – Netflix and chill works for me.", score: 0 },
            { text: "Sometimes I find it hard to unwind.", score: 1 },
            { text: "Relaxing feels almost impossible most days.", score: 2 },
            { text: "I haven't truly relaxed in weeks. I'm always tense.", score: 3 }
        ]
    },
    {
        id: 14, testType: 'GAD7', questionIndex: 4,
        title: "The Restless Body",
        emoji: "🪑",
        text: "You're in a long lecture. Everyone else seems calm, but you're fidgeting, tapping your feet, unable to sit still...",
        question: "How often have you been so restless that it's hard to sit still?",
        options: [
            { text: "I can sit through lectures no problem.", score: 0 },
            { text: "I fidget a little, but it's manageable.", score: 1 },
            { text: "I feel physically restless most of the time.", score: 2 },
            { text: "I can barely sit still – my body is always on edge.", score: 3 }
        ]
    },
    {
        id: 15, testType: 'GAD7', questionIndex: 5,
        title: "The Snap Moment",
        emoji: "😤",
        text: "Your roommate leaves their dishes in the sink again. Normally you'd shrug it off, but today...",
        question: "How often have you become easily annoyed or irritable?",
        options: [
            { text: "I'm pretty chill about small stuff.", score: 0 },
            { text: "Little things bug me sometimes.", score: 1 },
            { text: "I snap at people more often than I should.", score: 2 },
            { text: "Everything and everyone irritates me constantly.", score: 3 }
        ]
    },
    {
        id: 16, testType: 'GAD7', questionIndex: 6,
        title: "The Shadow of Dread",
        emoji: "😱",
        text: "You wake up in the morning and before your feet touch the floor, there's already a sense of dread. Something bad is going to happen today... you just know it...",
        question: "How often have you felt afraid, as if something awful might happen?",
        options: [
            { text: "Nah, I don't really feel that way.", score: 0 },
            { text: "Occasionally – but I reason my way out of it.", score: 1 },
            { text: "I frequently feel something terrible is about to happen.", score: 2 },
            { text: "I live in constant fear and dread every single day.", score: 3 }
        ]
    }
];

const getSeverityData = (score, type) => {
    if (type === 'PHQ9') {
        if (score >= 20) return { level: 'Severe', color: '#dc2626', icon: <SentimentVeryDissatisfied />, description: 'Your responses suggest you may be experiencing severe symptoms of depression. We strongly recommend speaking with a professional counsellor right away.' };
        if (score >= 15) return { level: 'Moderately Severe', color: '#ea580c', icon: <SentimentVeryDissatisfied />, description: 'Your responses indicate moderately severe symptoms of depression. Professional support is recommended.' };
        if (score >= 10) return { level: 'Moderate', color: '#f59e0b', icon: <SentimentDissatisfied />, description: 'Your responses suggest moderate symptoms of depression. Speaking with a counsellor could be beneficial.' };
        if (score >= 5) return { level: 'Mild', color: '#3b82f6', icon: <SentimentDissatisfied />, description: 'Your responses indicate mild symptoms of depression. Self-care strategies and monitoring are recommended.' };
        return { level: 'Minimal', color: '#10b981', icon: <SentimentSatisfied />, description: 'Great news! Your responses suggest minimal symptoms. Keep maintaining your healthy habits!' };
    } else {
        if (score >= 15) return { level: 'Severe', color: '#dc2626', icon: <SentimentVeryDissatisfied />, description: 'Your responses suggest you may be experiencing severe anxiety. We strongly recommend seeking professional help.' };
        if (score >= 10) return { level: 'Moderate', color: '#f59e0b', icon: <SentimentDissatisfied />, description: 'Your responses indicate moderate anxiety symptoms. Consider speaking with a counsellor.' };
        if (score >= 5) return { level: 'Mild', color: '#3b82f6', icon: <SentimentDissatisfied />, description: 'Your responses suggest mild anxiety. Self-care and mindfulness techniques may help.' };
        return { level: 'Minimal', color: '#10b981', icon: <SentimentSatisfied />, description: 'Your responses suggest minimal anxiety. You\'re doing well!' };
    }
};

const Screening = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState({ PHQ9: [], GAD7: [] });
    const [completed, setCompleted] = useState(false);
    const [result, setResult] = useState(null);
    const [started, setStarted] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);

    const handleAnswer = (score) => {
        setSelectedOption(score);
        const scenario = SCENARIOS[currentStep];
        const newAnswers = { ...answers };
        newAnswers[scenario.testType] = [...newAnswers[scenario.testType], score];
        setAnswers(newAnswers);

        setTimeout(() => {
            setSelectedOption(null);
            if (currentStep < SCENARIOS.length - 1) {
                setCurrentStep(curr => curr + 1);
            } else {
                finishTest(newAnswers);
            }
        }, 400);
    };

    const finishTest = async (finalAnswers) => {
        const phqScore = finalAnswers.PHQ9.reduce((a, b) => a + b, 0);
        const gadScore = finalAnswers.GAD7.reduce((a, b) => a + b, 0);

        const phqData = getSeverityData(phqScore, 'PHQ9');
        const gadData = getSeverityData(gadScore, 'GAD7');

        setResult({ phqScore, gadScore, phqData, gadData });
        setCompleted(true);

        try {
            await axios.post('/api/screening/submit', {
                testType: 'combined',
                answers: { PHQ9: finalAnswers.PHQ9, GAD7: finalAnswers.GAD7 },
                phqScore,
                gadScore,
                severity: phqScore > gadScore ? phqData.level : gadData.level
            });
        } catch (err) {
            console.error("Failed to save result", err);
        }
    };

    // ===== INTRO SCREEN =====
    if (!started) {
        return (
            <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
                <Fade in={true}>
                    <Card sx={{
                        borderRadius: 4,
                        overflow: 'hidden',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        textAlign: 'center',
                        p: 6
                    }}>
                        <Psychology sx={{ fontSize: 80, mb: 2, opacity: 0.9 }} />
                        <Typography variant="h3" fontWeight="bold" gutterBottom>
                            Student Life Simulator
                        </Typography>
                        <Typography variant="h6" sx={{ opacity: 0.9, mb: 3 }}>
                            A Story-Based Mental Health Screening
                        </Typography>
                        <Typography variant="body1" sx={{ maxWidth: 500, mx: 'auto', mb: 4, opacity: 0.85 }}>
                            Walk through 16 realistic campus scenarios and tell us how you'd feel.
                            This screening uses clinically validated PHQ-9 and GAD-7 questionnaires
                            presented as relatable student experiences.
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4, flexWrap: 'wrap' }}>
                            <Chip label="📊 PHQ-9 Depression" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600 }} />
                            <Chip label="📊 GAD-7 Anxiety" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600 }} />
                            <Chip label="⏱️ ~5 minutes" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600 }} />
                            <Chip label="🔒 100% Private" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600 }} />
                        </Box>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={() => setStarted(true)}
                            sx={{
                                bgcolor: 'white', color: '#6366f1', fontWeight: 700,
                                px: 6, py: 1.5, fontSize: '1.1rem',
                                '&:hover': { bgcolor: '#f0f0ff', transform: 'scale(1.05)' },
                                transition: 'all 0.3s'
                            }}
                        >
                            Begin Assessment
                        </Button>
                        <Typography variant="caption" display="block" sx={{ mt: 3, opacity: 0.7 }}>
                            This is not a diagnostic tool. For professional guidance, book a counsellor.
                        </Typography>
                    </Card>
                </Fade>
            </Container>
        );
    }

    // ===== RESULTS SCREEN =====
    if (completed && result) {
        const worse = result.phqScore >= result.gadScore ? 'phq' : 'gad';
        const needsHelp = result.phqScore >= 10 || result.gadScore >= 10;

        return (
            <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
                <Fade in={true}>
                    <Box>
                        <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom>
                            Your Assessment Results
                        </Typography>
                        <Typography variant="body1" color="text.secondary" textAlign="center" mb={4}>
                            Based on your responses to all 16 scenarios
                        </Typography>

                        <Grid container spacing={3} sx={{ mb: 4 }}>
                            {/* PHQ-9 Result */}
                            <Grid item xs={12} md={6}>
                                <Card sx={{
                                    borderRadius: 3, p: 3, textAlign: 'center',
                                    border: `2px solid ${result.phqData.color}30`,
                                    background: `linear-gradient(135deg, ${result.phqData.color}08 0%, ${result.phqData.color}03 100%)`
                                }}>
                                    <Typography variant="overline" color="text.secondary">
                                        Depression Screening (PHQ-9)
                                    </Typography>
                                    <Typography variant="h2" fontWeight="bold" sx={{ color: result.phqData.color, my: 1 }}>
                                        {result.phqScore}/27
                                    </Typography>
                                    <Chip
                                        label={result.phqData.level}
                                        sx={{
                                            bgcolor: result.phqData.color + '20',
                                            color: result.phqData.color,
                                            fontWeight: 700, fontSize: '0.9rem', mb: 2
                                        }}
                                    />
                                    <Typography variant="body2" color="text.secondary">
                                        {result.phqData.description}
                                    </Typography>
                                </Card>
                            </Grid>

                            {/* GAD-7 Result */}
                            <Grid item xs={12} md={6}>
                                <Card sx={{
                                    borderRadius: 3, p: 3, textAlign: 'center',
                                    border: `2px solid ${result.gadData.color}30`,
                                    background: `linear-gradient(135deg, ${result.gadData.color}08 0%, ${result.gadData.color}03 100%)`
                                }}>
                                    <Typography variant="overline" color="text.secondary">
                                        Anxiety Screening (GAD-7)
                                    </Typography>
                                    <Typography variant="h2" fontWeight="bold" sx={{ color: result.gadData.color, my: 1 }}>
                                        {result.gadScore}/21
                                    </Typography>
                                    <Chip
                                        label={result.gadData.level}
                                        sx={{
                                            bgcolor: result.gadData.color + '20',
                                            color: result.gadData.color,
                                            fontWeight: 700, fontSize: '0.9rem', mb: 2
                                        }}
                                    />
                                    <Typography variant="body2" color="text.secondary">
                                        {result.gadData.description}
                                    </Typography>
                                </Card>
                            </Grid>
                        </Grid>

                        {/* Recommendations */}
                        <Card sx={{ borderRadius: 3, p: 3, mb: 3 }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                {needsHelp ? '🔔 We Recommend' : '✅ Keep It Up!'}
                            </Typography>
                            <Box component="ul" sx={{ pl: 2 }}>
                                {needsHelp ? (
                                    <>
                                        <li><Typography variant="body2">Book a session with a professional counsellor on campus</Typography></li>
                                        <li><Typography variant="body2">Talk to someone you trust about how you're feeling</Typography></li>
                                        <li><Typography variant="body2">Use our AI chat for immediate coping strategies</Typography></li>
                                        <li><Typography variant="body2">Consider re-taking this screening in 2 weeks to track changes</Typography></li>
                                    </>
                                ) : (
                                    <>
                                        <li><Typography variant="body2">Continue your healthy routines and self-care habits</Typography></li>
                                        <li><Typography variant="body2">Stay connected with friends and family</Typography></li>
                                        <li><Typography variant="body2">Consider periodic check-ins with our screening tool</Typography></li>
                                    </>
                                )}
                            </Box>
                        </Card>

                        <Box display="flex" justifyContent="center" gap={2} flexWrap="wrap">
                            <Button variant="outlined" onClick={() => navigate('/')} size="large">
                                Back to Dashboard
                            </Button>
                            <Button variant="outlined" onClick={() => navigate('/chat')} size="large"
                                startIcon={<Psychology />}>
                                Talk to AI Chat
                            </Button>
                            {needsHelp && (
                                <Button variant="contained" onClick={() => navigate('/appointments')} size="large"
                                    startIcon={<LocalHospital />}
                                    sx={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                                    Book a Counsellor
                                </Button>
                            )}
                        </Box>
                    </Box>
                </Fade>
            </Container>
        );
    }

    // ===== QUESTION SCREEN =====
    const scenario = SCENARIOS[currentStep];
    const progress = ((currentStep) / SCENARIOS.length) * 100;
    const isPhq = scenario.testType === 'PHQ9';

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            {/* Progress Header */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Chip
                    label={isPhq ? '📊 Depression (PHQ-9)' : '📊 Anxiety (GAD-7)'}
                    size="small"
                    sx={{
                        bgcolor: isPhq ? '#6366f120' : '#ec489920',
                        color: isPhq ? '#6366f1' : '#ec4899',
                        fontWeight: 600
                    }}
                />
                <Typography variant="body2" color="text.secondary" fontWeight={600}>
                    {currentStep + 1} of {SCENARIOS.length}
                </Typography>
            </Box>
            <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                    mb: 4, height: 8, borderRadius: 4,
                    bgcolor: '#e2e8f0',
                    '& .MuiLinearProgress-bar': {
                        borderRadius: 4,
                        background: isPhq
                            ? 'linear-gradient(90deg, #6366f1, #8b5cf6)'
                            : 'linear-gradient(90deg, #ec4899, #f472b6)'
                    }
                }}
            />

            <Fade in={true} key={currentStep} timeout={400}>
                <Card sx={{
                    borderRadius: 4, overflow: 'hidden',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                    border: '1px solid #e2e8f0'
                }}>
                    <CardContent sx={{ p: 4 }}>
                        {/* Scenario Header */}
                        <Box display="flex" alignItems="center" gap={2} mb={3}>
                            <Avatar sx={{
                                width: 56, height: 56, fontSize: '1.8rem',
                                bgcolor: isPhq ? '#6366f115' : '#ec489915'
                            }}>
                                {scenario.emoji}
                            </Avatar>
                            <Box>
                                <Typography variant="h5" fontWeight="bold">
                                    {scenario.title}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Scenario {currentStep + 1}
                                </Typography>
                            </Box>
                        </Box>

                        {/* Story Text */}
                        <Typography variant="body1" sx={{
                            fontSize: '1.1rem', lineHeight: 1.8, mb: 3,
                            color: '#475569', fontStyle: 'italic',
                            borderLeft: '3px solid',
                            borderColor: isPhq ? '#6366f1' : '#ec4899',
                            pl: 2
                        }}>
                            {scenario.text}
                        </Typography>

                        {/* Clinical Question */}
                        <Typography variant="body2" fontWeight="bold" color="text.secondary" mb={2}>
                            {scenario.question}
                        </Typography>

                        {/* Options */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                            {scenario.options.map((option, idx) => (
                                <Button
                                    key={idx}
                                    variant={selectedOption === option.score ? "contained" : "outlined"}
                                    size="large"
                                    onClick={() => handleAnswer(option.score)}
                                    disabled={selectedOption !== null}
                                    sx={{
                                        justifyContent: 'flex-start', textAlign: 'left',
                                        py: 2, px: 3, borderRadius: 2,
                                        borderColor: selectedOption === option.score ? 'primary.main' : '#e2e8f0',
                                        color: selectedOption === option.score ? 'white' : 'text.primary',
                                        bgcolor: selectedOption === option.score
                                            ? (isPhq ? '#6366f1' : '#ec4899')
                                            : 'transparent',
                                        transition: 'all 0.2s',
                                        '&:hover': {
                                            bgcolor: isPhq ? '#6366f110' : '#ec489910',
                                            borderColor: isPhq ? '#6366f1' : '#ec4899',
                                            transform: 'translateX(4px)'
                                        }
                                    }}
                                >
                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                        {option.text}
                                    </Typography>
                                </Button>
                            ))}
                        </Box>
                    </CardContent>
                </Card>
            </Fade>
        </Container>
    );
};

export default Screening;
