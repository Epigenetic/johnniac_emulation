import { CardReader } from "./Components/CardReader.js";
import { Drums } from "./Components/Drum.js";
import { Memory } from "./Components/Memory.js";
import { MatchPatternMask, StationControlRegister, TTypewriterMessage, WorkerCommand } from "../MTC/MultipleTypewriterCommunication.js";
import { OP } from "./OP.js";
import { FortyBitMask, NextInstructionRegister, Register } from "./Register.js";

export enum CurrentCommand {
    Left,
    Right
}

export enum IODevice {
    CardReaderPrimaryFeed = 0o0,
    CardReaderSecondaryFeed = 0o1,
    CardPunchFeed = 0o2,
    CardPunchFeedAndEcho = 0o3,
    ANelexPrinter = 0o4,
    AnelexPrinterNoSpace = 0o5
}



export class CPU {

    private readonly _accumulator = new Register();
    private readonly _multipliedQuotientRegister = new Register();
    private readonly _numberRegister = new Register();
    private readonly _instructionRegister = new Register();
    private _nextInstructionRegister = new NextInstructionRegister();

    public get accumulator() {
        return this._accumulator.value;
    }
    public set accumulator(value: bigint) {
        this._accumulator.value = value;
    }
    public get multipliedQuotientRegister() {
        return this._multipliedQuotientRegister.value;
    }
    public get numberRegister() {
        return this._numberRegister.value;
    }
    public get nextInstructionRegister() {
        return this._nextInstructionRegister.value;
    }

    private _currentCommand: CurrentCommand = CurrentCommand.Left;
    public get currentCommand() {
        return this._currentCommand;
    }

    private _cardReader: CardReader;

    private _memory: Memory;
    private _drums: Drums;
    private _ioDevice: IODevice = IODevice.CardReaderPrimaryFeed;
    public get ioDevice() {
        return this._ioDevice;
    }
    private _halt = false;

    private _clockBuffer: Uint16Array | undefined;
    private _clockWorker: Worker | undefined;
    private _typewriterPort: MessagePort | undefined;

    private _switchT1 = false;
    public set switchT1(value: boolean) {
        this._switchT1 = value;
    }
    private _switchT2 = false;
    public set switchT2(value: boolean) {
        this._switchT2 = value;
    }
    private _switchT3 = false;
    public set switchT3(value: boolean) {
        this._switchT3 = value;
    }

    private _switchH1 = false;
    public set switchH1(value: boolean) {
        this._switchH1 = value;
    }
    private _switchH2 = false;
    public set switchH2(value: boolean) {
        this._switchH2 = value;
    }
    private _switchH3 = false;
    public set switchH3(value: boolean) {
        this._switchH3 = value;
    }

    // The Overflow Toggle is turned on when an overflow occurs and remains on until one of the operations 003 or 007 turns it off.
    private _overflowToggle: boolean = false;
    public get overflowToggle() {
        return this._overflowToggle;
    }

    private _stepThrough = false;
    public set stepThrough(value: boolean) {
        this._stepThrough = value;
    }

    private _trace = false;
    public set trace(value: boolean) {
        this._trace = value;
    }

    private _symbolMap: Record<string, [number, number]> = {};
    public set symbolMap(value: Record<string, [number, number]>) {
        this._symbolMap = value;
    }

    public addMemoryBreakpoint(...addresses: number[]) {
        this._memory.addBreakpoint(...addresses);
    }

    public removeMemoryBreakpoint(...addresses: number[]) {
        this._memory.removeBreakpoint(...addresses);
    }

    private _breakpoints: Set<number> = new Set();
    public addBreakpoint(...addresses: number[]) {
        addresses.forEach(address => this._breakpoints.add(address));
    }

    public removeBreakpoint(...addresses: number[]) {
        addresses.forEach(address => this._breakpoints.delete(address));
    }

    public addSymbolBreakpoint(...symbols: string[]) {
        symbols.forEach(symbol => this._breakpoints.add(this._translateSymbol(symbol)));
    }

    public removeSymbolBreakpoint(...symbols: string[]) {
        symbols.forEach(symbol => this._breakpoints.delete(this._translateSymbol(symbol)));
    }

    private _translateSymbol(symbol: string): number {
        const letter = symbol.substring(0, 1)
        const offset = Number(symbol.substring(1, 4));
        const symbolValue = this._symbolMap[letter]?.[0];
        if (!symbolValue) {
            throw new Error(`Undefined symbol: ${symbol}`);
        }
        return symbolValue + offset;
    }

    private _decodeAddress(address: number): string | undefined {
        for (let symbol in this._symbolMap) {
            const lowerBound = this._symbolMap[symbol]![0];
            const upperBound = lowerBound + this._symbolMap[symbol]![1] - 1;
            if (address >= lowerBound
                && address <= upperBound
            ) {
                return `${symbol}${(address - lowerBound).toString().padStart(3)}`;
            }
        }
        return undefined;
    }

    private _eventData: MessageEvent<any> | undefined = undefined;

    constructor(
        memory: Memory,
        cardReader: CardReader,
        drums: Drums,
        hasClock: boolean = false,
        typewriterPort: MessagePort | undefined = undefined
    ) {
        this._memory = memory;
        this._cardReader = cardReader;
        this._drums = drums;
        if (hasClock) {
            this._clockBuffer = new Uint16Array(new SharedArrayBuffer(2));
            this._clockWorker = new Worker("/Src/JOHNNIAC/Components/Clock.js");
            this._clockWorker.postMessage(this._clockBuffer);
        }
        if (typewriterPort) {
            this._typewriterPort = typewriterPort;
            this._typewriterPort.onmessage = event => this._eventData = event;
        }
    }

