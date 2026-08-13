import React from 'react';

const mockAlerts = [
  { id: 'ALT-101', sensor: 'Turbine Sensor A1', rule: 'Temp > 80°C', value: '90°C', severity: 'CRITICAL', time: '10:05:12 AM' },
  { id: 'ALT-102', sensor: 'Vibration Motor B', rule: 'Vibration > 2.5g', value: '3.4g', severity: 'HIGH', time: '10:03:45 AM' },
  { id: 'ALT-103', sensor: 'Pressure Valve C', rule: 'Pressure Drop', value: '12 PSI', severity: 'WARNING', time: '09:48:10 AM' },
];

export default function Alerts() {
  return (
    <div style={{ color: '#fff' }}>
      <h3 style={{ marginBottom: '20px' }}>🚨 System Alerts & Rule Execution Logs</h3>

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
            {mockAlerts.map((alert) => (
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}