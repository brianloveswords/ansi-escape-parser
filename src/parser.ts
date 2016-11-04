import stream = require("stream");
import { Token } from "./lexer";
export class AnsiEscapeParser extends stream.Transform {

    constructor() {
        super({objectMode: true});
    }

    _transform(token: Token, encoding: string, callback: Function) {

    }
}
