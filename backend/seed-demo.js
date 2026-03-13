const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Load models
const User = require('./models/User');
const Screening = require('./models/Screening');
const Appointment = require('./models/Appointment');
const ChatLog = require('./models/ChatLog');
const CounsellorSlot = require('./models/CounsellorSlot');
const CounsellorAvailability = require('./models/CounsellorAvailability');
const ForumPost = require('./models/ForumPost');
const CounsellorForum = require('./models/CounsellorForum');

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/mannsparsh';

// Helper: generate a date N days ago at a specific hour
const daysAgo = (days, hour = 10) => {
    const d = new Date();
    d.setDate(d.getDate() - days);
    d.setHours(hour, 0, 0, 0);
    return d;
};

const seedDatabase = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(mongoURI);
        console.log('Connected to MongoDB.');

        // Clear existing data
        console.log('Clearing database...');
        await Promise.all([
            User.deleteMany({}),
            Screening.deleteMany({}),
            Appointment.deleteMany({}),
            ChatLog.deleteMany({}),
            CounsellorSlot.deleteMany({}),
            CounsellorAvailability.deleteMany({}),
            ForumPost.deleteMany({}),
            CounsellorForum.deleteMany({})
        ]);
        console.log('Database cleared.');

        // ============================================================
        // 1. CREATE USERS
        // ============================================================
        console.log('\n--- Creating Users ---');

        // Counsellor
        const counsellor = await User.create({
            name: 'Dr. Sarah Peterson',
            universityId: 'CUN001',
            email: 'counsellor@test.com',
            passwordHash: 'password123',
            role: 'counsellor',
            specialization: 'general',
            credentials: 'Ph.D. in Clinical Psychology, Licensed Professional Counsellor (LPC)',
            bio: 'With over 10 years of experience in student mental health, I specialize in helping young adults navigate academic stress, anxiety, and personal growth. My approach combines CBT and mindfulness techniques.',
            rating: 4.8,
            totalSessions: 156,
            isVerified: true
        });
        console.log(`  Counsellor: ${counsellor.email} / password123`);

        // Students
        const alice = await User.create({
            name: 'Alice Johnson',
            universityId: 'STU001',
            email: 'alice@test.com',
            passwordHash: 'password123',
            role: 'student',
            department: 'Computer Science',
            year: '3rd Year',
            isVerified: true
        });

        const bob = await User.create({
            name: 'Bob Smith',
            universityId: 'STU002',
            email: 'bob@test.com',
            passwordHash: 'password123',
            role: 'student',
            department: 'Mechanical Engineering',
            year: '2nd Year',
            isVerified: true
        });

        const charlie = await User.create({
            name: 'Charlie Davis',
            universityId: 'STU003',
            email: 'charlie@test.com',
            passwordHash: 'password123',
            role: 'student',
            department: 'Computer Science',
            year: '4th Year',
            isVerified: true
        });

        const diana = await User.create({
            name: 'Diana Evans',
            universityId: 'STU004',
            email: 'diana@test.com',
            passwordHash: 'password123',
            role: 'student',
            department: 'Business Administration',
            year: '1st Year',
            isVerified: true
        });

        const ethan = await User.create({
            name: 'Ethan Roy',
            universityId: 'STU005',
            email: 'ethan@test.com',
            passwordHash: 'password123',
            role: 'student',
            department: 'Psychology',
            year: '2nd Year',
            isVerified: true
        });

        const fiona = await User.create({
            name: 'Fiona Gupta',
            universityId: 'STU006',
            email: 'fiona@test.com',
            passwordHash: 'password123',
            role: 'student',
            department: 'Electrical Engineering',
            year: '3rd Year',
            isVerified: true
        });

        const allStudents = [alice, bob, charlie, diana, ethan, fiona];
        console.log(`  Created 6 students (alice, bob, charlie, diana, ethan, fiona) — all password: password123`);

        // ============================================================
        // 2. ALICE — THE POWER USER (many sessions with counsellor)
        //    Story: Alice started struggling with academic stress 25 days
        //    ago, gradually improved through counselling sessions.
        // ============================================================
        console.log('\n--- Creating Alice\'s Journey (many sessions) ---');

        // Alice's Screening Tests — showing progression from severe → mild
        const aliceScreenings = [
            { userId: alice._id, testType: 'PHQ9', answers: [3,3,2,3,2,3,2,3,2], score: 23, severity: 'severe', completedAt: daysAgo(25) },
            { userId: alice._id, testType: 'GAD7', answers: [3,3,2,3,2,3,3],     score: 19, severity: 'severe', completedAt: daysAgo(24) },
            { userId: alice._id, testType: 'PHQ9', answers: [2,3,2,2,2,2,2,2,1], score: 18, severity: 'moderate', completedAt: daysAgo(20) },
            { userId: alice._id, testType: 'GAD7', answers: [2,2,2,2,2,2,2],     score: 14, severity: 'moderate', completedAt: daysAgo(17) },
            { userId: alice._id, testType: 'PHQ9', answers: [1,2,1,2,1,1,1,2,1], score: 12, severity: 'moderate', completedAt: daysAgo(13) },
            { userId: alice._id, testType: 'GAD7', answers: [1,2,1,1,1,2,1],     score: 9,  severity: 'mild', completedAt: daysAgo(9) },
            { userId: alice._id, testType: 'PHQ9', answers: [1,1,1,1,0,1,1,1,0], score: 7,  severity: 'mild', completedAt: daysAgo(5) },
            { userId: alice._id, testType: 'GAD7', answers: [1,1,0,1,0,1,0],     score: 4,  severity: 'minimal', completedAt: daysAgo(2) },
        ];

        // Alice's Appointments — 8 sessions with the counsellor
        const aliceAppointments = [
            { studentId: alice._id, counsellorId: counsellor._id, slotTime: daysAgo(24, 10), status: 'completed', notes: 'Initial session. Student reports severe academic stress and sleep issues. Started CBT exercises.', isEmergency: false, createdAt: daysAgo(25) },
            { studentId: alice._id, counsellorId: counsellor._id, slotTime: daysAgo(21, 14), status: 'completed', notes: 'Follow-up. Discussed time management strategies. Student showing some improvement in sleep patterns.', isEmergency: false, createdAt: daysAgo(22) },
            { studentId: alice._id, counsellorId: counsellor._id, slotTime: daysAgo(18, 11), status: 'completed', notes: 'Student had a panic attack before exam. Taught grounding techniques and breathing exercises.', isEmergency: true, createdAt: daysAgo(19) },
            { studentId: alice._id, counsellorId: counsellor._id, slotTime: daysAgo(15, 10), status: 'completed', notes: 'Positive progress. Student using mindfulness app daily. Academic performance starting to stabilize.', isEmergency: false, createdAt: daysAgo(16) },
            { studentId: alice._id, counsellorId: counsellor._id, slotTime: daysAgo(12, 15), status: 'completed', notes: 'Discussed relationship with peers. Student feeling more confident. Reduced anxiety levels.', isEmergency: false, createdAt: daysAgo(13) },
            { studentId: alice._id, counsellorId: counsellor._id, slotTime: daysAgo(9, 10),  status: 'completed', notes: 'Student reports better sleep and study habits. CBT techniques showing strong results.', isEmergency: false, createdAt: daysAgo(10) },
            { studentId: alice._id, counsellorId: counsellor._id, slotTime: daysAgo(5, 14),  status: 'completed', notes: 'Near-complete recovery. Student feeling optimistic about upcoming exams. Reducing session frequency.', isEmergency: false, createdAt: daysAgo(6) },
            { studentId: alice._id, counsellorId: counsellor._id, slotTime: daysAgo(1, 10),  status: 'completed', notes: 'Final check-in session. Student has developed strong coping mechanisms. Recommending monthly follow-ups.', isEmergency: false, createdAt: daysAgo(2) },
        ];

        // Alice's Chat Logs (AI chatbot conversations)
        const aliceChatLogs = [
            {
                userId: alice._id, riskLevel: 'high',
                summary: 'Student expressing severe academic burnout and feelings of hopelessness about upcoming exams.',
                messages: [
                    { sender: 'user', content: 'I feel like I can\'t handle the pressure anymore. My exams are next week and I haven\'t studied anything.', timestamp: daysAgo(25, 22) },
                    { sender: 'bot', content: 'I hear you, and it sounds like you\'re going through a really tough time. Academic pressure can feel overwhelming. Can you tell me more about what\'s been making it hard to study?', timestamp: daysAgo(25, 22) },
                    { sender: 'user', content: 'I just sit at my desk and stare at the books. My mind goes blank. I can\'t sleep at night and I\'m always exhausted.', timestamp: daysAgo(25, 22) },
                    { sender: 'bot', content: 'That sounds like you might be experiencing burnout symptoms. Sleep issues and difficulty concentrating are common signs. I strongly recommend booking a session with our counsellor, Dr. Sarah Peterson, who can help you develop coping strategies.', timestamp: daysAgo(25, 22) },
                    { sender: 'user', content: 'Will it actually help? I feel like nothing can fix this.', timestamp: daysAgo(25, 22) },
                    { sender: 'bot', content: 'Many students have found significant relief through counselling. Dr. Peterson specializes in academic stress. In the meantime, try this: take a 5-minute break every 25 minutes of studying, and practice deep breathing before bed. Would you like me to help you book an appointment?', timestamp: daysAgo(25, 22) }
                ],
                timestamp: daysAgo(25, 22)
            },
            {
                userId: alice._id, riskLevel: 'medium',
                summary: 'Student checking in, reports slight improvement after first counselling session.',
                messages: [
                    { sender: 'user', content: 'Hi, I had my first session with Dr. Peterson yesterday. She suggested some techniques.', timestamp: daysAgo(22, 20) },
                    { sender: 'bot', content: 'That\'s great that you took that step! How are you feeling after the session?', timestamp: daysAgo(22, 20) },
                    { sender: 'user', content: 'A bit better. I managed to study for 2 hours today without zoning out. But I still feel anxious.', timestamp: daysAgo(22, 20) },
                    { sender: 'bot', content: 'Progress isn\'t always linear, but 2 hours of focused study is a meaningful improvement! The anxiety may take time to reduce. Are you practicing the techniques Dr. Peterson recommended?', timestamp: daysAgo(22, 20) },
                    { sender: 'user', content: 'Yes, the breathing exercises help a little. I\'ll keep trying.', timestamp: daysAgo(22, 20) },
                    { sender: 'bot', content: 'That\'s wonderful to hear. Consistency is key. Keep up with the breathing exercises and don\'t hesitate to reach out here or book another session when you need support.', timestamp: daysAgo(22, 20) }
                ],
                timestamp: daysAgo(22, 20)
            },
            {
                userId: alice._id, riskLevel: 'low',
                summary: 'Student reports significant improvement, feeling more confident about academics.',
                messages: [
                    { sender: 'user', content: 'Hey! Just wanted to share that I scored well on my midterm today. I can\'t believe it.', timestamp: daysAgo(8, 18) },
                    { sender: 'bot', content: 'That\'s fantastic news! Congratulations! You\'ve put in a lot of hard work. How are you feeling overall?', timestamp: daysAgo(8, 18) },
                    { sender: 'user', content: 'So much better. I\'m sleeping well now and I actually enjoy studying again. The counselling sessions really changed everything.', timestamp: daysAgo(8, 18) },
                    { sender: 'bot', content: 'I\'m so glad to hear about your progress! It takes courage to seek help, and you\'ve done an amazing job. Remember, it\'s okay to reach out anytime if you feel the stress building up again.', timestamp: daysAgo(8, 18) }
                ],
                timestamp: daysAgo(8, 18)
            }
        ];

        // ============================================================
        // 3. OTHER STUDENTS — assorted data for rich analytics
        // ============================================================
        console.log('\n--- Creating data for other students ---');

        // Bob — moderate anxiety, 2 sessions
        const bobScreenings = [
            { userId: bob._id, testType: 'GAD7', answers: [2,2,1,2,1,2,1], score: 11, severity: 'moderate', completedAt: daysAgo(20) },
            { userId: bob._id, testType: 'PHQ9', answers: [1,2,1,1,1,2,1,1,1], score: 11, severity: 'moderate', completedAt: daysAgo(14) },
            { userId: bob._id, testType: 'GAD7', answers: [1,1,1,1,1,1,1], score: 7, severity: 'mild', completedAt: daysAgo(7) },
        ];

        const bobAppointments = [
            { studentId: bob._id, counsellorId: counsellor._id, slotTime: daysAgo(18, 14), status: 'completed', notes: 'Student dealing with peer pressure in engineering department. Discussed assertiveness techniques.', isEmergency: false, createdAt: daysAgo(19) },
            { studentId: bob._id, counsellorId: counsellor._id, slotTime: daysAgo(10, 11), status: 'completed', notes: 'Follow-up. Student feeling more assertive. Continuing to build confidence.', isEmergency: false, createdAt: daysAgo(11) },
        ];

        const bobChatLogs = [
            {
                userId: bob._id, riskLevel: 'medium',
                summary: 'Student mentions difficulty fitting in with peers in engineering department.',
                messages: [
                    { sender: 'user', content: 'I feel like everyone in my department is smarter than me. I struggle to keep up.', timestamp: daysAgo(20, 21) },
                    { sender: 'bot', content: 'Imposter syndrome is very common, especially in competitive fields like engineering. Many students feel this way. Have you talked to anyone about these feelings?', timestamp: daysAgo(20, 21) },
                    { sender: 'user', content: 'No, I\'m afraid they\'ll think I\'m weak.', timestamp: daysAgo(20, 21) },
                    { sender: 'bot', content: 'Seeking help is a sign of strength, not weakness. I\'d recommend booking a session with our counsellor. Everything discussed is completely confidential.', timestamp: daysAgo(20, 21) }
                ],
                timestamp: daysAgo(20, 21)
            }
        ];

        // Charlie — high risk, severe depression, 3 sessions
        const charlieScreenings = [
            { userId: charlie._id, testType: 'PHQ9', answers: [3,3,3,2,3,2,3,3,2], score: 24, severity: 'severe', completedAt: daysAgo(22) },
            { userId: charlie._id, testType: 'GAD7', answers: [3,3,3,3,2,3,3], score: 20, severity: 'severe', completedAt: daysAgo(18) },
            { userId: charlie._id, testType: 'PHQ9', answers: [2,2,2,2,2,1,2,2,1], score: 16, severity: 'moderate', completedAt: daysAgo(10) },
            { userId: charlie._id, testType: 'GAD7', answers: [2,1,2,1,1,2,1], score: 10, severity: 'moderate', completedAt: daysAgo(4) },
        ];

        const charlieAppointments = [
            { studentId: charlie._id, counsellorId: counsellor._id, slotTime: daysAgo(20, 10), status: 'completed', notes: 'Student in severe distress. Final year project pressure combined with job search anxiety. Started crisis intervention plan.', isEmergency: true, createdAt: daysAgo(21) },
            { studentId: charlie._id, counsellorId: counsellor._id, slotTime: daysAgo(14, 15), status: 'completed', notes: 'Significant improvement after breaking project into smaller milestones. Student using daily journaling.', isEmergency: false, createdAt: daysAgo(15) },
            { studentId: charlie._id, counsellorId: counsellor._id, slotTime: daysAgo(7, 10), status: 'completed', notes: 'Student secured an internship offer, which boosted confidence. Continuing anxiety management techniques.', isEmergency: false, createdAt: daysAgo(8) },
        ];

        const charlieChatLogs = [
            {
                userId: charlie._id, riskLevel: 'high',
                summary: 'Student expressing extreme financial stress and anxiety about job prospects after graduation.',
                messages: [
                    { sender: 'user', content: 'I\'m graduating soon and I have no job offers. My family is depending on me and I can\'t even pay my hostel fees.', timestamp: daysAgo(22, 23) },
                    { sender: 'bot', content: 'I can understand how stressful that must be. Financial pressure combined with job search anxiety is incredibly challenging. You\'re not alone in this.', timestamp: daysAgo(22, 23) },
                    { sender: 'user', content: 'I sometimes feel like giving up. What\'s the point if I can\'t even get a job after 4 years of studying?', timestamp: daysAgo(22, 23) },
                    { sender: 'bot', content: 'I want you to know that your feelings are valid, but please don\'t lose hope. Many students face this and find their way. I strongly recommend speaking with Dr. Peterson immediately — she can help you develop an action plan. Would you like me to flag this as an emergency appointment?', timestamp: daysAgo(22, 23) },
                    { sender: 'user', content: 'Yes, I think I need to talk to someone.', timestamp: daysAgo(22, 23) },
                    { sender: 'bot', content: 'I\'m glad you\'re reaching out. I\'ve flagged this as urgent. You can also call the university helpline at any time. You are valued and this situation is temporary.', timestamp: daysAgo(22, 23) }
                ],
                timestamp: daysAgo(22, 23)
            },
            {
                userId: charlie._id, riskLevel: 'high',
                summary: 'Student reports panic attacks during project presentations.',
                messages: [
                    { sender: 'user', content: 'I had another panic attack during my project review today. My professor noticed and asked if I was okay.', timestamp: daysAgo(16, 19) },
                    { sender: 'bot', content: 'I\'m sorry to hear that. Panic attacks can be very frightening. Are you in a safe place right now?', timestamp: daysAgo(16, 19) },
                    { sender: 'user', content: 'Yes, I\'m in my room. I just feel so drained.', timestamp: daysAgo(16, 19) },
                    { sender: 'bot', content: 'Take some slow, deep breaths with me. Breathe in for 4 counts, hold for 4, and breathe out for 6. This can help calm your nervous system. Have you been attending your sessions with Dr. Peterson?', timestamp: daysAgo(16, 19) },
                    { sender: 'user', content: 'Yes, I have one tomorrow. The last session helped me a lot actually.', timestamp: daysAgo(16, 19) },
                    { sender: 'bot', content: 'That\'s good to hear. Keep going with the sessions. Make sure to mention today\'s panic attack to Dr. Peterson so she can adjust your coping plan.', timestamp: daysAgo(16, 19) }
                ],
                timestamp: daysAgo(16, 19)
            }
        ];

        // Diana — mild issues, 1 session
        const dianaScreenings = [
            { userId: diana._id, testType: 'PHQ9', answers: [1,1,1,0,1,0,1,0,0], score: 5, severity: 'mild', completedAt: daysAgo(15) },
            { userId: diana._id, testType: 'GAD7', answers: [1,1,0,1,0,0,1], score: 4, severity: 'minimal', completedAt: daysAgo(8) },
        ];

        const dianaAppointments = [
            { studentId: diana._id, counsellorId: counsellor._id, slotTime: daysAgo(12, 14), status: 'completed', notes: 'Student adjusting to university life as a first-year. Homesickness and mild social anxiety. Provided coping strategies.', isEmergency: false, createdAt: daysAgo(13) },
        ];

        const dianaChatLogs = [
            {
                userId: diana._id, riskLevel: 'low',
                summary: 'First-year student experiencing mild homesickness, seeking advice on adjusting to campus life.',
                messages: [
                    { sender: 'user', content: 'It\'s been a month since I joined and I still miss home a lot. Is that normal?', timestamp: daysAgo(16, 19) },
                    { sender: 'bot', content: 'Absolutely! Homesickness is very normal, especially in the first semester. Many students experience it. Have you been able to make friends or join any clubs?', timestamp: daysAgo(16, 19) },
                    { sender: 'user', content: 'I joined the photography club last week. It\'s nice but I still feel out of place sometimes.', timestamp: daysAgo(16, 19) },
                    { sender: 'bot', content: 'That\'s a great step! Give it some time — belonging builds gradually. Maybe try calling your family on a regular schedule so you have that comfort while still building your new social circle.', timestamp: daysAgo(16, 19) }
                ],
                timestamp: daysAgo(16, 19)
            }
        ];

        // Ethan — moderate stress, 2 sessions
        const ethanScreenings = [
            { userId: ethan._id, testType: 'PHQ9', answers: [2,1,2,1,2,1,1,2,1], score: 13, severity: 'moderate', completedAt: daysAgo(18) },
            { userId: ethan._id, testType: 'GAD7', answers: [2,2,2,1,1,2,1], score: 11, severity: 'moderate', completedAt: daysAgo(12) },
            { userId: ethan._id, testType: 'PHQ9', answers: [1,1,1,1,1,0,1,1,0], score: 7, severity: 'mild', completedAt: daysAgo(6) },
        ];

        const ethanAppointments = [
            { studentId: ethan._id, counsellorId: counsellor._id, slotTime: daysAgo(16, 10), status: 'completed', notes: 'Student experiencing relationship issues affecting academic focus. Discussed healthy boundaries.', isEmergency: false, createdAt: daysAgo(17) },
            { studentId: ethan._id, counsellorId: counsellor._id, slotTime: daysAgo(8, 14), status: 'completed', notes: 'Student resolved relationship conflict. Discussed maintaining emotional balance alongside studies.', isEmergency: false, createdAt: daysAgo(9) },
        ];

        const ethanChatLogs = [
            {
                userId: ethan._id, riskLevel: 'medium',
                summary: 'Student dealing with relationship issues affecting academics.',
                messages: [
                    { sender: 'user', content: 'I had a big fight with my best friend and now I can\'t concentrate on anything.', timestamp: daysAgo(18, 20) },
                    { sender: 'bot', content: 'I\'m sorry to hear that. Conflicts with close friends can be very distressing. Would you like to talk about what happened?', timestamp: daysAgo(18, 20) },
                    { sender: 'user', content: 'We had a misunderstanding about a group project and it escalated badly. Now we\'re not talking.', timestamp: daysAgo(18, 20) },
                    { sender: 'bot', content: 'That sounds painful. Misunderstandings happen, especially under academic pressure. It might help to speak with our counsellor about communication strategies to navigate this. Would you be open to that?', timestamp: daysAgo(18, 20) },
                    { sender: 'user', content: 'Yeah, maybe that would help. I don\'t want to lose this friendship.', timestamp: daysAgo(18, 20) },
                    { sender: 'bot', content: 'That\'s a healthy perspective. I\'ll recommend booking a session. In the meantime, try writing down your feelings — it can help clarify what you want to say when you\'re ready to talk to your friend.', timestamp: daysAgo(18, 20) }
                ],
                timestamp: daysAgo(18, 20)
            }
        ];

        // Fiona — moderate, recent crisis
        const fionaScreenings = [
            { userId: fiona._id, testType: 'GAD7', answers: [2,2,2,2,1,2,2], score: 13, severity: 'moderate', completedAt: daysAgo(10) },
            { userId: fiona._id, testType: 'PHQ9', answers: [3,2,2,2,3,2,2,3,2], score: 21, severity: 'severe', completedAt: daysAgo(4) },
        ];

        const fionaAppointments = [
            { studentId: fiona._id, counsellorId: counsellor._id, slotTime: daysAgo(3, 10), status: 'completed', notes: 'Emergency session. Student under extreme pressure from lab deadlines. Expressed feelings of worthlessness. Created safety plan and coping strategies.', isEmergency: true, createdAt: daysAgo(4) },
            { studentId: fiona._id, counsellorId: counsellor._id, slotTime: daysAgo(0, 14), status: 'approved', notes: '', isEmergency: false, createdAt: daysAgo(1) },
        ];

        const fionaChatLogs = [
            {
                userId: fiona._id, riskLevel: 'high',
                summary: 'Student experiencing severe stress from lab deadlines and expressing feelings of worthlessness.',
                messages: [
                    { sender: 'user', content: 'I have 3 lab reports due this week and I haven\'t started any. I feel so worthless.', timestamp: daysAgo(5, 23) },
                    { sender: 'bot', content: 'I can hear that you\'re under a lot of pressure. First, you are NOT worthless — you\'re a student working hard in a demanding field. Lab deadlines are stressful but they\'re manageable with the right support.', timestamp: daysAgo(5, 23) },
                    { sender: 'user', content: 'I don\'t even know why I chose engineering. I\'m not good enough for this.', timestamp: daysAgo(5, 23) },
                    { sender: 'bot', content: 'Those feelings of self-doubt are very common in rigorous programs. I want to recommend that you speak with Dr. Peterson as soon as possible. She can help you work through these feelings. Shall I flag this for an urgent appointment?', timestamp: daysAgo(5, 23) },
                    { sender: 'user', content: 'Yes please. I really need help.', timestamp: daysAgo(5, 23) },
                    { sender: 'bot', content: 'Done. I\'ve marked this as urgent. Remember: reaching out for help is a brave step. You\'re going to get through this. If you need immediate support, the campus helpline is available 24/7.', timestamp: daysAgo(5, 23) }
                ],
                timestamp: daysAgo(5, 23)
            }
        ];

        // ============================================================
        // 4. INSERT ALL DATA
        // ============================================================
        console.log('\n--- Inserting all screenings ---');
        await Screening.create([
            ...aliceScreenings,
            ...bobScreenings,
            ...charlieScreenings,
            ...dianaScreenings,
            ...ethanScreenings,
            ...fionaScreenings
        ]);
        console.log(`  Inserted ${aliceScreenings.length + bobScreenings.length + charlieScreenings.length + dianaScreenings.length + ethanScreenings.length + fionaScreenings.length} screening records.`);

        console.log('\n--- Inserting all appointments ---');
        await Appointment.create([
            ...aliceAppointments,
            ...bobAppointments,
            ...charlieAppointments,
            ...dianaAppointments,
            ...ethanAppointments,
            ...fionaAppointments
        ]);
        console.log(`  Inserted ${aliceAppointments.length + bobAppointments.length + charlieAppointments.length + dianaAppointments.length + ethanAppointments.length + fionaAppointments.length} appointment records.`);

        console.log('\n--- Inserting all chat logs ---');
        await ChatLog.create([
            ...aliceChatLogs,
            ...bobChatLogs,
            ...charlieChatLogs,
            ...dianaChatLogs,
            ...ethanChatLogs,
            ...fionaChatLogs
        ]);
        console.log(`  Inserted ${aliceChatLogs.length + bobChatLogs.length + charlieChatLogs.length + dianaChatLogs.length + ethanChatLogs.length + fionaChatLogs.length} chat log records.`);

        // ============================================================
        // 5. COUNSELLOR AVAILABILITY & SLOTS
        // ============================================================
        console.log('\n--- Creating counsellor availability ---');
        await CounsellorAvailability.create({
            counsellorId: counsellor._id,
            weeklySchedule: [
                { day: 'Monday',    startTime: '09:00', endTime: '12:00', isRecurring: true },
                { day: 'Monday',    startTime: '14:00', endTime: '17:00', isRecurring: true },
                { day: 'Tuesday',   startTime: '10:00', endTime: '13:00', isRecurring: true },
                { day: 'Wednesday', startTime: '09:00', endTime: '12:00', isRecurring: true },
                { day: 'Wednesday', startTime: '14:00', endTime: '16:00', isRecurring: true },
                { day: 'Thursday',  startTime: '10:00', endTime: '13:00', isRecurring: true },
                { day: 'Friday',    startTime: '09:00', endTime: '11:00', isRecurring: true },
            ],
            blockedDates: []
        });

        // Create some upcoming slots
        const upcomingSlots = [];
        for (let i = 1; i <= 7; i++) {
            const slotDate = new Date();
            slotDate.setDate(slotDate.getDate() + i);
            slotDate.setHours(0, 0, 0, 0);
            // 3 slots per day
            upcomingSlots.push(
                { counsellorId: counsellor._id, date: slotDate, startTime: '09:00', endTime: '10:00', isBooked: false },
                { counsellorId: counsellor._id, date: slotDate, startTime: '11:00', endTime: '12:00', isBooked: false },
                { counsellorId: counsellor._id, date: slotDate, startTime: '14:00', endTime: '15:00', isBooked: false }
            );
        }
        await CounsellorSlot.create(upcomingSlots);
        console.log(`  Created ${upcomingSlots.length} upcoming appointment slots.`);

        // ============================================================
        // 6. FORUM POSTS (Student Community)
        // ============================================================
        console.log('\n--- Creating forum posts ---');
        await ForumPost.create([
            {
                authorId: alice._id,
                title: 'How I Overcame Exam Anxiety — My Journey',
                content: 'A month ago, I was at my lowest point. I couldn\'t study, couldn\'t sleep, and felt completely hopeless about exams. But with help from the campus counsellor and some CBT techniques, I\'ve turned things around. Here are some tips that worked for me:\n\n1. Break study sessions into 25-minute blocks\n2. Practice deep breathing before and during study\n3. Use a study journal to track progress\n4. Don\'t be afraid to ask for professional help\n\nIf you\'re struggling, please reach out. It really does get better.',
                tags: ['exam-stress', 'anxiety', 'recovery', 'study-tips'],
                category: 'Sharing Experience',
                mood: 'happy',
                urgency: 'low',
                isAnonymous: false,
                upvotes: [bob._id, charlie._id, diana._id, ethan._id, fiona._id],
                comments: [
                    { authorId: bob._id, content: 'Thank you for sharing this! I\'m going through something similar and this gives me hope.', createdAt: daysAgo(2) },
                    { authorId: diana._id, content: 'The 25-minute study block technique really works! I started using it last week.', createdAt: daysAgo(1) },
                    { authorId: ethan._id, content: 'So inspiring. It takes courage to share your story. ❤️', createdAt: daysAgo(1) }
                ],
                createdAt: daysAgo(3)
            },
            {
                authorId: bob._id,
                title: 'Feeling like I don\'t belong in engineering',
                content: 'Everyone in my class seems to understand concepts so easily while I struggle. I spend double the time on assignments and still get average grades. Am I the only one who feels this way?',
                tags: ['imposter-syndrome', 'engineering', 'academics'],
                category: 'Seeking Support',
                mood: 'sad',
                urgency: 'medium',
                isAnonymous: true,
                upvotes: [alice._id, charlie._id, fiona._id],
                comments: [
                    { authorId: fiona._id, content: 'You\'re definitely not alone! I\'m in electrical engineering and I feel the same way sometimes. We should form a study group!', createdAt: daysAgo(10) },
                    { authorId: alice._id, content: 'Trust me, everyone struggles — some just hide it better. You belong here. 💪', createdAt: daysAgo(9) }
                ],
                createdAt: daysAgo(12)
            },
            {
                authorId: ethan._id,
                title: 'Tips for managing stress during placement season?',
                content: 'Placement season is coming up and I can already feel the tension building. How do you all cope with the pressure of interviews, rejections, and comparing yourself to others who are getting placed?',
                tags: ['placements', 'stress', 'career'],
                category: 'Tips & Advice',
                mood: 'anxious',
                urgency: 'medium',
                isAnonymous: false,
                upvotes: [charlie._id, bob._id],
                comments: [
                    { authorId: charlie._id, content: 'I was in the same boat. What helped me was focusing on one application at a time and not checking social media during placement week.', createdAt: daysAgo(5) },
                    { authorId: alice._id, content: 'Meditation and exercise helped me a lot during stressful times. Even a 15-minute walk can clear your head.', createdAt: daysAgo(4) }
                ],
                createdAt: daysAgo(7)
            },
            {
                authorId: diana._id,
                title: 'First-year struggles — missing home terribly',
                content: 'It\'s been over a month and I still cry at night missing my family. I know it\'s supposed to get better but when? I have friends here but it\'s not the same. Any seniors have advice?',
                tags: ['homesickness', 'first-year', 'loneliness'],
                category: 'Vent/Rant',
                mood: 'sad',
                urgency: 'low',
                isAnonymous: true,
                upvotes: [alice._id, ethan._id],
                comments: [
                    { authorId: alice._id, content: 'I remember feeling the exact same way in my first year. It does get better, I promise. Try to establish a routine — it helped me feel more grounded.', createdAt: daysAgo(13) },
                    { authorId: bob._id, content: 'Have you tried joining a club? I joined the sports club and it really helped me feel like part of a community.', createdAt: daysAgo(12) }
                ],
                createdAt: daysAgo(14)
            },
            {
                authorId: fiona._id,
                title: 'Resources for dealing with academic burnout',
                content: 'I recently went through severe burnout and wanted to share some resources that helped me:\n\n- MannSparsh AI chatbot (it\'s available 24/7!)\n- Campus counselling — don\'t hesitate to book a session\n- Headspace app for guided meditation\n- "Burnout" by Emily Nagoski (great book)\n- YouTube: "The School of Life" channel\n\nTake care of yourselves! 🌟',
                tags: ['resources', 'burnout', 'self-care', 'mental-health'],
                category: 'Resources',
                mood: 'neutral',
                urgency: 'low',
                isAnonymous: false,
                upvotes: [alice._id, bob._id, charlie._id, diana._id, ethan._id],
                comments: [
                    { authorId: diana._id, content: 'Thank you so much for this list! I\'m going to check out all of these.', createdAt: daysAgo(1) }
                ],
                createdAt: daysAgo(2)
            }
        ]);
        console.log('  Created 5 forum posts with comments and upvotes.');

        // ============================================================
        // 7. COUNSELLOR FORUM POSTS (Professional Insights)
        // ============================================================
        console.log('\n--- Creating counsellor forum posts ---');
        await CounsellorForum.create([
            {
                authorId: counsellor._id,
                title: 'Trend Alert: Rising Academic Burnout Cases This Semester',
                content: 'Over the past 4 weeks, I\'ve noticed a significant increase in students presenting with academic burnout symptoms. Key observations:\n\n1. 60% of new cases are from STEM departments (CS, Engineering)\n2. 3rd and 4th year students are disproportionately affected\n3. Common triggers: project deadlines, placement pressure, sleep deprivation\n4. CBT combined with mindfulness has shown the best recovery rates\n\nI recommend we consider organizing department-level stress management workshops, especially in Computer Science and Engineering departments.\n\nHas anyone else observed similar trends?',
                category: 'case-study',
                tags: ['burnout', 'academic-stress', 'trends', 'STEM'],
                isPinned: true,
                comments: [],
                upvotes: [],
                createdAt: daysAgo(5)
            },
            {
                authorId: counsellor._id,
                title: 'Best Practices: Emergency Session Protocol for High-Risk Students',
                content: 'Based on recent high-risk cases, I want to share our updated emergency session protocol:\n\n**Step 1: Immediate Assessment**\n- Use the PHQ-9 for depression screening\n- Assess for safety concerns\n- Determine if the student needs immediate intervention\n\n**Step 2: Safety Planning**\n- Create a written safety plan with the student\n- Identify support network (friends, family, helpline numbers)\n- Schedule follow-up within 48 hours\n\n**Step 3: Follow-Up**\n- Check in via secure message within 24 hours\n- Review and adjust coping strategies\n- Coordinate with academic department if needed\n\nThis protocol has been effective in the 3 emergency cases I\'ve handled this month.',
                category: 'best-practice',
                tags: ['emergency', 'protocol', 'high-risk', 'safety-planning'],
                isPinned: true,
                comments: [],
                upvotes: [],
                createdAt: daysAgo(10)
            },
            {
                authorId: counsellor._id,
                title: 'Effective CBT Techniques for Student Anxiety — What\'s Working',
                content: 'Sharing some CBT techniques that have shown strong results with our student population:\n\n1. **Cognitive Restructuring**: Helping students identify and challenge negative thought patterns about exams and performance\n2. **Behavioral Activation**: Scheduling small, pleasurable activities to counteract withdrawal\n3. **Exposure Hierarchy**: Gradually exposing students to anxiety-triggering situations (presentations, social interactions)\n4. **Thought Records**: Daily journaling exercise to track automatic thoughts\n\nI\'ve seen significant improvement in 5 out of 6 students who consistently practiced these techniques over 3-4 weeks. The key is consistency and combining these with mindfulness exercises.',
                category: 'resource',
                tags: ['CBT', 'anxiety', 'techniques', 'therapy'],
                isPinned: false,
                comments: [],
                upvotes: [],
                createdAt: daysAgo(15)
            },
            {
                authorId: counsellor._id,
                title: 'Discussion: Should We Introduce Peer Counsellor Training?',
                content: 'Given the growing demand for mental health support, I\'d like to discuss the possibility of introducing a peer counsellor training program. Benefits:\n\n- Reduced wait times for initial consultations\n- Peer support is often the first step for students who are hesitant to see a professional\n- Trained peer counsellors can handle low-risk cases and refer higher-risk students\n- Creates a culture of mental health awareness on campus\n\nI believe this could complement our existing services. What are your thoughts?',
                category: 'discussion',
                tags: ['peer-counselling', 'training', 'campus-mental-health'],
                isPinned: false,
                comments: [],
                upvotes: [],
                createdAt: daysAgo(8)
            }
        ]);
        console.log('  Created 4 counsellor forum posts.');

        // ============================================================
        // SUMMARY
        // ============================================================
        console.log('\n========================================');
        console.log('  DATABASE SEEDING COMPLETE!');
        console.log('========================================');
        console.log('\n  LOGIN CREDENTIALS:');
        console.log('  ─────────────────────────────────────');
        console.log('  Counsellor:  counsellor@test.com / password123');
        console.log('  ─────────────────────────────────────');
        console.log('  Student 1 (POWER USER - 8 sessions):');
        console.log('    alice@test.com / password123');
        console.log('  Student 2:  bob@test.com / password123');
        console.log('  Student 3:  charlie@test.com / password123');
        console.log('  Student 4:  diana@test.com / password123');
        console.log('  Student 5:  ethan@test.com / password123');
        console.log('  Student 6:  fiona@test.com / password123');
        console.log('  ─────────────────────────────────────');
        console.log('\n  DATA SUMMARY:');
        console.log('  • 1 Counsellor + 6 Students');
        console.log('  • 22 Screening records (PHQ9 + GAD7)');
        console.log('  • 18 Appointments (Alice has 8 sessions!)');
        console.log('  • 8 AI Chat logs with realistic conversations');
        console.log('  • 5 Student forum posts with comments');
        console.log('  • 4 Counsellor forum posts (insights/analytics)');
        console.log('  • 21 Upcoming appointment slots');
        console.log('  • Counsellor weekly availability set');
        console.log('\n  DEMO HIGHLIGHTS:');
        console.log('  • Alice shows FULL RECOVERY JOURNEY (severe → minimal)');
        console.log('  • Charlie & Fiona are HIGH-RISK students');
        console.log('  • Analytics will show data across departments');
        console.log('  • Forum has realistic peer support conversations');
        console.log('========================================\n');

    } catch (err) {
        console.error('Error seeding database:', err);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB.');
    }
};

seedDatabase();
