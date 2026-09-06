import React, { useState, useCallback, useRef, useEffect } from 'react';
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
import DataSourceNode from '../components/nodes/DataSourceNode';
import MathOperationNode from '../components/nodes/MathOperationNode';
import ActionTriggerNode from '../components/nodes/ActionTriggerNode';
import GlowingEdge from '../components/edges/GlowingEdge';
import { socket } from '../socket';

const edgeTypes = {
  glowing: GlowingEdge
};

const nodeTypes = {
  sensor: DataSourceNode,
  condition: MathOperationNode,
  action: ActionTriggerNode
};

let id = 0;
const getId = () => `node_${id++}`;

const initialNodes = [
  { id: '1', type: 'sensor', data: { label: 'Turbine Sensor' }, position: { x: 50, y: 150 } },
  { id: '2', type: 'condition', data: { label: 'Temp > 80°C' }, position: { x: 300, y: 150 } },
];
const initialEdges = [{ id: 'e1-2', source: '1', target: '2', type: 'glowing', animated: true }];

function CanvasContent() {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes] = useState(() => {
    const saved = localStorage.getItem('nexusflow_nodes');
    if (saved) return JSON.parse(saved);
    return initialNodes;
  });
  const [edges, setEdges] = useState(() => {
    const saved = localStorage.getItem('nexusflow_edges');
    if (saved) return JSON.parse(saved);
    return initialEdges;
  });

  useEffect(() => {
    localStorage.setItem('nexusflow_nodes', JSON.stringify(nodes));
    localStorage.setItem('nexusflow_edges', JSON.stringify(edges));
  }, [nodes, edges]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const onNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
  const onEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);
  const onConnect = useCallback((params) => setEdges((eds) => addEdge({ ...params, type: 'glowing' }, eds)), []);

  useEffect(() => {
    function onEdgeActive(activeEvent) {
      const { edgeId, source, target } = activeEvent;
      
      setEdges((eds) => eds.map(e => {
        if (e.id === edgeId || (e.source === source && e.target === target)) {
          return {
            ...e,
            data: {
              ...e.data,
              isActive: true,
              activationTime: Date.now()
            }
          };
        }
        return e;
      }));
    }

    socket.on('edge:active', onEdgeActive);

    return () => {
      socket.off('edge:active', onEdgeActive);
    };
  }, []);

  const isValidConnection = useCallback((connection) => {
    // Prevent self-connection and inherently React Flow prevents output-to-output based on Handle types
    return connection.source !== connection.target;
  }, []);

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
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
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
  const handleSaveRule = async () => {
    if (reactFlowInstance) {
      const flowJSON = reactFlowInstance.toObject();
      const formattedJSON = JSON.stringify(flowJSON, null, 2);
      console.log('NexusFlow Compiled Graph JSON:', formattedJSON);

      try {
        const response = await fetch('http://localhost:5000/api/graphs/compile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: formattedJSON
        });

        if (response.ok) {
          alert('Pipeline saved successfully to the backend!');
        } else {
          alert('Failed to save pipeline to the backend.');
        }
      } catch (err) {
        console.error('Error saving pipeline:', err);
        alert('Error saving pipeline. See console for details.');
      }
      // Export perfectly formatted JSON object as a file
      const blob = new Blob([formattedJSON], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'pipeline-config.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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
            edgeTypes={edgeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            isValidConnection={isValidConnection}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            defaultEdgeOptions={{ style: { stroke: '#38bdf8', strokeWidth: 2 } }}
            fitView
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