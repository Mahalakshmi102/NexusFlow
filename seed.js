const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const { User, Device, Pipeline, Telemetry, Alert, AuditLog } = require('./models');
const { connectDB, disconnectDB } = require('./config/db');

const seedDatabase = async () => {
  console.log('🚀 Starting NexusFlow Database Seeding process...\n');
  
  await connectDB();

  try {
    // 1. Clear existing collections
    console.log('🧹 Clearing existing collections...');
    await User.deleteMany({});
    await Device.deleteMany({});
    await Pipeline.deleteMany({});
    await Telemetry.deleteMany({});
    await Alert.deleteMany({});
    await AuditLog.deleteMany({});
    console.log('✓ Collections cleared.\n');

    // 2. Seed Users
    console.log('👤 Seeding Users...');
    const salt = await bcrypt.genSalt(10);
    const defaultPasswordHash = await bcrypt.hash('Password123!', salt);

    const adminUser = await User.create({
      username: 'admin',
      email: 'admin@nexusflow.io',
      passwordHash: defaultPasswordHash,
      role: 'admin',
      apiKey: 'nf_live_admin_9a8b7c6d5e4f3a2b1c'
    });

    const managerUser = await User.create({
      username: 'floor_manager',
      email: 'manager@nexusflow.io',
      passwordHash: defaultPasswordHash,
      role: 'manager',
      apiKey: 'nf_live_mgr_112233445566778899'
    });

    const operatorUser = await User.create({
      username: 'technician',
      email: 'tech@nexusflow.io',
      passwordHash: defaultPasswordHash,
      role: 'operator',
      apiKey: 'nf_live_op_aabbccddeeff001122'
    });

    console.log(`✓ Seeded ${3} users. Admin ID: ${adminUser._id}`);

    // 3. Seed IoT Devices
    console.log('\n📟 Seeding IoT Hardware Devices...');
    const devicesData = [
      {
        deviceId: 'DEV-TURBINE-001',
        deviceName: 'Main Turbine Sensor Alpha',
        deviceType: 'Turbine Sensor',
        location: 'Factory Floor A - Zone 1',
        status: 'active',
        metrics: ['temperature', 'vibration', 'rpm'],
        hardwareConfig: { minRange: 0, maxRange: 150, samplingRateHz: 10, unit: '°C' },
        tags: ['critical', 'turbine', 'floor-a'],
        createdBy: managerUser._id
      },
      {
        deviceId: 'DEV-BOILER-002',
        deviceName: 'Boiler Chamber Temp Sensor',
        deviceType: 'Temperature Sensor',
        location: 'Thermal Plant - Bay 2',
        status: 'active',
        metrics: ['temperature'],
        hardwareConfig: { minRange: 0, maxRange: 300, samplingRateHz: 2, unit: '°C' },
        tags: ['high-temp', 'boiler'],
        createdBy: managerUser._id
      },
      {
        deviceId: 'DEV-HYD-003',
        deviceName: 'Hydraulic Line Pressure Gauge',
        deviceType: 'Pressure Gauge',
        location: 'Assembly Line 3',
        status: 'active',
        metrics: ['pressure'],
        hardwareConfig: { minRange: 0, maxRange: 200, samplingRateHz: 5, unit: 'PSI' },
        tags: ['hydraulic', 'assembly'],
        createdBy: operatorUser._id
      },
      {
        deviceId: 'DEV-VIB-004',
        deviceName: 'Motor Bearing Vibration Analyzer',
        deviceType: 'Vibration Monitor',
        location: 'Compressor Station 1',
        status: 'maintenance',
        metrics: ['vibration'],
        hardwareConfig: { minRange: 0, maxRange: 50, samplingRateHz: 20, unit: 'Hz' },
        tags: ['vibration', 'motor'],
        createdBy: managerUser._id
      },
      {
        deviceId: 'DEV-PWR-005',
        deviceName: 'Substation Power Analyzer',
        deviceType: 'Power Analyzer',
        location: 'Main Substation',
        status: 'active',
        metrics: ['power_kw'],
        hardwareConfig: { minRange: 0, maxRange: 1000, samplingRateHz: 1, unit: 'kW' },
        tags: ['energy', 'substation'],
        createdBy: adminUser._id
      }
    ];

    const seededDevices = await Device.insertMany(devicesData);
    const turbineDevice = seededDevices.find(d => d.deviceId === 'DEV-TURBINE-001');
    const hydDevice = seededDevices.find(d => d.deviceId === 'DEV-HYD-003');
    console.log(`✓ Seeded ${seededDevices.length} IoT hardware devices.`);

    // 4. Seed React Flow Visual Rule Pipelines
    console.log('\n🔀 Seeding React Flow Visual Rule Pipelines...');
    const pipelinesData = [
      {
        name: 'Turbine High-Temperature & Anomaly Pipeline',
        description: 'Monitors DEV-TURBINE-001 temperature. Applies a 60-second moving average filter and triggers critical SMS & Webhook alerts if moving average exceeds 80°C.',
        category: 'Anomalies',
        isActive: true,
        version: 1,
        author: managerUser._id,
        executionStats: {
          totalRuns: 1420,
          lastTriggeredAt: new Date(Date.now() - 15 * 60 * 1000),
          errorCount: 0
        },
        graphData: {
          nodes: [
            {
              id: 'node-src-1',
              type: 'dataSourceNode',
              position: { x: 50, y: 150 },
              data: {
                label: 'Turbine Telemetry Stream',
                deviceId: turbineDevice._id.toString(),
                deviceCode: 'DEV-TURBINE-001',
                metric: 'temperature'
              }
            },
            {
              id: 'node-avg-2',
              type: 'movingAverageNode',
              position: { x: 300, y: 150 },
              data: {
                label: '60s Moving Average Filter',
                windowSeconds: 60,
                smoothingFactor: 0.2
              }
            },
            {
              id: 'node-cond-3',
              type: 'conditionNode',
              position: { x: 550, y: 150 },
              data: {
                label: 'Temp Threshold Check (>80°C)',
                operator: 'GREATER_THAN',
                threshold: 80,
                unit: '°C'
              }
            },
            {
              id: 'node-act-4',
              type: 'actionTriggerNode',
              position: { x: 800, y: 100 },
              data: {
                label: 'Dispatch SMS Alert',
                alertLevel: 'critical',
                recipientRole: 'floor_manager',
                messageTemplate: 'CRITICAL: Turbine Temperature breached threshold! Current value: {{value}}°C'
              }
            },
            {
              id: 'node-web-5',
              type: 'webhookNode',
              position: { x: 800, y: 220 },
              data: {
                label: 'External Webhook Dispatch',
                targetUrl: 'https://api.factoryops.com/webhooks/alerts',
                method: 'POST'
              }
            }
          ],
          edges: [
            { id: 'e1-2', source: 'node-src-1', target: 'node-avg-2', animated: true, label: 'Raw Data Stream' },
            { id: 'e2-3', source: 'node-avg-2', target: 'node-cond-3', animated: true, label: 'Filtered Stream' },
            { id: 'e3-4', source: 'node-cond-3', target: 'node-act-4', animated: true, label: 'Threshold Exceeded' },
            { id: 'e3-5', source: 'node-cond-3', target: 'node-web-5', animated: true, label: 'Trigger Event' }
          ]
        }
      },
      {
        name: 'Hydraulic Pressure Safety Cutoff Pipeline',
        description: 'Monitors DEV-HYD-003 hydraulic pressure for sudden over-pressurization above 150 PSI.',
        category: 'Predictive Maintenance',
        isActive: true,
        version: 1,
        author: managerUser._id,
        executionStats: {
          totalRuns: 512,
          lastTriggeredAt: new Date(Date.now() - 2 * 3600 * 1000),
          errorCount: 0
        },
        graphData: {
          nodes: [
            {
              id: 'hnode-1',
              type: 'dataSourceNode',
              position: { x: 50, y: 150 },
              data: {
                label: 'Hydraulic Pressure Source',
                deviceId: hydDevice._id.toString(),
                deviceCode: 'DEV-HYD-003',
                metric: 'pressure'
              }
            },
            {
              id: 'hnode-2',
              type: 'conditionNode',
              position: { x: 320, y: 150 },
              data: {
                label: 'Pressure > 150 PSI',
                operator: 'GREATER_THAN',
                threshold: 150,
                unit: 'PSI'
              }
            },
            {
              id: 'hnode-3',
              type: 'actionTriggerNode',
              position: { x: 600, y: 150 },
              data: {
                label: 'Emergency Cutoff Trigger',
                alertLevel: 'warning',
                recipientRole: 'technician',
                messageTemplate: 'WARNING: Hydraulic pressure spike detected ({{value}} PSI).'
              }
            }
          ],
          edges: [
            { id: 'he1-2', source: 'hnode-1', target: 'hnode-2', animated: true },
            { id: 'he2-3', source: 'hnode-2', target: 'hnode-3', animated: true }
          ]
        }
      }
    ];

    const seededPipelines = await Pipeline.insertMany(pipelinesData);
    console.log(`✓ Seeded ${seededPipelines.length} visual rule pipelines.`);

    // 5. Seed Time-Series Telemetry Data
    console.log('\n📈 Generating high-volume Time-Series Telemetry data (1,000+ data points)...');
    const telemetryBatch = [];
    const now = Date.now();
    const hoursBack = 12;
    const intervalSeconds = 30; // One reading every 30s per device
    const totalSteps = (hoursBack * 3600) / intervalSeconds;

    for (let i = totalSteps; i >= 0; i--) {
      const timestamp = new Date(now - i * intervalSeconds * 1000);

      // Turbine Telemetry (Base ~65°C, with occasional spikes over 80°C)
      const isTurbineSpike = (i >= 20 && i <= 30); // Spike near recent timeframe
      const turbineTemp = isTurbineSpike 
        ? 82.5 + Math.random() * 6.5 
        : 65.0 + (Math.sin(i / 10) * 4) + (Math.random() * 2);

      telemetryBatch.push({
        timestamp,
        metadata: {
          deviceId: turbineDevice._id,
          deviceCode: turbineDevice.deviceId,
          sensorType: turbineDevice.deviceType,
          metric: 'temperature',
          unit: '°C',
          location: turbineDevice.location
        },
        value: Number(turbineTemp.toFixed(2)),
        qualityScore: 0.99,
        status: isTurbineSpike ? 'critical' : (turbineTemp > 75 ? 'warning' : 'normal')
      });

      // Hydraulic Pressure Telemetry (Base ~120 PSI)
      const hydPressure = 120 + (Math.cos(i / 8) * 15) + (Math.random() * 5);
      telemetryBatch.push({
        timestamp,
        metadata: {
          deviceId: hydDevice._id,
          deviceCode: hydDevice.deviceId,
          sensorType: hydDevice.deviceType,
          metric: 'pressure',
          unit: 'PSI',
          location: hydDevice.location
        },
        value: Number(hydPressure.toFixed(2)),
        qualityScore: 1.0,
        status: hydPressure > 145 ? 'warning' : 'normal'
      });
    }

    await Telemetry.insertMany(telemetryBatch);
    console.log(`✓ Seeded ${telemetryBatch.length} MongoDB Time-Series telemetry documents.`);

    // 6. Seed Triggered Alerts
    console.log('\n🚨 Seeding Alert History...');
    const alertData = [
      {
        pipelineId: seededPipelines[0]._id,
        deviceId: turbineDevice._id,
        level: 'critical',
        conditionTriggered: 'Temp Threshold Check (>80°C)',
        telemetryValue: 86.4,
        message: 'CRITICAL: Turbine Temperature breached threshold! Current value: 86.4°C',
        payloadSnapshot: {
          movingAverage60s: 84.1,
          spikeDurationSeconds: 120,
          triggeredNodeId: 'node-cond-3'
        },
        acknowledged: true,
        acknowledgedBy: managerUser._id,
        acknowledgedAt: new Date(Date.now() - 10 * 60 * 1000)
      },
      {
        pipelineId: seededPipelines[0]._id,
        deviceId: turbineDevice._id,
        level: 'warning',
        conditionTriggered: 'Temp Threshold Check (>80°C)',
        telemetryValue: 81.2,
        message: 'WARNING: Turbine Temperature approaching critical zone: 81.2°C',
        payloadSnapshot: {
          movingAverage60s: 79.8,
          triggeredNodeId: 'node-cond-3'
        },
        acknowledged: false
      }
    ];

    await Alert.insertMany(alertData);
    console.log(`✓ Seeded ${alertData.length} alert logs.`);

    // 7. Seed Audit Logs
    console.log('\n📋 Seeding Ingestion & Rule Audit Logs...');
    await AuditLog.create([
      {
        action: 'INGESTION_BURST',
        details: { writeRatePerSec: 5200, storageSavingsPercent: '78%', collection: 'telemetries' },
        performedBy: adminUser._id
      },
      {
        action: 'PIPELINE_COMPILED',
        details: { pipelineId: seededPipelines[0]._id, nodesCompiled: 5, rxJsObservablesCreated: 3 },
        performedBy: managerUser._id
      }
    ]);
    console.log('✓ Seeded Audit Logs.\n');

    console.log('🎉 NexusFlow Database Seeding completed successfully!');
    console.log('----------------------------------------------------');
    console.log(`Summary:`);
    console.log(`- Users: ${await User.countDocuments()}`);
    console.log(`- Devices: ${await Device.countDocuments()}`);
    console.log(`- Visual Rule Pipelines: ${await Pipeline.countDocuments()}`);
    console.log(`- Time-Series Telemetry Documents: ${await Telemetry.countDocuments()}`);
    console.log(`- Alert Logs: ${await Alert.countDocuments()}`);
    console.log(`- Audit Logs: ${await AuditLog.countDocuments()}`);
    console.log('----------------------------------------------------');

  } catch (error) {
    console.error('❌ Seeding failed with error:', error);
  } finally {
    await disconnectDB();
  }
};

// Run if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
