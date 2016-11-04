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
                console.log(end);
                console.log(time);
                let expected = delay * characters.length;
                expect(buffer).to.equal(characters);
                expect(time)
                    .to.be.gte(expected)
                    .and.be.lte(expected + 10);
                console.log(`end called at ${end}`);
                done();
            });
        });
    });

});
