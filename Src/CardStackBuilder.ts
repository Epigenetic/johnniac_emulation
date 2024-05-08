import { CardReader } from "./CardReader.js";

export class CardStackBuilder {
    private _index = 0;
    private _cardReader = new CardReader();

    public addCard(value: bigint) {
        this._cardReader.setCard(this._index++, value);
    }

    public addCardString(value: string) {
        const characters: CardColumn[] = [];
        for (let i = 0; i < 80; i++) {
            const character = CharacterEncoding[value.charAt(i) === '' ? ' ' : value.charAt(i)];
            if (!character) {
                throw new Error(`Character without mapping: ${character}`);
            }
            characters[i] = character;
        }

        for (let row = 11; row >= 0; row--) {
            let lineValue = 0n;
            for (let column = 0; column < 80; column++) {
                const bit = characters[column][row];
                if (bit) {
                    lineValue |= 1n << BigInt(80 - column - 1);
                }
            }
            this.addCard(lineValue);
        }
    }

    public finalize() {
        return this._cardReader;
    }
}

type Bit = 0 | 1;
type CardColumn = [Bit, Bit, Bit, Bit, Bit, Bit, Bit, Bit, Bit, Bit, Bit, Bit]

const CharacterEncoding: Record<string, CardColumn> = {
    '0': [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    '1': [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    '2': [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    '3': [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
    '4': [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    '5': [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
    '6': [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    '7': [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
    '8': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    '9': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    'A': [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    'B': [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    'C': [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
    'D': [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    'E': [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
    'F': [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    'G': [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
    'H': [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    'I': [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    'J': [0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    'K': [0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    'L': [0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
    'M': [0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    'N': [0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
    'O': [0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    'P': [0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
    'Q': [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    'R': [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    'S': [0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    'T': [0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0],
    'U': [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    'V': [0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0],
    'W': [0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    'X': [0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0],
    'Y': [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    'Z': [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    '#': [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0],
    ',': [0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0],
    '$': [0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0],
    '.': [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0],
    '-': [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    '*': [0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0],
    '&': [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ' ': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
}