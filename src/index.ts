import { AnsiEscapeLexer } from "./lexer";
import { AnsiEscapeParser } from "./parser";
import { ThrottleStream } from "./throttle-stream";
import { MapStream } from "./map-stream";

const stdin = process.stdin;
const stdout = process.stdout;

stdin
    .pipe(new AnsiEscapeLexer())
    .pipe(new AnsiEscapeParser())
    .pipe(new ThrottleStream(50, (chunk) => chunk.type !== "escape-code"))
    .pipe(new MapStream((chunk) => chunk.content))
    .pipe(stdout);
