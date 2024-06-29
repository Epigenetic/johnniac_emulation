import { Drums } from "../Src/Drum.js"

describe("Drums", () => {
    describe("getWord", () => {
        it("Permits only 1 drum", () => {
            const drums = new Drums();
            expect(() => drums.getWord(1, 0, 0, 0)).toThrow("Only 1 drum supported");
        });
        it("Validates position number", () => {
            const drums = new Drums();
            expect(() => drums.getWord(0, 3, 0, 0)).toThrow("Position 3 exceeds maximum permitted of 2");
        });
        it("Validates band number", () => {
            const drums = new Drums();
            expect(() => drums.getWord(0, 0, 4, 0)).toThrow("Band 4 exceeds maximum permitted of 3");
        });
        it("Gets correct word", () => {
            const drums = new Drums();
            drums.setWord(0, 1, 3, 15, 12345n);
            expect(drums.getWord(0, 1, 3, 15)).toBe(12345n);
        });
    });
    describe("setWord", () => {
        it("Permits only 1 drum", () => {
            const drums = new Drums();
            expect(() => drums.setWord(1, 0, 0, 0, 1n)).toThrow("Only 1 drum supported");
        });
        it("Validates position number", () => {
            const drums = new Drums();
            expect(() => drums.setWord(0, 3, 0, 0, 1n)).toThrow("Position 3 exceeds maximum permitted of 2");
        });
        it("Validates band number", () => {
            const drums = new Drums();
            expect(() => drums.setWord(0, 0, 4, 0, 1n)).toThrow("Band 4 exceeds maximum permitted of 3");
        });
        it("Sets correct word", () => {
            const drums = new Drums();
            drums.setWord(0, 1, 3, 15, 12345n);
            expect(drums.getWord(0, 1, 3, 15)).toBe(12345n);
        });
        it("Clamps values to 40 bits", () => {
            const drums = new Drums();
            drums.setWord(0, 1, 3, 15, 1n << 40n);
            expect(drums.getWord(0, 1, 3, 15)).toBe(0n);
        })
    });
});