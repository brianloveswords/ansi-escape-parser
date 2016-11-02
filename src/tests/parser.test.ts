import stream = require("stream");
import { expect } from "chai";
import { Lexer } from "../lexer";
import { AnsiEscapeParser } from "../parser";

describe("Lexer", () => {

    describe("constructor", () => {
        it("should construct", () => {
            let parser = new AnsiEscapeParser();
            expect(parser).to.be.instanceOf(AnsiEscapeParser);
            expect(parser).to.be.instanceOf(stream.Stream);
            expect(parser).to.be.instanceOf(stream.Transform);
        });
    });

    describe("write()", () => {
        it("should be able to parse escape codes", (done) => {
            let chunks = new Array();
            let lexer = new Lexer();
            let parser = new AnsiEscapeParser();

            lexer.pipe(parser);
            lexer.write("cal\x1b[01;31m\x1b[Kzone\x1b[m\x1b[Ks");
            lexer.end();

            parser.on("data", (chunk) => {
                chunks.push(chunk);
            });

            parser.on("end", () => {
                expect(chunks).to.eql([
                    { type: "letter", content: "c" },
                    { type: "letter", content: "a" },
                    { type: "letter", content: "l" },
                    { type: "escape-code", content: "\u001b[01;31m" },
                    { type: "escape-code", content: "\u001b[K" },
                    { type: "letter", content: "z" },
                    { type: "letter", content: "o" },
                    { type: "letter", content: "n" },
                    { type: "letter", content: "e" },
                    { type: "escape-code", content: "\u001b[m" },
                    { type: "escape-code", content: "\u001b[K" },
                    { type: "letter", content: "s" },
                ]);
                done();
            });
        });
    });
});
