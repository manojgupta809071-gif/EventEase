import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div style={{ textAlign: 'center', padding: '6rem 2rem' }}>
      <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🔍</div>
      <h1 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '2.5rem', marginBottom: '1rem' }}>404 — Page Not Found</h1>
      <p style={{ color: '#64748b', marginBottom: '2rem', fontSize: '1.1rem' }}>The page you are looking for does not exist.</p>
      <Link to="/" className="btn btn-primary btn-lg">← Go Home</Link>
    </div>
  );
}
