import { AnsiEscapeLexer } from "./lexer";
import { ThrottleStream } from "./throttle-stream";
import { MapStream } from "./map-stream";
import { AnsiEscapeParser } from "./parser";

const stdin = process.stdin;
const stdout = process.stdout;
const delay = parseInt(process.argv[2]);

stdin
    .pipe(new AnsiEscapeLexer())
    // .pipe(new AnsiEscapeParser())
    .pipe(new ThrottleStream(delay, (chunk) => chunk.type !== "escape-code"))
    .pipe(new MapStream((chunk) => chunk.content))
    .pipe(stdout);
