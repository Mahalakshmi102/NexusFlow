import React, {useState, useEffect} from 'react';
import {Handle, Position, useReactFlow} from 'reactflow';
import './nodes.css';

export default function ActionTriggerNode({data, id}) {
    const { setNodes } = useReactFlow();
    const [actionType, setActionType] = useState(data?.actionType || 'alert');
    const [webhooks, setWebhooks] = useState([]);
    const [selectedWebhookId, setSelectedWebhookId] = useState(data?.selectedWebhookId || '');

    useEffect(() => {
        if (actionType === 'webhook') {
            fetch('http://localhost:5000/api/webhooks')
                .then(res => res.json())
                .then(webhookData => {
                    setWebhooks(webhookData);
                    if (!selectedWebhookId && webhookData.length > 0) {
                        updateNodeData(actionType, webhookData[0]._id);
                    }
                })
                .catch(err => console.error('Failed to fetch webhooks', err));
        }
    }, [actionType]);

    const updateNodeData = (newActionType, newWebhookId) => {
        setActionType(newActionType);
        setSelectedWebhookId(newWebhookId);
        
        setNodes((nds) =>
            nds.map((n) => {
                if (n.id === id) {
                    n.data = {
                        ...n.data,
                        actionType: newActionType,
                        selectedWebhookId: newWebhookId
                    };
                }
                return n;
            })
        );
    };

    const handleActionChange = (e) => {
        const value = e.target.value;
        updateNodeData(value, selectedWebhookId);
    };

    const handleWebhookChange = (e) => {
        const value = e.target.value;
        updateNodeData(actionType, value);
    };

    return (
        <div className="flow-node action-node">
            <Handle type="target" position={Position.Left} id="input" />

            <div className="node-header"> Action Trigger</div>
            <div className="node-body">
                <label className="node-label">Select Action Type:</label>
                <select
                    className="node-select"
                    value={actionType}
                    onChange={handleActionChange}
                >
                    <option value="alert">Trigger Alert</option>
                    <option value="email">Send Email</option>
                    <option value="sms">Send SMS</option>
                    <option value="webhook">Webhook Call</option>
                </select>

                {actionType === 'webhook' && (
                    <div style={{marginTop: '10px'}}>
                        <label className="node-label">Select Webhook:</label>
                        <select
                            className="node-select"
                            value={selectedWebhookId}
                            onChange={handleWebhookChange}
                        >
                            <option value="">-- Select Webhook --</option>
                            {webhooks.map(wh => (
                                <option key={wh._id} value={wh._id}>{wh.name || wh.url}</option>
                            ))}
                        </select>
                    </div>
                )}
            </div>
        </div>
    );
}