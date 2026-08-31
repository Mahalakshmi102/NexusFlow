let io = null;

function initIO(server) {
    io = server;
    
    io.on('connection', (socket) => {
        console.log(`[Socket.io] Client connected: ${socket.id}`);
        
        socket.on('disconnect', () => {
            console.log(`[Socket.io] Client disconnected: ${socket.id}`);
        });
    });
}

function getIO() {
    return io;
}

function initSubscriptions(telemetryHub) {
    if (!io) return;
    
    telemetryHub.getGlobalStream().subscribe({
        next: (point) => {
            io.emit('telemetry:stream', point);
        },
        error: (err) => console.error('[Socket.io] Stream error:', err)
    });
}

module.exports = {
    initIO,
    getIO,
    initSubscriptions
};
