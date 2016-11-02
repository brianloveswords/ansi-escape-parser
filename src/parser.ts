import stream = require("stream");
import { Token } from "./lexer";
export class AnsiEscapeParser extends stream.Transform {
    public state: "text" | "escape";
    public buffer: String;

    constructor() {
        super({objectMode: true});
        this.state = "text";
        this.buffer = "";
    }

    _transform(token: Token, encoding: string, callback: Function) {
        encoding;

        if (this.state === "escape") {
            return this.parseAnsiEscape(token, callback);
        }

        if (this.state === "text") {
            return this.parseText(token, callback);
        }

    }

    parseAnsiEscape(token: Token, callback: Function) {
        this.buffer += token.content;
        if (token.type === "letter") {
            this.state = "text";
            this.push({ type: "escape-code", content: this.buffer });
        }
        return callback();
    }

    parseText(token: Token, callback: Function) {
        if (token.type === "escape") {
            this.state = "escape";
            this.buffer = token.content;
            return callback();
        }

        else {
            this.push(token);
            return callback();
        }
    }
}
