import React from 'react';

export default function Sidebar() {
  const onDragStart = (event, nodeType, label) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify({ nodeType, label }));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside style={{
      width: '220px',
      background: '#222',
      padding: '15px',
      color: '#fff',
      borderRight: '1px solid #444',
      borderRadius: '8px 0 0 8px'
    }}>
      <h3 style={{ fontSize: '16px', marginBottom: '15px' }}>Node Library</h3>
      
      <div style={{ marginBottom: '10px', fontSize: '12px', color: '#aaa' }}>DRAG TO CANVAS</div>

      {/* Input Node */}
      <div 
        onDragStart={(event) => onDragStart(event, 'input', 'Sensor Node')} 
        draggable
        style={nodeStyle('#1a73e8')}
      >
        📡 Sensor Input
      </div>

      {/* Logic Node */}
      <div 
        onDragStart={(event) => onDragStart(event, 'default', 'Filter / Condition')} 
        draggable
        style={nodeStyle('#f2a900')}
      >
        ⚙️ Filter / Condition
      </div>

      {/* Output Node */}
      <div 
        onDragStart={(event) => onDragStart(event, 'output', 'Action Trigger')} 
        draggable
        style={nodeStyle('#d93025')}
      >
        🔔 Action Trigger
      </div>
    </aside>
  );
}

const nodeStyle = (bgColor) => ({
  padding: '10px 14px',
  marginBottom: '10px',
  background: bgColor,
  borderRadius: '6px',
  cursor: 'grab',
  fontWeight: '500',
  fontSize: '14px',
  boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
});