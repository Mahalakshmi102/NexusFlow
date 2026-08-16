import React from 'react';
import { Handle, Position } from 'reactflow';

const nodeBaseStyle = {
  padding: '10px 14px',
  borderRadius: '6px',
  color: '#fff',
  fontWeight: '500',
  fontSize: '14px',
  boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
  minWidth: '150px',
  textAlign: 'center'
};

export function SensorNode({ data }) {
  return (
    <div style={{ ...nodeBaseStyle, background: '#1a73e8' }}>
      <div>📡 {data.label}</div>
      <Handle type="source" position={Position.Bottom} id="a" />
    </div>
  );
}

export function ConditionNode({ data }) {
  return (
    <div style={{ ...nodeBaseStyle, background: '#f2a900' }}>
      <Handle type="target" position={Position.Top} id="a" />
      <div>⚙️ {data.label}</div>
      <Handle type="source" position={Position.Bottom} id="b" />
    </div>
  );
}

export function ActionNode({ data }) {
  return (
    <div style={{ ...nodeBaseStyle, background: '#d93025' }}>
      <Handle type="target" position={Position.Top} id="a" />
      <div>🔔 {data.label}</div>
    </div>
  );
}
