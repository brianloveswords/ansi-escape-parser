import stream = require("stream");
import { expect } from "chai";
import { AnsiEscapeLexer } from "../lexer";

describe("Lexer", () => {
    describe("constructor", () => {
        it("should construct", () => {
            let lexer = new AnsiEscapeLexer();
            expect(lexer).to.be.instanceOf(AnsiEscapeLexer);
            expect(lexer).to.be.instanceOf(stream.Stream);
            expect(lexer).to.be.instanceOf(stream.Transform);
        });
    });

    describe("write()", () => {
        it("should emit numbers", (done) => {
            let events = new Array();
            let lexer = new AnsiEscapeLexer();
            let input = "123";
            lexer.end(input);
            lexer.on("data", (event) => events.push(event));
            lexer.on("end", () => {
                expect(events).to.eql([
                    {type: "number", content: "1"},
                    {type: "number", content: "2"},
                    {type: "number", content: "3"},
                ]);
                done();
            });
        });

        it("should emit letters", (done) => {
            let events = new Array();
            let lexer = new AnsiEscapeLexer();
            let input = new Buffer("abc");
            lexer.end(input);
            lexer.on("data", (event) => events.push(event));
            lexer.on("end", () => {
                expect(events).to.eql([
                    {type: "letter", content: "a"},
                    {type: "letter", content: "b"},
                    {type: "letter", content: "c"},
                ]);
                done();
            });
        });

        it("altogether now", (done) => {
            let events = new Array();
            let lexer = new AnsiEscapeLexer();
            let input = new Buffer("\x1b[01;31mlol");
            lexer.end(input);
            lexer.on("data", (event) => events.push(event));
            lexer.on("end", () => {
                expect(events).to.eql([
                    {type: "escape", content: "\x1b"},
                    {type: "lbrace", content: "["},
                    {type: "number", content: "0"},
                    {type: "number", content: "1"},
                    {type: "semicolon", content: ";"},
                    {type: "number", content: "3"},
                    {type: "number", content: "1"},
                    {type: "letter", content: "m"},
                    {type: "letter", content: "l"},
                    {type: "letter", content: "o"},
                    {type: "letter", content: "l"},
                ]);
                done();
            });
        });
    });
});
