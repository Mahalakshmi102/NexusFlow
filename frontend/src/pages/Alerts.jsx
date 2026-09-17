import React, { useState, useEffect } from 'react';
import { socket } from '../socket';

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    // Fetch historical alerts on mount
    fetch('http://localhost:5000/api/alerts')
      .then((res) => res.json())
      .then((data) => {
        // Data comes back as an array of alert objects from AlertService
        // Map them to the format we need
        const formattedAlerts = data.map(formatAlert);
        setAlerts(formattedAlerts.reverse()); // Show newest first
      })
      .catch((err) => console.error('Failed to fetch alerts:', err));

    // Listen to live alerts
    function onRuleAlert(alert) {
      setAlerts((prev) => [formatAlert(alert), ...prev]);
    }

    socket.on('rule:alert', onRuleAlert);

    return () => {
      socket.off('rule:alert', onRuleAlert);
    };
  }, []);

  const simulateAlert = () => {
    fetch('http://localhost:5000/api/alerts/mock', { method: 'POST' })
      .catch(err => console.error('Failed to simulate alert:', err));
  };

  const formatAlert = (alert) => ({
    id: alert.id || Date.now(),
    sensor: alert.nodeName || alert.nodeId || 'Unknown Node',
    rule: `Metric: ${alert.metric || 'Unknown'}`,
    value: alert.value !== undefined ? alert.value : 'N/A',
    severity: alert.message && alert.message.toLowerCase().includes('critical') ? 'CRITICAL' : 'WARNING',
    time: new Date(alert.timestamp || alert.createdAt || Date.now()).toLocaleTimeString(),
    message: alert.message
  });

  return (
    <div style={{ color: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ margin: 0 }}>🚨 System Alerts & Rule Execution Logs</h3>
        <button 
          onClick={simulateAlert}
          style={{ padding: '8px 16px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Simulate Alert
        </button>
      </div>

      <div style={{ background: '#1e293b', borderRadius: '8px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead>
            <tr style={{ background: '#0f172a', color: '#94a3b8', borderBottom: '1px solid #334155' }}>
              <th style={{ padding: '12px 16px' }}>Alert ID</th>
              <th style={{ padding: '12px 16px' }}>Sensor Name</th>
              <th style={{ padding: '12px 16px' }}>Triggered Rule</th>
              <th style={{ padding: '12px 16px' }}>Value</th>
              <th style={{ padding: '12px 16px' }}>Severity</th>
              <th style={{ padding: '12px 16px' }}>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {alerts.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>
                  No active alerts in the system.
                </td>
              </tr>
            ) : (
              alerts.map((alert) => (
                <tr key={alert.id} style={{ borderBottom: '1px solid #334155' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 'bold' }}>{alert.id}</td>
                  <td style={{ padding: '12px 16px' }}>{alert.sensor}</td>
                  <td style={{ padding: '12px 16px', color: '#38bdf8' }}>{alert.rule}</td>
                  <td style={{ padding: '12px 16px' }}>{alert.value}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      background: alert.severity === 'CRITICAL' ? '#ef4444' : alert.severity === 'HIGH' ? '#f97316' : '#eab308',
                      color: '#fff'
                    }}>
                      {alert.severity}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#94a3b8' }}>{alert.time}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}