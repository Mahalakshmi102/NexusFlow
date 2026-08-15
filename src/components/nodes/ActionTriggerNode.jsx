import React from'react';
import { Handle, Position} from 'reactflow';
import './nodes.css';

export default function ActionTriggerNode({data}) {
    return (
        <div className="flow-node action-node">
            <Handle type="target" position={Position-Left} id="input" />
            <div className="node-header"> Action Trigger</div>
            <div className="node-body">
                <span>{data?.lable ||'Trigger Alert'}</span>
            </div>
        </div>
    );
}