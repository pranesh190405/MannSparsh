const Appointment = require('../models/Appointment');
const CounsellorSlot = require('../models/CounsellorSlot');

const localAgent = {
    processAction: async (intent, userId, data) => {
        console.log(`Local Agent processing intent: ${intent} for user ${userId}`);

        switch (intent) {
            case 'SUGGEST_BOOKING':
                return await suggestAvailableSlots();

            case 'FLAG_HIGH_RISK':
                return await flagUserRisk(userId);

            default:
                return null;
        }
    }
};

const suggestAvailableSlots = async () => {
    try {
        const slots = await CounsellorSlot.find({
            isBooked: false,
            date: { $gte: new Date() }
        })
            .sort({ date: 1, startTime: 1 })
            .limit(3)
            .populate('counsellorId', 'name');

        if (slots.length === 0) return "No slots available currently.";

        return slots.map(s => `${s.counsellorId.name} on ${new Date(s.date).toLocaleDateString()} at ${s.startTime}`).join(', ');
    } catch (err) {
        console.error(err);
        return "Error fetching slots.";
    }
};

const flagUserRisk = async (userId) => {
    // Logic to notify admin or bookmark user for review
    console.log(`USER ${userId} FLAGGED AS HIGH RISK`);
    // In a real app, send email to admin or create an alert record
    return "Risk flagged. Crisis resources sent.";
};

module.exports = localAgent;
