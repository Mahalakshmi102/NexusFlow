import React from 'react';

export default function WebhookListTable({ webhooks, onToggleStatus, onDelete }) {
  if (!webhooks || webhooks.length === 0) {
    return (
      <div style={{
        background: '#1e293b',
        border: '1px dashed #475569',
        borderRadius: '10px',
        padding: '24px',
        textAlign: 'center',
        color: '#94a3b8',
        fontSize: '13px',
        marginTop: '20px'
      }}>
        No outbound webhooks configured yet. Click <strong>"Add Webhook"</strong> above to register an endpoint.
      </div>
    );
  }

  return (
    <div style={{
      background: '#1e293b',
      borderRadius: '10px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '20px',
      marginTop: '20px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '15px', margin: 0, color: '#38bdf8', fontWeight: '600' }}>
          📡 Registered Webhook Endpoints ({webhooks.length})
        </h3>
        <span style={{ fontSize: '11px', color: '#94a3b8' }}>Live Dispatcher Status</span>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #334155', color: '#94a3b8', fontSize: '12px' }}>
              <th style={{ padding: '10px 8px' }}>NAME</th>
              <th style={{ padding: '10px 8px' }}>METHOD</th>
              <th style={{ padding: '10px 8px' }}>TARGET URL</th>
              <th style={{ padding: '10px 8px' }}>CREATED</th>
              <th style={{ padding: '10px 8px' }}>STATUS</th>
              <th style={{ padding: '10px 8px', textAlign: 'right' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {webhooks.map((hook) => (
              <tr key={hook.id} style={{ borderBottom: '1px solid #1e293b' }}>
                <td style={{ padding: '12px 8px', fontWeight: '600', color: '#f8fafc' }}>
                  {hook.name}
                </td>
                <td style={{ padding: '12px 8px' }}>
                  <span style={{
                    background: hook.method === 'POST' ? '#0369a1' : '#047857',
                    color: '#f0fdf4',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: '700'
                  }}>
                    {hook.method}
                  </span>
                </td>
                <td style={{ padding: '12px 8px', color: '#94a3b8', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {hook.url}
                </td>
                <td style={{ padding: '12px 8px', color: '#64748b', fontSize: '12px' }}>
                  {hook.createdAt || 'Live'}
                </td>
                <td style={{ padding: '12px 8px' }}>
                  <button
                    onClick={() => onToggleStatus(hook.id)}
                    style={{
                      background: hook.status === 'active' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(148, 163, 184, 0.2)',
                      border: `1px solid ${hook.status === 'active' ? '#10b981' : '#64748b'}`,
                      color: hook.status === 'active' ? '#34d399' : '#94a3b8',
                      padding: '3px 10px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    {hook.status === 'active' ? '● Active' : '○ Paused'}
                  </button>
                </td>
                <td style={{ padding: '12px 8px', textAlign: 'right' }}>
                  <button
                    onClick={() => onDelete(hook.id)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#ef4444',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                    title="Delete Webhook"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}