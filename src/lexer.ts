import stream = require("stream");
import {
    isNumber,
    isLetter,
    isSemicolon,
    isLeftBrace,
    isEscape,
} from "./character-predicates";

export interface Token {
    type: "number" | "letter" | "semicolon" | "lbrace" | "escape" | "unknown";
    content: string;
}

export class Lexer extends stream.Transform {
    constructor() {
        super({objectMode: true});
    }

    _transform(chunk: string | Buffer, encoding: string, callback: Function) {
        // We don't use encoding but this makes the typechecker happy.
        encoding;

        if (Buffer.isBuffer(chunk)) {
            chunk = chunk.toString();
        }

        for (let chr of chunk) {
            let event: Token = {type: "unknown", content: chr};

            if (isNumber(chr)) {
                event.type =  "number";
            }

            else if (isLetter(chr)) {
                event.type = "letter";
            }

            else if (isSemicolon(chr)) {
                event.type = "semicolon";
            }

            else if (isLeftBrace(chr)) {
                event.type = "lbrace";
            }

            else if (isEscape(chr)) {
                event.type = "escape";
            }

            this.push(event);
        }

        return callback();
    }
}
