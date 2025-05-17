require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const cron = require('node-cron');
const { body, validationResult } = require('express-validator');
const winston = require('winston');

// Initialize logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}

// Initialize database connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

// Validation middleware
const validateAppointment = [
    body('doctor_id').isInt(),
    body('clinic_id').isInt(),
    body('appointment_date').isDate(),
    body('start_time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    body('end_time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
];

// Routes
// Get available time slots for a doctor on a specific date
app.get('/api/bookings/slots/:doctorId/:date', verifyToken, async (req, res) => {
    try {
        const { doctorId, date } = req.params;
        const dayOfWeek = moment(date).day();

        // Get doctor's schedule for the day
        const scheduleResult = await pool.query(
            'SELECT * FROM schedules WHERE doctor_id = $1 AND day_of_week = $2',
            [doctorId, dayOfWeek]
        );

        if (scheduleResult.rows.length === 0) {
            return res.json({ slots: [] });
        }

        const schedule = scheduleResult.rows[0];
        const slots = [];
        const startTime = moment(schedule.start_time, 'HH:mm');
        const endTime = moment(schedule.end_time, 'HH:mm');
        const slotDuration = schedule.slot_duration;

        // Get existing appointments for the date
        const appointmentsResult = await pool.query(
            'SELECT start_time, end_time FROM appointments WHERE doctor_id = $1 AND appointment_date = $2 AND status != $3',
            [doctorId, date, 'cancelled']
        );

        const bookedSlots = appointmentsResult.rows.map(apt => ({
            start: moment(apt.start_time, 'HH:mm'),
            end: moment(apt.end_time, 'HH:mm')
        }));

        // Generate available slots
        let currentSlot = startTime.clone();
        while (currentSlot.add(slotDuration, 'minutes').isBefore(endTime)) {
            const slotStart = currentSlot.clone().subtract(slotDuration, 'minutes');
            const slotEnd = currentSlot.clone();

            // Check if slot overlaps with any booked appointments
            const isAvailable = !bookedSlots.some(booked =>
                (slotStart.isSameOrAfter(booked.start) && slotStart.isBefore(booked.end)) ||
                (slotEnd.isAfter(booked.start) && slotEnd.isSameOrBefore(booked.end))
            );

            if (isAvailable) {
                slots.push({
                    start_time: slotStart.format('HH:mm'),
                    end_time: slotEnd.format('HH:mm')
                });
            }
        }

        res.json({ slots });
    } catch (error) {
        logger.error('Error getting available slots:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Book an appointment
app.post('/api/bookings', verifyToken, validateAppointment, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { doctor_id, clinic_id, appointment_date, start_time, end_time } = req.body;
        const patient_id = req.user.id;

        // Check if slot is available
        const slotCheck = await pool.query(
            'SELECT * FROM appointments WHERE doctor_id = $1 AND appointment_date = $2 AND start_time = $3 AND status != $4',
            [doctor_id, appointment_date, start_time, 'cancelled']
        );

        if (slotCheck.rows.length > 0) {
            return res.status(400).json({ message: 'This time slot is already booked' });
        }

        // Create appointment
        const result = await pool.query(
            'INSERT INTO appointments (patient_id, doctor_id, clinic_id, appointment_date, start_time, end_time, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [patient_id, doctor_id, clinic_id, appointment_date, start_time, end_time, 'scheduled']
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        logger.error('Error booking appointment:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get patient's appointments
app.get('/api/bookings/patient', verifyToken, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT a.*, d.specialization, c.name as clinic_name, u.name as doctor_name
       FROM appointments a
       JOIN doctors d ON a.doctor_id = d.id
       JOIN clinics c ON a.clinic_id = c.id
       JOIN users u ON d.user_id = u.id
       WHERE a.patient_id = $1
       ORDER BY a.appointment_date DESC, a.start_time DESC`,
            [req.user.id]
        );

        res.json(result.rows);
    } catch (error) {
        logger.error('Error getting patient appointments:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get doctor's appointments
app.get('/api/bookings/doctor', verifyToken, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT a.*, u.name as patient_name, c.name as clinic_name
       FROM appointments a
       JOIN users u ON a.patient_id = u.id
       JOIN clinics c ON a.clinic_id = c.id
       JOIN doctors d ON a.doctor_id = d.id
       WHERE d.user_id = $1
       ORDER BY a.appointment_date DESC, a.start_time DESC`,
            [req.user.id]
        );

        res.json(result.rows);
    } catch (error) {
        logger.error('Error getting doctor appointments:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update appointment status
app.patch('/api/bookings/:id/status', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['scheduled', 'completed', 'cancelled', 'no_show'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const result = await pool.query(
            'UPDATE appointments SET status = $1 WHERE id = $2 RETURNING *',
            [status, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        logger.error('Error updating appointment status:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Schedule reminder notifications
cron.schedule('0 20 * * *', async () => {
    try {
        const tomorrow = moment().add(1, 'days').format('YYYY-MM-DD');

        const result = await pool.query(
            `SELECT a.*, u.email, u.name as patient_name, d.specialization, c.name as clinic_name
       FROM appointments a
       JOIN users u ON a.patient_id = u.id
       JOIN doctors d ON a.doctor_id = d.id
       JOIN clinics c ON a.clinic_id = c.id
       WHERE a.appointment_date = $1 AND a.status = $2`,
            [tomorrow, 'scheduled']
        );

        // Here you would implement the actual notification sending logic
        // For example, sending emails or push notifications
        logger.info(`Sending reminders for ${result.rows.length} appointments tomorrow`);
    } catch (error) {
        logger.error('Error sending appointment reminders:', error);
    }
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    logger.info(`Booking service running on port ${PORT}`);
}); 