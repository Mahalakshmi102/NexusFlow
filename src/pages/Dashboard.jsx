import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

function SensorCard({ title, value, unit, icon, status = 'normal' }) {
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

export default function Dashboard() {
  const [telemetry, setTelemetry] = useState({
    temperature: 78,
    humidity: 58,
    pressure: 1013,
  });

  const [chartData, setChartData] = useState([
    { time: '10:00:00', temperature: 72, humidity: 55 },
    { time: '10:00:05', temperature: 74, humidity: 56 },
    { time: '10:00:10', temperature: 75, humidity: 57 },
    { time: '10:00:15', temperature: 78, humidity: 58 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().toLocaleTimeString();
      const newTemp = Math.floor(Math.random() * (90 - 70 + 1)) + 70;
      const newHum = Math.floor(Math.random() * (65 - 50 + 1)) + 50;

      setTelemetry((prev) => ({
        ...prev,
        temperature: newTemp,
        humidity: newHum,
      }));

      setChartData((prev) => [
        ...prev.slice(-9),
        { time: now, temperature: newTemp, humidity: newHum },
      ]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: '24px', background: '#0f172a', minHeight: 'calc(100vh - 60px)', color: '#ffffff' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '700', margin: 0 }}>Visual IoT Live Telemetry</h1>
        <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>
          Real-time sensor monitoring & rule evaluations
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '28px',
        }}
      >
        <SensorCard
          title="Temperature"
          value={telemetry.temperature}
          unit="°C"
          icon="🌡️"
          status={telemetry.temperature > 80 ? 'danger' : 'normal'}
        />
        <SensorCard
          title="Humidity"
          value={telemetry.humidity}
          unit="%"
          icon="💧"
          status="normal"
        />
        <SensorCard
          title="Pressure"
          value={telemetry.pressure}
          unit="hPa"
          icon="⏲️"
          status="normal"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        <div
          style={{
            background: '#1e293b',
            padding: '20px',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <h3 style={{ fontSize: '15px', marginBottom: '16px', color: '#cbd5e1' }}>
            📈 Live Sensor Telemetry Stream
          </h3>
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="time" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Line
                  type="monotone"
                  dataKey="temperature"
                  name="Temperature (°C)"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="humidity"
                  name="Humidity (%)"
                  stroke="#38bdf8"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div
          style={{
            background: '#1e293b',
            padding: '20px',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            minHeight: '280px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748b',
          }}
        >
          🚨 Active Rule Triggers & Alerts (Day 3 Implementation)
        </div>
      </div>
    </div>
  );
}