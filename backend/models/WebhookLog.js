const mongoose = require('mongoose');

const webhookLogSchema = new mongoose.Schema({
  webhook: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Webhook',
    required: true
  },
  status: {
    type: String,
    enum: ['SUCCESS', 'FAILED'],
    required: true
  },
  requestPayload: {
    type: mongoose.Schema.Types.Mixed
  },
  responseStatus: {
    type: Number
  },
  responseBody: {
    type: mongoose.Schema.Types.Mixed
  },
  error: {
    type: String
  },
  executionTimeMs: {
    type: Number
  }
}, {
  timestamps: true
});

webhookLogSchema.index({ webhook: 1 });
webhookLogSchema.index({ createdAt: -1 });

module.exports = mongoose.model('WebhookLog', webhookLogSchema);
