export enum Format {
    Reset = 0,
    BoldOn,
    Faint,
    ItalicOn,
    UnderlineOn,
    SlowBlinkOn,
    FastBlinkon,
    NegativeOn,
    ConcealOn,
    CrossedOutOn,
    PrimaryFont,
    AltFont1,
    AltFont2,
    AltFont3,
    AltFont4,
    AltFont5,
    AltFont6,
    AltFont7,
    AltFont8,
    AltFont9,
    Fraktur,
    BoldOff,
    NormalWeight,
    ItalicOff,
    UnderlineOff,
    BlinkOff,

    NegativeOff = 27,
    ConcealOff,
    CrossedOutOff,

    FramedOn = 51,
    EncircledOn,
    OverlineOn,
    EncircledOff,
    OverlineOff,

    IdeogramUnderlineOn = 60,
    IdeogramDoubleUnderlineOn,
    IdeogramOverlineOn,
    IdeogramDoubleOverline,
    IdeogramStressMarking,
    IdeogramsOff,
}

export enum FgColor {
    Black = 30,
    Red,
    Green,
    Yellow,
    Blue,
    Magenta,
    Cyan,
    White,
    Extended,
Default,
}
export enum BgColor {
    Black = 40,
    Red,
    Green,
    Yellow,
    Blue,
    Magenta,
    Cyan,
    White,
    Extended,
Default,
}
export enum IntenseFgColor {
    Black = 90,
    Red,
    Green,
    Yellow,
    Blue,
    Magenta,
    Cyan,
    White,
    Extended,
Default,
}

export enum IntenseBgColor {
    Black = 100,
    Red,
    Green,
    Yellow,
    Blue,
    Magenta,
    Cyan,
    White,
    Extended,
Default,
}

export class EscapeCode {
    csiValidator(input: string) {
        let byte1 = input.charCodeAt(0);
        let byte2 = input.charCodeAt(1);

        if (byte1 === 0x1b && byte2 < 0x40 && byte2 > 0x5f) {
            return true;
        }

        return false;
    }
}

export class SGR extends EscapeCode {
    public formats: Array<Format>;
    public fgColor: FgColor;
    public bgColor: BgColor;
    public intenseFgColor: IntenseFgColor;
    public intenseBgColor: IntenseBgColor;

    constructor(input: string) {
        super();
        this.formats = new Array();
        input.split(";").forEach((n) => {
            let code = parseInt(n);
            if (between(code, [0, 29]) || between(code, [50, 65])) {
                this.formats.push(code);
            }

            if (between(code, [30, 39])) {
                this.fgColor = code;
            }

            if (between(code, [40, 49])) {
                this.bgColor = code;
            }

            if (between(code, [66, 89])) {
                // undefined
            }

            if (between(code, [90, 97])) {
                this.intenseFgColor = code;
            }

            if (between(code, [100, 107])) {
                this.intenseBgColor = code;
            }
        });
    }

    public static isSGR(input: string) {
        let parser = new SGRParser(input);
        return parser.parse();
    }
}

type SGRParserStates = "pre-start"
    | "first-digit"
    | "pre-digit"
    | "second-digit"
    | "semicolon"
    | "escape"
    | "left-brace"
    | "terminator"
    | "!error"

class ParseError extends SyntaxError {
    public column: number;
    public state: SGRParserStates;

    constructor(state, message) {
        super(message);
        this.state = state;
    }
}

class SGRParser {
    private state: SGRParserStates;
    private input: string;
    constructor(input: string) {
        this.input = input;
        this.state = "pre-start";
    }

    public parse() {
        return this._parse(this.input, 0);
    }

    private _parse(input: string, column: number) {
        let newState;
        try {
            newState = this.transitionState(input[0]);
        }
        catch (err) {
            err.column = column;
            console.log(`[state:${err.state}, column:${column}]: ${err.message}`);
            return false;
        }

        let tail = input.slice(1);
        if (tail.length === 0) {
            return true;
        }
        return this._parse(tail, column + 1);
    };


    private transitionState(c): SGRParserStates {
        let parseError = new ParseError(this.state, `unexpected character "${c}"`);

        switch (this.state) {
        case "pre-start":
            if (c === "\x1b") {
                return this.state = "escape";
            }
            else {
                throw parseError;
            }

        case "escape":
            if (c === "[") {
                return this.state = "left-brace";
            }
            else {
                throw parseError;
            }

        case "semicolon":
            if (/^\d$/.test(c)) {
                return this.state = "first-digit";
            }
            else {
                throw parseError;
            }

        case "left-brace":
            if (/^\d$/.test(c)) {
                return this.state = "first-digit";

            }
            else if (c === "m") {
                return this.state = "terminator";
            }
            else {
                throw parseError;
            }

        case "pre-digit":
            if (/^\d$/.test(c)) {
                return this.state = "first-digit";
            }
            else {
                throw parseError;
            }

        case "first-digit":
            if (/^\d$/.test(c)) {
                return this.state = "second-digit";
            }
            else if (c === ";") {
                return this.state = "semicolon";
            }
            else if (c === "m") {
                return this.state = "terminator";
            }
            else {
                throw parseError;
            }

        case "second-digit":
            if (c === ";") {
                return this.state = "semicolon";
            }
            else if (c === "m") {
                return this.state = "terminator";
            }
            else {
                throw parseError;
            }

        default:
        case "terminator":
            throw parseError;
        }

    }
}

function between(input, [l, h]) {
    return input >= l && input <= h;
}
