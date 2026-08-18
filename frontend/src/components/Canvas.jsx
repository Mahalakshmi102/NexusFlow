import React, { useState, useCallback } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Handle,
  Position
} from 'reactflow';

// Custom Node definitions to match the UI aesthetic
const SensorNode = ({ data }) => (
  <div className="custom-node sensor-node">
    <Handle type="source" position={Position.Right} />
    <div className="node-header">📡 {data.label}</div>
    <div className="node-desc">{data.desc}</div>
  </div>
);

const ActionNode = ({ data }) => (
  <div className="custom-node action-node">
    <Handle type="target" position={Position.Left} />
    <div className="node-header">⚡ {data.label}</div>
    <div className="node-desc">{data.desc}</div>
  </div>
);

const nodeTypes = {
  sensor: SensorNode,
  action: ActionNode,
};

const initialNodes = [
  {
    id: '1',
    type: 'sensor',
    position: { x: 100, y: 150 },
    data: { label: 'Turbine Sensor A', desc: 'Emits temperature data' },
  },
  {
    id: '2',
    type: 'action',
    position: { x: 500, y: 150 },
    data: { label: 'SMS Alert', desc: 'Triggers on Temp > 80°C' },
  },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
];

export default function Canvas() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    []
  );

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        className="dark-theme"
      >
        <Background color="#334155" gap={16} size={1} />
        <Controls />
        <MiniMap 
          nodeColor={(node) => {
            if (node.type === 'sensor') return '#3b82f6';
            if (node.type === 'action') return '#8b5cf6';
            return '#eee';
          }}
          maskColor="rgba(2, 6, 23, 0.8)"
          style={{ backgroundColor: '#1e293b' }}
        />
      </ReactFlow>
    </div>
  );
}
