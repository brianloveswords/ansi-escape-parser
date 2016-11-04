import stream = require("stream");
import { Token } from "./lexer";
export class AnsiEscapeParser extends stream.Transform {

    constructor() {
        super({objectMode: true});
    }

    _transform(token: Token, encoding: string, callback: Function) {
        encoding;

        if (token.type !== "escape-code") {
            this.push(token);
            return callback();
        }
    }
}

function csiValidator(input: string) {
    let byte1 = input.charCodeAt(0);
    let byte2 = input.charCodeAt(1);

    if (byte1 !== 0x1b) {
        return false;
    }

    if (byte2 < 0x40 || byte2 > 0x5f) {
        return false;
    }
}
