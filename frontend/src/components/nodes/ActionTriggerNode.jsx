import React, {useState} from 'react';
import {Handle, Position} from 'reactflow';
import './nodes.css';

export default function ActionTriggerNode({data, id}) {
    const [actionType, setActionType] = useState(data?.actionType || 'alert');

    const handleActionChange = (e) => {
        const value = e.target.value;
        setActionType(value);
        if (data.onChange) {
            data.onChange(id, value);
        }
    };

    return (
        <div className="flow-node action-node">
            {/* Input Handle */}
            <Handle type="target" position={Position.Left} id="input" />

            <div className="node-header"> Action Trigger</div>
            <div className="node-body">
                <label className="node-label">Select Action Type:</label>
                <select
                className="node-select"
                value={actionType}
                onChange={handleActionChange}
                >
                    <option value="alert"> Trigger ALert</option>
                    <option value="email"> Send Email</option>
                    <option value="sms">Send SMS</option>
                    <option value="webhook">Webhook Call</option>
                </select>
            </div>
        </div>
    );
}