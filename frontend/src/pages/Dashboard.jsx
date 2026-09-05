import WebhookListTable from '../components/WebhookListTable';
import React, { useState, useEffect, useMemo } from 'react';
import WebhookConfigModal from '../components/WebhookConfigModal';
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
  const [isWebhookModalOpen, setIsWebhookModalOpen] = useState(false);
  const [configuredWebhooks, setConfiguredWebhooks] = useState([]);
  const [selectedMetric, setSelectedMetric] = useState('all');
  const [timeRange, setTimeRange] = useState('live');

  // Week 3 Day 5: Stream Pause / Resume State
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

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
        ...prev.slice(-14),
        { time: now, temperature: newTemp, humidity: newHum },
      ]);

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
  }, [isPaused]);

  const stats = useMemo(() => {
    if (!chartData.length) return { maxTemp: 0, minTemp: 0, avgTemp: 0 };
    const temps = chartData.map((d) => d.temperature);
    const max = Math.max(...temps);
    const min = Math.min(...temps);
    const avg = Math.round(temps.reduce((a, b) => a + b, 0) / temps.length);
    return { maxTemp: max, minTemp: min, avgTemp: avg };
  }, [chartData]);

  const handleSaveWebhook = (webhook) => {
    setConfiguredWebhooks((prev) => [...prev, webhook]);
    setAlerts((prev) => [
      {
        id: Date.now(),
        time: new Date().toLocaleTimeString(),
        type: 'INFO',
        msg: `New Webhook Configured: "${webhook.name}" (${webhook.method})`,
      },
      ...prev,
    ]);
  };

  // Week 4 Day 2: Toggle & Delete Handlers
  const handleToggleWebhook = (id) => {
    setConfiguredWebhooks((prev) =>
      prev.map((hook) =>
        hook.id === id
          ? { ...hook, status: hook.status === 'active' ? 'paused' : 'active' }
          : hook
      )
    );
  };

  const handleDeleteWebhook = (id) => {
    setConfiguredWebhooks((prev) => prev.filter((hook) => hook.id !== id));
  };

  // Week 4 Day 3: Simulate Webhook Dispatch
  const handleTestWebhook = (webhook) => {
    const mockPayload = {
      event: 'TELEMETRY_ALERT',
      timestamp: new Date().toISOString(),
      source: 'NexusFlow IoT Gateway',
      data: telemetry,
    };

    setAlerts((prev) => [
      {
        id: Date.now(),
        time: new Date().toLocaleTimeString(),
        type: 'INFO',
        msg: `🚀 Webhook Dispatched to [${webhook.name}] -> 200 OK (Payload Delivered)`,
      },
      ...prev,
    ]);
  };

  // Week 3 Day 5: CSV Export Handler
  const exportTelemetryCSV = () => {
    const headers = 'Time,Temperature(°C),Humidity(%)\n';
    const rows = chartData
      .map((row) => `${row.time},${row.temperature},${row.humidity}`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Telemetry_Report_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Week 3 Day 5: Clear Alerts Handler
  const clearAlerts = () => {
    setAlerts([]);
  };

  return (
    <div style={{ padding: '24px', background: '#0f172a', minHeight: 'calc(100vh - 60px)', color: '#ffffff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '700', margin: 0 }}>Visual IoT Live Telemetry</h1>
          <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>
            Real-time sensor monitoring, historical stream analysis & controls
          </p>
        </div>

        {/* Controls (Pause/Play, Export, Filters, Add Webhook) */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Add Webhook Button */}
          <button
            onClick={() => setIsWebhookModalOpen(true)}
            style={{
              background: '#8b5cf6',
              color: '#ffffff',
              border: 'none',
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            🔗 Add Webhook
          </button>

          {/* Pause / Resume Button */}
          <button
            onClick={() => setIsPaused(!isPaused)}
            style={{
              background: isPaused ? '#10b981' : '#f59e0b',
              color: '#ffffff',
              border: 'none',
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            {isPaused ? '▶ Resume Stream' : '⏸ Pause Stream'}
          </button>

          <button
            onClick={exportTelemetryCSV}
            style={{
              background: '#38bdf8',
              color: '#0f172a',
              border: 'none',
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            📥 Export CSV
          </button>

          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            style={{
              background: '#1e293b',
              color: '#f8fafc',
              border: '1px solid #334155',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '13px',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="all">📊 All Metrics</option>
            <option value="temperature">🌡️ Temp Only</option>
            <option value="humidity">💧 Humidity Only</option>
          </select>

          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            style={{
              background: '#1e293b',
              color: '#f8fafc',
              border: '1px solid #334155',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '13px',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="live">⚡ Live Stream</option>
            <option value="5m">⏱️ Last 5 Mins</option>
            <option value="15m">⏳ Last 15 Mins</option>
          </select>
        </div>
      </div>

      {/* Sensor Metric Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '20px',
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

      {/* Statistical Summary Bar */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
          background: '#1e293b',
          padding: '12px 16px',
          borderRadius: '8px',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          marginBottom: '24px',
          textAlign: 'center',
          fontSize: '13px',
        }}
      >
        <div><span style={{ color: '#94a3b8' }}>Max Peak:</span> <strong style={{ color: '#ef4444' }}>{stats.maxTemp}°C</strong></div>
        <div><span style={{ color: '#94a3b8' }}>Lowest Dip:</span> <strong style={{ color: '#38bdf8' }}>{stats.minTemp}°C</strong></div>
        <div><span style={{ color: '#94a3b8' }}>Current Avg:</span> <strong style={{ color: '#f59e0b' }}>{stats.avgTemp}°C</strong></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        {/* Live Stream Chart */}
        <div
          style={{
            background: '#1e293b',
            padding: '20px',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '15px', margin: 0, color: '#cbd5e1' }}>
              📈 Live Sensor Telemetry Stream
            </h3>
            {isPaused && (
              <span style={{ fontSize: '11px', color: '#f59e0b', background: 'rgba(245, 158, 11, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>
                PAUSED
              </span>
            )}
          </div>
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="time" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                {(selectedMetric === 'all' || selectedMetric === 'temperature') && (
                  <Line type="monotone" dataKey="temperature" name="Temperature (°C)" stroke="#ef4444" strokeWidth={2} dot={false} />
                )}
                {(selectedMetric === 'all' || selectedMetric === 'humidity') && (
                  <Line type="monotone" dataKey="humidity" name="Humidity (%)" stroke="#38bdf8" strokeWidth={2} dot={false} />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Active Rule Triggers & Alerts Panel with Clear History */}
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
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                onClick={clearAlerts}
                style={{
                  background: 'transparent',
                  color: '#94a3b8',
                  border: '1px solid #475569',
                  borderRadius: '4px',
                  fontSize: '11px',
                  padding: '2px 6px',
                  cursor: 'pointer',
                }}
              >
                Clear
              </button>
              <span style={{ fontSize: '11px', background: '#334155', padding: '2px 8px', borderRadius: '12px', color: '#94a3b8' }}>
                Live
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', maxHeight: '250px' }}>
            {alerts.length === 0 ? (
              <div style={{ fontSize: '12px', color: '#64748b', textAlign: 'center', marginTop: '20px' }}>
                No active alerts
              </div>
            ) : (
              alerts.map((item) => (
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
              ))
            )}
          </div>
        </div>
      </div>

      {/* Week 4 Day 2 & 3: Webhook Management Table */}
      <WebhookListTable
        webhooks={configuredWebhooks}
        onToggleStatus={handleToggleWebhook}
        onDelete={handleDeleteWebhook}
        onTestWebhook={handleTestWebhook}
      />

      {/* Webhook Configuration Modal */}
      <WebhookConfigModal
        isOpen={isWebhookModalOpen}
        onClose={() => setIsWebhookModalOpen(false)}
        onSave={handleSaveWebhook}
      />
    </div>
  );
}