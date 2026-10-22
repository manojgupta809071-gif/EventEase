const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const Registration = require('../models/Registration');

// GET all events (sorted by date ascending)
router.get('/', async (req, res, next) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json({ success: true, data: events });
  } catch (err) {
    next(err);
  }
});

// GET single event
router.get('/:id', async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    res.json({ success: true, data: event });
  } catch (err) {
    next(err);
  }
});

// POST create event
router.post('/', async (req, res, next) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json({ success: true, data: event, message: 'Event created successfully' });
  } catch (err) {
    next(err);
  }
});

// PUT update event
router.put('/:id', async (req, res, next) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    res.json({ success: true, data: event, message: 'Event updated successfully' });
  } catch (err) {
    next(err);
  }
});

// DELETE event (and its registrations)
router.delete('/:id', async (req, res, next) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    await Registration.deleteMany({ eventId: req.params.id });
    res.json({ success: true, message: 'Event and all registrations deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
