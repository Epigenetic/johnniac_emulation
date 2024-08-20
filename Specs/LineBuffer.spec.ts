import { MultipleTypewriterCommunication } from "../Src/MultipleTypewriterCommunication"

describe("LineBuffer", () => {
    describe("writeCharacter7Bit", () => {
        it("Writes 7 bit character", () => {
            const buffer = new MultipleTypewriterCommunication().getLineBuffer(0);
            buffer.writeCharacter7Bit(12);
            buffer.writeCharacter7Bit(255);
            expect(buffer.getBuffer()[0]).toBe(12);
            expect(buffer.getBuffer()[1]).toBe(127);
        });
    });
    describe("deleteCharacter",()=>{
        it("Backs up character pointer without clearing content",()=>{
        const buffer = new MultipleTypewriterCommunication().getLineBuffer(0);
        buffer.writeCharacter7Bit(12);
        buffer.writeCharacter7Bit(255);
        buffer.deleteCharacter();
        expect(buffer.getBuffer()[0]).toBe(12);
        expect(buffer.getBuffer()[1]).toBe(127);
        buffer.writeCharacter7Bit(18);
        expect(buffer.getBuffer()[1]).toBe(18);
        });
    });
});