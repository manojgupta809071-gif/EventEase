import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import RegistrationForm from '../components/RegistrationForm';

const CATEGORY_EMOJI = {
  Workshop: '🛠️',
  Seminar: '🎤',
  Hackathon: '💻',
  Conference: '🏛️',
  Webinar: '🌐',
  Other: '📅',
};

export default function EventDetailPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchEvent = useCallback(async () => {
    try {
      const res = await api.get(`/events/${id}`);
      setEvent(res.data.data);
    } catch {
      setError('Event not found or failed to load.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchEvent(); }, [fetchEvent]);

  if (loading) return <div style={{ padding: '4rem 0' }}><div className="spinner" /></div>;
  if (error) return (
    <div className="container" style={{ padding: '3rem 0' }}>
      <div className="alert alert-error">❌ {error}</div>
      <Link to="/" className="btn btn-secondary">← Back to Home</Link>
    </div>
  );

  const dateStr = new Date(event.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const seatsLeft = event.capacity - event.registeredCount;
  const pct = Math.min((event.registeredCount / event.capacity) * 100, 100);

  return (
    <div className="event-detail">
      <div className="container">
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#6366f1', fontWeight: 500, marginBottom: '1.5rem' }}>
          ← Back to Events
        </Link>

        <div className="event-detail-grid">
          {/* Left: Info */}
          <div>
            <div className="event-detail-hero">
              {event.imageUrl
                ? <img src={event.imageUrl} alt={event.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} />
                : CATEGORY_EMOJI[event.category] || '📅'}
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <span className="badge badge-purple">{event.category}</span>
              {seatsLeft <= 0
                ? <span className="badge badge-red">Fully Booked</span>
                : seatsLeft <= 10
                ? <span className="badge badge-yellow">Only {seatsLeft} seats left!</span>
                : <span className="badge badge-green">{seatsLeft} seats available</span>}
            </div>

            <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{event.title}</h1>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.5rem', padding: '1.25rem', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div className="event-meta-item" style={{ fontSize: '0.95rem' }}>
                <svg width="16" height="16" fill="none" stroke="#6366f1" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                <strong>{dateStr}</strong>
              </div>
              <div className="event-meta-item" style={{ fontSize: '0.95rem' }}>
                <svg width="16" height="16" fill="none" stroke="#6366f1" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                {event.time}
              </div>
              <div className="event-meta-item" style={{ fontSize: '0.95rem' }}>
                <svg width="16" height="16" fill="none" stroke="#6366f1" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                {event.location}
              </div>
              <div className="event-meta-item" style={{ fontSize: '0.95rem' }}>
                <svg width="16" height="16" fill="none" stroke="#6366f1" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                {event.registeredCount} / {event.capacity} seats filled
              </div>
            </div>

            {/* Seats bar */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div className="seats-bar" style={{ height: '10px' }}>
                <div className="seats-bar-fill" style={{ width: `${pct}%`, background: pct >= 100 ? '#ef4444' : pct >= 80 ? '#f59e0b' : '#10b981' }} />
              </div>
            </div>

            <h3 style={{ marginBottom: '0.75rem' }}>About this Event</h3>
            <p style={{ color: '#475569', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{event.description}</p>
          </div>

          {/* Right: Registration form */}
          <div>
            <div className="card" style={{ position: 'sticky', top: '80px' }}>
              <div className="card-body">
                <h2 style={{ marginBottom: '0.25rem', fontSize: '1.3rem' }}>Register for this Event</h2>
                <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Fill in your details below</p>
                <RegistrationForm event={event} onSuccess={fetchEvent} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