    public async go(): Promise<void> {
        this._halt = false;
        while (!this._halt) {
            const word = this._memory.get(this._nextInstructionRegister.value);
            this._instructionRegister.value = word;

            const { leftOp, leftAddress, rightOp, rightAddress } = this._decodeWord(this._instructionRegister.value);

            if (this._stepThrough || this._breakpoints.has(this._nextInstructionRegister.value)) {
                console.log({
                    nextInstructionRegister: this._nextInstructionRegister.value,
                    nextInstructionSymbol: this._decodeAddress(this._nextInstructionRegister.value),
                    accumulator: this._accumulator.value,
                    multipliedQuotient: this._multipliedQuotientRegister.value,
                    currentCommand: CurrentCommand[this._currentCommand],
                    OP: this._currentCommand === CurrentCommand.Left ? OP[leftOp] : OP[rightOp],
                    opAddress: this._currentCommand === CurrentCommand.Left ? leftAddress : rightAddress,
                    opSymbol: this._decodeAddress(this._currentCommand === CurrentCommand.Left ? leftAddress : rightAddress),
                })
                debugger;
            }

            if (this._trace) {
                const symbol = this._decodeAddress(this._nextInstructionRegister.value);
                if (symbol) {
                    console.log(symbol);
                }
            }

            if (this._currentCommand === CurrentCommand.Left) {
                if (!await this._executeOp(leftOp, leftAddress)) {
                    // Don't increment next instruction register- we are still processing the same word
                    this._currentCommand = CurrentCommand.Right;
                }
            } else {
                if (!await this._executeOp(rightOp, rightAddress)) {
                    this._nextInstructionRegister.value++;
                    this._currentCommand = CurrentCommand.Left;
                }
            }
        }
    }

    private _decodeWord(word: bigint) {
        const leftOp = Number((word >> 33n) & 0o177n);
        const rightOp = Number((word >> 12n) & 0o177n);

        const leftAddress = Number((word >> 21n) & 0o7777n);
        const rightAddress = Number(word & 0o7777n);

        return { leftOp, leftAddress, rightOp, rightAddress };
    }

    private _hasOverflow(sum: bigint, complementNumber: boolean): boolean {
        const accumulatorSign = (this._accumulator.value >> 39n) & 1n
        // NOTE: Based on the description of RS, overflow does not account 
        //       for the corrective one added in complementing
        const numberRegisterSign = ((complementNumber ? ~this._numberRegister.value : this._numberRegister.value) >> 39n) & 1n
        const registersMatch = accumulatorSign === numberRegisterSign;
        const sumSign = (sum >> 39n) & 1n;
        if (registersMatch) {
            // If sign of result doesn't match but the source registers do, overflow has occurred
            return sumSign !== accumulatorSign;
        }
        // If the signs don't match, overflow cannot occur
        return false;
    }

    private _complement(): bigint {
        return BigInt.asUintN(40, (~this._numberRegister.value) + 1n);
    }

    private _multiply(address: number, negative: boolean) {
        // The basic multiplication process is the same for all variations of the multiply operation.
        // Initially the multiplier is in the Multiplier Quotient register MQ.
        // It can be put there by the Load MQ operation, 004, or it can be left in MQ by some other operation.
        // The address associated with the multiply operation specifies the multiplicand.
        // The result is a double length product in A and MQ.
        // The Accumulator contains the sign bit and the high order 39 bits of the product; 
        // MQ contains zero in its sign bit and the 39 low order bits of product.

        // The multiplicand is read from the Store and put in the Number register at the beginning of the operation and remains there throughout the succeeding steps. 
        this._numberRegister.value = this._memory.get(address);
        // The complement gates are set to complement if the operation is negative multiply.

        // The first 39 steps are conditional add and shift right operations.
        for (let i = 0; i < 39; i++) {
            // At each step the decision to add or not is made by examining the bit in position 39 of MQ.
            const shouldAdd = (this._multipliedQuotientRegister.value & 1n) === 1n;
            // The add is called for when the multiplier bit is a 1 and is omitted when it is zero.
            let result = this._accumulator.value
            if (shouldAdd) {
                if (negative) {
                    result += this._complement();
                } else {
                    result += this._numberRegister.value;
                }
            }


            // The right shift always occurs. It serves a dual purpose.
            // The partial product in A and MQ is divided by two and the multiplier is moved to the right to bring the next bit into position 39 where it can be examined. 
            // The low order bits of the product are shifted into the high order positions of MQ as they are vacated by the multiplier. 
            const accumulatorBit = (result & 1n) << 39n;
            const accumulatorSign = ((result >> 39n) & 1n) << 39n;

            this._multipliedQuotientRegister.value >>= 1n;
            this._accumulator.value = result >> 1n;

            // NOTE- Based on the examples in the manual the shift operation is actually a power shift so we maintain the sign bit
            this._accumulator.value |= accumulatorSign;
            this._multipliedQuotientRegister.value |= accumulatorBit;
        }

        // After 39 steps of this kind, the multiplier sign bit is in MQ position 39 and the partial product is in the other positions of A and MQ.
        // The final step is a conditional corrective subtraction (i.e., the complement gate is reversed if the multiplier sign bit is one); 
        if (this._multipliedQuotientRegister.value & 1n) {
            if (negative) {
                this._accumulator.value += this._numberRegister.value;
            } else {
                this._accumulator.value += this._complement();
            }
        }
        // followed by a shift of MQ only which brings zero into the MQ sign bit and puts the low order 39 bits of product in standard word position in MQ.
        this._multipliedQuotientRegister.value >>= 1n;
        // The eight variations of the multiply operation are obtained by combinations of clear or don't clear the Accumulator at the start of the operation,
        // insert a one in position one of A or don't, and Add or Add the complement of the multiplicand.
        // The multiply operations cannot turn on the Overflow Toggle - no circuitry is provided for testing for overflows,
    }

