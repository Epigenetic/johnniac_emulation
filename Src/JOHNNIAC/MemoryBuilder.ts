import { Memory } from "./Components/Memory.js";
import { OP } from "./OP.js";

/**
 * Helper class to set up JOHNNIAC memory
 */
export class MemoryBuilder {
    private _index = 0;
    private _memory = new Memory();

    public addWordRaw(value: bigint) {
        this._memory.set(this._index++, value);
    }

    public addWord(leftCommand: OP, leftAddress: number, rightCommand: OP, rightAddress: number) {
        this._memory.set(this._index++, this._buildWord(leftCommand, leftAddress, rightCommand, rightAddress));
    }

    public updateIndex(index: number) {
        this._index = index;
    }

    public finalize() {
        return this._memory;
    }

    private _buildWord(leftCommand: OP, leftAddress: number, rightCommand: OP, rightAddress: number): bigint {
        let word = BigInt(rightAddress);
        word |= BigInt(rightCommand) << 12n;
        word |= BigInt(leftAddress) << 21n
        word |= BigInt(leftCommand) << 33n;
        return word;
    }
}