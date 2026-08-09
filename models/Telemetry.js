const mongoose = require('mongoose');

const telemetrySchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    required: true,
    default: Date.now
  },
  metadata: {
    deviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Device',
      required: true
    },
    deviceCode: {
      type: String,
      required: true
    },
    sensorType: {
      type: String,
      required: true
    },
    metric: {
      type: String,
      required: true,
      enum: ['temperature', 'vibration', 'pressure', 'rpm', 'power_kw', 'flow_rate']
    },
    unit: {
      type: String,
      default: 'units'
    },
    location: {
      type: String
    }
  },
  value: {
    type: Number,
    required: true
  },
  qualityScore: {
    type: Number,
    default: 1.0,
    min: 0,
    max: 1
  },
  status: {
    type: String,
    enum: ['normal', 'warning', 'critical'],
    default: 'normal'
  }
}, {
  timeseries: {
    timeField: 'timestamp',
    metaField: 'metadata',
    granularity: 'seconds' // High-frequency IoT telemetry optimization
  }
});

// Secondary index on metadata fields for aggregated time-series queries
telemetrySchema.index({ 'metadata.deviceCode': 1, timestamp: -1 });
telemetrySchema.index({ 'metadata.metric': 1, timestamp: -1 });
telemetrySchema.index({ status: 1 });

module.exports = mongoose.model('Telemetry', telemetrySchema);