    private _divide(address: number, negative: boolean) {
        // The basic division process is the same for all variations of the divide operation.
        // The dividend resides in A and MQ at the start of the operation.
        // The divisor is specified by the address associated with the operation.
        // The quotient which is generated by repeated trial subtractions, is put in MQ and the Remainder is left in the Accumulator.
        // At the start of the division process the Divisor is read from the Store and put in the Number register.
        this._numberRegister.value = this._memory.get(address);

        // If the operation is negative divide, the complement of the number in the Number register is treated as the "Divisor".

        // The "Divisor" sign bit and the Dividend sign bit, i.e., the sign bit of A, are examined to determine the sign of the Quotient.
        const quotientSign = (this._numberRegister.value >> 39n) ^ (this._accumulator.value >> 39n);
        // If the Quotient is negative, one is put in the sign bit of MQ, and the "Divisor" is added to the word in the Accumulator.
        if (quotientSign) {
            this._multipliedQuotientRegister.value |= (1n << 39n);
            this._accumulator.value += this._numberRegister.value;
        } else {
            // If the Quotient is positive, zero is put in the sign bit of MQ; no corrective addition is required.
            this._multipliedQuotientRegister.value &= (FortyBitMask - (1n << 39n));
        }

        // The number in A and MQ is shifted left one place, skipping the sign bit of MQ register which contains the sign of the Quotient.
        this._powerShiftLeft(1);

        for (let i = 0; i < 39; i++) {
            // A trial subtraction of the "Divisor" is made, and a one or a zero is selected to be put in position 39 of MQ to indicate that the "Divisor" goes, or does not go.
            const trialSubtraction = BigInt.asUintN(40, this._accumulator.value + (negative ? this._numberRegister.value : this._complement()));
            // Go or no go is selected by examining the sign bits of the "Divisor" and the result of the trial subtraction.
            const go = (trialSubtraction >> 39n) === (this._numberRegister.value >> 39n);
            // If the sign bits - agree; one is written in the quotient, and the result of the subtraction is taken.
            if (go) {
                this._accumulator.value = trialSubtraction;
            }

            // The left shift which follows the generation of a Quotient digit does double duty; it moves the quotient left, bringing the newly formed digit into position 39 and also positions the intermediate remainder;
            // for the next trial subtraction.
            // The trial subtractions are continued until all the 39 digits of the Quotient have been generated.
            this._powerShiftLeft(1);

            // If the sign bits - agree; one is written in the quotient, and the result of the subtraction is taken.
            if (go) {
                this._multipliedQuotientRegister.value |= 1n;
            }
            // If the sign bits disagree, zero is written in the Quotient and the result of the Subtraction is rejected.
            else {
                // NOTE: No action needed since the shift above moved a 0 into bit 39
            }
        }

        // The final step consists of shifting the remainder right one place so that it will occupy standard word position in the Accumulator.
        // NOTE- this is a power shift right, which copies the sign bit
        const signBit = this._accumulator.value >> 39n << 39n;
        this._accumulator.value >>= 1n;
        this._accumulator.value |= signBit;
        // The factors in the division operation always satisfy the following relationship:
        // Quotient times Divisor plus Remainder equals Dividend. 
        // This is true for intermediate results as well as final results, provided allowance is made for the changing positions of the factors.
        // For example, at the start of the operation the quotient is zero, and the remainder is equal to the dividend.
        // If the quotient is negative, minus one is put in the quotient and the divisor is added to the remainder.
        // The equality still holds. All other digits are positive, and each one that is inserted is accompanied by a subtraction.
        // The rule which is used to recognize "go" and "no go" fails to give the expected result in one situation.
        // If the divisor is negative and a zero remainder turns up, the signs disagree and "no go" is selected instead of "go".
        // The final remainder will be equal to the divisor and the quotient will be too small by one in the least significant position.
        // Note, however, that the above algebraic relationship is still satisfied.
        // Division can give results which are outside the range of representable numbers. 
        // No safeguards or alarms are built in the machine.
        // There is no simple rule for reconstructing the correct quotient and remainder from the results of an improper division.
    }

    private _powerShiftRight(steps: number) {
        // The words in A and MQ are treated as a double length representation of a number.
        // The shift is equivalent to dividing the double length number by a power of two, if the sign bit of MQ is ignored.
        // Bits that are shifted out position 39 of A skip the sign position and go into position 1 of MQ.
        // The sign bit of the Accumulator remains the same and is copied into position 1 of A each time A is shifted one place.
        // This maintains the correct representation of either positive or negative numbers as they are shifted right.
        // Recall that lead zeros of a positive number turn out to be lead ones when the number 1s complemented.
        // Since one of the anticipated uses of this operation is to set up a product as a multiplier with one operation,
        // the sign bit of A is copied into the sign bit of MQ.
        for (let i = 0; i < steps; i++) {
            const accumulatorBit = this._accumulator.value & 1n;
            const accumulatorSignBit = (this._accumulator.value >> 39n) << 39n;
            const multiplierQuotientSignBit = (this._multipliedQuotientRegister.value >> 39n) << 39n;
            this._accumulator.value >>= 1n;
            this._accumulator.value |= accumulatorSignBit;
            this._multipliedQuotientRegister.value >>= 1n;
            if (accumulatorBit) {
                this._multipliedQuotientRegister.value |= 1n << 38n;
            } else {
                this._multipliedQuotientRegister.value &= 0b1011_1111_1111_1111_1111_1111_1111_1111_1111_1111n
            }
            this._multipliedQuotientRegister.value |= multiplierQuotientSignBit;
        }

        const accumulatorSignBit = (this._accumulator.value >> 39n) << 39n;
        if (accumulatorSignBit) {
            this._multipliedQuotientRegister.value |= accumulatorSignBit;
        } else {
            this._multipliedQuotientRegister.value &= (1n << 39n) - 1n;
        }

    }

