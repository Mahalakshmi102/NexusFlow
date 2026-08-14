import React from 'react';
import {Handle,Position} from 'reactflow';
import './nodes.css';

export default function MathOperationNode({data}) {
    return (
        <div className="flow-node math-node">
            <Handle type="target" position={Position.left} id="input" />
            <div className="node-header"> ➗Math Operation</div>
            <div className="node-body">
                <span>{data?.label || 'Filter Condition'}</span>
            </div>
            <Handle type="source" position={Position.Right}vid="output" />
        </div>
    );
}