import { FortyBitMask } from "../Register.js";

export class CardReader {
    private _cards: bigint[] = [];
    private _currentCard: number = 0;

    public setCard(position: number, value: bigint) {
        this._cards[position] = BigInt.asUintN(80, value);
    }

    public nextCard(): [bigint, bigint] {
        if (this._currentCard > this._cards.length - 1) {
            throw new Error("No more cards to read")
        }

        const value = this._cards[this._currentCard++]!;

        return [(value & (FortyBitMask << 40n)) >> 40n, value & FortyBitMask];
    }
}