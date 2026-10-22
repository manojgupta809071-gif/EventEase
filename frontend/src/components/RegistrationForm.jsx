import React, { useState } from 'react';
import api from '../api/axios';

const YEAR_OPTIONS = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Other'];

function validate(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = 'Name is required';
  if (!form.email.trim()) errors.email = 'Email is required';
  else if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = 'Enter a valid email';
  if (!form.phone.trim()) errors.phone = 'Phone number is required';
  else if (!/^[0-9]{10}$/.test(form.phone)) errors.phone = 'Enter a valid 10-digit phone number';
  return errors;
}

export default function RegistrationForm({ event, onSuccess }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', college: '', year: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverMsg, setServerMsg] = useState(null); // { type: 'success'|'error', text }

  const isFull = event.registeredCount >= event.capacity;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    setServerMsg(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    setServerMsg(null);
    try {
      const res = await api.post('/registrations', { ...form, eventId: event._id });
      setServerMsg({ type: 'success', text: res.data.message });
      setForm({ name: '', email: '', phone: '', college: '', year: '' });
      if (onSuccess) onSuccess();
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong. Please try again.';
      setServerMsg({ type: 'error', text: msg });
    } finally {
      setLoading(false);
    }
  };

  if (isFull) {
    return (
      <div className="alert alert-error">
        <span>😔</span>
        <div>
          <strong>This event is fully booked.</strong>
          <br />All {event.capacity} seats have been taken.
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {serverMsg && (
        <div className={`alert alert-${serverMsg.type}`}>
          <span>{serverMsg.type === 'success' ? '✅' : '❌'}</span>
          <span>{serverMsg.text}</span>
        </div>
      )}

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Full Name <span>*</span></label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className={`form-control ${errors.name ? 'error' : ''}`}
            placeholder="e.g. Arjun Sharma"
          />
          {errors.name && <p className="form-error">{errors.name}</p>}
        </div>
        <div className="form-group">
          <label className="form-label">Email Address <span>*</span></label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className={`form-control ${errors.email ? 'error' : ''}`}
            placeholder="e.g. arjun@gmail.com"
          />
          {errors.email && <p className="form-error">{errors.email}</p>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Phone Number <span>*</span></label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className={`form-control ${errors.phone ? 'error' : ''}`}
            placeholder="10-digit mobile number"
            maxLength={10}
          />
          {errors.phone && <p className="form-error">{errors.phone}</p>}
        </div>
        <div className="form-group">
          <label className="form-label">College / Institution</label>
          <input
            name="college"
            value={form.college}
            onChange={handleChange}
            className="form-control"
            placeholder="e.g. IIT Delhi"
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Year of Study</label>
        <select name="year" value={form.year} onChange={handleChange} className="form-control">
          <option value="">Select year (optional)</option>
          {YEAR_OPTIONS.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
        {loading ? 'Registering…' : '🎟 Confirm Registration'}
      </button>
    </form>
  );
}
