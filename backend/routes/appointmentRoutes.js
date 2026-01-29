const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { bookAppointment, getAppointments, updateAppointmentStatus } = require('../controllers/appointmentController');

router.route('/')
    .post(protect, bookAppointment)
    .get(protect, getAppointments);

router.route('/:id')
    .put(protect, updateAppointmentStatus);

module.exports = router;
