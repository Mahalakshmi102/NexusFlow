import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockTelemetryData = [
  { time: '10:00', temperature: 65, vibration: 1.2 },
  { time: '10:01', temperature: 72, vibration: 1.5 },
  { time: '10:02', temperature: 81, vibration: 2.1 },
  { time: '10:03', temperature: 85, vibration: 2.8 },
  { time: '10:04', temperature: 78, vibration: 1.9 },
  { time: '10:05', temperature: 90, vibration: 3.4 },
];

export default function Dashboard() {
  return (
    <div style={{ color: '#fff' }}>
      <h3 style={{ marginBottom: '20px' }}>📊 Live IoT Telemetry Stream</h3>
      
      {/* Metrics Summary Cards */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
        <div style={cardStyle('#1e293b')}>
          <p style={{ color: '#94a3b8', margin: 0 }}>Active Sensors</p>
          <h2>12 Nodes</h2>
        </div>
        <div style={cardStyle('#1e293b')}>
          <p style={{ color: '#94a3b8', margin: 0 }}>Current Avg Temp</p>
          <h2 style={{ color: '#ef4444' }}>81.8 °C</h2>
        </div>
        <div style={cardStyle('#1e293b')}>
          <p style={{ color: '#94a3b8', margin: 0 }}>System Alerts</p>
          <h2 style={{ color: '#f59e0b' }}>3 Triggered</h2>
        </div>
      </div>

      {/* Sensor Chart */}
      <div style={{ background: '#1e293b', padding: '20px', borderRadius: '8px' }}>
        <h4 style={{ marginTop: 0 }}>Turbine Sensor - Real-time Temperature & Vibration</h4>
        <div style={{ width: '100%', height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockTelemetryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="time" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
              <Line type="monotone" dataKey="temperature" stroke="#ef4444" strokeWidth={2} name="Temperature (°C)" />
              <Line type="monotone" dataKey="vibration" stroke="#3b82f6" strokeWidth={2} name="Vibration (g)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

const cardStyle = (bgColor) => ({
  background: bgColor,
  padding: '15px 25px',
  borderRadius: '8px',
  flex: 1,
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
});