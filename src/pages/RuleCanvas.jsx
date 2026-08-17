import React, { useState, useCallback, useMemo } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  applyNodeChanges,
  applyEdgeChanges
} from 'reactflow';
import 'reactflow/dist/style.css';

// 1. Custom Nodes Import karein
import DataSourceNode from '../components/nodes/DataSourceNode';
import MathOperationNode from '../components/nodes/MathOperationNode';
import ActionTriggerNode from '../components/nodes/ActionTriggerNode';

// 2. Initial Sample Flow Setup
const initialNodes = [
  {
    id: '1',
    type: 'dataSource',
    position: { x: 50, y: 100 },
    data: { label: 'Temperature Sensor', sensorType: 'temperature' },
  },
  {
    id: '2',
    type: 'mathOperation',
    position: { x: 300, y: 100 },
    data: { threshold: 80 },
  },
  {
    id: '3',
    type: 'actionTrigger',
    position: { x: 580, y: 100 },
    data: { actionType: 'alert' },
  },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e2-3', source: '2', target: '3', animated: true },
];

export default function RuleCanvas() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  // 3. Register Custom Node Types (useMemo ensures stability)
  const nodeTypes = useMemo(
    () => ({
      dataSource: DataSourceNode,
      mathOperation: MathOperationNode,
      actionTrigger: ActionTriggerNode,
    }),
    []
  );

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge({ ...connection, animated: true }, eds)),
    []
  );

  return (
    <div style={{ width: '100%', height: 'calc(100vh - 60px)', background: '#0f172a' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Background color="#334155" gap={16} />
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            if (node.type === 'dataSource') return '#0284c7';
            if (node.type === 'mathOperation') return '#7c3aed';
            if (node.type === 'actionTrigger') return '#ea580c';
            return '#64748b';
          }}
          maskColor="rgba(15, 23, 42, 0.7)"
        />
      </ReactFlow>
    </div>
  );
}