const mongoose = require('mongoose');

const counsellorSlotSchema = new mongoose.Schema({
    counsellorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    startTime: {
        type: String, // Format: "HH:mm"
        required: true
    },
    endTime: {
        type: String, // Format: "HH:mm"
        required: true
    },
    isBooked: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('CounsellorSlot', counsellorSlotSchema);
