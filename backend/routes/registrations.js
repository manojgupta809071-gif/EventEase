const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration');
const Event = require('../models/Event');

// GET registrations for an event
router.get('/', async (req, res, next) => {
  try {
    const { eventId } = req.query;
    if (!eventId) return res.status(400).json({ success: false, message: 'eventId query param required' });
    const registrations = await Registration.find({ eventId }).sort({ createdAt: -1 });
    res.json({ success: true, data: registrations });
  } catch (err) {
    next(err);
  }
});

// POST register for an event
router.post('/', async (req, res, next) => {
  try {
    const { eventId, name, email, phone, college, year } = req.body;

    // 1. Check event exists
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

    // 2. Check seat availability
    if (event.registeredCount >= event.capacity) {
      return res.status(400).json({ success: false, message: 'Sorry, this event is fully booked!' });
    }

    // 3. Create registration (unique index handles duplicates)
    const registration = await Registration.create({ eventId, name, email, phone, college, year });

    // 4. Increment registered count
    await Event.findByIdAndUpdate(eventId, { $inc: { registeredCount: 1 } });

    res.status(201).json({
      success: true,
      data: registration,
      message: `🎉 You're registered for ${event.title}!`,
    });
  } catch (err) {
    // Duplicate key error (email already registered for this event)
    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'This email is already registered for this event.',
      });
    }
    next(err);
  }
});

// DELETE a registration
router.delete('/:id', async (req, res, next) => {
  try {
    const reg = await Registration.findByIdAndDelete(req.params.id);
    if (!reg) return res.status(404).json({ success: false, message: 'Registration not found' });
    // Decrement count
    await Event.findByIdAndUpdate(reg.eventId, { $inc: { registeredCount: -1 } });
    res.json({ success: true, message: 'Registration removed' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
