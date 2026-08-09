const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    required: [true, 'Device ID is required'],
    unique: true,
    uppercase: true,
    trim: true
  },
  deviceName: {
    type: String,
    required: [true, 'Device Name is required'],
    trim: true
  },
  deviceType: {
    type: String,
    required: [true, 'Device Type is required'],
    enum: [
      'Turbine Sensor',
      'Temperature Sensor',
      'Vibration Monitor',
      'Pressure Gauge',
      'Flow Meter',
      'Power Analyzer'
    ]
  },
  location: {
    type: String,
    default: 'Unassigned Zone',
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'maintenance'],
    default: 'active'
  },
  metrics: [{
    type: String,
    enum: ['temperature', 'vibration', 'pressure', 'rpm', 'power_kw', 'flow_rate']
  }],
  hardwareConfig: {
    minRange: { type: Number, default: 0 },
    maxRange: { type: Number, default: 100 },
    samplingRateHz: { type: Number, default: 1 },
    unit: { type: String, default: 'units' }
  },
  tags: [{
    type: String,
    trim: true
  }],
  lastActiveAt: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

deviceSchema.index({ status: 1 });
deviceSchema.index({ deviceType: 1 });
deviceSchema.index({ location: 1 });

module.exports = mongoose.model('Device', deviceSchema);
