const { Subject } = require('rxjs');

class TelemetryHub {
    constructor() {
        this.subjects = new Map();
    }

    forDevice(deviceId) {
        let subject = this.subjects.get(deviceId);

        if (!subject) {
            subject = new Subject();
            this.subjects.set(deviceId, subject);
        }

        return subject.asObservable();
    }

    push(deviceId, point) {
        const subject = this.subjects.get(deviceId);

        if (subject) {
            subject.next(point);
        }
    }
}

module.exports = TelemetryHub;