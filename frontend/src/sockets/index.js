let io = null;

function initIO(server) {
    io = server;
}

function getIO() {
    return io;
}

module.exports = {
    initIO,
    getIO
};
