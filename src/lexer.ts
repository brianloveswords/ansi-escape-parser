import stream = require("stream");
import {
    isNumber,
    isLetter,
    isSemicolon,
    isLeftBrace,
    isEscape,
} from "./character-predicates";

export interface Token {
    type: "number" | "letter" | "semicolon" | "lbrace" |
        "escape" | "escape-code" | "unknown";
    content: string;
}

export class AnsiEscapeLexer extends stream.Transform {
    public state: "text" | "escape";
    public buffer: String;

    constructor() {
        super({objectMode: true});
        this.state = "text";
        this.buffer = "";
    }

    _transform(chunk: string | Buffer, _: string, callback: Function) {
        if (Buffer.isBuffer(chunk)) {
            chunk = chunk.toString();
        }

        for (let chr of chunk) {
            let token: Token = {type: "unknown", content: chr};

            if (isNumber(chr)) { token.type =  "number"; }

            else if (isLetter(chr)) { token.type = "letter"; }

            else if (isSemicolon(chr)) { token.type = "semicolon"; }

            else if (isLeftBrace(chr)) { token.type = "lbrace"; }

            else if (isEscape(chr)) { token.type = "escape"; }

            if (this.state === "escape") {
                this.buffer += token.content;
                if (token.type === "letter") {
                    this.state = "text";
                    this.push({ type: "escape-code", content: this.buffer });
                }
            }

            else if (this.state === "text") {
                if (token.type === "escape") {
                    this.state = "escape";
                    this.buffer = token.content;
                }

                else {
                    this.push(token);
                }
            }
        }

        return callback();
    }
}