    private _powerShiftLeft(steps: number) {
        for (let i = 0; i < steps; i++) {
            const multiplierQuotientBit = (this._multipliedQuotientRegister.value >> 38n) & 1n;
            const multiplierQuotientSignBit = this._multipliedQuotientRegister.value >> 39n;
            this._multipliedQuotientRegister.value <<= 1n;
            if (multiplierQuotientSignBit) {
                this._multipliedQuotientRegister.value |= 1n << 39n;
            } else {
                this._multipliedQuotientRegister.value &= ((1n << 39n) - 1n);
            }
            this._accumulator.value <<= 1n;
            this._accumulator.value |= multiplierQuotientBit;
        }
    }

    private _circularShiftLeft(steps: number) {
        for (let i = 0; i < steps; i++) {
            const accumulatorBit = ((this._accumulator.value & 0x80_0000_0000n) !== 0n) ? 1n : 0n;
            const multiplierQuotientBit = ((this._multipliedQuotientRegister.value & 0x80_0000_0000n) !== 0n) ? 1n : 0n;

            this._accumulator.value <<= 1n;
            this._multipliedQuotientRegister.value <<= 1n;

            this._accumulator.value |= multiplierQuotientBit;
            this._multipliedQuotientRegister.value |= accumulatorBit;
        }
    }

