export class Memory {
    private _memory = new BigUint64Array(4096);

    constructor() {
        this._memory.fill(0n);
    }

    public get(address: number) {
        return this._memory[address];
    }

    public set(address: number, value: bigint) {
        this._memory[address] = BigInt.asUintN(40, value);
    }
}