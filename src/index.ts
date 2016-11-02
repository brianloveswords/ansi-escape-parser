import { Lexer } from "./lexer";
import { AnsiEscapeParser } from "./parser";
import { ThrottleStream } from "./throttle-stream";
import { MapStream } from "./map-stream";

const stdin = process.stdin;
const stdout = process.stdout;

stdin
    .pipe(new Lexer())
    .pipe(new AnsiEscapeParser())
    .pipe(new ThrottleStream(250, (chunk) => chunk.type !== "escape-code"))
    .pipe(new MapStream((chunk) => chunk.content))
    .pipe(stdout);
