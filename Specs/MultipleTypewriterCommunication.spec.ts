import { FortyBitMask } from "../Src/JOHNNIAC/Register";
import { MatchPatternMask, MultipleTypewriterCommunication, searchFailValue, StationControlRegister } from "../Src/MTC/MultipleTypewriterCommunication";

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
            expect(mtc.findMatchingRegister(register.value() & MatchPatternMask, register.value() & MatchPatternMask)).toBe(register.value());
        });
        it("Returns fail value when no match", () => {
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
            expect(mtc.findMatchingRegister(register.value() & MatchPatternMask, FortyBitMask)).toEqual(searchFailValue);
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
            expect(mtc.findMismatchRegister(register.value() & MatchPatternMask, FortyBitMask)).toBe(0n);
        });
        it("Returns fail value when no match", () => {
            const mtc = new MultipleTypewriterCommunication();
            expect(mtc.findMismatchRegister(0n, 0n)).toEqual(searchFailValue);
        });
    });
    describe("StationControlRegister", () => {
        it("Parses EN bit", () => {
            const scr = new StationControlRegister(0o040_0000_000_0000n);
            expect(scr.EN).toBe(true);
        });
        it("Parses DS bit", () => {
            const scr = new StationControlRegister(0o020_0000_000_0000n);
            expect(scr.DS).toBe(true);
        });
        it("Parses RO bit", () => {
            const scr = new StationControlRegister(0o010_0000_000_0000n);
            expect(scr.RO).toBe(true);
        });
        it("Parses TL bit", () => {
            const scr = new StationControlRegister(0o004_0000_000_0000n);
            expect(scr.TL).toBe(true);
        });
        it("Parses CL bit", () => {
            const scr = new StationControlRegister(0o002_0000_000_0000n);
            expect(scr.CL).toBe(true);
        });
        it("Parses SU bit", () => {
            const scr = new StationControlRegister(0o001_0000_000_0000n);
            expect(scr.SU).toBe(true);
        });
        it("Parses ON bit", () => {
            const scr = new StationControlRegister(0o000_0000_100_0000n);
            expect(scr.ON).toBe(true);
        });
        it("Parses OF bit", () => {
            const scr = new StationControlRegister(0o000_0000_040_0000n);
            expect(scr.OF).toBe(true);
        });
        it("Parses TC bit", () => {
            const scr = new StationControlRegister(0o000_0000_020_0000n);
            expect(scr.TC).toBe(true);
        });
        it("Parses RI bit", () => {
            const scr = new StationControlRegister(0o000_0000_010_0000n);
            expect(scr.RI).toBe(true);
        });
        it("Parses RC bit", () => {
            const scr = new StationControlRegister(0o000_0000_004_0000n);
            expect(scr.RC).toBe(true);
        });
        it("Parses EJ bit", () => {
            const scr = new StationControlRegister(0o000_0000_002_0000n);
            expect(scr.EJ).toBe(true);
        });
        it("Parses TO bit", () => {
            const scr = new StationControlRegister(0o000_0000_001_0000n);
            expect(scr.TO).toBe(true);
        });
        it("Parses BN",()=>{
            const scr = new StationControlRegister(0o000_0017_000_0000n);
            expect(scr.BN).toBe(0o17);
        });
        it("Parses station number",()=>{
            const scr = new StationControlRegister(0o000_0000_000_0177n);
            expect(scr.stationNumber).toBe(0o177);
        });
        it("Serializes EN bit", () => {
            const scr = new StationControlRegister(0o040_0000_000_0000n);
            expect(scr.value()).toBe(0o040_0000_000_0000n);
        });
        it("Serializes DS bit", () => {
            const scr = new StationControlRegister(0o020_0000_000_0000n);
            expect(scr.value()).toBe(0o020_0000_000_0000n);
        });
        it("Serializes RO bit", () => {
            const scr = new StationControlRegister(0o010_0000_000_0000n);
            expect(scr.value()).toBe(0o010_0000_000_0000n);
        });
        it("Serializes TL bit", () => {
            const scr = new StationControlRegister(0o004_0000_000_0000n);
            expect(scr.value()).toBe(0o004_0000_000_0000n);
        });
        it("Serializes CL bit", () => {
            const scr = new StationControlRegister(0o002_0000_000_0000n);
            expect(scr.value()).toBe(0o002_0000_000_0000n);
        });
        it("Serializes SU bit", () => {
            const scr = new StationControlRegister(0o001_0000_000_0000n);
            expect(scr.value()).toBe(0o001_0000_000_0000n);
        });
        it("Serializes ON bit", () => {
            const scr = new StationControlRegister(0o000_0000_100_0000n);
            expect(scr.value()).toBe(0o000_0000_100_0000n);
        });
        it("Serializes OF bit", () => {
            const scr = new StationControlRegister(0o000_0000_040_0000n);
            expect(scr.value()).toBe(0o000_0000_040_0000n);
        });
        it("Serializes TC bit", () => {
            const scr = new StationControlRegister(0o000_0000_020_0000n);
            expect(scr.value()).toBe(0o000_0000_020_0000n);
        });
        it("Serializes RI bit", () => {
            const scr = new StationControlRegister(0o000_0000_010_0000n);
            expect(scr.value()).toBe(0o000_0000_010_0000n);
        });
        it("Serializes RC bit", () => {
            const scr = new StationControlRegister(0o000_0000_004_0000n);
            expect(scr.value()).toBe(0o000_0000_004_0000n);
        });
        it("Serializes EJ bit", () => {
            const scr = new StationControlRegister(0o000_0000_002_0000n);
            expect(scr.value()).toBe(0o000_0000_002_0000n);
        });
        it("Serializes TO bit", () => {
            const scr = new StationControlRegister(0o000_0000_001_0000n);
            expect(scr.value()).toBe(0o000_0000_001_0000n);
        });
        it("Serializes BN",()=>{
            const scr = new StationControlRegister(0o000_0017_000_0000n);
            expect(scr.value()).toBe(0o000_0017_000_0000n);
        });
        it("Serializes station number",()=>{
            const scr = new StationControlRegister(0o000_0000_000_0177n);
            expect(scr.value()).toBe(0o000_0000_000_0177n);
        });
    });
});