const mongoose = require('mongoose');
const crypto = require('crypto');

const alertSchema = new mongoose.Schema({
  alertId: {
    type: String,
    unique: true,
    default: () => 'ALT-' + crypto.randomBytes(4).toString('hex').toUpperCase()
  },
  pipelineId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pipeline',
    required: true
  },
  deviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Device',
    required: true
  },
  level: {
    type: String,
    enum: ['info', 'warning', 'critical'],
    default: 'warning'
  },
  conditionTriggered: {
    type: String,
    required: true
  },
  telemetryValue: {
    type: Number,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  payloadSnapshot: {
    type: mongoose.Schema.Types.Mixed
  },
  acknowledged: {
    type: Boolean,
    default: false
  },
  acknowledgedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  acknowledgedAt: {
    type: Date
  }
}, {
  timestamps: true
});

alertSchema.index({ level: 1 });
alertSchema.index({ acknowledged: 1 });
alertSchema.index({ deviceId: 1 });
alertSchema.index({ pipelineId: 1 });

module.exports = mongoose.model('Alert', alertSchema);