    private async _executeOp(op: OP, data: number) {
        let transferExecuted = false;

        switch (op) {
            case OP.BLANK:
                // This operation causes the computer to go ahead to the next step In the sequencing cycle left, right, fetch, but does no operation on the registers or the Store of the computers.
                break;
            case OP.TNL:
                // A jump to the left operation of the instruction specified in the address occurs if the bit in position 0 of the Accumulator is one at the time 001 is executed.
                if (this._accumulator.value >> 39n) {
                    this._nextInstructionRegister.value = data;
                    this._currentCommand = CurrentCommand.Left;
                    transferExecuted = true;
                }
                break;
            case OP.TPL:
                // A jump to the left operation of the instruction specified in the address occurs if the bit in position O of the Accumulator is zero at the time 002 is executed.
                // NOTE- bit 0 is the most significant bit on the JOHNNIAC
                if (!(this._accumulator.value >> 39n)) {
                    this._nextInstructionRegister.value = data;
                    this._currentCommand = CurrentCommand.Left;
                    transferExecuted = true;
                }
                break;
            case OP.LM:
                //The word from the Internal Store designated by the address associated with this operation is read into the Number Register and transferred to the Multiplier-Quotient register.' The Accumulator is undisturbed.
                this._numberRegister.value = this._memory.get(data);
                this._multipliedQuotientRegister.value = this._numberRegister.value;
                break;
            case OP.TNR:
                // A jump to the right operation of the instruction specified in the address occurs if the bit in position 0 of the Accumulator is one at the time 005 is executed.
                if (this._accumulator.value >> 39n) {
                    this._nextInstructionRegister.value = data;
                    this._currentCommand = CurrentCommand.Right;
                    transferExecuted = true;
                }
                break;
            case OP.TPR:
                // A jump to the right operation of the instruction specified in the address occurs if the bit in position O of the Accumulator is zero at the time 006 is executed.
                // NOTE- bit 0 is the most significant bit on the JOHNNIAC
                if (!(this._accumulator.value >> 39n)) {
                    this._nextInstructionRegister.value = data;
                    this._currentCommand = CurrentCommand.Right;
                    transferExecuted = true;
                }
                break;
            case OP.TRL:
                // This operations causes an unconditional transfer of control to the left operation of the instruction specified in the Address part.
                this._nextInstructionRegister.value = data;
                this._currentCommand = CurrentCommand.Left;
                transferExecuted = true;
                break;
            case OP.TRR:
                // This operations causes an unconditional transfer of control to the right operation of the instruction specified in the Address part.
                this._nextInstructionRegister.value = data;
                this._currentCommand = CurrentCommand.Right;
                transferExecuted = true;
                break;
            case OP.T1L:
                // A jump occurs if Switch T1 on the console is on. No jump occurs if the switch is off.
                if (this._switchT1) {
                    this._nextInstructionRegister.value = data;
                    this._currentCommand = CurrentCommand.Left;
                    transferExecuted = true;
                }
                break;
            case OP.T1R:
                // A jump occurs if Switch T1 on the console is on. No jump occurs if the switch is off.
                if (this._switchT1) {
                    this._nextInstructionRegister.value = data;
                    this._currentCommand = CurrentCommand.Right;
                    transferExecuted = true;
                }
                break;
            case OP.T2L:
                // A jump occurs if Switch T2 on the console is on. No jump occurs if the switch is off.
                if (this._switchT2) {
                    this._nextInstructionRegister.value = data;
                    this._currentCommand = CurrentCommand.Left;
                    transferExecuted = true;
                }
                break;
            case OP.T2R:
                // A jump occurs if Switch T2 on the console is on. No jump occurs if the switch is off.
                if (this._switchT2) {
                    this._nextInstructionRegister.value = data;
                    this._currentCommand = CurrentCommand.Right;
                    transferExecuted = true;
                }
                break;
            case OP.T3L:
                // A jump occurs if Switch T3 on the console is on. No jump occurs if the switch is off.
                if (this._switchT3) {
                    this._nextInstructionRegister.value = data;
                    this._currentCommand = CurrentCommand.Left;
                    transferExecuted = true;
                }
                break;
            case OP.T3R:
                // A jump occurs if Switch T3 on the console is on. No jump occurs if the switch is off.
                if (this._switchT3) {
                    this._nextInstructionRegister.value = data;
                    this._currentCommand = CurrentCommand.Right;
                    transferExecuted = true;
                }
                break;
            case OP.RA:
                // This operation replaces the contents of the Accumulator with a word from the Internal Store. The Overflow Toggle cannot be turned on by 020.

                //The steps in the operation are:
                // Clear the Accumulator to zero.
                this._accumulator.value = 0n;
                // Read the specified word from the Store to the Number register.

                this._numberRegister.value = this._memory.get(data);
                // Add and put the result in the accumulator.
                this._accumulator.value += this._numberRegister.value;
                // Set O.F. toggle if overflow occurred.
                break;
            case OP.RS:
                {
                    // This operation puts the complement (2's complement if the number is regarded as a fraction) of the word from the Store in the Accumulator. 
                    // The 021 Operation can set the Overflow Toggle if the word specified by the address is -1. That is, 1 in the high order position followed by 39 zeros.
                    // In this case, the computer control circuitry examines the sign bit coming from the complement gate and finds it to be zero which agrees with the sign bit of the Accumulator that was just cleared to zero. 
                    // When the corrective one is added, the carry propagates to the high order position. The result has a one in the sign position so the Overflow Toggle is turned on.

                    // The steps in the operation are:
                    // Clear the Accumulator to zero.
                    this._accumulator.value = 0n;
                    // Read the specified word from the Store to the Number register.
                    this._numberRegister.value = this._memory.get(data);
                    // Complement and Add.
                    const result = this._accumulator.value + this._complement();
                    const overflow = this._hasOverflow(result, true);

                    // Put the result in the Accumulator.
                    this._accumulator.value = result;
                    // Set O.F. toggle 1 if overflow occurred.
                    this._overflowToggle = overflow;
                }
                break;
            case OP.RSV:
                {
                    // The 023 operation is conditionally an 020 or an 021 operation.
                    // The operation is selected which is expected to yield a negative result in the Accumulator.
                    // Zero is the exception; it gives a result zero which has a zero in the sign bit.
                    // The 023 operation followed by a Transfer Plus can he used to test for zero.
                    // The steps in the operation are:
                    //  Clear the Accumulator to zero.
                    this._accumulator.value = 0n;
                    //  Read the specified word from the Store to the Number register.
                    this._numberRegister.value = this._memory.get(data);
                    //  Examine the sign bit of the Number register and choose(a) or (b).
                    const signBit = this._accumulator.value >> 39n << 39n;
                    let result;
                    let overflow;
                    //      (a) Complement and Add if the sign bit is zero.
                    if (!signBit) {
                        result = this._accumulator.value + this._complement();
                        overflow = this._hasOverflow(result, true);
                    }
                    //      (b) Add if the sign bit is one.
                    else {
                        result = this._accumulator.value + this._numberRegister.value;
                        overflow = this._hasOverflow(result, false);
                    }
                    //  Put the result in the Accumulator.
                    this._accumulator.value = result;
                    //  Set O.F.toggle if overflow occurred.
                    this._overflowToggle = overflow;
                }
                break;
            case OP.A:
                {
                    // The word specified by the address 1s added to the number residing in the Accumulator and the result is put back in theAccumulator.
                    // The Overflow Toggle may be set by this operation.

                    // The steps in the operation are:
                    // Read the specified word from the Store to the Number register.
                    this._numberRegister.value = this._memory.get(data);
                    // Add.
                    const result = this._numberRegister.value + this._accumulator.value;
                    const overflow = this._hasOverflow(result, false);

                    // Put the result in the Accumulator.
                    this._accumulator.value = result;
                    // Set O.F. toggle if overflow occurred.
                    this._overflowToggle = overflow;
                }
                break;
            case OP.S:
                {
                    // The steps in the operation are:
                    //Read the specified word from the store to the Number register.
                    this._numberRegister.value = this._memory.get(data);
                    // Complement and add.
                    const result = this._accumulator.value + this._complement();
                    const overflow = this._hasOverflow(result, true);

                    // Put the result in the Accumulator.
                    this._accumulator.value = result;
                    // Set 0.F. toggle if overflow occurred.
                    this._overflowToggle = overflow;
                }
                break;
            case OP.M:
                //The Accumulator is cleared to zero at the start of the operation.
                // The double length product of the multiplier in MQ and the multiplicand from the Store is formed in A and MQ.
                // The sign bit and the 39 high order bits of product are put in A; the low order 39 bits of product are in MQ.
                // The sign bit of MQ is zero.
                this._accumulator.value = 0n;
                this._multiply(data, false);
                break;
            case OP.MA:
                // The contents of the Accumulator is retained and added to the product as it is developed.
                // Since the word which resided in the Accumulator at the start of the operation is shifted as the multiplication progresses, 
                // it is added to the low order positions of the product,
                this._multiply(data, false);
                break;
            case OP.DS:
                // Clear MQ and divide the number in the Accumulator by the number specified in the Store.
                // Put the Quotient in MQ and the Remainder *2^39 in the Accumulator.
                this._multipliedQuotientRegister.value = 0n;
                this._divide(data, false);
                break;
            case OP.D:
                {
                    // Divide the double precision dividend in A and MQ by the single precision divisor specified by the address. Put the Quotient in the MQ register and the Remainder * 2+39 in the Accumulator. 
                    // The contents of the MQ sign bit at the start of the division is irrelevant.
                    this._divide(data, false);
                }
                break;
            case OP.ST:
                this._memory.set(data, this._accumulator.value);
                break;
            case OP.SAL:
                {
                    //Store bits 7-19 of the accumulator to the address. The other bits should be left undisturbed
                    const toStore = this._accumulator.value & 0b0000_0001_1111_1111_1111_0000_0000_0000_0000_0000n;
                    let word = this._memory.get(data);
                    word &= 0b1111_1110_0000_0000_0000_1111_1111_1111_1111_1111n;
                    word |= toStore;
                    this._memory.set(data, word)
                }
                break;
            case OP.SOR:
                {
                    // Store bits 20-27 of the accumulator to the address. The other bits should be left undisturbed
                    const toStore = this._accumulator.value & 0b0000_0000_0000_0000_0000_1111_1111_0000_0000_0000n;
                    let word = this._memory.get(data);
                    word &= 0b1111_1111_1111_1111_1111_0000_0000_1111_1111_1111n;
                    word |= toStore;
                    this._memory.set(data, word);
                }
                break;
            case OP.SAR:
                {
                    // Store bits 28-39 of the accumulator to the address. The other bits should be left undisturbed
                    const toStore = this._accumulator.value & 0b0000_0000_0000_0000_0000_0000_0000_1111_1111_1111n;
                    let word = this._memory.get(data);
                    word &= 0b1111_1111_1111_1111_1111_1111_1111_0000_0000_0000n;
                    word |= toStore;
                    this._memory.set(data, word);
                }
                break;
            case OP.STQ:
                {
                    // The 06 group of operations provide a way for putting the contents of the MQ register in the Store.
                    // The path over which this information travels is MQ to Number register, Number register to the Accumulator via the Adder, and from the Accumulator
                    // to the Store. Since the information goes via the Adder, all the eight options of the Add operation are provided.
                    // The result is put in the Accumulator and in the specified location in the Store. 
                    // The word in the MQ register is not changed.

                    // Reset Add the word in MQ into A and store the result in the specified location.
                    this._numberRegister.value = this._multipliedQuotientRegister.value

                    const result = this._numberRegister.value;
                    this._overflowToggle = this._hasOverflow(result, false);
                    this._accumulator.value = result;

                    this._memory.set(data, this._accumulator.value);
                }
                break
            case OP.SNQ:
                {
                    // Reset Subtract the word in MQ into A and store the result in the specified location.
                    this._numberRegister.value = this._multipliedQuotientRegister.value;

                    const result = this._complement();
                    this._overflowToggle = this._hasOverflow(result, true);
                    this._accumulator.value = result;

                    this._memory.set(data, this._accumulator.value);
                }
                break;
            case OP.SNV:
                {
                    // Reset Subtract the Absolute Value of the word in MQ into A and store the result in the specified location.
                    // NOTE: SNV is functionally RSV with but it takes the value from MQ and also saves to memory
                    // The 023 operation is conditionally an 020 or an 021 operation.
                    // The operation is selected which is expected to yield a negative result in the Accumulator.
                    // Zero is the exception; it gives a result zero which has a zero in the sign bit.
                    // The 023 operation followed by a Transfer Plus can he used to test for zero.
                    // The steps in the operation are:
                    //  Clear the Accumulator to zero.
                    this._accumulator.value = 0n;
                    //  Read the specified word from the Store to the Number register.
                    this._numberRegister.value = this._multipliedQuotientRegister.value;
                    //  Examine the sign bit of the Number register and choose(a) or (b).
                    const signBit = this._accumulator.value >> 39n << 39n;
                    let result;
                    let overflow;
                    //      (a) Complement and Add if the sign bit is zero.
                    if (!signBit) {
                        result = this._accumulator.value + this._complement();
                        overflow = this._hasOverflow(result, true);
                    }
                    //      (b) Add if the sign bit is one.
                    else {
                        result = this._accumulator.value + this._numberRegister.value;
                        overflow = this._hasOverflow(result, false);
                    }
                    //  Put the result in the Accumulator.
                    this._accumulator.value = result;
                    //  Set O.F.toggle if overflow occurred.
                    this._overflowToggle = overflow;

                    this._memory.set(data, this._accumulator.value);
                }
                break;
            case OP.AQS:
                {
                    //Add the word in MQ to the word in A and store the result in the specified location.
                    this._numberRegister.value = this._multipliedQuotientRegister.value;

                    const result = this._accumulator.value + this._numberRegister.value;
                    this._overflowToggle = this._hasOverflow(result, false)
                    this._accumulator.value = result;

                    this._memory.set(data, this._accumulator.value);
                }
                break;
            case OP.SQS:
                {
                    // Subtract the word in MQ from the word in A and store the result in the specified location.
                    this._numberRegister.value = this._multipliedQuotientRegister.value;

                    const result = this._accumulator.value + this._complement();
                    this._overflowToggle = this._hasOverflow(result, true)
                    this._accumulator.value = result;

                    this._memory.set(data, this._accumulator.value);
                }
                break;
            case OP.SRC:
                //The operation 070 clears the MQ before the start of the shift.
                this._multipliedQuotientRegister.value = 0n;
                //The shift moves the bits in the Accumulator to the right the specified number of positions.
                // Zeros are brought into the zero position of A and bits are dropped from position 39 of A
                // as the shift progresses. MQ is not shifted. This shift is not equivalent to dividing
                // the word in the Accumulator by a power of two if the word is negative.
                this._accumulator.value >>= BigInt(data);
                break;
            case OP.CLC:
                // The operation clears MQ before the actual shifting. 
                this._multipliedQuotientRegister.value = 0n;

                // The accumulator and MQ are connected into an eighty position ring by connecting 
                // position O of MR to position 39 of A and position 0 of A to position 39 of MQ. 
                // The shift moves the information the specified number of places to the left in the ring. 
                // A shift of 40 places exchanges the words in A and MQ.
                // A shift of 80 places returns the words to their original locations.
                this._circularShiftLeft(data);
                break;
            case OP.LRC:
                // The operation clears MQ before the actual shifting occurs.
                this._multipliedQuotientRegister.value = 0n;

                this._powerShiftRight(data);
                break;
            case OP.SRH:
                // The shift moves the bits in the Accumulator to the right the specified number of positions. 
                // Zeros are brought into the zero position of A and bits are dropped from position 39 of A as the shift progresses.
                // MQ is not shifted. This shift is not equivalent to dividing the word in the Accumulator by a power of two if the word is negative.
                this._accumulator.value >>= BigInt(data);
                break;
            case OP.CLH:
                // The accumulator and MQ are connected into an eighty position ring by connecting position 0 of MR to position 39 of A and position 0 of A to position 39 of MQ.
                // The shift moves the information the specified number of places to the left in the ring.
                this._circularShiftLeft(data);
                break;
            case OP.LRH:
                this._powerShiftRight(data);
                break;
            case OP.LLH:
                // The words in A and MQ are treated as a double length number.
                // The shift is equivalent to multiplying the double length number by a power of two.
                // Position 1 of MQ is coupled to position 39 of A.
                // Bits shifted out of Accumulator position 0 are lost. 
                // No provision for recording overflows is provided.
                // Zeros are brought into the MQ positions vacated by shifting. 
                // The MQ sign bit is not changed.
                this._powerShiftLeft(data);
                break;
            case OP.SEL:
                // The operation 10.0 causes the JOHNNIAC to select an input or an output device designated by an integer in the address part.
                // Currently all digits of the address except the least octal are irrelevant.
                this._ioDevice = data;
                break;
            case OP.C:
                {
                    // The interpretation of the copy operation is a function of the input-output device selected.
                    switch (this._ioDevice) {
                        case IODevice.CardReaderPrimaryFeed:
                            {
                                // TODO two words are one row on the card, maybe rework to reflect this
                                // The binary word read from card columns 1 through 40 is put in the Store at the location specified by the address; the binary word read from card columns 41 through 80 is put in the Accumulator.
                                const [firstWord, secondWord] = this._cardReader.nextCard();
                                this._memory.set(data, firstWord);
                                this._accumulator.value = secondWord;
                            }
                            break
                        case IODevice.CardReaderSecondaryFeed:
                        case IODevice.CardPunchFeed:
                        case IODevice.CardPunchFeedAndEcho:
                        case IODevice.ANelexPrinter:
                        case IODevice.AnelexPrinterNoSpace:
                            throw new Error(`Unimplemented IO device ${IODevice[this._ioDevice]}`)
                    }
                }
                break;
            case OP.CLK:
                if (!this._clockBuffer) {
                    throw new Error("Trying to access clock value without requesting clock in constructor.");
                }
                this._accumulator.value = BigInt(Atomics.load(this._clockBuffer, 0));
                break;
            case OP.CLEAR1:
            case OP.CLEAR2:
            case OP.CLEAR3:
            case OP.CLEAR4:
                this._accumulator.value = 0n;
                break;
            case OP.RD:
                {
                    const {
                        leftAddress: firstDrumAddress,
                        rightOp: controlBits,
                        rightAddress: lastDrumAddress
                    } = this._decodeWord(this._multipliedQuotientRegister.value);

                    const drum = (controlBits & 0o700) >> 6;
                    const position = (controlBits & 0o070) >> 3;
                    const band = controlBits & 0o007;

                    for (let drumAddress = firstDrumAddress; drumAddress <= lastDrumAddress; drumAddress++, data++) {
                        this._memory.set(data, this._drums.getWord(drum, position, band, drumAddress));
                    }
                }
                break;
            case OP.WD:
                const {
                    leftAddress: firstDrumAddress,
                    rightOp: controlBits,
                    rightAddress: lastDrumAddress
                } = this._decodeWord(this._multipliedQuotientRegister.value);

                const drum = (controlBits & 0o700) >> 6;
                const position = (controlBits & 0o070) >> 3;
                const band = controlBits & 0o007;

                for (let drumAddress = firstDrumAddress; drumAddress <= lastDrumAddress; drumAddress++, data++) {
                    this._drums.setWord(drum, position, band, drumAddress, this._memory.get(data));
                }
                break;
            case OP.PI:
                {
                    // The bit by bit intersection of the word specified in the Store and the word in the Accumulator is formed and put in the Accumulator.
                    this._numberRegister.value = this._memory.get(data);
                    this._accumulator.value &= this._numberRegister.value;
                }
                break;
            case OP.NI:
                {
                    // The logical complement of the word specified in the Store is used to form the intersection with the word in A. The result is put in A,
                    this._numberRegister.value = this._memory.get(data);
                    const complement = ~this._numberRegister.value;
                    this._accumulator.value &= complement;
                }
                break;
            case OP.HTL:
                // Halt the computer. Operation is resumed, starting with the left (13.0) operation of the instruction specified by the address, when the GO button is depressed.
                this._halt = true;
                this._nextInstructionRegister.value = data;
                this._currentCommand = CurrentCommand.Left;
                transferExecuted = true;
                break;
            case OP.HTR:
                // Halt the computer. Operation is resumed, starting with the right (13.4) operation of the instruction specified by the address, when the GO button is depressed.
                this._halt = true;
                this._nextInstructionRegister.value = data;
                this._currentCommand = CurrentCommand.Right;
                transferExecuted = true;
                break;
            case OP.H1L:
                // If the conditioning switch is on, these operations are unconditional transfer operations
                if (this._switchH1) {
                    this._halt = true;
                    this._nextInstructionRegister.value = data;
                    this._currentCommand = CurrentCommand.Left;
                    transferExecuted = true;
                }
                break;
            case OP.H1R:
                // If the conditioning switch is on, these operations are unconditional transfer operations
                if (this._switchH1) {
                    this._halt = true;
                    this._nextInstructionRegister.value = data;
                    this._currentCommand = CurrentCommand.Right;
                    transferExecuted = true;
                }
                break;
            case OP.H2L:
                // If the conditioning switch is on, these operations are unconditional transfer operations
                if (this._switchH2) {
                    this._halt = true;
                    this._nextInstructionRegister.value = data;
                    this._currentCommand = CurrentCommand.Left;
                    transferExecuted = true;
                }
                break;
            case OP.H2R:
                // If the conditioning switch is on, these operations are unconditional transfer operations
                if (this._switchH2) {
                    this._halt = true;
                    this._nextInstructionRegister.value = data;
                    this._currentCommand = CurrentCommand.Right;
                    transferExecuted = true;
                }
                break;
            case OP.H3L:
                // If the conditioning switch is on, these operations are unconditional transfer operations
                if (this._switchH3) {
                    this._halt = true;
                    this._nextInstructionRegister.value = data;
                    this._currentCommand = CurrentCommand.Left;
                    transferExecuted = true;
                }
                break;
            case OP.H3R:
                // If the conditioning switch is on, these operations are unconditional transfer operations
                if (this._switchH3) {
                    this._halt = true;
                    this._nextInstructionRegister.value = data;
                    this._currentCommand = CurrentCommand.Right;
                    transferExecuted = true;
                }
                break;
            case OP.WRITE_LINE_BUFFER:
                {
                    if (!this._typewriterPort) {
                        throw new Error("Typewriter worker is required for this opcode");
                    }

                    const lineBuffer = new StationControlRegister(this._accumulator.value).BN;

                    const message: TTypewriterMessage = {
                        command: WorkerCommand.BufferTransmission,
                        lineBuffer,
                    }

                    const writeMessage: TTypewriterMessage = {
                        command: WorkerCommand.WriteLineBuffer,
                        lineBuffer,
                        data: [...this._memory.slice(data, data + 81)].map(value => Number(value & 127n)),
                    };

                    let canWrite = false;
                    do {
                        this._eventData = undefined;
                        this._typewriterPort.postMessage(message);

                        const eventData = await this._waitForEventMessage();

                        canWrite = eventData.data === true;

                    } while (!canWrite);

                    this._typewriterPort.postMessage(writeMessage);
                }
                break;
            case OP.READ_LINE_BUFFER:
                {
                    if (!this._typewriterPort) {
                        throw new Error("Typewriter worker is required for this opcode");
                    }

                    const message: TTypewriterMessage = {
                        command: WorkerCommand.ReadLineBuffer,
                        lineBuffer: new StationControlRegister(this._accumulator.value).BN,
                    };

                    this._eventData = undefined;
                    this._typewriterPort.postMessage(message);

                    const eventData = await this._waitForEventMessage();

                    for (let i = 0; i < 81; i++) {
                        this._memory.set(data + i, BigInt(eventData.data[i]));
                    }
                }
                break;
            case OP.WRITE_SCR:
                {
                    if (!this._typewriterPort) {
                        throw new Error("Typewriter worker is required for this opcode");
                    }
                    const mask = new StationControlRegister(this._memory.get(data));
                    const newValues = new StationControlRegister(this._accumulator.value);
                    const message: TTypewriterMessage = {
                        command: WorkerCommand.SetControlRegister, update: {
                            F: mask.F ? newValues.F : undefined,
                            EN: mask.EN ? newValues.EN : undefined,
                            DS: mask.DS ? newValues.DS : undefined,
                            RO: mask.RO ? newValues.RO : undefined,
                            TL: mask.TL ? newValues.TL : undefined,
                            CL: mask.CL ? newValues.CL : undefined,
                            SU: mask.SU ? newValues.SU : undefined,
                            BN: mask.BN === 0xF ? newValues.BN : undefined,
                            ON: mask.ON ? newValues.ON : undefined,
                            OF: mask.OF ? newValues.OF : undefined,
                            TC: mask.TC ? newValues.TC : undefined,
                            RI: mask.RI ? newValues.RI : undefined,
                            RC: mask.RC ? newValues.RC : undefined,
                            EJ: mask.EJ ? newValues.EJ : undefined,
                            TO: mask.TO ? newValues.TO : undefined,
                        },
                        stationNumber: Number(this._accumulator.value & 127n),
                    };
                    this._typewriterPort.postMessage(message);
                }
                break;
            case OP.READ_SCR:
                {
                    if (!this._typewriterPort) {
                        throw new Error("Typewriter worker is required for this opcode");
                    }

                    const message: TTypewriterMessage = { command: WorkerCommand.GetControlRegister, station: Number(this._accumulator.value & 127n) };
                    this._eventData = undefined;
                    this._typewriterPort.postMessage(message);
                    const eventData = await this._waitForEventMessage();

                    this._accumulator.value = BigInt(eventData.data);
                }
                break;
            case OP.MATCH_SCR:
                {
                    if (!this._typewriterPort) {
                        throw new Error("Typewriter worker is required for this opcode");
                    }

                    const message: TTypewriterMessage = {
                        command: WorkerCommand.MatchControlRegister,
                        mask: this._memory.get(data) & MatchPatternMask,
                        pattern: this._accumulator.value,
                    };
                    this._eventData = undefined;
                    this._typewriterPort.postMessage(message);
                    const eventData = await this._waitForEventMessage();
                    this._accumulator.value = BigInt(eventData.data);
                }
            case OP.MISMATCH_SCR:
                {
                    if (!this._typewriterPort) {
                        throw new Error("Typewriter worker is required for this opcode");
                    }

                    const message: TTypewriterMessage = {
                        command: WorkerCommand.MismatchControlRegister,
                        mask: this._memory.get(data) & MatchPatternMask,
                        pattern: this._accumulator.value,
                    };
                    this._eventData = undefined;
                    this._typewriterPort.postMessage(message);
                    const eventData = await this._waitForEventMessage();
                    this._accumulator.value = BigInt(eventData.data);
                }
            case OP.EJ:
                // TODO
                break;
            case OP.TFL:
            case OP.TFR:
            case OP.RAV:
            case OP.AV:
            case OP.SV:
            case OP.MR:
            case OP.MNR:
            case OP.MN:
            case OP.MNA:
            case OP.MB:
            case OP.MNB:
            case OP.DNS:
            case OP.DN:
            case OP.SOL:
            case OP.SHL:
            case OP.SAB:
            case OP.SHR:
            case OP.SVQ:
            case OP.AVS:
            case OP.SVS:
            case OP.LLC:
            case OP.DIS:
            case OP.HUT:
            case OP.PMI:
            case OP.NMI:
                throw new Error(`Unimplemented op code ${OP[op]}`);
            default:
                throw new Error(`Unknown op code ${op}`);
        }

        return transferExecuted;
    }

    private async _waitForEventMessage(): Promise<MessageEvent<any>> {
        while (this._eventData === undefined) {
            await new Promise(resolve => setTimeout(resolve, 0));
        }
        return this._eventData;
    }
}

