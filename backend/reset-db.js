const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Load models
const User = require('./models/User');
const Screening = require('./models/Screening');
const Appointment = require('./models/Appointment');
const ChatLog = require('./models/ChatLog');
const CounsellorSlot = require('./models/CounsellorSlot');
const ForumPost = require('./models/ForumPost');
const CounsellorForum = require('./models/CounsellorForum');

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/mannsparsh';

const seedDatabase = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(mongoURI);
        console.log('Connected to MongoDB.');

        // Clear existing data
        console.log('Clearing database...');
        await User.deleteMany({});
        await Screening.deleteMany({});
        await Appointment.deleteMany({});
        await ChatLog.deleteMany({});
        await CounsellorSlot.deleteMany({});
        await ForumPost.deleteMany({});
        await CounsellorForum.deleteMany({});
        console.log('Database cleared.');

        // Create Student User (original)
        console.log('Creating Student users...');
        const student1 = await User.create({
            name: 'Alice Johnson', universityId: 'STU001', email: 'alice@test.com', passwordHash: 'password123',
            role: 'student', department: 'Computer Science', year: '3rd Year', isVerified: true
        });
        const student2 = await User.create({
            name: 'Bob Smith', universityId: 'STU002', email: 'bob@test.com', passwordHash: 'password123',
            role: 'student', department: 'Mechanical Engineering', year: '2nd Year', isVerified: true
        });
        const student3 = await User.create({
            name: 'Charlie Davis', universityId: 'STU003', email: 'charlie@test.com', passwordHash: 'password123',
            role: 'student', department: 'Computer Science', year: '4th Year', isVerified: true
        });
        const student4 = await User.create({
            name: 'Diana Evans', universityId: 'STU004', email: 'diana@test.com', passwordHash: 'password123',
            role: 'student', department: 'Business', year: '1st Year', isVerified: true
        });
        console.log(`Main Student created: Email: ${student1.email}, Password: password123`);

        // Create Counsellor User
        console.log('Creating Counsellor user...');
        const counsellor = await User.create({
            name: 'Dr. Sarah Peterson',
            universityId: 'CUN001',
            email: 'counsellor@test.com',
            passwordHash: 'password123',
            role: 'counsellor',
            specialization: 'general',
            credentials: 'Ph.D. in Clinical Psychology, Licensed Therapist',
            bio: 'Experienced counsellor helping students with academic and personal growth.',
            rating: 4.8,
            totalSessions: 45,
            isVerified: true
        });
        const counsellor2 = await User.create({
            name: 'Mr. David Lee', universityId: 'CUN002', email: 'david@test.com', passwordHash: 'password123',
            role: 'counsellor', specialization: 'academic', credentials: 'M.S. Counseling', isVerified: true
        });
        console.log(`Main Counsellor created: Email: ${counsellor.email}, Password: password123`);

        console.log('Adding robust sample data for reports...');

        // Random Date generator (past 30 days)
        const getRandomPastDate = (days) => new Date(Date.now() - Math.floor(Math.random() * days) * 86400000);

        // 1. Add Screenings (Populates Mental Health Report & Screenings Over Time)
        const screenings = [];
        const severities = ['minimal', 'mild', 'moderate', 'severe'];
        const testTypes = ['PHQ9', 'GAD7'];
        const allStudents = [student1, student2, student3, student4];

        for (let i = 0; i < 40; i++) {
            const randomStudent = allStudents[Math.floor(Math.random() * allStudents.length)];
            const randomSeverity = severities[Math.floor(Math.random() * severities.length)];
            screenings.push({
                userId: randomStudent._id,
                testType: testTypes[Math.floor(Math.random() * testTypes.length)],
                answers: [1, 2, 3],
                score: Math.floor(Math.random() * 20),
                severity: randomSeverity,
                completedAt: getRandomPastDate(30)
            });
        }
        // Force a few more recents for the trend chart
        screenings.push({ userId: student2._id, testType: 'PHQ9', answers: [3, 3, 3], score: 18, severity: 'severe', completedAt: getRandomPastDate(2) });
        screenings.push({ userId: student1._id, testType: 'GAD7', answers: [3, 3, 3], score: 15, severity: 'severe', completedAt: getRandomPastDate(1) });
        await Screening.create(screenings);

        // 2. Add High-Risk Chats (Populates High-Risk List and Department Heatmap)
        await ChatLog.create([
            { userId: student1._id, riskLevel: 'high', summary: 'Severe academic burnout.', messages: [], timestamp: getRandomPastDate(5) },
            { userId: student3._id, riskLevel: 'high', summary: 'Financial stress anxiety.', messages: [], timestamp: getRandomPastDate(2) },
            { userId: student3._id, riskLevel: 'high', summary: 'Exams anxiety peak.', messages: [], timestamp: getRandomPastDate(10) },
            { userId: student4._id, riskLevel: 'high', summary: 'Social isolation expressions.', messages: [], timestamp: getRandomPastDate(1) }
        ]);

        // 3. Add Appointments (Populates Utilization Chart)
        const appointments = [];
        const statuses = ['completed', 'pending', 'approved', 'cancelled'];

        for (let i = 0; i < 25; i++) {
            const randomStudent = allStudents[Math.floor(Math.random() * allStudents.length)];
            const status = statuses[Math.floor(Math.random() * statuses.length)];
            appointments.push({
                studentId: randomStudent._id,
                counsellorId: counsellor._id,
                slotTime: getRandomPastDate(15),
                status: status,
                isEmergency: Math.random() > 0.8 // 20% chance of emergency
            });
        }
        await Appointment.create(appointments);
        console.log('Sample data added.');

        console.log('Seeding completed successfully!');
    } catch (err) {
        console.error('Error seeding database:', err);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB.');
    }
};

seedDatabase();
