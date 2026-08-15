import React from 'react';
import {Handle, Position} from 'reactflow';
import './nodes.css';

export default function DataSourceNode({data}) {
    return (
        <div className="flow-node data-source-node">
            <div className="node-header"> Data Source</div>
            <div className="node-body">
                <span>{data?.label || 'Turbine Telemetry'}</span>
            </div>
            <Handle type="source" position={Position.Right} id="output" />
        </div>
    );
}