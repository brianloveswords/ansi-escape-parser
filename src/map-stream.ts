import stream = require("stream");

export class MapStream extends stream.Transform {
    mapFn: Function;
    constructor(mapFn: Function) {
        super({objectMode: true});
        this.mapFn = mapFn;
    }

    _transform(chunk: any, encoding: string, cb: Function) {
        if (this.mapFn.length < 3) {
            this.push(this.mapFn(chunk, encoding));
            return cb();
        }
        else {
            return this.push(this.mapFn(chunk, encoding, cb));
        }
    }
}
