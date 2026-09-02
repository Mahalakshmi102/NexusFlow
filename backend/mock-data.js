const http = require('http');

const API_URL = 'http://localhost:5000/api/telemetry';

function generateData() {
  return {
    deviceId: 'sensor-1',
    sensorType: 'environment',
    temperature: Math.floor(Math.random() * (95 - 68 + 1)) + 68,
    humidity: Math.floor(Math.random() * (70 - 45 + 1)) + 45,
    pressure: 1013,
    timestamp: new Date().toISOString()
  };
}

const agent = new http.Agent({ keepAlive: true });

function sendData() {
  const data = JSON.stringify(generateData());

  const options = {
    method: 'POST',
    agent: agent,
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  const req = http.request(API_URL, options, (res) => {
    // console.log(`statusCode: ${res.statusCode}`);
  });

  req.on('error', (error) => {
    console.error('Error sending data:', error);
  });

  req.write(data);
  req.end();
}

console.log('Starting mock telemetry generator. Sending data every 10ms...');
setInterval(sendData, 10); // 100 times per second
