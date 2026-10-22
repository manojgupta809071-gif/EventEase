import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import EventCard from '../components/EventCard';

export default function HomePage() {
  const [events, setEvents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const CATEGORIES = ['All', 'Workshop', 'Seminar', 'Hackathon', 'Conference', 'Webinar', 'Other'];

  useEffect(() => {
    api.get('/events')
      .then((res) => { setEvents(res.data.data); setFiltered(res.data.data); })
      .catch(() => setError('Failed to load events. Please check if the backend is running.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let list = events;
    if (category !== 'All') list = list.filter((e) => e.category === category);
    if (search.trim()) list = list.filter((e) =>
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.location.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(list);
  }, [search, category, events]);

  const upcoming = events.filter((e) => new Date(e.date) >= new Date()).length;
  const totalSeats = events.reduce((sum, e) => sum + e.capacity, 0);
  const totalRegistered = events.reduce((sum, e) => sum + e.registeredCount, 0);

  return (
    <>
      {/* ─── Hero ─── */}
      <section className="hero">
        <div className="hero-content">
          <h1>Your Gateway to<br /><span>Amazing Events</span></h1>
          <p>
            Discover workshops, seminars, hackathons and more. Register in seconds and level up your skills.
          </p>
          <a href="#events" className="btn btn-lg" style={{ background: '#fcd34d', color: '#1e1b4b', fontWeight: 700 }}>
            🔍 Browse Events
          </a>
          <div className="hero-stats">
            <div className="hero-stat"><div className="number">{events.length}</div><div className="label">Total Events</div></div>
            <div className="hero-stat"><div className="number">{upcoming}</div><div className="label">Upcoming</div></div>
            <div className="hero-stat"><div className="number">{totalRegistered}</div><div className="label">Registered</div></div>
            <div className="hero-stat"><div className="number">{totalSeats - totalRegistered}</div><div className="label">Seats Available</div></div>
          </div>
        </div>
      </section>

      {/* ─── Events Section ─── */}
      <section className="events-section" id="events">
        <div className="container">
          <h2 className="section-title">Upcoming Events & Workshops</h2>
          <p className="section-sub">Find your next learning opportunity</p>

          {/* Filters */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <input
              className="form-control"
              style={{ maxWidth: 300 }}
              placeholder="🔍 Search by title or location…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  className={`admin-tab ${category === c ? 'active' : ''}`}
                  onClick={() => setCategory(c)}
                  style={{ fontSize: '0.82rem', padding: '0.35rem 0.85rem' }}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {loading && <div className="spinner" />}

          {error && (
            <div className="alert alert-error">
              ❌ {error}
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div className="empty-state">
              <div className="icon">🗓️</div>
              <h3>No events found</h3>
              <p>Try a different search or category. Ask the admin to add events!</p>
            </div>
          )}

          <div className="events-grid">
            {filtered.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer>
        <strong>EventEase</strong> — Event &amp; Workshop Registration System &nbsp;|&nbsp; Built with ❤️ using MERN Stack
      </footer>
    </>
  );
}
