const mongoose = require('mongoose');

const pipelineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Pipeline name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    enum: ['Anomalies', 'Predictive Maintenance', 'Alerting', 'Data Filtering', 'Custom'],
    default: 'Anomalies'
  },
  graphData: {
    nodes: [{
      id: { type: String, required: true },
      type: { 
        type: String, 
        required: true,
        enum: ['dataSourceNode', 'mathFilterNode', 'movingAverageNode', 'conditionNode', 'actionTriggerNode', 'webhookNode']
      },
      position: {
        x: { type: Number, default: 0 },
        y: { type: Number, default: 0 }
      },
      data: { type: mongoose.Schema.Types.Mixed, default: {} }
    }],
    edges: [{
      id: { type: String, required: true },
      source: { type: String, required: true },
      target: { type: String, required: true },
      sourceHandle: { type: String },
      targetHandle: { type: String },
      label: { type: String },
      animated: { type: Boolean, default: true }
    }]
  },
  isActive: {
    type: Boolean,
    default: true
  },
  version: {
    type: Number,
    default: 1
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  executionStats: {
    totalRuns: { type: Number, default: 0 },
    lastTriggeredAt: { type: Date },
    errorCount: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

pipelineSchema.index({ isActive: 1 });
pipelineSchema.index({ author: 1 });
pipelineSchema.index({ category: 1 });

module.exports = mongoose.model('Pipeline', pipelineSchema);
