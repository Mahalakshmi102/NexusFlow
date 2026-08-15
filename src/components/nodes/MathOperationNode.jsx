import React, {useState} from 'react';
import { Handle, Position} from 'reactflow';
import './nodes.css';

export default function MathOperationNode ({ data, id}) {
    const [threshold, setThreshold] = useState(data?.threshold ?? 80);

    const handleThresholdChange = (e) => {
        const value = e.target.value;
        setThreshold(value);
        if (data && data.onChange) {
            data.onCharge(id, value);
        }
    };

    return (
        <div className="flow-node math-node">
            {/* Input Handle */}
            <Handle type="target" position={Position.Left} id="input" />

            <div className="node-header">Math Operation</div>

            <div className="node-body">
                <label className="node-label">Condition: &gt; Threshold</label>
                <div className="input-group">
                    <input 
                    type="number"
                    className="node-input"
                    value={threshold}
                    onChange={handleThresholdChange}
                    placeholder="e.g. 80"
                    />
                    <span className="input-unit">C / val</span>
                </div>
            </div>

            {/* Output Handle*/}
            <Handle type="source" position={Position.Right} id="output" />
        </div>
    
    );
} 