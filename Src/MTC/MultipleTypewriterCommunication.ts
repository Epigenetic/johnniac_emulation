import { ShiftLowerCase, ShiftUpperCase } from "../Characters.js";
import { FortyBitMask } from "../JOHNNIAC/Register.js";

export class MultipleTypewriterCommunication {
    private _lineBuffers = [
        new LineBuffer(),
        new LineBuffer(),
        new LineBuffer(),
        new LineBuffer(),
        new LineBuffer(),
        new LineBuffer(),
        new LineBuffer(),
        new LineBuffer(),
        new LineBuffer(),
        new LineBuffer(),
        new LineBuffer(),
        new LineBuffer(),
        new LineBuffer(),
        new LineBuffer(),
        new LineBuffer(),
        new LineBuffer(),
    ];
    private _stationControlRegisters = new BigUint64Array(81);

    public constructor() {
        for (let i = 0; i < this._stationControlRegisters.length; i++) {
            // TODO - 0 or 1 indexed?
            this._stationControlRegisters[i] = BigInt(i);
        }
    }

    public getLineBuffer(buffer: number): LineBuffer {
        if (buffer >= 16 || buffer < 0) {
            throw new Error(`Invalid buffer number ${buffer}`);
        }
        return this._lineBuffers[buffer]!;
    }

    public getStationControlRegister(station: number): StationControlRegister {
        if (station >= 81 || station < 0) {
            throw new Error(`Invalid station number: ${station}`);
        }
        return new StationControlRegister(this._stationControlRegisters[station]!);
    }

    public setStationControlRegister(station: number, register: StationControlRegister): void {
        if (station >= 81 || station < 0) {
            throw new Error(`Invalid station number: ${station}`);
        }
        this._stationControlRegisters[station] = register.value();
    }

    public findAssignedRegister(buffer: number): StationControlRegister | undefined {
        const register = this._stationControlRegisters.filter(register => new StationControlRegister(register).BN === buffer)[0];

        if (register === undefined) {
            return undefined;
        }
        return new StationControlRegister(register);
    }

    public findMatchingRegister(mask: bigint, pattern: bigint): bigint {
        for (const register of this._stationControlRegisters) {
            if (!((register & mask) ^ pattern)) {
                return register;
            }
        }
        return searchFailValue;
    }

    public findMismatchRegister(mask: bigint, pattern: bigint): bigint {
        for (const register of this._stationControlRegisters) {
            if ((register & mask) ^ pattern) {
                return register;
            }
        }
        return searchFailValue;
    }
}

export const MatchPatternMask = FortyBitMask - 127n;

class LineBuffer {
    private _buffer = new Uint8Array(81);
    private _pointer = 0;
    private _uppercase = false;

    public get uppercase(): boolean {
        return this._uppercase;
    }
    public set uppercase(value: boolean) {
        this._uppercase = value;
    }

    public writeCharacter7Bit(character: number): void {
        this._buffer[this._pointer] = character & 127;
        if (this._pointer < 80) {
            this._pointer++;
        }
    }

    public writeCharacter6Bit(character: number): void {
        if (character === ShiftUpperCase) {
            this._uppercase = true;
            return;
        } else if (character === ShiftLowerCase) {
            this._uppercase = false
            return;
        }

        this.writeCharacter7Bit(character | (this._uppercase ? 64 : 0)); // TODO - verify
    }

    public deleteCharacter(): void {
        if (this._pointer > 0) {
            this._pointer--;
        }
    }

    public getBuffer(): Uint8Array {
        return this._buffer;
    }

    public getCharactersToTransmit(): Uint8Array {
        return this._buffer.slice(0, this._pointer);
    }
}

export interface StationControlRegister extends IStationControlRegister { }
export class StationControlRegister {

    constructor(
        F: boolean,
        EN: boolean,
        DS: boolean,
        RO: boolean,
        TL: boolean,
        CL: boolean,
        SU: boolean,
        BN: number,
        ON: boolean,
        OF: boolean,
        TC: boolean,
        RI: boolean,
        RC: boolean,
        EJ: boolean,
        TO: boolean,
        stationNumber: number,
    )
    constructor(registerValue: bigint)
    constructor(registerValueOrF: bigint | boolean,
        EN?: boolean,
        DS?: boolean,
        RO?: boolean,
        TL?: boolean,
        CL?: boolean,
        SU?: boolean,
        BN?: number,
        ON?: boolean,
        OF?: boolean,
        TC?: boolean,
        RI?: boolean,
        RC?: boolean,
        EJ?: boolean,
        TO?: boolean,
        stationNumber?: number,
    ) {
        if (typeof registerValueOrF === "bigint") {
            const registerValue = registerValueOrF;
            this.F = Boolean(registerValue & (1n << 39n));
            this.EN = Boolean(registerValue & (1n << 38n));
            this.DS = Boolean(registerValue & (1n << 37n));
            this.RO = Boolean(registerValue & (1n << 36n));
            this.TL = Boolean(registerValue & (1n << 35n));
            this.CL = Boolean(registerValue & (1n << 34n));
            this.SU = Boolean(registerValue & (1n << 33n));
            this.BN = Number((registerValue & (15n << 16n)) >> 16n);
            this.ON = Boolean(registerValue & (1n << 13n));
            this.OF = Boolean(registerValue & (1n << 12n));
            this.TC = Boolean(registerValue & (1n << 11n));
            this.RI = Boolean(registerValue & (1n << 10n));
            this.RC = Boolean(registerValue & (1n << 9n));
            this.EJ = Boolean(registerValue & (1n << 8n));
            this.TO = Boolean(registerValue & (1n << 7n));
            this.stationNumber = Number(registerValue & 7n);
        } else if (
            EN !== undefined
            && DS !== undefined
            && RO !== undefined
            && TL !== undefined
            && CL !== undefined
            && SU !== undefined
            && BN !== undefined
            && ON !== undefined
            && OF !== undefined
            && TC !== undefined
            && RI !== undefined
            && RC !== undefined
            && EJ !== undefined
            && TO !== undefined
            && stationNumber !== undefined
        ) {
            this.F = registerValueOrF;
            this.EN = EN;
            this.DS = DS;
            this.RO = RO;
            this.TL = TL;
            this.CL = CL;
            this.SU = SU;
            this.BN = BN;
            this.ON = ON;
            this.OF = OF;
            this.TC = TC;
            this.RI = RI;
            this.RC = RC;
            this.EJ = EJ;
            this.TO = TO;
            this.stationNumber = stationNumber;
        } else {
            throw new Error("Invalid parameters");
        }
    }

