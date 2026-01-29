const Appointment = require('../models/Appointment');
const User = require('../models/User');

// @desc    Book a new appointment
// @route   POST /api/appointments
// @access  Private (Student)
const bookAppointment = async (req, res) => {
    const { counsellorId, date, timeSlot, mode } = req.body;

    try {
        const appointment = await Appointment.create({
            student: req.user.id,
            counsellor: counsellorId,
            date,
            timeSlot,
            mode: mode || 'online',
        });

        res.status(201).json(appointment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get appointments for the logged-in user
// @route   GET /api/appointments
// @access  Private
const getAppointments = async (req, res) => {
    try {
        let appointments;
        if (req.user.role === 'student') {
            appointments = await Appointment.find({ student: req.user.id })
                .populate('counsellor', 'name email specialisation')
                .sort({ date: 1 });
        } else if (req.user.role === 'counsellor') {
            appointments = await Appointment.find({ counsellor: req.user.id })
                .populate('student', 'name email department year')
                .sort({ date: 1 });
        } else {
            appointments = [];
        }
        res.json(appointments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update appointment status (Approve/Reject)
// @route   PUT /api/appointments/:id
// @access  Private (Counsellor)
const updateAppointmentStatus = async (req, res) => {
    const { status, meetLink } = req.body; // status: 'confirmed', 'cancelled'

    try {
        let appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // Ensure only the assigned counsellor can update
        console.log('Appt Counsellor:', appointment.counsellor.toString());
        // Ensure only the assigned counsellor can update
        console.log('Appt Counsellor:', appointment.counsellor.toString());
        console.log('User ID:', req.user.id);

        if (appointment.counsellor.toString() !== req.user.id) {
            return res.status(401).json({
                message: `Not authorized. Appt: ${appointment.counsellor.toString()}, User: ${req.user.id}`
            });
        }

        appointment.status = status;
        if (meetLink) {
            appointment.meetLink = meetLink;
        }

        // Mock meet link for MVP if confirmed and not provided
        if (status === 'confirmed' && !appointment.meetLink) {
            const roomId = `campusmind-${appointment._id}`;
            appointment.meetLink = `/video-call?room=${roomId}`;
        }

        await appointment.save();
        res.json(appointment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    bookAppointment,
    getAppointments,
    updateAppointmentStatus
};
