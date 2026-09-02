const { Subject } = require('rxjs');
const { bufferTime, filter } = require('rxjs/operators');

class TelemetryHub {
    constructor() {
        this.subjects = new Map();
        this.globalSubject = new Subject();
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
        
        this.globalSubject.next(point);
    }
    
    getGlobalStream() {
        return this.globalSubject.asObservable().pipe(
            bufferTime(1000),
            filter(points => points.length > 0)
        );
    }
}

module.exports = TelemetryHub;