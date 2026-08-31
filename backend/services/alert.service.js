class AlertService {
    constructor() {
        this.alerts = [];
    }

    createAlert(alert) {
        const newAlert = {
            id: Date.now().toString(),
            ...alert,
            createdAt: new Date()
        };

        this.alerts.push(newAlert);

        console.log('Alert created:', newAlert);
        
        const { getIO } = require('../sockets');
        const io = getIO();
        if (io) {
            io.emit('rule:alert', newAlert);
        }

        return newAlert;
    }

    getAlerts() {
       return this.alerts;
    }

    clearAlerts() {
        this.alerts = [];
    }
}

module.exports = AlertService;
