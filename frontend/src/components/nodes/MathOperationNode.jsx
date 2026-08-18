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
            <Handle type="target" position={Position.Left} id="input" />
            <div className="node-header"> ➗ Math Operation</div>
            <div className="node-body">
                <span>{data?.label || 'Filter Condition'}</span>
                <input
                    type="number"
                    className="nodrag"
                    placeholder="Threshold (e.g. 80)"
                    value={data?.threshold || ''}
                    onChange={onChange}
                    style={{ marginTop: '8px', width: '100%', padding: '4px', boxSizing: 'border-box', color: 'black' }}
                />
            </div>
            <Handle type="source" position={Position.Right} id="output" />
        </div>
    );
}