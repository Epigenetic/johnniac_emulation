export const FortyBitMask = 0xff_ffff_ffffn

export class Register {
    private _value: bigint;

    constructor() {
        this._value = 0n;
    }

    public set value(value: bigint) {
        this._value = value & 0o17777777777777n;
    }

    public get value() {
        return this._value;
    }
}

export class NextInstructionRegister {
    private _value: number;

    constructor() {
        this._value = 0;
    }

    public set value(value: number) {
        this._value = value & 0b1111_1111_1111;
    }

    public get value() {
        return this._value;
    }
}