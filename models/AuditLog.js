const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
    enum: [
      'INGESTION_BURST',
      'PIPELINE_CREATED',
      'PIPELINE_COMPILED',
      'PIPELINE_DEACTIVATED',
      'RULE_TRIGGERED',
      'DEVICE_REGISTERED',
      'DEVICE_STATUS_CHANGED',
      'ALERT_ACKNOWLEDGED'
    ]
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  ipAddress: {
    type: String,
    default: '127.0.0.1'
  }
}, {
  timestamps: true
});

auditLogSchema.index({ action: 1 });
auditLogSchema.index({ createdAt: -1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
