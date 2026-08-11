const { MongoClient } = require('mongodb');

const MONGO_URL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017';
const MONGO_DB = process.env.MONGO_DB || 'nexusflow';

let _db = null;

async function connectToDb() {
    const client = new MongoClient(MONGO_URL);

    await client.connect();

    console.log('MongoDB connected successfully');

    const db = client.db(MONGO_DB);

    await ensureCollections(db);

    _db = db;

    return db;
}

function getDb() {
    if (!_db) {
        throw new Error('Database not initialized');
    }

    return _db;
}

async function ensureCollections(db) {
    const telemetryColls =
        await db.listCollections({ name: 'telemetry' }).toArray();

    if (telemetryColls.length === 0) {
        await db.createCollection('telemetry', {
            timeseries: {
                timeField: 'timestamp',
                metaField: 'metadata',
                granularity: 'seconds'
            }
        });

        console.log('Telemetry time-series collection created');
    }

    await db.collection('telemetry').createIndex({
        'metadata.deviceId': 1,
        timestamp: -1
    });

    const graphColls =
        await db.listCollections({ name: 'graphs' }).toArray();

    if (graphColls.length === 0) {
        await db.createCollection('graphs');

        console.log('Graphs collection created');
    }

    await db.collection('graphs').createIndex({
        name: 1
    });
}

module.exports = {
    connectToDb,
    getDb
};
