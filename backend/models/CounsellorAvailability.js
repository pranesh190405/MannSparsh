const mongoose = require('mongoose');

const timeSlotSchema = new mongoose.Schema({
    day: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        required: true
    },
    startTime: {
        type: String,
        required: true,
        match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
    },
    endTime: {
        type: String,
        required: true,
        match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
    },
    isRecurring: {
        type: Boolean,
        default: true
    }
});

const counsellorAvailabilitySchema = new mongoose.Schema({
    counsellorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    weeklySchedule: [timeSlotSchema],
    blockedDates: [{
        date: Date,
        reason: String
    }],
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update timestamp on save
counsellorAvailabilitySchema.pre('save', function () {
    this.updatedAt = Date.now();
});

module.exports = mongoose.model('CounsellorAvailability', counsellorAvailabilitySchema);
