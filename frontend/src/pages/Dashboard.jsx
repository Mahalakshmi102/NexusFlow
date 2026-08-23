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

  const [alerts, setAlerts] = useState([
    { id: 1, time: '10:00:15', type: 'INFO', msg: 'System initialized & telemetry connected' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().toLocaleTimeString();
      const newTemp = Math.floor(Math.random() * (95 - 68 + 1)) + 68;
      const newHum = Math.floor(Math.random() * (70 - 45 + 1)) + 45;

      setTelemetry((prev) => ({
        ...prev,
        temperature: newTemp,
        humidity: newHum,
      }));

      setChartData((prev) => [
        ...prev.slice(-9),
        { time: now, temperature: newTemp, humidity: newHum },
      ]);

      // Week 3 Day 3: Rule Evaluation & Alert Triggers
      if (newTemp > 85) {
        setAlerts((prev) => [
          {
            id: Date.now(),
            time: now,
            type: 'CRITICAL',
            msg: `High Temperature Alert! (${newTemp}°C > 85°C)`,
          },
          ...prev.slice(0, 5),
        ]);
      } else if (newHum > 65) {
        setAlerts((prev) => [
          {
            id: Date.now(),
            time: now,
            type: 'WARNING',
            msg: `High Humidity detected (${newHum}%)`,
          },
          ...prev.slice(0, 5),
        ]);
      }
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
          status={telemetry.temperature > 85 ? 'danger' : telemetry.temperature > 80 ? 'warning' : 'normal'}
        />
        <SensorCard
          title="Humidity"
          value={telemetry.humidity}
          unit="%"
          icon="💧"
          status={telemetry.humidity > 65 ? 'warning' : 'normal'}
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
        {/* Stream Chart */}
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

        {/* Week 3 Day 3: Active Rule Triggers & Alerts Panel */}
        <div
          style={{
            background: '#1e293b',
            padding: '20px',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '15px', margin: 0, color: '#cbd5e1' }}>🚨 Active Rule Triggers</h3>
            <span style={{ fontSize: '11px', background: '#334155', padding: '2px 8px', borderRadius: '12px', color: '#94a3b8' }}>
              Live
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', maxHeight: '250px' }}>
            {alerts.map((item) => (
              <div
                key={item.id}
                style={{
                  background: item.type === 'CRITICAL' ? 'rgba(239, 68, 68, 0.15)' : item.type === 'WARNING' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(56, 189, 248, 0.1)',
                  borderLeft: `4px solid ${item.type === 'CRITICAL' ? '#ef4444' : item.type === 'WARNING' ? '#f59e0b' : '#38bdf8'}`,
                  borderRadius: '6px',
                  padding: '10px 12px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>
                  <span style={{ fontWeight: '600', color: item.type === 'CRITICAL' ? '#fca5a5' : item.type === 'WARNING' ? '#fde68a' : '#bae6fd' }}>
                    [{item.type}]
                  </span>
                  <span>{item.time}</span>
                </div>
                <div style={{ fontSize: '12px', color: '#f8fafc', fontWeight: '500' }}>{item.msg}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
