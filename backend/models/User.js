const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    universityId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
    },
    passwordHash: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['student', 'counsellor', 'admin', 'peer'],
        default: 'student'
    },
    department: String,
    year: String,
    // Counsellor-specific fields
    specialization: {
        type: String,
        enum: ['anxiety', 'depression', 'stress', 'relationships', 'academic', 'general'],
        required: function () { return this.role === 'counsellor'; }
    },
    bio: {
        type: String,
        maxlength: 500
    },
    credentials: {
        type: String,
        maxlength: 200
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    totalSessions: {
        type: Number,
        default: 0
    },
    isApproved: {
        type: Boolean,
        default: function () { return this.role !== 'counsellor'; }
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Hash password before saving
userSchema.pre('save', async function () {
    if (!this.isModified('passwordHash')) return;
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.passwordHash);
};

module.exports = mongoose.model('User', userSchema);
