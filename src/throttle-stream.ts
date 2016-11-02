import stream = require("stream");

export class ThrottleStream extends stream.Transform {
    public readonly delayIncrement: number;
    public readonly predicate: Function;
    private nextEvent: number;

    constructor(ms: number, predicate?: Function) {
        super({objectMode: true});
        this.predicate = predicate || (() => true);
        this.delayIncrement = ms;
        this.nextEvent = 0;
    }

    _flush(callback: Function) {
        const now = Date.now();
        const currentNextEvent = Math.max(now, this.nextEvent);
        const timeout = currentNextEvent - now;
        setTimeout(callback, timeout);
    }

    _transform(chunk: any, encoding: string, cb: Function) {
        encoding;

        if (!this.predicate(chunk)) {
            this.push(chunk);
            return cb();
        }

        const now = Date.now();
        const currentNextEvent = Math.max(now, this.nextEvent);
        const timeout = currentNextEvent - now;

        setTimeout(() => {
            this.push(chunk);
            return cb();
        }, timeout);

        this.nextEvent = currentNextEvent + this.delayIncrement;
    }
}
