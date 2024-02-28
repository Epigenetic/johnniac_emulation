import { Memory } from "../Src/Memory";
import { OP } from "../Src/OP";
import { CPU, CurrentCommand, IODevice } from "../Src/CPU";
import { CardReader } from "../Src/CardReader";
import { FortyBitMask } from "../Src/Register";

const ThirtyNineBitMask = ((1n << 39n) - 1n);

describe("CPU", () => {
    describe("BLANK", () => {
        it("Does nothing", () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.BLANK, 0, OP.HTL, 10))
            const cpu = new CPU(memory, new CardReader());
            cpu.go();
            expect(cpu.accumulator).toBe(0n);
            expect(cpu.multipliedQuotientRegister).toBe(0n);
            expect(cpu.numberRegister).toBe(0n);
            expect(cpu.nextInstructionRegister).toBe(10);
            expect(cpu.currentCommand).toBe(CurrentCommand.Left);
        });
    });
    describe("TNL", () => {
        it("Transfers left on negative", () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.RA, 1, OP.TNL, 2));
            memory.set(1, FortyBitMask); // Mask has sign bit set
            memory.set(2, buildWord(OP.HTL, 5, OP.HTR, 10));
            memory.set(3, buildWord(OP.BLANK, 0, OP.HTR, 10));

            const cpu = new CPU(memory, new CardReader());
            cpu.go();
            expect(cpu.nextInstructionRegister).toBe(5);
            expect(cpu.currentCommand).toBe(CurrentCommand.Left);
        });
        it("Does not transfer on positive", () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.RA, 2, OP.TNL, 3));
            memory.set(1, buildWord(OP.HTR, 5, OP.BLANK, 0))
            memory.set(2, 0n); // 0 does not have sign bit set
            memory.set(3, buildWord(OP.HTL, 10, OP.BLANK, 0));

            const cpu = new CPU(memory, new CardReader());
            cpu.go();
            expect(cpu.nextInstructionRegister).toBe(5);
            expect(cpu.currentCommand).toBe(CurrentCommand.Right);
        })
    });
    describe("TPL", () => {
        it("Transfers left on positive", () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.RA, 2, OP.TPL, 3));
            memory.set(1, buildWord(OP.HTR, 5, OP.BLANK, 0));
            memory.set(2, 0n); // 0 does not have sign bit set
            memory.set(3, buildWord(OP.HTL, 10, OP.BLANK, 0));

            const cpu = new CPU(memory, new CardReader());
            cpu.go();
            expect(cpu.nextInstructionRegister).toBe(10);
            expect(cpu.currentCommand).toBe(CurrentCommand.Left);
        });
        it("Does not transfer on negative", () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.RA, 2, OP.TPL, 3));
            memory.set(1, buildWord(OP.HTR, 5, OP.BLANK, 0));
            memory.set(2, FortyBitMask); // Mask has sign bit set
            memory.set(3, buildWord(OP.HTL, 10, OP.BLANK, 0));

            const cpu = new CPU(memory, new CardReader());
            cpu.go();
            expect(cpu.nextInstructionRegister).toBe(5);
            expect(cpu.currentCommand).toBe(CurrentCommand.Right);
        });
    });
    describe("LM", () => {
        it("Loads to MQ", () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.LM, 1, OP.HTR, 3));
            memory.set(1, 123n);

            const cpu = new CPU(memory, new CardReader());
            cpu.go();
            expect(cpu.multipliedQuotientRegister).toBe(123n);
            expect(cpu.numberRegister).toBe(123n);
        });
    });
    describe("TRN", () => {
        it("transfers right on negative", () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.RA, 2, OP.TNR, 3));
            memory.set(1, buildWord(OP.HTL, 5, OP.BLANK, 0));
            memory.set(2, FortyBitMask);
            memory.set(3, buildWord(OP.HTL, 5, OP.HTR, 10));

            const cpu = new CPU(memory, new CardReader());
            cpu.go();
            expect(cpu.nextInstructionRegister).toBe(10);
            expect(cpu.currentCommand).toBe(CurrentCommand.Right);
        });
        it("Does not transfer on positive", () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.RA, 2, OP.TNR, 3));
            memory.set(1, buildWord(OP.HTL, 5, OP.BLANK, 0));
            memory.set(2, 0n);
            memory.set(3, buildWord(OP.HTL, 5, OP.HTR, 10));

            const cpu = new CPU(memory, new CardReader());
            cpu.go();
            expect(cpu.nextInstructionRegister).toBe(5);
            expect(cpu.currentCommand).toBe(CurrentCommand.Left);
        });
    });
    describe("TPR", () => {
        it("Transfers right on positive", () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.RA, 2, OP.TPR, 3));
            memory.set(1, buildWord(OP.HTL, 5, OP.BLANK, 0));
            memory.set(2, 0n);
            memory.set(3, buildWord(OP.HTL, 5, OP.HTR, 10));

            const cpu = new CPU(memory, new CardReader());
            cpu.go();
            expect(cpu.nextInstructionRegister).toBe(10);
            expect(cpu.currentCommand).toBe(CurrentCommand.Right);
        });
        it("Does not transfer on negative", () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.RA, 2, OP.TPR, 3));
            memory.set(1, buildWord(OP.HTL, 5, OP.BLANK, 0));
            memory.set(2, FortyBitMask);
            memory.set(3, buildWord(OP.HTL, 5, OP.HTR, 10));

            const cpu = new CPU(memory, new CardReader());
            cpu.go();
            expect(cpu.nextInstructionRegister).toBe(5);
            expect(cpu.currentCommand).toBe(CurrentCommand.Left);
        });
    });
    describe("TRL", () => {
        it("Transfers left", () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.TRL, 3, OP.BLANK, 0));
            memory.set(1, buildWord(OP.HTR, 10, OP.BLANK, 0));
            memory.set(3, buildWord(OP.HTL, 5, OP.HTR, 10));

            const cpu = new CPU(memory, new CardReader());
            cpu.go();
            expect(cpu.nextInstructionRegister).toBe(5);
            expect(cpu.currentCommand).toBe(CurrentCommand.Left);
        });
    });
    describe("TRR", () => {
        it("Transfers right", () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.TRR, 3, OP.BLANK, 0));
            memory.set(1, buildWord(OP.HTR, 5, OP.BLANK, 0));
            memory.set(3, buildWord(OP.HTL, 5, OP.HTR, 10));

            const cpu = new CPU(memory, new CardReader());
            cpu.go();
            expect(cpu.nextInstructionRegister).toBe(10);
            expect(cpu.currentCommand).toBe(CurrentCommand.Right);
        });
    });
    describe("RA", () => {
        it("Loads word to accumulator", () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.RA, 1, OP.HTL, 10));
            memory.set(1, 12345n);

            const cpu = new CPU(memory, new CardReader());
            cpu.go();
            expect(cpu.accumulator).toBe(12345n);
            expect(cpu.numberRegister).toBe(12345n);
        });
    });
    describe("RS", () => {
        it("Loads word complement to accumulator", () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.RS, 1, OP.HTL, 10));
            memory.set(1, 12345n);

            const cpu = new CPU(memory, new CardReader());
            cpu.go();
            expect(cpu.accumulator).toBe(BigInt.asUintN(40, ~12345n + 1n));
            expect(cpu.numberRegister).toBe(12345n);
        });
        it("Triggers overflow if word is -1", () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.RS, 1, OP.HTL, 10));
            memory.set(1, 1n << 39n);

            const cpu = new CPU(memory, new CardReader());
            cpu.go();
            expect(cpu.accumulator).toBe(BigInt.asUintN(40, ~(1n << 39n) + 1n));
            expect(cpu.numberRegister).toBe(BigInt.asUintN(40, 1n << 39n));
            expect(cpu.overflowToggle).toBe(true);
        })
    });
    describe("A", () => {
        it("Adds accumulator to memory value", () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.RA, 2, OP.A, 3));
            memory.set(1, buildWord(OP.HTL, 10, OP.BLANK, 0));
            memory.set(2, 123n);
            memory.set(3, 456n);

            const cpu = new CPU(memory, new CardReader());
            cpu.go();
            expect(cpu.accumulator).toBe(579n);
            expect(cpu.numberRegister).toBe(456n);
            expect(cpu.overflowToggle).toBe(false);
        });
        it("Triggers positive overflow if it occurs", () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.RA, 2, OP.A, 3));
            memory.set(1, buildWord(OP.HTL, 10, OP.BLANK, 0));
            memory.set(2, 0o07777777777777n);
            memory.set(3, 1n);

            const cpu = new CPU(memory, new CardReader());
            cpu.go();
            expect(cpu.accumulator).toBe(1n << 39n);
            expect(cpu.numberRegister).toBe(1n);
            expect(cpu.overflowToggle).toBe(true);
        });
        it("Triggers negative overflow if it occurs", () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.RA, 2, OP.A, 3));
            memory.set(1, buildWord(OP.HTL, 10, OP.BLANK, 0));
            memory.set(2, 1n << 39n);
            memory.set(3, -1n);

            const cpu = new CPU(memory, new CardReader());
            cpu.go();
            expect(cpu.accumulator).toBe(0o07777777777777n);
            expect(cpu.numberRegister).toBe(BigInt.asUintN(40, -1n));
            expect(cpu.overflowToggle).toBe(true);
        });
        it("Adds negative numbers", () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.RA, 2, OP.A, 3));
            memory.set(1, buildWord(OP.HTL, 10, OP.BLANK, 0));
            memory.set(2, -1n);
            memory.set(3, -2n);

            const cpu = new CPU(memory, new CardReader());
            cpu.go();
            expect(cpu.accumulator).toBe(BigInt.asUintN(40, -3n));
            expect(cpu.numberRegister).toBe(BigInt.asUintN(40, -2n));
            expect(cpu.overflowToggle).toBe(false);
        });
        it("Adds mixed signs", () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.RA, 2, OP.A, 3));
            memory.set(1, buildWord(OP.HTL, 10, OP.BLANK, 0));
            memory.set(2, -1n);
            memory.set(3, 2n);

            const cpu = new CPU(memory, new CardReader());
            cpu.go();
            expect(cpu.accumulator).toBe(BigInt.asUintN(40, 1n));
            expect(cpu.numberRegister).toBe(BigInt.asUintN(40, 2n));
            expect(cpu.overflowToggle).toBe(false);
        });
    });
    describe("S", () => {
        it("Subtracts memory value from accumulator", () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.RA, 2, OP.S, 3));
            memory.set(1, buildWord(OP.HTL, 10, OP.BLANK, 0));
            memory.set(2, 123n);
            memory.set(3, 456n);

            const cpu = new CPU(memory, new CardReader());
            cpu.go();
            expect(cpu.accumulator).toBe(BigInt.asUintN(40, -333n));
            expect(cpu.numberRegister).toBe(456n);
            expect(cpu.overflowToggle).toBe(false);
        });
        it("Triggers negative overflow if it occurs", () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.RA, 2, OP.S, 3));
            memory.set(1, buildWord(OP.HTL, 10, OP.BLANK, 0));
            memory.set(2, 1n << 39n);
            memory.set(3, 1n);

            const cpu = new CPU(memory, new CardReader());
            cpu.go();
            expect(cpu.accumulator).toBe(0o07777777777777n);
            expect(cpu.numberRegister).toBe(1n);
            expect(cpu.overflowToggle).toBe(true);
        })
    });
    describe("MA", () => {
        it("Multiplies", () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.LM, 2, OP.RA, 3));
            memory.set(1, buildWord(OP.MA, 4, OP.HTL, 2));
            memory.set(2, 2n);
            memory.set(3, 0n);
            memory.set(4, 3n);

            const cpu = new CPU(memory, new CardReader());
            cpu.go();
            expect(cpu.multipliedQuotientRegister).toBe(6n);
            expect(cpu.numberRegister).toBe(3n);
            expect(cpu.accumulator).toBe(0n);
            expect(cpu.overflowToggle).toBe(false);
        });
        it("Handles negatives", () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.LM, 2, OP.RA, 3));
            memory.set(1, buildWord(OP.MA, 4, OP.HTL, 2));
            memory.set(2, -2n);
            memory.set(3, 0n);
            memory.set(4, -3n);

            const cpu = new CPU(memory, new CardReader());
            cpu.go();
            expect(cpu.multipliedQuotientRegister).toBe(6n);
            expect(cpu.numberRegister).toBe(BigInt.asUintN(40, -3n));
            expect(cpu.accumulator).toBe(0n);
            expect(cpu.overflowToggle).toBe(false);
        })
        it("Handles negative in multiplicand only", () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.LM, 2, OP.RA, 3));
            memory.set(1, buildWord(OP.MA, 4, OP.HTL, 2));
            memory.set(2, -2n);
            memory.set(3, 0n);
            memory.set(4, 3n);

            const cpu = new CPU(memory, new CardReader());
            cpu.go();
            expect(cpu.multipliedQuotientRegister).toBe(BigInt.asUintN(40, -6n) & ThirtyNineBitMask);
            expect(cpu.numberRegister).toBe(3n);
            expect(cpu.accumulator).toBe(FortyBitMask);
            expect(cpu.overflowToggle).toBe(false);
        });
        it("Handles negative in multiplier only", () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.LM, 2, OP.RA, 3));
            memory.set(1, buildWord(OP.MA, 4, OP.HTL, 2));
            memory.set(2, 2n);
            memory.set(3, 0n);
            memory.set(4, -3n);

            const cpu = new CPU(memory, new CardReader());
            cpu.go();
            expect(cpu.multipliedQuotientRegister).toBe(BigInt.asUintN(40, -6n) & ThirtyNineBitMask);
            expect(cpu.numberRegister).toBe(BigInt.asUintN(40, -3n));
            expect(cpu.accumulator).toBe(FortyBitMask);
            expect(cpu.overflowToggle).toBe(false);
        });
        it("Uses value already in accumulator", () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.LM, 2, OP.RA, 3));
            memory.set(1, buildWord(OP.MA, 4, OP.HTL, 2));
            memory.set(2, 2n);
            memory.set(3, 4n);
            memory.set(4, 3n);

            const cpu = new CPU(memory, new CardReader());
            cpu.go();
            expect(cpu.multipliedQuotientRegister).toBe(10n);
            expect(cpu.numberRegister).toBe(3n);
            expect(cpu.accumulator).toBe(0n);
            expect(cpu.overflowToggle).toBe(false);
        });
        it("Result spans accumulator and MQ", () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.LM, 2, OP.RA, 3));
            memory.set(1, buildWord(OP.MA, 4, OP.HTL, 2));
            memory.set(2, 1n << 38n);
            memory.set(3, 0n);
            memory.set(4, 2n);

            const cpu = new CPU(memory, new CardReader());
            cpu.go();
            expect(cpu.multipliedQuotientRegister).toBe(0n);
            expect(cpu.numberRegister).toBe(2n);
            expect(cpu.accumulator).toBe(1n);
            expect(cpu.overflowToggle).toBe(false);
        });
    });
    describe("D", () => {
        // NOTE: See the comments in CPU._divide on inaccuracy when using a negative divisor
        //       which divides the dividend with no remainder
        it("Divides", () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.LM, 2, OP.D, 3));
            memory.set(1, buildWord(OP.HTR, 2, OP.BLANK, 0));
            memory.set(2, 6n);
            memory.set(3, 2n);

            const cpu = new CPU(memory, new CardReader());
            cpu.go();
            expect(cpu.accumulator).toBe(0n);
            expect(cpu.multipliedQuotientRegister).toBe(3n);
        });
        it("Reports remainder in accumulator", () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.LM, 2, OP.D, 3));
            memory.set(1, buildWord(OP.HTR, 2, OP.BLANK, 0));
            memory.set(2, 5n);
            memory.set(3, 2n);

            const cpu = new CPU(memory, new CardReader());
            cpu.go();
            expect(cpu.accumulator).toBe(1n);
            expect(cpu.multipliedQuotientRegister).toBe(2n);
        });
        it("Handles negatives", () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.LM, 2, OP.RA, 4));
            memory.set(1, buildWord(OP.D, 3, OP.HTR, 2));
            memory.set(2, -6n);
            memory.set(3, -2n);
            memory.set(4, FortyBitMask);

            const cpu = new CPU(memory, new CardReader());
            cpu.go();
            expect(cpu.accumulator).toBe(BigInt.asUintN(40, -2n));
            expect(cpu.multipliedQuotientRegister).toBe(2n);
        });
        it("Handles negative in divisor only", () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.LM, 2, OP.D, 3));
            memory.set(1, buildWord(OP.HTR, 2, OP.BLANK, 0));
            memory.set(2, 6n);
            memory.set(3, -2n);

            const cpu = new CPU(memory, new CardReader());
            cpu.go();
            expect(cpu.accumulator).toBe(BigInt.asUintN(40, -2n));
            expect(cpu.multipliedQuotientRegister).toBe(BigInt.asUintN(40, -4n));
        });
        it("Handles negative in dividend only", () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.LM, 2, OP.RA, 4));
            memory.set(1, buildWord(OP.D, 3, OP.HTR, 2));
            memory.set(2, -6n);
            memory.set(3, 2n);
            memory.set(4, FortyBitMask);

            const cpu = new CPU(memory, new CardReader());
            cpu.go();
            expect(cpu.accumulator).toBe(0n);
            expect(cpu.multipliedQuotientRegister).toBe(BigInt.asUintN(40, -3n));
        });
    });
    describe("ST", () => {
        it("Stores to memory", () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.RA, 2, OP.ST, 4));
            memory.set(1, buildWord(OP.HTR, 3, OP.BLANK, 0));
            memory.set(2, 1234n);

            const cpu = new CPU(memory, new CardReader());
            cpu.go();
            expect(memory.get(4)).toBe(1234n);
        });
    });
    describe("SAL", () => {
        it("Stores bits 7-19", () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.RA, 2, OP.SAL, 4));
            memory.set(1, buildWord(OP.HTR, 3, OP.BLANK, 0));
            memory.set(2, FortyBitMask);

            const cpu = new CPU(memory, new CardReader());
            cpu.go();
            const bits7To19 = 0b0000_0001_1111_1111_1111_0000_0000_0000_0000_0000n;
            expect(memory.get(4)).toBe(bits7To19);
        });
        it("Does not modify other bits", () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.RA, 2, OP.SAL, 4));
            memory.set(1, buildWord(OP.HTR, 3, OP.BLANK, 0));
            memory.set(2, FortyBitMask);
            memory.set(4, 0b0101_0101_0101_0101_0101_0101_0101_0101_0101_0101n);

            const cpu = new CPU(memory, new CardReader());
            cpu.go();
            expect(memory.get(4)).toBe(0b0101_0101_1111_1111_1111_0101_0101_0101_0101_0101n);
        });
    });
    describe("SAR", () => {
        it("Stores bits 28-39", () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.RA, 2, OP.SAR, 4));
            memory.set(1, buildWord(OP.HTR, 3, OP.BLANK, 0));
            memory.set(2, FortyBitMask);

            const cpu = new CPU(memory, new CardReader());
            cpu.go();
            const bits28To39 = 0b0000_0000_0000_0000_0000_0000_0000_1111_1111_1111n;
            expect(memory.get(4)).toBe(bits28To39);
        });
        it("Does not modify other bits", () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.RA, 2, OP.SAR, 4));
            memory.set(1, buildWord(OP.HTR, 3, OP.BLANK, 0));
            memory.set(2, FortyBitMask);
            memory.set(4, 0b0101_0101_0101_0101_0101_0101_0101_0101_0101_0101n);

            const cpu = new CPU(memory, new CardReader());
            cpu.go();
            const bits28To39 = 0b0101_0101_0101_0101_0101_0101_0101_1111_1111_1111n;
            expect(memory.get(4)).toBe(bits28To39);
        });
    });
    describe("STQ", () => {
        it("Stores MQ to memory", () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.LM, 2, OP.STQ, 3));
            memory.set(1, buildWord(OP.HTR, 3, OP.BLANK, 0));
            memory.set(2, 123n);

            const cpu = new CPU(memory, new CardReader());
            cpu.go();
            expect(cpu.accumulator).toBe(123n);
            expect(cpu.numberRegister).toBe(123n);
            expect(memory.get(3)).toBe(123n);
        });
    });
    describe("SNQ", () => {
        it("Stores MQ complement to memory", () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.LM, 2, OP.SNQ, 3));
            memory.set(1, buildWord(OP.HTR, 3, OP.BLANK, 0));
            memory.set(2, 123n);

            const cpu = new CPU(memory, new CardReader());
            cpu.go();
            expect(cpu.accumulator).toBe(BigInt.asUintN(40, -123n));
            expect(cpu.numberRegister).toBe(123n);
            expect(memory.get(3)).toBe(BigInt.asUintN(40, -123n));
        });
    });
    describe("AQS", () => {
        it("Adds MQ to A and stores result", () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.LM, 2, OP.RA, 3));
            memory.set(1, buildWord(OP.AQS, 4, OP.HTR, 4));
            memory.set(2, 123n);
            memory.set(3, 456n);

            const cpu = new CPU(memory, new CardReader());
            cpu.go();
            expect(cpu.accumulator).toBe(579n);
            expect(cpu.numberRegister).toBe(123n)
            expect(memory.get(4)).toBe(579n);
            expect(cpu.overflowToggle).toBe(false);
        });
        it("Sets overflow if it occurred", () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.LM, 2, OP.RA, 3));
            memory.set(1, buildWord(OP.AQS, 4, OP.HTR, 4));
            memory.set(2, 1n);
            memory.set(3, 0o07777777777777n);

            const cpu = new CPU(memory, new CardReader());
            cpu.go();
            expect(cpu.accumulator).toBe(1n << 39n);
            expect(cpu.numberRegister).toBe(1n);
            expect(memory.get(4)).toBe(1n << 39n);
            expect(cpu.overflowToggle).toBe(true);
        });
    });
    describe("SQS", () => {
        it("Subtracts MQ from A and stores result", () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.LM, 2, OP.RA, 3));
            memory.set(1, buildWord(OP.SQS, 4, OP.HTR, 4));
            memory.set(2, 123n);
            memory.set(3, 456n);

            const cpu = new CPU(memory, new CardReader());
            cpu.go();
            expect(cpu.accumulator).toBe(333n);
            expect(cpu.numberRegister).toBe(123n);
            expect(memory.get(4)).toBe(333n);
            expect(cpu.overflowToggle).toBe(false);
        });
    });
    describe("CLC", () => {
        it("Shifts left", () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.RA, 2, OP.CLC, 1));
            memory.set(1, buildWord(OP.HTR, 2, OP.BLANK, 0));
            memory.set(2, 1n);

            const cpu = new CPU(memory, new CardReader());
            cpu.go();
            expect(cpu.accumulator).toBe(2n);
            expect(cpu.multipliedQuotientRegister).toBe(0n);
        });
        it("Clears LM before shifting", () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.RA, 2, OP.LM, 2));
            memory.set(1, buildWord(OP.CLC, 1, OP.HTR, 2));
            memory.set(2, 1n);

            const cpu = new CPU(memory, new CardReader());
            cpu.go();
            expect(cpu.accumulator).toBe(2n);
            expect(cpu.multipliedQuotientRegister).toBe(0n);
        });
        it("Shift of 40 swaps MQ and Accumulator", () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.RA, 2, OP.CLC, 40));
            memory.set(1, buildWord(OP.HTR, 2, OP.BLANK, 0));
            memory.set(2, 123n);

            const cpu = new CPU(memory, new CardReader());
            cpu.go();
            expect(cpu.accumulator).toBe(0n);
            expect(cpu.multipliedQuotientRegister).toBe(123n);
        });
        it("Shift of 80 returns to starting position", () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.RA, 2, OP.CLC, 80));
            memory.set(1, buildWord(OP.HTR, 2, OP.BLANK, 0));
            memory.set(2, 123n);

            const cpu = new CPU(memory, new CardReader());
            cpu.go();
            expect(cpu.accumulator).toBe(123n);
            expect(cpu.multipliedQuotientRegister).toBe(0n);
        });
    });
    describe("LRC", () => {
        it("Shifts right", () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.RA, 2, OP.LRC, 1));
            memory.set(1, buildWord(OP.HTR, 2, OP.BLANK, 0));
            memory.set(2, 2n);

            const cpu = new CPU(memory, new CardReader());
            cpu.go();
            expect(cpu.accumulator).toBe(1n);
            expect(cpu.multipliedQuotientRegister).toBe(0n);
        });
        it("Clears LM before shifting", () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.RA, 2, OP.LM, 2));
            memory.set(1, buildWord(OP.LRC, 1, OP.HTR, 2));
            memory.set(2, 2n);

            const cpu = new CPU(memory, new CardReader());
            cpu.go();
            expect(cpu.accumulator).toBe(1n);
            expect(cpu.multipliedQuotientRegister).toBe(0n);
        });
        it("Performs a power shift and copies sign bit to MQ sign bit", () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.RA, 2, OP.LRC, 1));
            memory.set(1, buildWord(OP.HTR, 2, OP.BLANK, 0));
            memory.set(2, 1n << 39n);

            const cpu = new CPU(memory, new CardReader());
            cpu.go();
            expect(cpu.accumulator).toBe(3n << 38n);
            expect(cpu.multipliedQuotientRegister).toBe(1n << 39n);
        });
        it("Skips sign bit of MQ", () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.RA, 2, OP.LRC, 1));
            memory.set(1, buildWord(OP.HTR, 2, OP.BLANK, 0));
            memory.set(2, 1n);

            const cpu = new CPU(memory, new CardReader());
            cpu.go();
            expect(cpu.accumulator).toBe(0n);
            expect(cpu.multipliedQuotientRegister).toBe(1n << 38n);
        });
    });
    describe("SRH", () => {
        it("Shifts accumulator right", () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.RA, 2, OP.SRH, 1));
            memory.set(1, buildWord(OP.HTR, 2, OP.BLANK, 0));
            memory.set(2, 5n);

            const cpu = new CPU(memory, new CardReader());
            cpu.go();
            expect(cpu.accumulator).toBe(2n);
        });
        it("Leaves MQ untouched", () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.RA, 2, OP.LM, 2));
            memory.set(1, buildWord(OP.SRH, 1, OP.HTR, 2));
            memory.set(2, 2n);

            const cpu = new CPU(memory, new CardReader());
            cpu.go();
            expect(cpu.accumulator).toBe(1n);
            expect(cpu.multipliedQuotientRegister).toBe(2n);
        });
    });
    describe("CLH", () => {
        it("Shifts accumulator and MQ left", () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.RA, 2, OP.LM, 2));
            memory.set(1, buildWord(OP.CLH, 1, OP.HTR, 2));
            memory.set(2, 2n);

            const cpu = new CPU(memory, new CardReader());
            cpu.go();
            expect(cpu.accumulator).toBe(4n);
            expect(cpu.multipliedQuotientRegister).toBe(4n);
        });
        it("Shifts high bit of one register into low bit of the other", () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.RA, 2, OP.LM, 2));
            memory.set(1, buildWord(OP.CLH, 1, OP.HTR, 2));
            memory.set(2, 1n << 39n);

            const cpu = new CPU(memory, new CardReader());
            cpu.go();
            expect(cpu.accumulator).toBe(1n);
            expect(cpu.multipliedQuotientRegister).toBe(1n);
        });
    });
    describe("LRH", () => {
        it("Shifts right", () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.RA, 2, OP.LRH, 1));
            memory.set(1, buildWord(OP.HTR, 2, OP.BLANK, 0));
            memory.set(2, 2n);

            const cpu = new CPU(memory, new CardReader());
            cpu.go();
            expect(cpu.accumulator).toBe(1n);
            expect(cpu.multipliedQuotientRegister).toBe(0n);
        });
        it("Does not clear LM before shifting", () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.RA, 2, OP.LM, 2));
            memory.set(1, buildWord(OP.LRH, 1, OP.HTR, 2));
            memory.set(2, 2n);

            const cpu = new CPU(memory, new CardReader());
            cpu.go();
            expect(cpu.accumulator).toBe(1n);
            expect(cpu.multipliedQuotientRegister).toBe(1n);
        });
        it("Performs a power shift and copies sign bit to MQ sign bit", () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.RA, 2, OP.LRH, 1));
            memory.set(1, buildWord(OP.HTR, 2, OP.BLANK, 0));
            memory.set(2, 1n << 39n);

            const cpu = new CPU(memory, new CardReader());
            cpu.go();
            expect(cpu.accumulator).toBe(3n << 38n);
            expect(cpu.multipliedQuotientRegister).toBe(1n << 39n);
        });
        it("Skips sign bit of MQ", () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.RA, 2, OP.LRH, 1));
            memory.set(1, buildWord(OP.HTR, 2, OP.BLANK, 0));
            memory.set(2, 1n);

            const cpu = new CPU(memory, new CardReader());
            cpu.go();
            expect(cpu.accumulator).toBe(0n);
            expect(cpu.multipliedQuotientRegister).toBe(1n << 38n);
        });
    });
    describe("LLH", () => {
        it("Shifts left", () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.RA, 2, OP.LM, 2));
            memory.set(1, buildWord(OP.LLH, 1, OP.HTR, 2));
            memory.set(2, 2n);

            const cpu = new CPU(memory, new CardReader());
            cpu.go();
            expect(cpu.accumulator).toBe(4n);
            expect(cpu.multipliedQuotientRegister).toBe(4n);
        });
        it("Connects bit 1 of MQ to bit 39 of accumulator", () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.LM, 2, OP.LLH, 1));
            memory.set(1, buildWord(OP.HTR, 2, OP.BLANK, 0));
            memory.set(2, 1n << 38n);

            const cpu = new CPU(memory, new CardReader());
            cpu.go();
            expect(cpu.accumulator).toBe(1n);
            expect(cpu.multipliedQuotientRegister).toBe(0n);
        });
        it("Does not change MQ sign bit", () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.LM, 2, OP.LLH, 1));
            memory.set(1, buildWord(OP.HTR, 2, OP.BLANK, 0));
            memory.set(2, 1n << 39n);

            const cpu = new CPU(memory, new CardReader());
            cpu.go();
            expect(cpu.accumulator).toBe(0n);
            expect(cpu.multipliedQuotientRegister).toBe(1n << 39n);
        });
    });
    describe("SEL", () => {
        it("Selects IO device", () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.SEL, IODevice.CardPunchFeed, OP.HTR, 2));

            const cpu = new CPU(memory, new CardReader());
            cpu.go();
            expect(cpu.ioDevice).toBe(IODevice.CardPunchFeed);
        });
    });
    describe("C", () => {
        it("Copies from card reader", () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.SEL, IODevice.CardReaderPrimaryFeed, OP.C, 2));
            memory.set(1, buildWord(OP.HTR, 2, OP.BLANK, 0));

            const cardReader = new CardReader();
            cardReader.setCard(0, (123n << 40n) | 456n)

            const cpu = new CPU(memory, cardReader);
            cpu.go();
            expect(memory.get(2)).toBe(123n);
            expect(cpu.accumulator).toBe(456n);
        });
        it("Throws on unimplemented device", () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.SEL, IODevice.AnelexPrinterNoSpace, OP.C, 2));
            memory.set(1, buildWord(OP.HTR, 2, OP.BLANK, 0));

            const cpu = new CPU(memory, new CardReader());
            expect(cpu.go).toThrow();
        });
    });
    describe("CLEAR", () => {
        it("CLEAR1 clears accumulator", () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.RA, 2, OP.CLEAR1, 0));
            memory.set(1, buildWord(OP.HTR, 2, OP.BLANK, 0));
            memory.set(2, 123n);

            const cpu = new CPU(memory, new CardReader());
            cpu.go();
            expect(cpu.accumulator).toBe(0n);
        });
        it("CLEAR2 clears accumulator", () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.RA, 2, OP.CLEAR2, 0));
            memory.set(1, buildWord(OP.HTR, 2, OP.BLANK, 0));
            memory.set(2, 123n);

            const cpu = new CPU(memory, new CardReader());
            cpu.go();
            expect(cpu.accumulator).toBe(0n);
        });
        it("CLEAR3 clears accumulator", () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.RA, 2, OP.CLEAR3, 0));
            memory.set(1, buildWord(OP.HTR, 2, OP.BLANK, 0));
            memory.set(2, 123n);

            const cpu = new CPU(memory, new CardReader());
            cpu.go();
            expect(cpu.accumulator).toBe(0n);
        });
        it("CLEAR4 clears accumulator", () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.RA, 2, OP.CLEAR4, 0));
            memory.set(1, buildWord(OP.HTR, 2, OP.BLANK, 0));
            memory.set(2, 123n);

            const cpu = new CPU(memory, new CardReader());
            cpu.go();
            expect(cpu.accumulator).toBe(0n);
        });
    });
    describe("NI", () => {
        it("Takes logical intersection of logical complement", () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.RA, 2, OP.NI, 3));
            memory.set(1, buildWord(OP.HTR, 2, OP.BLANK, 0));
            memory.set(2, 3n);
            memory.set(3, 1n);

            const cpu = new CPU(memory, new CardReader());
            cpu.go();
            expect(cpu.accumulator).toBe(2n);
            expect(cpu.numberRegister).toBe(1n);
        });
    });
    describe("HTL", () => {
        it("Halts left", () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.HTL, 5, OP.BLANK, 0));

            const cpu = new CPU(memory, new CardReader());
            cpu.go();
            expect(cpu.nextInstructionRegister).toBe(5);
            expect(cpu.currentCommand).toBe(CurrentCommand.Left);
        });
    });
    describe("HTR", () => {
        it("Halts right", () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.HTR, 5, OP.BLANK, 0));

            const cpu = new CPU(memory, new CardReader());
            cpu.go();
            expect(cpu.nextInstructionRegister).toBe(5);
            expect(cpu.currentCommand).toBe(CurrentCommand.Right);
        });
    });
});

function buildWord(leftCommand: OP, leftAddress: number, rightCommand: OP, rightAddress: number): bigint {
    let word = BigInt(rightAddress);
    word |= BigInt(rightCommand) << 12n;
    word |= BigInt(leftAddress) << 21n
    word |= BigInt(leftCommand) << 33n;
    return word;
}