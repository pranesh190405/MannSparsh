import React, { useState } from 'react';
import {
    Box, Button, Typography, Paper, LinearProgress, Card, CardContent,
    Fade, Chip, Avatar, Container, Grid
} from '@mui/material';
import {
    Psychology, SentimentDissatisfied, SentimentSatisfied,
    SentimentVeryDissatisfied, CheckCircle, LocalHospital, AutoAwesome
} from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SCENARIOS = [
    {
        id: 1, testType: 'PHQ9', questionIndex: 0, title: "The Weekend Plans", emoji: "🎬",
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
        id: 2, testType: 'PHQ9', questionIndex: 1, title: "The Morning Alarm", emoji: "⏰",
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
        id: 3, testType: 'PHQ9', questionIndex: 2, title: "The Late Night", emoji: "🌙",
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
        id: 4, testType: 'PHQ9', questionIndex: 3, title: "The Energy Meter", emoji: "🔋",
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
        id: 5, testType: 'PHQ9', questionIndex: 4, title: "The Dining Hall", emoji: "🍽️",
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
        id: 6, testType: 'PHQ9', questionIndex: 5, title: "The Mirror Moment", emoji: "🪞",
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
        id: 7, testType: 'PHQ9', questionIndex: 6, title: "The Study Session", emoji: "📚",
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
        id: 8, testType: 'PHQ9', questionIndex: 7, title: "The Group Project", emoji: "🐢",
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
        id: 9, testType: 'PHQ9', questionIndex: 8, title: "The Dark Thought", emoji: "💭",
        text: "It's a quiet night. You're alone with your thoughts. Sometimes an intrusive thought creeps in...",
        question: "How often have you had thoughts that you would be better off dead, or of hurting yourself?",
        options: [
            { text: "Never. Life has its ups and downs, but I'm okay.", score: 0 },
            { text: "Very rarely – a passing thought I quickly dismiss.", score: 1 },
            { text: "These thoughts come up more than I'd like to admit.", score: 2 },
            { text: "I think about it often. I need help.", score: 3 }
        ]
    },
    {
        id: 10, testType: 'GAD7', questionIndex: 0, title: "The Exam Hall", emoji: "📝",
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
        id: 11, testType: 'GAD7', questionIndex: 1, title: "The Worry Loop", emoji: "🔄",
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
        id: 12, testType: 'GAD7', questionIndex: 2, title: "The Overthinking Marathon", emoji: "🧠",
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
        id: 13, testType: 'GAD7', questionIndex: 3, title: "The Restless Night", emoji: "😰",
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
        id: 14, testType: 'GAD7', questionIndex: 4, title: "The Restless Body", emoji: "🪑",
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
        id: 15, testType: 'GAD7', questionIndex: 5, title: "The Snap Moment", emoji: "😤",
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
        id: 16, testType: 'GAD7', questionIndex: 6, title: "The Shadow of Dread", emoji: "😱",
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
                phqScore, gadScore,
                severity: phqScore > gadScore ? phqData.level : gadData.level
            });
        } catch (err) {
            console.error("Failed to save result", err);
        }
    };

    // ===== INTRO SCREEN =====
    if (!started) {
        return (
            <Container maxWidth="md" sx={{ mt: 4, mb: 4, position: 'relative' }}>
                {/* Background orb */}
                <Box sx={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.15), transparent 70%)', top: -60, right: -60, animation: 'orbFloat1 14s ease-in-out infinite', filter: 'blur(50px)', pointerEvents: 'none' }} />

                <Fade in={true}>
                    <Box className="animate-fadeInUp" sx={{
                        position: 'relative', overflow: 'hidden',
                        background: 'rgba(255,255,255,0.05)',
                        backdropFilter: 'blur(24px)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 5, textAlign: 'center', p: { xs: 4, md: 6 },
                    }}>
                        {/* Shimmer overlay */}
                        <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.04), transparent)', backgroundSize: '200% 100%', animation: 'shimmer 3s linear infinite', pointerEvents: 'none' }} />

                        <Box sx={{ position: 'relative', zIndex: 1 }}>
                            <Box sx={{
                                width: 80, height: 80, borderRadius: 4, mx: 'auto', mb: 3,
                                background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: '0 8px 32px rgba(139,92,246,0.4)',
                                animation: 'float 3s ease-in-out infinite',
                            }}>
                                <Psychology sx={{ fontSize: 44, color: 'white' }} />
                            </Box>

                            <Typography sx={{
                                fontSize: { xs: '1.75rem', md: '2.5rem' }, fontWeight: 800, mb: 1,
                                background: 'linear-gradient(135deg, #fff 0%, #a78bfa 100%)',
                                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                            }}>
                                Student Life Simulator
                            </Typography>
                            <Typography sx={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.6)', mb: 1 }}>
                                A Story-Based Mental Health Screening
                            </Typography>
                            <Typography sx={{ maxWidth: 520, mx: 'auto', mb: 4, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7 }}>
                                Walk through 16 realistic campus scenarios and tell us how you'd feel.
                                This screening uses clinically validated PHQ-9 and GAD-7 questionnaires
                                presented as relatable student experiences.
                            </Typography>

                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1.5, mb: 4, flexWrap: 'wrap' }}>
                                {['📊 PHQ-9 Depression', '📊 GAD-7 Anxiety', '⏱️ ~5 minutes', '🔒 100% Private'].map((label) => (
                                    <Chip key={label} label={label} sx={{
                                        bgcolor: 'rgba(139,92,246,0.12)', color: '#a78bfa', fontWeight: 600,
                                        border: '1px solid rgba(139,92,246,0.2)',
                                    }} />
                                ))}
                            </Box>

                            <Button
                                variant="contained" size="large"
                                onClick={() => setStarted(true)}
                                startIcon={<AutoAwesome sx={{ animation: 'spin 3s linear infinite' }} />}
                                sx={{ px: 6, py: 1.5, fontSize: '1.05rem', fontWeight: 700, borderRadius: 3 }}
                            >
                                Begin Assessment
                            </Button>

                            <Typography sx={{ mt: 3, fontSize: '0.8rem', color: 'rgba(255,255,255,0.35)' }}>
                                This is not a diagnostic tool. For professional guidance, book a counsellor.
                            </Typography>
                        </Box>
                    </Box>
                </Fade>
            </Container>
        );
    }

    // ===== RESULTS SCREEN =====
    if (completed && result) {
        const needsHelp = result.phqScore >= 10 || result.gadScore >= 10;
        return (
            <Container maxWidth="md" sx={{ mt: 4, mb: 4, position: 'relative' }}>
                <Box sx={{ position: 'absolute', width: 250, height: 250, borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.12), transparent 70%)', bottom: -40, left: -40, animation: 'orbFloat2 16s ease-in-out infinite', filter: 'blur(50px)', pointerEvents: 'none' }} />

                <Fade in={true}>
                    <Box>
                        <Box className="animate-fadeInUp" sx={{ textAlign: 'center', mb: 4 }}>
                            <Typography sx={{
                                fontSize: { xs: '1.5rem', md: '2rem' }, fontWeight: 800,
                                background: 'linear-gradient(135deg, #fff, #a78bfa)',
                                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                            }}>
                                Your Assessment Results
                            </Typography>
                            <Typography sx={{ color: 'rgba(255,255,255,0.5)' }}>
                                Based on your responses to all 16 scenarios
                            </Typography>
                        </Box>

                        <Grid container spacing={3} sx={{ mb: 4 }}>
                            {[
                                { label: 'Depression Screening (PHQ-9)', score: result.phqScore, max: 27, data: result.phqData },
                                { label: 'Anxiety Screening (GAD-7)', score: result.gadScore, max: 21, data: result.gadData },
                            ].map((item, idx) => (
                                <Grid item xs={12} md={6} key={idx}>
                                    <Card className="animate-fadeInUp" sx={{ animationDelay: `${idx * 0.15}s`, textAlign: 'center', p: 3 }}>
                                        <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.4)' }}>{item.label}</Typography>
                                        <Typography sx={{ fontSize: '2.5rem', fontWeight: 800, color: item.data.color, my: 1 }}>
                                            {item.score}/{item.max}
                                        </Typography>
                                        <Chip label={item.data.level} sx={{
                                            bgcolor: item.data.color + '20', color: item.data.color,
                                            fontWeight: 700, fontSize: '0.85rem', mb: 2,
                                            border: '1px solid ' + item.data.color + '30',
                                        }} />
                                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>{item.data.description}</Typography>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>

                        <Card className="animate-fadeInUp delay-2" sx={{ p: 3, mb: 3 }}>
                            <Typography variant="h6" fontWeight={700} gutterBottom>
                                {needsHelp ? '🔔 We Recommend' : '✅ Keep It Up!'}
                            </Typography>
                            <Box component="ul" sx={{ pl: 2, '& li': { mb: 1 } }}>
                                {needsHelp ? (
                                    <>
                                        <li><Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>Book a session with a professional counsellor on campus</Typography></li>
                                        <li><Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>Talk to someone you trust about how you're feeling</Typography></li>
                                        <li><Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>Use our AI chat for immediate coping strategies</Typography></li>
                                        <li><Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>Consider re-taking this screening in 2 weeks</Typography></li>
                                    </>
                                ) : (
                                    <>
                                        <li><Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>Continue your healthy routines and self-care habits</Typography></li>
                                        <li><Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>Stay connected with friends and family</Typography></li>
                                        <li><Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>Consider periodic check-ins with our screening tool</Typography></li>
                                    </>
                                )}
                            </Box>
                        </Card>

                        <Box display="flex" justifyContent="center" gap={2} flexWrap="wrap">
                            <Button variant="outlined" onClick={() => navigate('/')} size="large" sx={{ borderRadius: 3 }}>
                                Back to Dashboard
                            </Button>
                            <Button variant="outlined" onClick={() => navigate('/chat')} size="large" startIcon={<Psychology />} sx={{ borderRadius: 3 }}>
                                Talk to AI Chat
                            </Button>
                            {needsHelp && (
                                <Button variant="contained" onClick={() => navigate('/appointments')} size="large"
                                    startIcon={<LocalHospital />} sx={{ borderRadius: 3, fontWeight: 700 }}>
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
    const accentColor = isPhq ? '#8b5cf6' : '#ec4899';

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            {/* Progress Header */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Chip
                    label={isPhq ? '📊 Depression (PHQ-9)' : '📊 Anxiety (GAD-7)'}
                    size="small"
                    sx={{
                        bgcolor: accentColor + '15', color: accentColor,
                        fontWeight: 600, border: '1px solid ' + accentColor + '25',
                    }}
                />
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>
                    {currentStep + 1} of {SCENARIOS.length}
                </Typography>
            </Box>
            <LinearProgress
                variant="determinate" value={progress}
                sx={{
                    mb: 4, height: 6, borderRadius: 4,
                    bgcolor: 'rgba(255,255,255,0.06)',
                    '& .MuiLinearProgress-bar': {
                        borderRadius: 4,
                        background: `linear-gradient(90deg, ${accentColor}, ${accentColor}aa)`,
                    }
                }}
            />

            <Fade in={true} key={currentStep} timeout={400}>
                <Card sx={{ overflow: 'hidden' }}>
                    <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                        {/* Scenario Header */}
                        <Box display="flex" alignItems="center" gap={2} mb={3}>
                            <Avatar sx={{
                                width: 56, height: 56, fontSize: '1.8rem',
                                bgcolor: accentColor + '15',
                                border: '1px solid ' + accentColor + '25',
                            }}>
                                {scenario.emoji}
                            </Avatar>
                            <Box>
                                <Typography variant="h5" fontWeight={700}>{scenario.title}</Typography>
                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>
                                    Scenario {currentStep + 1}
                                </Typography>
                            </Box>
                        </Box>

                        {/* Story */}
                        <Typography sx={{
                            fontSize: '1.05rem', lineHeight: 1.8, mb: 3,
                            color: 'rgba(255,255,255,0.55)', fontStyle: 'italic',
                            borderLeft: '3px solid ' + accentColor,
                            pl: 2,
                        }}>
                            {scenario.text}
                        </Typography>

                        {/* Q */}
                        <Typography variant="body2" fontWeight={700} sx={{ color: 'rgba(255,255,255,0.7)', mb: 2 }}>
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
                                        py: 2, px: 3, borderRadius: 3,
                                        borderColor: selectedOption === option.score ? accentColor : 'rgba(255,255,255,0.08)',
                                        color: selectedOption === option.score ? 'white' : 'rgba(255,255,255,0.7)',
                                        bgcolor: selectedOption === option.score ? accentColor : 'transparent',
                                        transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                                        '&:hover': {
                                            bgcolor: accentColor + '10',
                                            borderColor: accentColor + '40',
                                            transform: 'translateX(6px)',
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
