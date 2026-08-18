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

import DataSourceNode from '../components/nodes/DataSourceNode';
import MathOperationNode from '../components/nodes/MathOperationNode';
import ActionTriggerNode from '../components/nodes/ActionTriggerNode';

const initialNodes = [
  {
    id: 'node-1',
    type: 'dataSource',
    position: { x: 50, y: 150 },
    data: { label: 'Temperature Sensor', sensorType: 'temperature' },
  },
  {
    id: 'node-2',
    type: 'mathOperation',
    position: { x: 320, y: 150 },
    data: { threshold: 80 },
  },
  {
    id: 'node-3',
    type: 'actionTrigger',
    position: { x: 600, y: 150 },
    data: { actionType: 'alert' },
  },
];

const initialEdges = [
  { id: 'e1-2', source: 'node-1', target: 'node-2', animated: true },
  { id: 'e2-3', source: 'node-2', target: 'node-3', animated: true },
];

export default function RuleCanvas() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  // Custom node registration
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

  // Day 5: Dynamic Node Adder Function
  const addNode = (type, label) => {
    const id = `node_${Date.now()}`;
    const newNode = {
      id,
      type,
      position: { x: Math.random() * 250 + 50, y: Math.random() * 200 + 50 },
      data: {
        label,
        threshold: 50,
        actionType: 'alert',
      },
    };
    setNodes((nds) => nds.concat(newNode));
  };

  return (
    <div style={{ width: '100%', height: 'calc(100vh - 60px)', background: '#0f172a', position: 'relative' }}>
      {/* Node Palette Toolbar */}
      <div className="canvas-toolbar">
        <span className="toolbar-title">Add Nodes:</span>
        <button className="btn-add btn-data" onClick={() => addNode('dataSource', 'New Data Source')}>
          + Data Source
        </button>
        <button className="btn-add btn-math" onClick={() => addNode('mathOperation', 'Math Operator')}>
          + Math Operation
        </button>
        <button className="btn-add btn-action" onClick={() => addNode('actionTrigger', 'Action Trigger')}>
          + Action Trigger
        </button>
      </div>

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