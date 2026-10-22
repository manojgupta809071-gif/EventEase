import React, { useState, useEffect } from 'react';
import api from '../api/axios';

export default function AttendeeList({ eventId, eventTitle }) {
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAttendees = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/registrations?eventId=${eventId}`);
      setAttendees(res.data.data);
    } catch {
      setError('Failed to load attendees.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAttendees(); }, [eventId]);

  const handleRemove = async (id) => {
    if (!window.confirm('Remove this registration?')) return;
    try {
      await api.delete(`/registrations/${id}`);
      setAttendees((prev) => prev.filter((a) => a._id !== id));
    } catch {
      alert('Could not remove registration.');
    }
  };

  if (loading) return <div className="spinner" />;
  if (error) return <div className="alert alert-error">{error}</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ fontFamily: 'Poppins, sans-serif' }}>
          Attendees — <span style={{ color: '#6366f1' }}>{eventTitle}</span>
        </h3>
        <span className="badge badge-purple">{attendees.length} registered</span>
      </div>

      {attendees.length === 0 ? (
        <div className="empty-state">
          <div className="icon">👥</div>
          <h3>No registrations yet</h3>
          <p>Attendees will appear here once people register.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>College</th>
                <th>Year</th>
                <th>Registered On</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {attendees.map((a, i) => (
                <tr key={a._id}>
                  <td>{i + 1}</td>
                  <td style={{ fontWeight: 500 }}>{a.name}</td>
                  <td>{a.email}</td>
                  <td>{a.phone}</td>
                  <td>{a.college || '—'}</td>
                  <td>{a.year || '—'}</td>
                  <td>{new Date(a.createdAt).toLocaleDateString('en-IN')}</td>
                  <td>
                    <button className="btn btn-danger btn-sm" onClick={() => handleRemove(a._id)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
