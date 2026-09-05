import React from 'react';

export default function SensorCard({ title, value, unit, icon, status = 'normal' }) {
  const getStatusColor = () => {
    switch (status) {
      case 'warning':
        return '#f59e0b';
      case 'danger':
        return '#ef4444';
      default:
        return '#38bdf8';
    }
  };

  return (
    <div
      style={{
        background: '#1e293b',
        border: `1px solid ${getStatusColor()}`,
        borderRadius: '10px',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
      }}
    >
      <div>
        <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '4px' }}>{title}</div>
        <div style={{ fontSize: '24px', fontWeight: '700', color: '#f8fafc' }}>
          {value !== undefined ? value : '--'} <span style={{ fontSize: '14px', color: '#cbd5e1' }}>{unit}</span>
        </div>
      </div>
      <div style={{ fontSize: '28px', opacity: 0.9 }}>{icon}</div>
    </div>
  );
}