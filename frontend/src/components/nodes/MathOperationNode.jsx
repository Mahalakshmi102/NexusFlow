import React, { useCallback } from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';
import './nodes.css';

export default function MathOperationNode({ id, data }) {
    const { setNodes } = useReactFlow();

    const onChange = useCallback((evt) => {
        const val = evt.target.value;
        setNodes((nodes) =>
            nodes.map((n) => {
                if (n.id === id) {
                    return { ...n, data: { ...n.data, threshold: val } };
                }
                return n;
            })
        );
    }, [id, setNodes]);

    return (
        <div className="flow-node math-node">
            {/* Input Handle */}
            <Handle type="target" position={Position.Left} id="input" />
            <div className="node-header"> ➗ Math Operation</div>
            <div className="node-body">
                <label className="node-label" style={{ display: 'block', marginBottom: '4px' }}>Condition: &gt; Threshold</label>
                <div className="input-group" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <input 
                        type="number"
                        className="node-input nodrag"
                        placeholder="e.g. 80"
                        value={data?.threshold || ''}
                        onChange={onChange}
                        style={{ width: '100%', padding: '4px', boxSizing: 'border-box', color: 'black' }}
                    />
                    <span className="input-unit" style={{ fontSize: '10px' }}>C / val</span>
                </div>
            </div>

            {/* Output Handle*/}
            <Handle type="source" position={Position.Right} id="output" />
        </div>
    
    );
} 
