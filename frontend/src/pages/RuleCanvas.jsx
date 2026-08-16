import React, { useState, useCallback, useRef } from 'react';
import ReactFlow, { 
  MiniMap, 
  Controls, 
  Background, 
  applyNodeChanges, 
  applyEdgeChanges, 
  addEdge,
  ReactFlowProvider
} from 'reactflow';
import 'reactflow/dist/style.css';
import Sidebar from '../components/Sidebar';
import { SensorNode, ConditionNode, ActionNode } from '../components/CustomNodes';

const nodeTypes = {
  sensor: SensorNode,
  condition: ConditionNode,
  action: ActionNode
};

let id = 0;
const getId = () => `node_${id++}`;

const initialNodes = [
  { id: '1', type: 'sensor', data: { label: 'Turbine Sensor' }, position: { x: 50, y: 150 } },
  { id: '2', type: 'condition', data: { label: 'Temp > 80°C' }, position: { x: 300, y: 150 } },
];
const initialEdges = [{ id: 'e1-2', source: '1', target: '2', animated: true }];

function CanvasContent() {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const onNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
  const onEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);
  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const rawData = event.dataTransfer.getData('application/reactflow');

      if (!rawData) return;

      const { nodeType, label } = JSON.parse(rawData);
      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode = {
        id: getId(),
        type: nodeType,
        position,
        data: { label: `${label}` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );

  // JSON Graph output handler (Keerthi ke backend ko bhejne ke liye)
  const handleSaveRule = () => {
    if (reactFlowInstance) {
      const flowJSON = reactFlowInstance.toObject();
      console.log('NexusFlow Compiled Graph JSON:', flowJSON);
      alert('Rule Saved Successfully! (Check Browser Console for JSON Output)');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <span style={{ color: '#aaa', fontSize: '14px' }}>Drag nodes from library and wire them to build logic</span>
        <button 
          onClick={handleSaveRule}
          style={{
            background: '#22c55e',
            color: '#fff',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '6px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          💾 Save Rule Pipeline
        </button>
      </div>

      <div style={{ display: 'flex', width: '100%', height: '75vh', border: '1px solid #444', borderRadius: '8px', overflow: 'hidden' }}>
        <Sidebar />
        <div style={{ flexGrow: 1, height: '100%' }} ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
          >
            <Controls />
            <MiniMap />
            <Background gap={16} size={1} />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}

export default function RuleCanvas() {
  return (
    <ReactFlowProvider>
      <CanvasContent />
    </ReactFlowProvider>
  );
}