    public value(): bigint {
        return BigInt(this.stationNumber)
            | BigInt(this.F) << 39n
            | BigInt(this.EN) << 38n
            | BigInt(this.DS) << 37n
            | BigInt(this.RO) << 36n
            | BigInt(this.TL) << 35n
            | BigInt(this.CL) << 34n
            | BigInt(this.SU) << 33n
            | BigInt(this.BN) << 16n
            | BigInt(this.ON) << 13n
            | BigInt(this.OF) << 12n
            | BigInt(this.TC) << 11n
            | BigInt(this.RI) << 10n
            | BigInt(this.RC) << 9n
            | BigInt(this.EJ) << 8n
            | BigInt(this.TO) << 7n

    }
}

export interface IStationControlRegister {
    /** Flag for Unsuccessful Search */
    F: boolean;
    /** Enable */
    EN: boolean;
    /** Disable */
    DS: boolean;
    /** Request Out */
    RO: boolean;
    /** Transmit Line */
    TL: boolean;
    /** Clear Line Buffer */
    CL: boolean;
    /** Switch to User */
    SU: boolean;
    /** Line Buffer Assignment */
    BN: number;
    /** Turn On */
    ON: boolean;
    /** Turn Off */
    OF: boolean;
    /** Take Control (Out) */
    TC: boolean;
    /** Request In */
    RI: boolean;
    /** Carriage Return */
    RC: boolean;
    /** Page */
    EJ: boolean;
    /** Transmission Over */
    TO: boolean;
    /** Station Number (Permanent) */
    stationNumber: number;
}

export const searchFailValue = new StationControlRegister(true, false, false, false, false, false, false, 0, false, false, false, false, false, false, false, 0).value();

export enum WorkerCommand {
    ReadLineBuffer,
    WriteLineBuffer,
    GetControlRegister,
    SetControlRegister,
    BufferTransmission,
    MatchControlRegister,
    MismatchControlRegister,
    JOSSTypewriterMessage,
}

export type TTypewriterMessage = IGetStationMessage
    | IWriteStationMessage
    | IReadLineBufferMessage
    | IWriteLineBufferMessage
    | IBufferTransmissionMessage
    | IMatchScreenRegisterMessage
    | IMismatchScreenRegisterMessage
    | IJOSSTypewriterMessage;
export type TStationRegisterRequest = Omit<Partial<IStationControlRegister>, "stationNumber">;

interface ITypewriterMessage {
    command: WorkerCommand;
}

interface IReadLineBufferMessage extends ITypewriterMessage {
    command: WorkerCommand.ReadLineBuffer;
    lineBuffer: number;
}

interface IWriteLineBufferMessage extends ITypewriterMessage {
    command: WorkerCommand.WriteLineBuffer;
    lineBuffer: number;
    data: number[];
}

interface IGetStationMessage extends ITypewriterMessage {
    command: WorkerCommand.GetControlRegister;
    station: number;
}

interface IWriteStationMessage extends ITypewriterMessage {
    command: WorkerCommand.SetControlRegister;
    update: TStationRegisterRequest;
    stationNumber: number;
}

interface IBufferTransmissionMessage extends ITypewriterMessage {
    command: WorkerCommand.BufferTransmission;
    lineBuffer: number;
}

interface IMatchScreenRegisterMessage extends ITypewriterMessage {
    command: WorkerCommand.MatchControlRegister;
    mask: bigint;
    pattern: bigint;
}

interface IMismatchScreenRegisterMessage extends ITypewriterMessage {
    command: WorkerCommand.MismatchControlRegister;
    mask: bigint;
    pattern: bigint;
}

interface IJOSSTypewriterMessage extends ITypewriterMessage {
    command: WorkerCommand.JOSSTypewriterMessage;
    station: number;
    on?: true;
    off?: true;
    character?: number;
}