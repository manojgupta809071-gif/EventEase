import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import EventForm from '../components/EventForm';
import AttendeeList from '../components/AttendeeList';

const CATEGORY_EMOJI = { Workshop: '🛠️', Seminar: '🎤', Hackathon: '💻', Conference: '🏛️', Webinar: '🌐', Other: '📅' };

export default function AdminPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [viewAttendeesEvent, setViewAttendeesEvent] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchEvents = async () => {
    try {
      const res = await api.get('/events');
      setEvents(res.data.data);
    } catch {
      setError('Failed to load events.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEvents(); }, []);

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleSave = async (formData) => {
    if (editingEvent) {
      await api.put(`/events/${editingEvent._id}`, formData);
      showSuccess('Event updated successfully!');
    } else {
      await api.post('/events', formData);
      showSuccess('Event created successfully!');
    }
    setShowModal(false);
    setEditingEvent(null);
    fetchEvents();
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}" and all its registrations? This cannot be undone.`)) return;
    try {
      await api.delete(`/events/${id}`);
      showSuccess('Event deleted.');
      fetchEvents();
    } catch {
      alert('Failed to delete event.');
    }
  };

  const openCreate = () => { setEditingEvent(null); setShowModal(true); };
  const openEdit = (event) => { setEditingEvent(event); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditingEvent(null); };

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
          <div>
            <h1 className="section-title">Admin Dashboard</h1>
            <p className="section-sub" style={{ marginBottom: 0 }}>Manage all events and registrations</p>
          </div>
          <button className="btn btn-primary btn-lg" onClick={openCreate}>
            ＋ Create New Event
          </button>
        </div>

        {successMsg && <div className="alert alert-success">✅ {successMsg}</div>}
        {error && <div className="alert alert-error">❌ {error}</div>}

        {/* Attendee View */}
        {viewAttendeesEvent && (
          <div className="card" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div />
              <button className="btn btn-secondary btn-sm" onClick={() => setViewAttendeesEvent(null)}>
                ✕ Close
              </button>
            </div>
            <AttendeeList eventId={viewAttendeesEvent._id} eventTitle={viewAttendeesEvent.title} />
          </div>
        )}

        {loading && <div className="spinner" />}

        {!loading && events.length === 0 && (
          <div className="empty-state">
            <div className="icon">📭</div>
            <h3>No events yet</h3>
            <p>Create your first event using the button above.</p>
          </div>
        )}

        {/* Events Table */}
        {events.length > 0 && (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Category</th>
                  <th>Date & Time</th>
                  <th>Location</th>
                  <th>Seats</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((ev) => {
                  const seatsLeft = ev.capacity - ev.registeredCount;
                  const isFull = seatsLeft <= 0;
                  const dateStr = new Date(ev.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
                  return (
                    <tr key={ev._id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{CATEGORY_EMOJI[ev.category]} {ev.title}</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{ev.description.slice(0, 60)}…</div>
                      </td>
                      <td><span className="badge badge-purple">{ev.category}</span></td>
                      <td style={{ whiteSpace: 'nowrap' }}>{dateStr}<br /><span style={{ fontSize: '0.82rem', color: '#64748b' }}>{ev.time}</span></td>
                      <td>{ev.location}</td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{ev.registeredCount}/{ev.capacity}</div>
                        <div className="seats-bar" style={{ marginTop: '0.3rem', width: '80px' }}>
                          <div className="seats-bar-fill" style={{ width: `${Math.min((ev.registeredCount/ev.capacity)*100,100)}%`, background: isFull ? '#ef4444' : '#10b981' }} />
                        </div>
                      </td>
                      <td>
                        {isFull
                          ? <span className="badge badge-red">Full</span>
                          : <span className="badge badge-green">{seatsLeft} left</span>}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                          <button className="btn btn-secondary btn-sm" onClick={() => setViewAttendeesEvent(ev)}>
                            👥 Attendees
                          </button>
                          <button className="btn btn-secondary btn-sm" onClick={() => openEdit(ev)}>
                            ✏️ Edit
                          </button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(ev._id, ev.title)}>
                            🗑 Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
          <div className="modal">
            <div className="modal-header">
              <h2>{editingEvent ? '✏️ Edit Event' : '✨ Create New Event'}</h2>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>
            <EventForm existing={editingEvent} onSave={handleSave} onClose={closeModal} />
          </div>
        </div>
      )}
    </div>
  );
}
