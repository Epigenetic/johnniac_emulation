import { MatchPatternMask, MultipleTypewriterCommunication, StationControlRegister } from "../Src/MTC/MultipleTypewriterCommunication";

describe("MultipleTypewriterCommunication", () => {
    describe("getLineBuffer", () => {
        it("Throws on out of bounds", () => {
            const mtc = new MultipleTypewriterCommunication();
            expect(() => mtc.getLineBuffer(17)).toThrow();
            expect(() => mtc.getLineBuffer(-1)).toThrow();
        });
    });
    describe("getStationControlRegister", () => {
        it("Throws on out of bounds", () => {
            const mtc = new MultipleTypewriterCommunication();
            expect(() => mtc.getStationControlRegister(82)).toThrow();
            expect(() => mtc.getStationControlRegister(-1)).toThrow();
        });
        it("Gets expected register", () => {
            const mtc = new MultipleTypewriterCommunication();
            mtc.setStationControlRegister(1, new StationControlRegister(7n));
            expect(mtc.getStationControlRegister(1).value()).toBe(7n);
        });
    });
    describe("findAssignedRegister", () => {
        it("Finds register assigned to buffer", () => {
            const mtc = new MultipleTypewriterCommunication();
            const register = new StationControlRegister(
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                6,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                4
            );
            mtc.setStationControlRegister(4, register);
            expect(mtc.findAssignedRegister(6)?.value()).toBe(register.value())
        });
    });
    describe("findMatchingRegister", () => {
        it("Finds register matching pattern", () => {
            const mtc = new MultipleTypewriterCommunication();
            const register = new StationControlRegister(
                true,
                false,
                true,
                false,
                true,
                false,
                true,
                0,
                true,
                false,
                true,
                false,
                true,
                false,
                true,
                1
            );
            mtc.setStationControlRegister(1, register);
            expect(mtc.findMatchingRegister(register.value() & MatchPatternMask)).toBe(register.value());
        });
        it("Returns undefined when no match", () => {
            const mtc = new MultipleTypewriterCommunication();
            const register = new StationControlRegister(
                true,
                false,
                true,
                false,
                true,
                false,
                true,
                0,
                true,
                false,
                true,
                false,
                true,
                false,
                true,
                1
            );
            expect(mtc.findMatchingRegister(register.value() & MatchPatternMask)).toBeUndefined();
        });
    });
    describe("findMismatchRegister", () => {
        it("Finds register not matching pattern", () => {
            const mtc = new MultipleTypewriterCommunication();
            const register = new StationControlRegister(
                true,
                false,
                true,
                false,
                true,
                false,
                true,
                0,
                true,
                false,
                true,
                false,
                true,
                false,
                true,
                1
            );
            mtc.setStationControlRegister(1, register);
            expect(mtc.findMismatchRegister(register.value() & MatchPatternMask)).toBe(0n);
        });
        it("Returns undefined when no match", () => {
            const mtc = new MultipleTypewriterCommunication();
            expect(mtc.findMismatchRegister(0n)).toBeUndefined();
        });
    })
});