export enum MemoryInteraction {
    Read = 1,
    Write = 2,
}

export class Memory {
    private _memory = new BigUint64Array(4096);

    private _breakPoints: Map<number, MemoryInteraction> = new Map();

    constructor() {
        this._memory.fill(0n);
    }

    public get(address: number): bigint {
        const interaction = this._breakPoints.get(address)
        if (interaction && interaction & MemoryInteraction.Read) {
            debugger;
        }
        const value = this._memory[address];
        if (value === undefined) {
            throw new Error(`Undefined value in address ${address}`)
        }
        return value;
    }

    public set(address: number, value: bigint) {
        const interaction = this._breakPoints.get(address)
        if (interaction && interaction & MemoryInteraction.Write) {
            debugger;
        }
        this._memory[address] = BigInt.asUintN(40, value);
    }

    public slice(start: number, end: number) {
        return this._memory.slice(start, end);
    }

    public addBreakpoint(interaction: MemoryInteraction, ...addresses: number[]) {
        addresses.forEach(address => this._breakPoints.set(address, interaction));
    }

    public removeBreakpoint(...addresses: number[]) {
        addresses.forEach(address => this._breakPoints.delete(address));
    }
}