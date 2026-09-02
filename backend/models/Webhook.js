const mongoose = require('mongoose');

const webhookSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Webhook name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  url: {
    type: String,
    required: [true, 'Webhook URL is required'],
    trim: true
  },
  method: {
    type: String,
    enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    default: 'POST'
  },
  headers: [{
    key: { type: String, required: true },
    value: { type: String, required: true }
  }],
  payloadMapping: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  isActive: {
    type: Boolean,
    default: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastTriggeredAt: {
    type: Date
  },
  successCount: {
    type: Number,
    default: 0
  },
  errorCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

webhookSchema.index({ author: 1 });
webhookSchema.index({ isActive: 1 });

module.exports = mongoose.model('Webhook', webhookSchema);
