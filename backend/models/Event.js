const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Event description is required'],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, 'Event date is required'],
    },
    time: {
      type: String,
      required: [true, 'Event time is required'],
    },
    location: {
      type: String,
      required: [true, 'Event location is required'],
      trim: true,
    },
    capacity: {
      type: Number,
      required: [true, 'Seat capacity is required'],
      min: [1, 'Capacity must be at least 1'],
    },
    category: {
      type: String,
      enum: ['Workshop', 'Seminar', 'Hackathon', 'Conference', 'Webinar', 'Other'],
      default: 'Workshop',
    },
    imageUrl: {
      type: String,
      default: '',
    },
    registeredCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', eventSchema);
