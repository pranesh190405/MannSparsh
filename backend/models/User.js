const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['student', 'counsellor'],
        default: 'student'
    },
    // fields for students
    department: {
        type: String
    },
    year: {
        type: String
    },
    // fields for counsellors
    specialisation: {
        type: String
    },
    isVerified: {
        type: Boolean,
        default: true // Always true now as Admin is removed
    },
    date: {
        type: Date,
        default: Date.now
    }
});

// Password hashing middleware
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

module.exports = mongoose.model('User', UserSchema);
