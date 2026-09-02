import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { socket } from '../socket';

export default function Navbar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }
    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

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
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '6px', 
          marginLeft: '16px',
          padding: '4px 8px',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '12px',
          fontSize: '11px',
          color: '#cbd5e1'
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: isConnected ? '#10b981' : '#ef4444',
            boxShadow: isConnected ? '0 0 8px #10b981' : '0 0 8px #ef4444'
          }} />
          {isConnected ? 'Live' : 'Disconnected'}
        </div>
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