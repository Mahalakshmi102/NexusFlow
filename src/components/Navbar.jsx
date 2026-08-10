import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      display: 'flex',
      justify: 'space-between',
      alignItems: 'center',
      background: '#0f172a',
      padding: '12px 24px',
      borderBottom: '1px solid #1e293b',
      marginBottom: '20px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '20px' }}>⚡</span>
        <h3 style={{ margin: 0, color: '#38bdf8' }}>NexusFlow IoT Engine</h3>
      </div>

      <div style={{ display: 'flex', gap: '15px' }}>
        <Link to="/" style={linkStyle(isActive('/'))}>
          📊 Telemetry Dashboard
        </Link>
        <Link to="/rules" style={linkStyle(isActive('/rules'))}>
          ⚙️ Visual Rule Builder
        </Link>
        <Link to="/alerts" style={linkStyle(isActive('/alerts'))}>
          🚨 Alerts & Logs
        </Link>
      </div>
    </nav>
  );
}

const linkStyle = (active) => ({
  color: active ? '#38bdf8' : '#94a3b8',
  textDecoration: 'none',
  padding: '6px 12px',
  borderRadius: '6px',
  background: active ? '#1e293b' : 'transparent',
  fontWeight: active ? 'bold' : 'normal'
});