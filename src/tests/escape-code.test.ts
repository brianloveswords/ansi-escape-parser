import { Format, SGR, FgColor, BgColor } from "../escape-code";
import { expect } from "chai";

describe("SGR", () => {
    describe("constructor()", () => {
        it("figures out the properties", () => {
            let sgr = new SGR("01;31;41;33;07");
            expect(sgr.formats).to.contain(Format.BoldOn);
            expect(sgr.formats).to.contain(Format.NegativeOn);
            expect(sgr.fgColor).to.be.equal(FgColor.Yellow);
            expect(sgr.bgColor).to.be.equal(BgColor.Red);
        });
    });
    describe(".isSGR()", () => {
        it("figures out if something is actually an SGR code", () => {
            expect(SGR.isSGR("\x1b\x5b01;31;42m")).to.equal(true);
            expect(SGR.isSGR("\x1b\x5b1;31;42m")).to.equal(true);
            expect(SGR.isSGR("\x1b\x5b42m")).to.equal(true);
            expect(SGR.isSGR("\x1b\x5b42;m")).to.equal(false);
            expect(SGR.isSGR("\x1b\x5bm")).to.equal(true);
        });
    });
});
