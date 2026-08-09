const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://localhost:27017/nexusflow';
    
    const conn = await mongoose.connect(connStr, {
      maxPoolSize: 50,
      minPoolSize: 5,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log(`[NexusFlow DB] Connected to MongoDB: ${conn.connection.host}/${conn.connection.name}`);

    // Event listeners
    mongoose.connection.on('error', (err) => {
      console.error(`[NexusFlow DB Error] MongoDB Connection Error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('[NexusFlow DB Warning] MongoDB Disconnected. Reconnecting...');
    });

    return conn;
  } catch (error) {
    console.error(`[NexusFlow DB Error] Initial connection failed: ${error.message}`);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    console.log('[NexusFlow DB] MongoDB Connection Closed.');
  } catch (error) {
    console.error(`[NexusFlow DB Error] Disconnect failed: ${error.message}`);
  }
};

module.exports = { connectDB, disconnectDB };
