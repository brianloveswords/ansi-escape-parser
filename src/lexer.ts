import stream = require("stream");


export class Lexer extends stream.Transform {
    constructor() {
        super({objectMode: true});
    }

    _transform(chunk: string | Buffer, encoding: string, callback: Function) {
        chunk; encoding; callback;
        for (let c of chunk) {
            this.push({type: "number", content: c});
        }
        return callback();
    }
}
