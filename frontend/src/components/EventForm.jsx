import React, { useState, useEffect } from 'react';

const CATEGORIES = ['Workshop', 'Seminar', 'Hackathon', 'Conference', 'Webinar', 'Other'];

function validate(form) {
  const errors = {};
  if (!form.title.trim()) errors.title = 'Title is required';
  if (!form.description.trim()) errors.description = 'Description is required';
  if (!form.date) errors.date = 'Date is required';
  if (!form.time) errors.time = 'Time is required';
  if (!form.location.trim()) errors.location = 'Location is required';
  if (!form.capacity || form.capacity < 1) errors.capacity = 'Capacity must be at least 1';
  return errors;
}

export default function EventForm({ existing, onSave, onClose }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    capacity: '',
    category: 'Workshop',
    imageUrl: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    if (existing) {
      const d = new Date(existing.date);
      const dateStr = d.toISOString().split('T')[0];
      setForm({
        title: existing.title || '',
        description: existing.description || '',
        date: dateStr,
        time: existing.time || '',
        location: existing.location || '',
        capacity: existing.capacity || '',
        category: existing.category || 'Workshop',
        imageUrl: existing.imageUrl || '',
      });
    }
  }, [existing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    setServerError('');
    try {
      await onSave({ ...form, capacity: Number(form.capacity) });
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to save event.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {serverError && <div className="alert alert-error">❌ {serverError}</div>}

      <div className="form-row">
        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label className="form-label">Event Title <span>*</span></label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className={`form-control ${errors.title ? 'error' : ''}`}
            placeholder="e.g. React.js Workshop 2024"
          />
          {errors.title && <p className="form-error">{errors.title}</p>}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Description <span>*</span></label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className={`form-control ${errors.description ? 'error' : ''}`}
          rows={4}
          placeholder="Describe the event, what attendees will learn, prerequisites, etc."
        />
        {errors.description && <p className="form-error">{errors.description}</p>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Date <span>*</span></label>
          <input
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
            className={`form-control ${errors.date ? 'error' : ''}`}
          />
          {errors.date && <p className="form-error">{errors.date}</p>}
        </div>
        <div className="form-group">
          <label className="form-label">Time <span>*</span></label>
          <input
            name="time"
            type="time"
            value={form.time}
            onChange={handleChange}
            className={`form-control ${errors.time ? 'error' : ''}`}
          />
          {errors.time && <p className="form-error">{errors.time}</p>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Location <span>*</span></label>
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            className={`form-control ${errors.location ? 'error' : ''}`}
            placeholder="e.g. Seminar Hall A, Block 3"
          />
          {errors.location && <p className="form-error">{errors.location}</p>}
        </div>
        <div className="form-group">
          <label className="form-label">Seat Capacity <span>*</span></label>
          <input
            name="capacity"
            type="number"
            min={1}
            value={form.capacity}
            onChange={handleChange}
            className={`form-control ${errors.capacity ? 'error' : ''}`}
            placeholder="e.g. 100"
          />
          {errors.capacity && <p className="form-error">{errors.capacity}</p>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Category</label>
          <select name="category" value={form.category} onChange={handleChange} className="form-control">
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Image URL (optional)</label>
          <input
            name="imageUrl"
            value={form.imageUrl}
            onChange={handleChange}
            className="form-control"
            placeholder="https://..."
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
        <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving…' : existing ? '✏️ Update Event' : '✅ Create Event'}
        </button>
      </div>
    </form>
  );
}
