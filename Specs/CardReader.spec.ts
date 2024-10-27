import { CardReader } from "../Src/JOHNNIAC/Components/CardReader.js"

describe("CardReader", () => {
    it("Splits card into two words", () => {
        const cardReader = new CardReader();
        cardReader.setCard(0, (123n << 40n) | 456n);

        const [firstWord, secondWord] = cardReader.nextCard();
        expect(firstWord).toBe(123n);
        expect(secondWord).toBe(456n);
    });
    it("Advances to next card", () => {
        const cardReader = new CardReader();
        cardReader.setCard(0, (123n << 40n) | 456n);
        cardReader.setCard(1, (789n << 40n) | 135n);

        const [firstWord, secondWord] = cardReader.nextCard();
        expect(firstWord).toBe(123n);
        expect(secondWord).toBe(456n);
        const [thirdWord, fourthWord] = cardReader.nextCard();
        expect(thirdWord).toBe(789n);
        expect(fourthWord).toBe(135n);
    })
});