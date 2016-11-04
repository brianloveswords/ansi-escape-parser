import stream = require("stream");
import { expect } from "chai";
import { ThrottleStream } from "../throttle-stream";

describe("ThrottleStream", () => {
    describe("constructor", () => {
        it("should construct", () => {
            let throttle = new ThrottleStream(100);
            expect(throttle).to.be.instanceOf(ThrottleStream);
            expect(throttle).to.be.instanceOf(stream.Stream);
            expect(throttle).to.be.instanceOf(stream.Transform);
        });
    });

    describe("write()", () => {
        it("should delay outputs", (done) => {
            let start;
            let delay = 200;
            let characters = "abcd";
            let throttle = new ThrottleStream(delay);
            Array.from(characters).forEach((c, index) => {
                let timeout = (delay / 2) + (index * 10);
                setTimeout(() => {
                    if (index === 0) {
                        start = Date.now();
                    }
                    throttle.write(c);
                    if (index + 1 === characters.length) {
                        throttle.end();
                    }
                }, timeout);
            });

            let buffer = "";
            throttle.on("data", (chunk) => {
                buffer += chunk;
            });

            throttle.on("end", () => {
                let end = Date.now();
                let time = end - start;
                let expected = delay * characters.length;
                expect(buffer).to.equal(characters);
                expect(time)
                    .to.be.gte(expected)
                    .and.be.lte(expected + 10);
                done();
            });
        });
    });
    describe("write(), with conditions", () => {
        it("should only delay if the condition matches", (done) => {
            let throttle = new ThrottleStream(100, n => n > 3);
            throttle.on("end", () => {
                let expected = 100;
                let end = Date.now();
                let time = end - start;
                expect(time).to.be.gte(expected);
                done();
            });

            throttle.on("data", (_) => {});

            let start = Date.now();
            throttle.write(1);
            throttle.write(2);
            throttle.write(3);
            throttle.write(4);
            throttle.end();
        });
    });

});
