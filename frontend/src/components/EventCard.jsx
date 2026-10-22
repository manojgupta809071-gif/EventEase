import React from 'react';
import { Link } from 'react-router-dom';

const CATEGORY_EMOJI = {
  Workshop: '🛠️',
  Seminar: '🎤',
  Hackathon: '💻',
  Conference: '🏛️',
  Webinar: '🌐',
  Other: '📅',
};

function SeatsBar({ registered, capacity }) {
  const pct = Math.min((registered / capacity) * 100, 100);
  const color = pct >= 100 ? '#ef4444' : pct >= 80 ? '#f59e0b' : '#10b981';
  const left = capacity - registered;
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.3rem' }}>
        <span style={{ color: '#64748b' }}>Seats filled</span>
        <span style={{ fontWeight: 600, color }}>
          {pct >= 100 ? 'FULL' : `${left} left`}
        </span>
      </div>
      <div className="seats-bar">
        <div className="seats-bar-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

export default function EventCard({ event }) {
  const { _id, title, description, date, time, location, category, capacity, registeredCount } = event;
  const isFull = registeredCount >= capacity;
  const dateStr = new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="card event-card">
      <div className="event-card-img">
        {CATEGORY_EMOJI[category] || '📅'}
      </div>
      <div className="event-card-body">
        <div style={{ marginBottom: '0.6rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          <span className="badge badge-purple">{category}</span>
          {isFull && <span className="badge badge-red">Fully Booked</span>}
        </div>
        <h3>{title}</h3>
        <p>{description.length > 100 ? description.slice(0, 100) + '…' : description}</p>
        <div className="event-meta">
          <div className="event-meta-item">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            {dateStr} at {time}
          </div>
          <div className="event-meta-item">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            {location}
          </div>
        </div>
        <SeatsBar registered={registeredCount} capacity={capacity} />
        <Link
          to={`/events/${_id}`}
          className={`btn ${isFull ? 'btn-secondary' : 'btn-primary'}`}
          style={{ marginTop: '1rem', width: '100%', justifyContent: 'center' }}
        >
          {isFull ? 'View Details' : 'Register Now →'}
        </Link>
      </div>
    </div>
  );
}
