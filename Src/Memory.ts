export class Memory {
    private _memory = new BigUint64Array(4096);

    private _breakPoints: Set<number> = new Set();

    constructor() {
        this._memory.fill(0n);
    }

    public get(address: number): bigint {
        if (this._breakPoints.has(address)) {
            debugger;
        }
        const value = this._memory[address];
        if (value === undefined) {
            throw new Error(`Undefined value in address ${address}`)
        }
        return value;
    }

    public set(address: number, value: bigint) {
        if (this._breakPoints.has(address)) {
            debugger;
        }
        this._memory[address] = BigInt.asUintN(40, value);
    }

    public addBreakpoint(...addresses: number[]) {
        addresses.forEach(address => this._breakPoints.add(address));
    }

    public removeBreakpoint(...addresses: number[]) {
        addresses.forEach(address => this._breakPoints.delete(address));
    }
}