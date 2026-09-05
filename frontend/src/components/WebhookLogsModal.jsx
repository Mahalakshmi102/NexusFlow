import React from 'react';

export default function WebhookLogsModal({ isOpen, onClose, logs, webhookName }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(15, 23, 42, 0.8)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        background: '#1e293b',
        border: '1px solid #334155',
        borderRadius: '12px',
        width: '90%',
        maxWidth: '700px',
        maxHeight: '85vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid #334155',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '16px', color: '#38bdf8' }}>
              📜 Delivery Audit Logs: {webhookName || 'All Webhooks'}
            </h3>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>
              Detailed transmission history & HTTP responses
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              fontSize: '18px',
              cursor: 'pointer',
            }}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
          {logs.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#64748b', fontSize: '13px', padding: '30px 0' }}>
              No transmission logs recorded yet. Trigger a test dispatch to generate logs.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {logs.map((log) => (
                <div
                  key={log.id}
                  style={{
                    background: '#0f172a',
                    border: `1px solid ${log.status >= 200 && log.status < 300 ? '#059669' : '#dc2626'}`,
                    borderRadius: '8px',
                    padding: '12px 16px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{
                        background: log.status >= 200 && log.status < 300 ? '#10b981' : '#ef4444',
                        color: '#ffffff',
                        fontSize: '11px',
                        fontWeight: '700',
                        padding: '2px 6px',
                        borderRadius: '4px',
                      }}>
                        {log.status} {log.statusText}
                      </span>
                      <strong style={{ fontSize: '13px', color: '#f8fafc' }}>{log.webhookName}</strong>
                    </div>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                      {log.time} ({log.latency}ms)
                    </span>
                  </div>

                  <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '6px' }}>
                    Endpoint: <span style={{ color: '#cbd5e1' }}>{log.endpoint}</span>
                  </div>

                  <details style={{ fontSize: '11px', color: '#38bdf8', cursor: 'pointer' }}>
                    <summary>View Request Payload</summary>
                    <pre style={{
                      background: '#1e293b',
                      padding: '10px',
                      borderRadius: '6px',
                      overflowX: 'auto',
                      color: '#e2e8f0',
                      marginTop: '6px',
                    }}>
                      {JSON.stringify(log.payload, null, 2)}
                    </pre>
                  </details>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '12px 20px',
          borderTop: '1px solid #334155',
          display: 'flex',
          justifyContent: 'flex-end',
        }}>
          <button
            onClick={onClose}
            style={{
              background: '#334155',
              color: '#ffffff',
              border: 'none',
              padding: '6px 16px',
              borderRadius: '6px',
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}