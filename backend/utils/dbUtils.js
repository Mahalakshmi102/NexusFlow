const { Telemetry, Alert, Device, Pipeline } = require('../models');
const mongoose = require('mongoose');

/**
 * Ensures indexes and time-series collections exist.
 */
const initializeIndexes = async () => {
  try {
    console.log('[NexusFlow DB Utils] Syncing indexes across all collections...');
    await Device.syncIndexes();
    await Pipeline.syncIndexes();
    await Alert.syncIndexes();
    console.log('[NexusFlow DB Utils] Indexes synchronized successfully.');
  } catch (error) {
    console.error(`[NexusFlow DB Utils Error] Index sync failed: ${error.message}`);
  }
};

/**
 * Aggregates Time-Series telemetry over a window (e.g. 5m, 1h) for device metric visualization.
 */
const getAggregatedTelemetry = async (deviceCode, metric, startTime, endTime, intervalMinutes = 5) => {
  return await Telemetry.aggregate([
    {
      $match: {
        'metadata.deviceCode': deviceCode,
        'metadata.metric': metric,
        timestamp: { $gte: new Date(startTime), $lte: new Date(endTime) }
      }
    },
    {
      $group: {
        _id: {
          $dateTrunc: {
            date: '$timestamp',
            unit: 'minute',
            binSize: intervalMinutes
          }
        },
        avgValue: { $avg: '$value' },
        minValue: { $min: '$value' },
        maxValue: { $max: '$value' },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id': 1 } }
  ]);
};

/**
 * Computes Moving Average for dynamic rule engine evaluation.
 */
const getMovingAverage = async (deviceId, metric, windowSeconds = 60) => {
  const windowStart = new Date(Date.now() - windowSeconds * 1000);
  
  const result = await Telemetry.aggregate([
    {
      $match: {
        'metadata.deviceId': new mongoose.Types.ObjectId(deviceId),
        'metadata.metric': metric,
        timestamp: { $gte: windowStart }
      }
    },
    {
      $group: {
        _id: '$metadata.deviceId',
        movingAverage: { $avg: '$value' },
        maxObserved: { $max: '$value' },
        dataPointsCount: { $sum: 1 }
      }
    }
  ]);

  return result[0] || { movingAverage: 0, maxObserved: 0, dataPointsCount: 0 };
};

module.exports = {
  initializeIndexes,
  getAggregatedTelemetry,
  getMovingAverage
};
