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
            let throttle = new ThrottleStream(200);
            throttle.write("a");
            throttle.write("b");
            setTimeout(() => {
                throttle.write("c");
            }, 146);

            setTimeout(() => {
                throttle.write("d");
                throttle.end();
            }, 600);

            throttle.on("data", (chunk) => {
                console.log(chunk);
            });

            throttle.on("end", () => {
                console.log(`end called at ${Date.now()}`);
                done();
            });
        });
    });

});
