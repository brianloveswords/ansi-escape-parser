import stream = require("stream");
import { expect } from "chai";
import { Lexer } from "../lexer";

describe("Lexer", () => {
    describe("constructor", () => {
        it("should construct", () => {
            let lexer = new Lexer();
            expect(lexer).to.be.instanceOf(Lexer);
            expect(lexer).to.be.instanceOf(stream.Stream);
            expect(lexer).to.be.instanceOf(stream.Transform);
        });
    });

    describe("write()", () => {
        let lexer = new Lexer();
        it("should emit a number after writing a number", (done) => {
            lexer.end("123");

            let events = new Array();
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
    });
});
