import { Memory } from "../Src/JOHNNIAC/Components/Memory.js";
import { OP } from "../Src/JOHNNIAC/OP.js";
import { CPU, CurrentCommand, IODevice } from "../Src/JOHNNIAC/CPU.js";
import { CardReader } from "../Src/JOHNNIAC/Components/CardReader.js";
import { FortyBitMask } from "../Src/JOHNNIAC/Register.js";
import { Drums } from "../Src/JOHNNIAC/Components/Drum.js";

const ThirtyNineBitMask = ((1n << 39n) - 1n);

describe("CPU", () => {
    describe("BLANK", () => {
        it("Does nothing", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.BLANK, 0, OP.HTL, 10))
            const cpu = new CPU(memory, new CardReader(), new Drums());
            await cpu.go();
            expect(cpu.accumulator).toBe(0n);
            expect(cpu.multipliedQuotientRegister).toBe(0n);
            expect(cpu.numberRegister).toBe(0n);
            expect(cpu.nextInstructionRegister).toBe(10);
            expect(cpu.currentCommand).toBe(CurrentCommand.Left);
        });
    });
    describe("TNL", () => {
        it("Transfers left on negative", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.RA, 1, OP.TNL, 2));
            memory.set(1, FortyBitMask); // Mask has sign bit set
            memory.set(2, buildWord(OP.HTL, 5, OP.HTR, 10));
            memory.set(3, buildWord(OP.BLANK, 0, OP.HTR, 10));

            const cpu = new CPU(memory, new CardReader(), new Drums());
            await cpu.go();
            expect(cpu.nextInstructionRegister).toBe(5);
            expect(cpu.currentCommand).toBe(CurrentCommand.Left);
        });
        it("Does not transfer on positive", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.RA, 2, OP.TNL, 3));
            memory.set(1, buildWord(OP.HTR, 5, OP.BLANK, 0))
            memory.set(2, 0n); // 0 does not have sign bit set
            memory.set(3, buildWord(OP.HTL, 10, OP.BLANK, 0));

            const cpu = new CPU(memory, new CardReader(), new Drums());
            await cpu.go();
            expect(cpu.nextInstructionRegister).toBe(5);
            expect(cpu.currentCommand).toBe(CurrentCommand.Right);
        })
    });
    describe("TPL", () => {
        it("Transfers left on positive", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.RA, 2, OP.TPL, 3));
            memory.set(1, buildWord(OP.HTR, 5, OP.BLANK, 0));
            memory.set(2, 0n); // 0 does not have sign bit set
            memory.set(3, buildWord(OP.HTL, 10, OP.BLANK, 0));

            const cpu = new CPU(memory, new CardReader(), new Drums());
            await cpu.go();
            expect(cpu.nextInstructionRegister).toBe(10);
            expect(cpu.currentCommand).toBe(CurrentCommand.Left);
        });
        it("Does not transfer on negative", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.RA, 2, OP.TPL, 3));
            memory.set(1, buildWord(OP.HTR, 5, OP.BLANK, 0));
            memory.set(2, FortyBitMask); // Mask has sign bit set
            memory.set(3, buildWord(OP.HTL, 10, OP.BLANK, 0));

            const cpu = new CPU(memory, new CardReader(), new Drums());
            await cpu.go();
            expect(cpu.nextInstructionRegister).toBe(5);
            expect(cpu.currentCommand).toBe(CurrentCommand.Right);
        });
    });
    describe("LM", () => {
        it("Loads to MQ", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.LM, 1, OP.HTR, 3));
            memory.set(1, 123n);

            const cpu = new CPU(memory, new CardReader(), new Drums());
            await cpu.go();
            expect(cpu.multipliedQuotientRegister).toBe(123n);
            expect(cpu.numberRegister).toBe(123n);
        });
    });
    describe("TRN", () => {
        it("transfers right on negative", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.RA, 2, OP.TNR, 3));
            memory.set(1, buildWord(OP.HTL, 5, OP.BLANK, 0));
            memory.set(2, FortyBitMask);
            memory.set(3, buildWord(OP.HTL, 5, OP.HTR, 10));

            const cpu = new CPU(memory, new CardReader(), new Drums());
            await cpu.go();
            expect(cpu.nextInstructionRegister).toBe(10);
            expect(cpu.currentCommand).toBe(CurrentCommand.Right);
        });
        it("Does not transfer on positive", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.RA, 2, OP.TNR, 3));
            memory.set(1, buildWord(OP.HTL, 5, OP.BLANK, 0));
            memory.set(2, 0n);
            memory.set(3, buildWord(OP.HTL, 5, OP.HTR, 10));

            const cpu = new CPU(memory, new CardReader(), new Drums());
            await cpu.go();
            expect(cpu.nextInstructionRegister).toBe(5);
            expect(cpu.currentCommand).toBe(CurrentCommand.Left);
        });
    });
    describe("TPR", () => {
        it("Transfers right on positive", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.RA, 2, OP.TPR, 3));
            memory.set(1, buildWord(OP.HTL, 5, OP.BLANK, 0));
            memory.set(2, 0n);
            memory.set(3, buildWord(OP.HTL, 5, OP.HTR, 10));

            const cpu = new CPU(memory, new CardReader(), new Drums());
            await cpu.go();
            expect(cpu.nextInstructionRegister).toBe(10);
            expect(cpu.currentCommand).toBe(CurrentCommand.Right);
        });
        it("Does not transfer on negative", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.RA, 2, OP.TPR, 3));
            memory.set(1, buildWord(OP.HTL, 5, OP.BLANK, 0));
            memory.set(2, FortyBitMask);
            memory.set(3, buildWord(OP.HTL, 5, OP.HTR, 10));

            const cpu = new CPU(memory, new CardReader(), new Drums());
            await cpu.go();
            expect(cpu.nextInstructionRegister).toBe(5);
            expect(cpu.currentCommand).toBe(CurrentCommand.Left);
        });
    });
    describe("TRL", () => {
        it("Transfers left", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.TRL, 3, OP.BLANK, 0));
            memory.set(1, buildWord(OP.HTR, 10, OP.BLANK, 0));
            memory.set(3, buildWord(OP.HTL, 5, OP.HTR, 10));

            const cpu = new CPU(memory, new CardReader(), new Drums());
            await cpu.go();
            expect(cpu.nextInstructionRegister).toBe(5);
            expect(cpu.currentCommand).toBe(CurrentCommand.Left);
        });
    });
    describe("TRR", () => {
        it("Transfers right", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.TRR, 3, OP.BLANK, 0));
            memory.set(1, buildWord(OP.HTR, 5, OP.BLANK, 0));
            memory.set(3, buildWord(OP.HTL, 5, OP.HTR, 10));

            const cpu = new CPU(memory, new CardReader(), new Drums());
            await cpu.go();
            expect(cpu.nextInstructionRegister).toBe(10);
            expect(cpu.currentCommand).toBe(CurrentCommand.Right);
        });
    });
    describe("T1L", () => {
        it("Transfers left if switch T1 is set", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.T1L, 3, OP.BLANK, 0));
            memory.set(1, buildWord(OP.HTR, 10, OP.BLANK, 0));
            memory.set(3, buildWord(OP.HTL, 5, OP.HTR, 10));

            const cpu = new CPU(memory, new CardReader(), new Drums());
            cpu.switchT1 = true;
            await cpu.go();
            expect(cpu.nextInstructionRegister).toBe(5);
            expect(cpu.currentCommand).toBe(CurrentCommand.Left);
        });
        it("Does not transfer if switch T1 is not set", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.T1L, 3, OP.BLANK, 0));
            memory.set(1, buildWord(OP.HTR, 10, OP.BLANK, 0));
            memory.set(3, buildWord(OP.HTL, 5, OP.HTR, 15));

            const cpu = new CPU(memory, new CardReader(), new Drums());
            cpu.switchT1 = false;
            await cpu.go();
            expect(cpu.nextInstructionRegister).toBe(10);
            expect(cpu.currentCommand).toBe(CurrentCommand.Right);
        });
    });
    describe("T1R", () => {
        it("Transfers right if switch T1 is set", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.T1R, 3, OP.BLANK, 0));
            memory.set(1, buildWord(OP.HTR, 10, OP.BLANK, 0));
            memory.set(3, buildWord(OP.HTL, 5, OP.HTR, 15));

            const cpu = new CPU(memory, new CardReader(), new Drums());
            cpu.switchT1 = true;
            await cpu.go();
            expect(cpu.nextInstructionRegister).toBe(15);
            expect(cpu.currentCommand).toBe(CurrentCommand.Right);
        });
        it("Does not transfer if switch T1 is not set", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.T1R, 3, OP.BLANK, 0));
            memory.set(1, buildWord(OP.HTR, 10, OP.BLANK, 0));
            memory.set(3, buildWord(OP.HTL, 5, OP.HTR, 15));

            const cpu = new CPU(memory, new CardReader(), new Drums());
            cpu.switchT1 = false;
            await cpu.go();
            expect(cpu.nextInstructionRegister).toBe(10);
            expect(cpu.currentCommand).toBe(CurrentCommand.Right);
        });
    });
    describe("T2L", () => {
        it("Transfers left if switch T2 is set", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.T2L, 3, OP.BLANK, 0));
            memory.set(1, buildWord(OP.HTR, 10, OP.BLANK, 0));
            memory.set(3, buildWord(OP.HTL, 5, OP.HTR, 10));

            const cpu = new CPU(memory, new CardReader(), new Drums());
            cpu.switchT2 = true;
            await cpu.go();
            expect(cpu.nextInstructionRegister).toBe(5);
            expect(cpu.currentCommand).toBe(CurrentCommand.Left);
        });
        it("Does not transfer if switch T2 is not set", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.T2L, 3, OP.BLANK, 0));
            memory.set(1, buildWord(OP.HTR, 10, OP.BLANK, 0));
            memory.set(3, buildWord(OP.HTL, 5, OP.HTR, 15));

            const cpu = new CPU(memory, new CardReader(), new Drums());
            cpu.switchT2 = false;
            await cpu.go();
            expect(cpu.nextInstructionRegister).toBe(10);
            expect(cpu.currentCommand).toBe(CurrentCommand.Right);
        });
    });
    describe("T2R", () => {
        it("Transfers right if switch T2 is set", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.T2R, 3, OP.BLANK, 0));
            memory.set(1, buildWord(OP.HTR, 10, OP.BLANK, 0));
            memory.set(3, buildWord(OP.HTL, 5, OP.HTR, 15));

            const cpu = new CPU(memory, new CardReader(), new Drums());
            cpu.switchT2 = true;
            await cpu.go();
            expect(cpu.nextInstructionRegister).toBe(15);
            expect(cpu.currentCommand).toBe(CurrentCommand.Right);
        });
        it("Does not transfer if switch T2 is not set", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.T2R, 3, OP.BLANK, 0));
            memory.set(1, buildWord(OP.HTR, 10, OP.BLANK, 0));
            memory.set(3, buildWord(OP.HTL, 5, OP.HTR, 15));

            const cpu = new CPU(memory, new CardReader(), new Drums());
            cpu.switchT2 = false;
            await cpu.go();
            expect(cpu.nextInstructionRegister).toBe(10);
            expect(cpu.currentCommand).toBe(CurrentCommand.Right);
        });
    });
    describe("T3L", () => {
        it("Transfers left if switch T3 is set", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.T3L, 3, OP.BLANK, 0));
            memory.set(1, buildWord(OP.HTR, 10, OP.BLANK, 0));
            memory.set(3, buildWord(OP.HTL, 5, OP.HTR, 10));

            const cpu = new CPU(memory, new CardReader(), new Drums());
            cpu.switchT3 = true;
            await cpu.go();
            expect(cpu.nextInstructionRegister).toBe(5);
            expect(cpu.currentCommand).toBe(CurrentCommand.Left);
        });
        it("Does not transfer if switch T3 is not set", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.T3L, 3, OP.BLANK, 0));
            memory.set(1, buildWord(OP.HTR, 10, OP.BLANK, 0));
            memory.set(3, buildWord(OP.HTL, 5, OP.HTR, 15));

            const cpu = new CPU(memory, new CardReader(), new Drums());
            cpu.switchT3 = false;
            await cpu.go();
            expect(cpu.nextInstructionRegister).toBe(10);
            expect(cpu.currentCommand).toBe(CurrentCommand.Right);
        });
    });
    describe("T3R", () => {
        it("Transfers right if switch T3 is set", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.T3R, 3, OP.BLANK, 0));
            memory.set(1, buildWord(OP.HTR, 10, OP.BLANK, 0));
            memory.set(3, buildWord(OP.HTL, 5, OP.HTR, 15));

            const cpu = new CPU(memory, new CardReader(), new Drums());
            cpu.switchT3 = true;
            await cpu.go();
            expect(cpu.nextInstructionRegister).toBe(15);
            expect(cpu.currentCommand).toBe(CurrentCommand.Right);
        });
        it("Does not transfer if switch T3 is not set", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.T3R, 3, OP.BLANK, 0));
            memory.set(1, buildWord(OP.HTR, 10, OP.BLANK, 0));
            memory.set(3, buildWord(OP.HTL, 5, OP.HTR, 15));

            const cpu = new CPU(memory, new CardReader(), new Drums());
            cpu.switchT3 = false;
            await cpu.go();
            expect(cpu.nextInstructionRegister).toBe(10);
            expect(cpu.currentCommand).toBe(CurrentCommand.Right);
        });
    });
    describe("RA", () => {
        it("Loads word to accumulator", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.RA, 1, OP.HTL, 10));
            memory.set(1, 12345n);

            const cpu = new CPU(memory, new CardReader(), new Drums());
            await cpu.go();
            expect(cpu.accumulator).toBe(12345n);
            expect(cpu.numberRegister).toBe(12345n);
        });
    });
    describe("RS", () => {
        it("Loads word complement to accumulator", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.RS, 1, OP.HTL, 10));
            memory.set(1, 12345n);

            const cpu = new CPU(memory, new CardReader(), new Drums());
            await cpu.go();
            expect(cpu.accumulator).toBe(BigInt.asUintN(40, ~12345n + 1n));
            expect(cpu.numberRegister).toBe(12345n);
        });
        it("Triggers overflow if word is -1", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.RS, 1, OP.HTL, 10));
            memory.set(1, 1n << 39n);

            const cpu = new CPU(memory, new CardReader(), new Drums());
            await cpu.go();
            expect(cpu.accumulator).toBe(BigInt.asUintN(40, ~(1n << 39n) + 1n));
            expect(cpu.numberRegister).toBe(BigInt.asUintN(40, 1n << 39n));
            expect(cpu.overflowToggle).toBe(true);
        })
    });
    describe("RSV", () => {
        it("Clears accumulator before subtracting", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.RA, 3, OP.RSV, 2));
            memory.set(1, buildWord(OP.HTL, 4, OP.BLANK, 0));
            memory.set(2, BigInt.asUintN(40, -2n));

            const cpu = new CPU(memory, new CardReader(), new Drums());
            await cpu.go();
            expect(cpu.accumulator).toBe(BigInt.asUintN(40, 2n));
            expect(cpu.numberRegister).toBe(BigInt.asUintN(40, -2n));
            expect(cpu.overflowToggle).toBe(false);
        });
        it("Subtracts if MQ is positive", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.RSV, 2, OP.HTL, 4));
            memory.set(2, 2n);

            const cpu = new CPU(memory, new CardReader(), new Drums());
            await cpu.go();
            expect(cpu.accumulator).toBe(BigInt.asUintN(40, -2n));
            expect(cpu.numberRegister).toBe(2n);
            expect(cpu.overflowToggle).toBe(false);
        });
        it("Adds if MQ is negative", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.RSV, 2, OP.HTL, 4));
            memory.set(2, BigInt.asUintN(40, -2n));

            const cpu = new CPU(memory, new CardReader(), new Drums());
            await cpu.go();
            expect(cpu.accumulator).toBe(BigInt.asUintN(40, 2n));
            expect(cpu.numberRegister).toBe(BigInt.asUintN(40, -2n));
            expect(cpu.overflowToggle).toBe(false);
        });
    });
    describe("A", () => {
        it("Adds accumulator to memory value", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.RA, 2, OP.A, 3));
            memory.set(1, buildWord(OP.HTL, 10, OP.BLANK, 0));
            memory.set(2, 123n);
            memory.set(3, 456n);

            const cpu = new CPU(memory, new CardReader(), new Drums());
            await cpu.go();
            expect(cpu.accumulator).toBe(579n);
            expect(cpu.numberRegister).toBe(456n);
            expect(cpu.overflowToggle).toBe(false);
        });
        it("Triggers positive overflow if it occurs", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.RA, 2, OP.A, 3));
            memory.set(1, buildWord(OP.HTL, 10, OP.BLANK, 0));
            memory.set(2, 0o07777777777777n);
            memory.set(3, 1n);

            const cpu = new CPU(memory, new CardReader(), new Drums());
            await cpu.go();
            expect(cpu.accumulator).toBe(1n << 39n);
            expect(cpu.numberRegister).toBe(1n);
            expect(cpu.overflowToggle).toBe(true);
        });
        it("Triggers negative overflow if it occurs", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.RA, 2, OP.A, 3));
            memory.set(1, buildWord(OP.HTL, 10, OP.BLANK, 0));
            memory.set(2, 1n << 39n);
            memory.set(3, -1n);

            const cpu = new CPU(memory, new CardReader(), new Drums());
            await cpu.go();
            expect(cpu.accumulator).toBe(0o07777777777777n);
            expect(cpu.numberRegister).toBe(BigInt.asUintN(40, -1n));
            expect(cpu.overflowToggle).toBe(true);
        });
        it("Adds negative numbers", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.RA, 2, OP.A, 3));
            memory.set(1, buildWord(OP.HTL, 10, OP.BLANK, 0));
            memory.set(2, -1n);
            memory.set(3, -2n);

            const cpu = new CPU(memory, new CardReader(), new Drums());
            await cpu.go();
            expect(cpu.accumulator).toBe(BigInt.asUintN(40, -3n));
            expect(cpu.numberRegister).toBe(BigInt.asUintN(40, -2n));
            expect(cpu.overflowToggle).toBe(false);
        });
        it("Adds mixed signs", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.RA, 2, OP.A, 3));
            memory.set(1, buildWord(OP.HTL, 10, OP.BLANK, 0));
            memory.set(2, -1n);
            memory.set(3, 2n);

            const cpu = new CPU(memory, new CardReader(), new Drums());
            await cpu.go();
            expect(cpu.accumulator).toBe(BigInt.asUintN(40, 1n));
            expect(cpu.numberRegister).toBe(BigInt.asUintN(40, 2n));
            expect(cpu.overflowToggle).toBe(false);
        });
    });
    describe("S", () => {
        it("Subtracts memory value from accumulator", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.RA, 2, OP.S, 3));
            memory.set(1, buildWord(OP.HTL, 10, OP.BLANK, 0));
            memory.set(2, 123n);
            memory.set(3, 456n);

            const cpu = new CPU(memory, new CardReader(), new Drums());
            await cpu.go();
            expect(cpu.accumulator).toBe(BigInt.asUintN(40, -333n));
            expect(cpu.numberRegister).toBe(456n);
            expect(cpu.overflowToggle).toBe(false);
        });
        it("Triggers negative overflow if it occurs", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.RA, 2, OP.S, 3));
            memory.set(1, buildWord(OP.HTL, 10, OP.BLANK, 0));
            memory.set(2, 1n << 39n);
            memory.set(3, 1n);

            const cpu = new CPU(memory, new CardReader(), new Drums());
            await cpu.go();
            expect(cpu.accumulator).toBe(0o07777777777777n);
            expect(cpu.numberRegister).toBe(1n);
            expect(cpu.overflowToggle).toBe(true);
        })
    });
    describe("M", () => {
        it("Multiplies", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.LM, 2, OP.RA, 3));
            memory.set(1, buildWord(OP.M, 4, OP.HTL, 2));
            memory.set(2, 2n);
            memory.set(3, 0n);
            memory.set(4, 3n);

            const cpu = new CPU(memory, new CardReader(), new Drums());
            await cpu.go();
            expect(cpu.multipliedQuotientRegister).toBe(6n);
            expect(cpu.numberRegister).toBe(3n);
            expect(cpu.accumulator).toBe(0n);
            expect(cpu.overflowToggle).toBe(false);
        });
        it("Clears the accumulator", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.LM, 2, OP.RA, 3));
            memory.set(1, buildWord(OP.M, 4, OP.HTL, 2));
            memory.set(2, 2n);
            memory.set(3, 4n);
            memory.set(4, 3n);

            const cpu = new CPU(memory, new CardReader(), new Drums());
            await cpu.go();
            expect(cpu.multipliedQuotientRegister).toBe(6n);
            expect(cpu.numberRegister).toBe(3n);
            expect(cpu.accumulator).toBe(0n);
            expect(cpu.overflowToggle).toBe(false);
        });
        it("Result spans accumulator and MQ", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.LM, 2, OP.RA, 3));
            memory.set(1, buildWord(OP.M, 4, OP.HTL, 2));
            memory.set(2, 1n << 38n);
            memory.set(3, 0n);
            memory.set(4, 2n);

            const cpu = new CPU(memory, new CardReader(), new Drums());
            await cpu.go();
            expect(cpu.multipliedQuotientRegister).toBe(0n);
            expect(cpu.numberRegister).toBe(2n);
            expect(cpu.accumulator).toBe(1n);
            expect(cpu.overflowToggle).toBe(false);
        });
    });
    describe("MA", () => {
        it("Multiplies", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.LM, 2, OP.RA, 3));
            memory.set(1, buildWord(OP.MA, 4, OP.HTL, 2));
            memory.set(2, 2n);
            memory.set(3, 0n);
            memory.set(4, 3n);

            const cpu = new CPU(memory, new CardReader(), new Drums());
            await cpu.go();
            expect(cpu.multipliedQuotientRegister).toBe(6n);
            expect(cpu.numberRegister).toBe(3n);
            expect(cpu.accumulator).toBe(0n);
            expect(cpu.overflowToggle).toBe(false);
        });
        it("Handles negatives", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.LM, 2, OP.RA, 3));
            memory.set(1, buildWord(OP.MA, 4, OP.HTL, 2));
            memory.set(2, -2n);
            memory.set(3, 0n);
            memory.set(4, -3n);

            const cpu = new CPU(memory, new CardReader(), new Drums());
            await cpu.go();
            expect(cpu.multipliedQuotientRegister).toBe(6n);
            expect(cpu.numberRegister).toBe(BigInt.asUintN(40, -3n));
            expect(cpu.accumulator).toBe(0n);
            expect(cpu.overflowToggle).toBe(false);
        })
        it("Handles negative in multiplicand only", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.LM, 2, OP.RA, 3));
            memory.set(1, buildWord(OP.MA, 4, OP.HTL, 2));
            memory.set(2, -2n);
            memory.set(3, 0n);
            memory.set(4, 3n);

            const cpu = new CPU(memory, new CardReader(), new Drums());
            await cpu.go();
            expect(cpu.multipliedQuotientRegister).toBe(BigInt.asUintN(40, -6n) & ThirtyNineBitMask);
            expect(cpu.numberRegister).toBe(3n);
            expect(cpu.accumulator).toBe(FortyBitMask);
            expect(cpu.overflowToggle).toBe(false);
        });
        it("Handles negative in multiplier only", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.LM, 2, OP.RA, 3));
            memory.set(1, buildWord(OP.MA, 4, OP.HTL, 2));
            memory.set(2, 2n);
            memory.set(3, 0n);
            memory.set(4, -3n);

            const cpu = new CPU(memory, new CardReader(), new Drums());
            await cpu.go();
            expect(cpu.multipliedQuotientRegister).toBe(BigInt.asUintN(40, -6n) & ThirtyNineBitMask);
            expect(cpu.numberRegister).toBe(BigInt.asUintN(40, -3n));
            expect(cpu.accumulator).toBe(FortyBitMask);
            expect(cpu.overflowToggle).toBe(false);
        });
        it("Uses value already in accumulator", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.LM, 2, OP.RA, 3));
            memory.set(1, buildWord(OP.MA, 4, OP.HTL, 2));
            memory.set(2, 2n);
            memory.set(3, 4n);
            memory.set(4, 3n);

            const cpu = new CPU(memory, new CardReader(), new Drums());
            await cpu.go();
            expect(cpu.multipliedQuotientRegister).toBe(10n);
            expect(cpu.numberRegister).toBe(3n);
            expect(cpu.accumulator).toBe(0n);
            expect(cpu.overflowToggle).toBe(false);
        });
        it("Result spans accumulator and MQ", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.LM, 2, OP.RA, 3));
            memory.set(1, buildWord(OP.MA, 4, OP.HTL, 2));
            memory.set(2, 1n << 38n);
            memory.set(3, 0n);
            memory.set(4, 2n);

            const cpu = new CPU(memory, new CardReader(), new Drums());
            await cpu.go();
            expect(cpu.multipliedQuotientRegister).toBe(0n);
            expect(cpu.numberRegister).toBe(2n);
            expect(cpu.accumulator).toBe(1n);
            expect(cpu.overflowToggle).toBe(false);
        });
    });
    describe("D", () => {
        // NOTE: See the comments in CPU._divide on inaccuracy when using a negative divisor
        //       which divides the dividend with no remainder
        it("Divides", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.LM, 2, OP.D, 3));
            memory.set(1, buildWord(OP.HTR, 2, OP.BLANK, 0));
            memory.set(2, 6n);
            memory.set(3, 2n);

            const cpu = new CPU(memory, new CardReader(), new Drums());
            await cpu.go();
            expect(cpu.accumulator).toBe(0n);
            expect(cpu.multipliedQuotientRegister).toBe(3n);
        });
        it("Reports remainder in accumulator", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.LM, 2, OP.D, 3));
            memory.set(1, buildWord(OP.HTR, 2, OP.BLANK, 0));
            memory.set(2, 5n);
            memory.set(3, 2n);

            const cpu = new CPU(memory, new CardReader(), new Drums());
            await cpu.go();
            expect(cpu.accumulator).toBe(1n);
            expect(cpu.multipliedQuotientRegister).toBe(2n);
        });
        it("Handles negatives", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.LM, 2, OP.RA, 4));
            memory.set(1, buildWord(OP.D, 3, OP.HTR, 2));
            memory.set(2, -6n);
            memory.set(3, -2n);
            memory.set(4, FortyBitMask);

            const cpu = new CPU(memory, new CardReader(), new Drums());
            await cpu.go();
            expect(cpu.accumulator).toBe(BigInt.asUintN(40, -2n));
            expect(cpu.multipliedQuotientRegister).toBe(2n);
        });
        it("Handles negatives with remainders", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.LM, 2, OP.RA, 4));
            memory.set(1, buildWord(OP.D, 3, OP.HTR, 2));
            memory.set(2, -5n);
            memory.set(3, -2n);
            memory.set(4, FortyBitMask);

            const cpu = new CPU(memory, new CardReader(), new Drums());
            await cpu.go();
            expect(cpu.accumulator).toBe(BigInt.asUintN(40, -1n));
            expect(cpu.multipliedQuotientRegister).toBe(2n);
        });
        it("Handles negative in divisor only", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.LM, 2, OP.D, 3));
            memory.set(1, buildWord(OP.HTR, 2, OP.BLANK, 0));
            memory.set(2, 6n);
            memory.set(3, -2n);

            const cpu = new CPU(memory, new CardReader(), new Drums());
            await cpu.go();
            expect(cpu.accumulator).toBe(BigInt.asUintN(40, -2n));
            expect(cpu.multipliedQuotientRegister).toBe(BigInt.asUintN(40, -4n));
        });
        it("Handles negative in dividend only", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.LM, 2, OP.RA, 4));
            memory.set(1, buildWord(OP.D, 3, OP.HTR, 2));
            memory.set(2, -6n);
            memory.set(3, 2n);
            memory.set(4, FortyBitMask);

            const cpu = new CPU(memory, new CardReader(), new Drums());
            await cpu.go();
            expect(cpu.accumulator).toBe(0n);
            expect(cpu.multipliedQuotientRegister).toBe(BigInt.asUintN(40, -3n));
        });
    });
    describe("DS", () => {
        it("Divides short dividend", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.RA, 2, OP.DS, 3));
            memory.set(1, buildWord(OP.HTR, 2, OP.BLANK, 0));
            memory.set(2, 1n);
            memory.set(3, 2n);

            const cpu = new CPU(memory, new CardReader(), new Drums());
            await cpu.go();
            expect(cpu.accumulator).toBe(0n);
            expect(cpu.multipliedQuotientRegister).toBe(1n << 38n);
        });
    });
    describe("ST", () => {
        it("Stores to memory", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.RA, 2, OP.ST, 4));
            memory.set(1, buildWord(OP.HTR, 3, OP.BLANK, 0));
            memory.set(2, 1234n);

            const cpu = new CPU(memory, new CardReader(), new Drums());
            await cpu.go();
            expect(memory.get(4)).toBe(1234n);
        });
    });
    describe("SOL",()=>{
        it("Stores bits 0-6",async ()=>{
            const memory = new Memory();
            memory.set(0, buildWord(OP.RA, 2, OP.SOR, 4));
            memory.set(1, buildWord(OP.HTR, 3, OP.BLANK, 0));
            memory.set(2, FortyBitMask);

            const cpu = new CPU(memory, new CardReader(), new Drums());
            await cpu.go();
            const bits0To6 = 0b0000_0000_0000_0000_0000_1111_1111_0000_0000_0000n;
            expect(memory.get(4)).toBe(bits0To6);
        });
    });
    describe("SAL", () => {
        it("Stores bits 7-19", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.RA, 2, OP.SAL, 4));
            memory.set(1, buildWord(OP.HTR, 3, OP.BLANK, 0));
            memory.set(2, FortyBitMask);

            const cpu = new CPU(memory, new CardReader(), new Drums());
            await cpu.go();
            const bits7To19 = 0b0000_0001_1111_1111_1111_0000_0000_0000_0000_0000n;
            expect(memory.get(4)).toBe(bits7To19);
        });
        it("Does not modify other bits", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.RA, 2, OP.SAL, 4));
            memory.set(1, buildWord(OP.HTR, 3, OP.BLANK, 0));
            memory.set(2, FortyBitMask);
            memory.set(4, 0b0101_0101_0101_0101_0101_0101_0101_0101_0101_0101n);

            const cpu = new CPU(memory, new CardReader(), new Drums());
            await cpu.go();
            expect(memory.get(4)).toBe(0b0101_0101_1111_1111_1111_0101_0101_0101_0101_0101n);
        });
    });
    describe("SOR", () => {
        it("Stores bits 20-27", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.RA, 2, OP.SOR, 4));
            memory.set(1, buildWord(OP.HTR, 3, OP.BLANK, 0));
            memory.set(2, FortyBitMask);

            const cpu = new CPU(memory, new CardReader(), new Drums());
            await cpu.go();
            const bits20To27 = 0b0000_0000_0000_0000_0000_1111_1111_0000_0000_0000n;
            expect(memory.get(4)).toBe(bits20To27);
        });
    });
    describe("SAR", () => {
        it("Stores bits 28-39", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.RA, 2, OP.SAR, 4));
            memory.set(1, buildWord(OP.HTR, 3, OP.BLANK, 0));
            memory.set(2, FortyBitMask);

            const cpu = new CPU(memory, new CardReader(), new Drums());
            await cpu.go();
            const bits28To39 = 0b0000_0000_0000_0000_0000_0000_0000_1111_1111_1111n;
            expect(memory.get(4)).toBe(bits28To39);
        });
        it("Does not modify other bits", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.RA, 2, OP.SAR, 4));
            memory.set(1, buildWord(OP.HTR, 3, OP.BLANK, 0));
            memory.set(2, FortyBitMask);
            memory.set(4, 0b0101_0101_0101_0101_0101_0101_0101_0101_0101_0101n);

            const cpu = new CPU(memory, new CardReader(), new Drums());
            await cpu.go();
            const bits28To39 = 0b0101_0101_0101_0101_0101_0101_0101_1111_1111_1111n;
            expect(memory.get(4)).toBe(bits28To39);
        });
    });
    describe("SAB", () => {
        it("Stores both sets of address bits", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.RA, 2, OP.SAB, 4));
            memory.set(1, buildWord(OP.HTR, 3, OP.BLANK, 0));
            memory.set(2, FortyBitMask);

            const cpu = new CPU(memory, new CardReader(), new Drums());
            await cpu.go();
            const expectedBits = 0b0001_1111_1111_1111_0000_0000_1111_1111_1111n;
            expect(memory.get(4)).toBe(expectedBits);
        });
        it("Does not modify other bits",async ()=>{
            const memory = new Memory();
            memory.set(0, buildWord(OP.RA, 2, OP.SAB, 4));
            memory.set(1, buildWord(OP.HTR, 3, OP.BLANK, 0));
            memory.set(2, FortyBitMask);
            memory.set(4, 0b0101_0101_0101_0101_0101_0101_0101_0101_0101_0101n);

            const cpu = new CPU(memory, new CardReader(), new Drums());
            await cpu.go();
            const expectedBits = 0b101_0101_1111_1111_1111_0101_0101_1111_1111_1111n;
            expect(memory.get(4)).toBe(expectedBits);
        });
    });
    describe("STQ", () => {
        it("Stores MQ to memory", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.LM, 2, OP.STQ, 3));
            memory.set(1, buildWord(OP.HTR, 3, OP.BLANK, 0));
            memory.set(2, 123n);

            const cpu = new CPU(memory, new CardReader(), new Drums());
            await cpu.go();
            expect(cpu.accumulator).toBe(123n);
            expect(cpu.numberRegister).toBe(123n);
            expect(memory.get(3)).toBe(123n);
        });
    });
    describe("SNQ", () => {
        it("Stores MQ complement to memory", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.LM, 2, OP.SNQ, 3));
            memory.set(1, buildWord(OP.HTR, 3, OP.BLANK, 0));
            memory.set(2, 123n);

            const cpu = new CPU(memory, new CardReader(), new Drums());
            await cpu.go();
            expect(cpu.accumulator).toBe(BigInt.asUintN(40, -123n));
            expect(cpu.numberRegister).toBe(123n);
            expect(memory.get(3)).toBe(BigInt.asUintN(40, -123n));
        });
    });
    describe("SNV", () => {
        it("Clears accumulator before subtracting", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.LM, 2, OP.RA, 3));
            memory.set(1, buildWord(OP.SNV, 3, OP.HTL, 4,));
            memory.set(2, BigInt.asUintN(40, -2n));

            const cpu = new CPU(memory, new CardReader(), new Drums());
            await cpu.go();
            expect(cpu.accumulator).toBe(BigInt.asUintN(40, 2n));
            expect(cpu.numberRegister).toBe(BigInt.asUintN(40, -2n));
            expect(memory.get(3)).toBe(BigInt.asUintN(40, 2n));
            expect(cpu.overflowToggle).toBe(false);
        });
        it("Subtracts if MQ is positive", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.LM, 2, OP.SNV, 3));
            memory.set(1, buildWord(OP.HTL, 4, OP.BLANK, 0));
            memory.set(2, 2n);

            const cpu = new CPU(memory, new CardReader(), new Drums());
            await cpu.go();
            expect(cpu.accumulator).toBe(BigInt.asUintN(40, -2n));
            expect(cpu.numberRegister).toBe(2n);
            expect(memory.get(3)).toBe(BigInt.asUintN(40, -2n));
            expect(cpu.overflowToggle).toBe(false);
        });
        it("Adds if MQ is negative", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.LM, 2, OP.SNV, 3));
            memory.set(1, buildWord(OP.HTL, 4, OP.BLANK, 0));
            memory.set(2, BigInt.asUintN(40, -2n));

            const cpu = new CPU(memory, new CardReader(), new Drums());
            await cpu.go();
            expect(cpu.accumulator).toBe(BigInt.asUintN(40, 2n));
            expect(cpu.numberRegister).toBe(BigInt.asUintN(40, -2n));
            expect(memory.get(3)).toBe(BigInt.asUintN(40, 2n));
            expect(cpu.overflowToggle).toBe(false);
        });
    });
    describe("AQS", () => {
        it("Adds MQ to A and stores result", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.LM, 2, OP.RA, 3));
            memory.set(1, buildWord(OP.AQS, 4, OP.HTR, 4));
            memory.set(2, 123n);
            memory.set(3, 456n);

            const cpu = new CPU(memory, new CardReader(), new Drums());
            await cpu.go();
            expect(cpu.accumulator).toBe(579n);
            expect(cpu.numberRegister).toBe(123n)
            expect(memory.get(4)).toBe(579n);
            expect(cpu.overflowToggle).toBe(false);
        });
        it("Sets overflow if it occurred", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.LM, 2, OP.RA, 3));
            memory.set(1, buildWord(OP.AQS, 4, OP.HTR, 4));
            memory.set(2, 1n);
            memory.set(3, 0o07777777777777n);

            const cpu = new CPU(memory, new CardReader(), new Drums());
            await cpu.go();
            expect(cpu.accumulator).toBe(1n << 39n);
            expect(cpu.numberRegister).toBe(1n);
            expect(memory.get(4)).toBe(1n << 39n);
            expect(cpu.overflowToggle).toBe(true);
        });
    });
    describe("SQS", () => {
        it("Subtracts MQ from A and stores result", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.LM, 2, OP.RA, 3));
            memory.set(1, buildWord(OP.SQS, 4, OP.HTR, 4));
            memory.set(2, 123n);
            memory.set(3, 456n);

            const cpu = new CPU(memory, new CardReader(), new Drums());
            await cpu.go();
            expect(cpu.accumulator).toBe(333n);
            expect(cpu.numberRegister).toBe(123n);
            expect(memory.get(4)).toBe(333n);
            expect(cpu.overflowToggle).toBe(false);
        });
    });
    describe("CLC", () => {
        it("Shifts left", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.RA, 2, OP.CLC, 1));
            memory.set(1, buildWord(OP.HTR, 2, OP.BLANK, 0));
            memory.set(2, 1n);

            const cpu = new CPU(memory, new CardReader(), new Drums());
            await cpu.go();
            expect(cpu.accumulator).toBe(2n);
            expect(cpu.multipliedQuotientRegister).toBe(0n);
        });
        it("Clears LM before shifting", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.RA, 2, OP.LM, 2));
            memory.set(1, buildWord(OP.CLC, 1, OP.HTR, 2));
            memory.set(2, 1n);

            const cpu = new CPU(memory, new CardReader(), new Drums());
            await cpu.go();
            expect(cpu.accumulator).toBe(2n);
            expect(cpu.multipliedQuotientRegister).toBe(0n);
        });
        it("Shift of 40 swaps MQ and Accumulator", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.RA, 2, OP.CLC, 40));
            memory.set(1, buildWord(OP.HTR, 2, OP.BLANK, 0));
            memory.set(2, 123n);

            const cpu = new CPU(memory, new CardReader(), new Drums());
            await cpu.go();
            expect(cpu.accumulator).toBe(0n);
            expect(cpu.multipliedQuotientRegister).toBe(123n);
        });
        it("Shift of 80 returns to starting position", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.RA, 2, OP.CLC, 80));
            memory.set(1, buildWord(OP.HTR, 2, OP.BLANK, 0));
            memory.set(2, 123n);

            const cpu = new CPU(memory, new CardReader(), new Drums());
            await cpu.go();
            expect(cpu.accumulator).toBe(123n);
            expect(cpu.multipliedQuotientRegister).toBe(0n);
        });
    });
    describe("LRC", () => {
        it("Shifts right", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.RA, 2, OP.LRC, 1));
            memory.set(1, buildWord(OP.HTR, 2, OP.BLANK, 0));
            memory.set(2, 2n);

            const cpu = new CPU(memory, new CardReader(), new Drums());
            await cpu.go();
            expect(cpu.accumulator).toBe(1n);
            expect(cpu.multipliedQuotientRegister).toBe(0n);
        });
        it("Clears LM before shifting", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.RA, 2, OP.LM, 2));
            memory.set(1, buildWord(OP.LRC, 1, OP.HTR, 2));
            memory.set(2, 2n);

            const cpu = new CPU(memory, new CardReader(), new Drums());
            await cpu.go();
            expect(cpu.accumulator).toBe(1n);
            expect(cpu.multipliedQuotientRegister).toBe(0n);
        });
        it("Performs a power shift and copies sign bit to MQ sign bit", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.RA, 2, OP.LRC, 1));
            memory.set(1, buildWord(OP.HTR, 2, OP.BLANK, 0));
            memory.set(2, 1n << 39n);

            const cpu = new CPU(memory, new CardReader(), new Drums());
            await cpu.go();
            expect(cpu.accumulator).toBe(3n << 38n);
            expect(cpu.multipliedQuotientRegister).toBe(1n << 39n);
        });
        it("Skips sign bit of MQ", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.RA, 2, OP.LRC, 1));
            memory.set(1, buildWord(OP.HTR, 2, OP.BLANK, 0));
            memory.set(2, 1n);

            const cpu = new CPU(memory, new CardReader(), new Drums());
            await cpu.go();
            expect(cpu.accumulator).toBe(0n);
            expect(cpu.multipliedQuotientRegister).toBe(1n << 38n);
        });
    });
    describe("SRH", () => {
        it("Shifts accumulator right", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.RA, 2, OP.SRH, 1));
            memory.set(1, buildWord(OP.HTR, 2, OP.BLANK, 0));
            memory.set(2, 5n);

            const cpu = new CPU(memory, new CardReader(), new Drums());
            await cpu.go();
            expect(cpu.accumulator).toBe(2n);
        });
        it("Leaves MQ untouched", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.RA, 2, OP.LM, 2));
            memory.set(1, buildWord(OP.SRH, 1, OP.HTR, 2));
            memory.set(2, 2n);

            const cpu = new CPU(memory, new CardReader(), new Drums());
            await cpu.go();
            expect(cpu.accumulator).toBe(1n);
            expect(cpu.multipliedQuotientRegister).toBe(2n);
        });
    });
    describe("CLH", () => {
        it("Shifts accumulator and MQ left", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.RA, 2, OP.LM, 2));
            memory.set(1, buildWord(OP.CLH, 1, OP.HTR, 2));
            memory.set(2, 2n);

            const cpu = new CPU(memory, new CardReader(), new Drums());
            await cpu.go();
            expect(cpu.accumulator).toBe(4n);
            expect(cpu.multipliedQuotientRegister).toBe(4n);
        });
        it("Shifts high bit of one register into low bit of the other", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.RA, 2, OP.LM, 2));
            memory.set(1, buildWord(OP.CLH, 1, OP.HTR, 2));
            memory.set(2, 1n << 39n);

            const cpu = new CPU(memory, new CardReader(), new Drums());
            await cpu.go();
            expect(cpu.accumulator).toBe(1n);
            expect(cpu.multipliedQuotientRegister).toBe(1n);
        });
    });
    describe("LRH", () => {
        it("Shifts right", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.RA, 2, OP.LRH, 1));
            memory.set(1, buildWord(OP.HTR, 2, OP.BLANK, 0));
            memory.set(2, 2n);

            const cpu = new CPU(memory, new CardReader(), new Drums());
            await cpu.go();
            expect(cpu.accumulator).toBe(1n);
            expect(cpu.multipliedQuotientRegister).toBe(0n);
        });
        it("Does not clear LM before shifting", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.RA, 2, OP.LM, 2));
            memory.set(1, buildWord(OP.LRH, 1, OP.HTR, 2));
            memory.set(2, 2n);

            const cpu = new CPU(memory, new CardReader(), new Drums());
            await cpu.go();
            expect(cpu.accumulator).toBe(1n);
            expect(cpu.multipliedQuotientRegister).toBe(1n);
        });
        it("Performs a power shift and copies sign bit to MQ sign bit", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.RA, 2, OP.LRH, 1));
            memory.set(1, buildWord(OP.HTR, 2, OP.BLANK, 0));
            memory.set(2, 1n << 39n);

            const cpu = new CPU(memory, new CardReader(), new Drums());
            await cpu.go();
            expect(cpu.accumulator).toBe(3n << 38n);
            expect(cpu.multipliedQuotientRegister).toBe(1n << 39n);
        });
        it("Skips sign bit of MQ", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.RA, 2, OP.LRH, 1));
            memory.set(1, buildWord(OP.HTR, 2, OP.BLANK, 0));
            memory.set(2, 1n);

            const cpu = new CPU(memory, new CardReader(), new Drums());
            await cpu.go();
            expect(cpu.accumulator).toBe(0n);
            expect(cpu.multipliedQuotientRegister).toBe(1n << 38n);
        });
    });
    describe("LLH", () => {
        it("Shifts left", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.RA, 2, OP.LM, 2));
            memory.set(1, buildWord(OP.LLH, 1, OP.HTR, 2));
            memory.set(2, 2n);

            const cpu = new CPU(memory, new CardReader(), new Drums());
            await cpu.go();
            expect(cpu.accumulator).toBe(4n);
            expect(cpu.multipliedQuotientRegister).toBe(4n);
        });
        it("Connects bit 1 of MQ to bit 39 of accumulator", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.LM, 2, OP.LLH, 1));
            memory.set(1, buildWord(OP.HTR, 2, OP.BLANK, 0));
            memory.set(2, 1n << 38n);

            const cpu = new CPU(memory, new CardReader(), new Drums());
            await cpu.go();
            expect(cpu.accumulator).toBe(1n);
            expect(cpu.multipliedQuotientRegister).toBe(0n);
        });
        it("Does not change MQ sign bit", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.LM, 2, OP.LLH, 1));
            memory.set(1, buildWord(OP.HTR, 2, OP.BLANK, 0));
            memory.set(2, 1n << 39n);

            const cpu = new CPU(memory, new CardReader(), new Drums());
            await cpu.go();
            expect(cpu.accumulator).toBe(0n);
            expect(cpu.multipliedQuotientRegister).toBe(1n << 39n);
        });
    });
    describe("SEL", () => {
        it("Selects IO device", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.SEL, IODevice.CardPunchFeed, OP.HTR, 2));

            const cpu = new CPU(memory, new CardReader(), new Drums());
            await cpu.go();
            expect(cpu.ioDevice).toBe(IODevice.CardPunchFeed);
        });
    });
    describe("C", () => {
        it("Copies from card reader", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.SEL, IODevice.CardReaderPrimaryFeed, OP.C, 2));
            memory.set(1, buildWord(OP.HTR, 2, OP.BLANK, 0));

            const cardReader = new CardReader();
            cardReader.setCard(0, (123n << 40n) | 456n)

            const cpu = new CPU(memory, cardReader, new Drums());
            await cpu.go();
            expect(memory.get(2)).toBe(123n);
            expect(cpu.accumulator).toBe(456n);
        });
        it("Throws on unimplemented device", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.SEL, IODevice.AnelexPrinterNoSpace, OP.C, 2));
            memory.set(1, buildWord(OP.HTR, 2, OP.BLANK, 0));

            const cpu = new CPU(memory, new CardReader(), new Drums());
            expect(async () => await cpu.go()).rejects.toThrow();
        });
    });
    describe("CLEAR", () => {
        it("CLEAR1 clears accumulator", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.RA, 2, OP.CLEAR1, 0));
            memory.set(1, buildWord(OP.HTR, 2, OP.BLANK, 0));
            memory.set(2, 123n);

            const cpu = new CPU(memory, new CardReader(), new Drums());
            await cpu.go();
            expect(cpu.accumulator).toBe(0n);
        });
        it("CLEAR2 clears accumulator", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.RA, 2, OP.CLEAR2, 0));
            memory.set(1, buildWord(OP.HTR, 2, OP.BLANK, 0));
            memory.set(2, 123n);

            const cpu = new CPU(memory, new CardReader(), new Drums());
            await cpu.go();
            expect(cpu.accumulator).toBe(0n);
        });
        it("CLEAR3 clears accumulator", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.RA, 2, OP.CLEAR3, 0));
            memory.set(1, buildWord(OP.HTR, 2, OP.BLANK, 0));
            memory.set(2, 123n);

            const cpu = new CPU(memory, new CardReader(), new Drums());
            await cpu.go();
            expect(cpu.accumulator).toBe(0n);
        });
        it("CLEAR4 clears accumulator", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.RA, 2, OP.CLEAR4, 0));
            memory.set(1, buildWord(OP.HTR, 2, OP.BLANK, 0));
            memory.set(2, 123n);

            const cpu = new CPU(memory, new CardReader(), new Drums());
            await cpu.go();
            expect(cpu.accumulator).toBe(0n);
        });
    });
    describe("PI", () => {
        it("Takes logical intersection", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.RA, 2, OP.PI, 3));
            memory.set(1, buildWord(OP.HTR, 2, OP.BLANK, 0));
            memory.set(2, 3n);
            memory.set(3, 1n);

            const cpu = new CPU(memory, new CardReader(), new Drums());
            await cpu.go();
            expect(cpu.accumulator).toBe(1n);
            expect(cpu.numberRegister).toBe(1n);
        });
    });
    describe("NI", () => {
        it("Takes logical intersection of logical complement", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.RA, 2, OP.NI, 3));
            memory.set(1, buildWord(OP.HTR, 2, OP.BLANK, 0));
            memory.set(2, 3n);
            memory.set(3, 1n);

            const cpu = new CPU(memory, new CardReader(), new Drums());
            await cpu.go();
            expect(cpu.accumulator).toBe(2n);
            expect(cpu.numberRegister).toBe(1n);
        });
    });
    describe("HTL", () => {
        it("Halts left", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.HTL, 5, OP.BLANK, 0));

            const cpu = new CPU(memory, new CardReader(), new Drums());
            await cpu.go();
            expect(cpu.nextInstructionRegister).toBe(5);
            expect(cpu.currentCommand).toBe(CurrentCommand.Left);
        });
    });
    describe("HTR", () => {
        it("Halts right", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.HTR, 5, OP.BLANK, 0));

            const cpu = new CPU(memory, new CardReader(), new Drums());
            await cpu.go();
            expect(cpu.nextInstructionRegister).toBe(5);
            expect(cpu.currentCommand).toBe(CurrentCommand.Right);
        });
    });
    describe("H1L", () => {
        it("Halts left if switch is set", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.H1L, 5, OP.HTR, 10));

            const cpu = new CPU(memory, new CardReader(), new Drums());
            cpu.switchH1 = true;
            await cpu.go();
            expect(cpu.nextInstructionRegister).toBe(5);
            expect(cpu.currentCommand).toBe(CurrentCommand.Left);
        });
        it("Does not halt if switch is not set", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.H1L, 5, OP.HTR, 10));
            memory.set(5, buildWord(OP.HTL, 15, OP.BLANK, 0));

            const cpu = new CPU(memory, new CardReader(), new Drums());
            cpu.switchH1 = false;
            await cpu.go();
            expect(cpu.nextInstructionRegister).toBe(15);
            expect(cpu.currentCommand).toBe(CurrentCommand.Left);
        });
    });
    describe("H1R", () => {
        it("Halts right if switch is set", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.H1R, 5, OP.HTL, 10));

            const cpu = new CPU(memory, new CardReader(), new Drums());
            cpu.switchH1 = true;
            await cpu.go();
            expect(cpu.nextInstructionRegister).toBe(5);
            expect(cpu.currentCommand).toBe(CurrentCommand.Right);
        });
        it("Does not halt if switch is not set", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.H1R, 5, OP.HTL, 10));
            memory.set(5, buildWord(OP.BLANK, 0, OP.HTR, 15));

            const cpu = new CPU(memory, new CardReader(), new Drums());
            cpu.switchH1 = false;
            await cpu.go();
            expect(cpu.nextInstructionRegister).toBe(15);
            expect(cpu.currentCommand).toBe(CurrentCommand.Right);
        });
    });
    describe("H2L", () => {
        it("Halts left if switch is set", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.H2L, 5, OP.HTR, 10));

            const cpu = new CPU(memory, new CardReader(), new Drums());
            cpu.switchH2 = true;
            await cpu.go();
            expect(cpu.nextInstructionRegister).toBe(5);
            expect(cpu.currentCommand).toBe(CurrentCommand.Left);
        });
        it("Does not halt if switch is not set", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.H2L, 5, OP.HTR, 10));
            memory.set(5, buildWord(OP.HTL, 15, OP.BLANK, 0));

            const cpu = new CPU(memory, new CardReader(), new Drums());
            cpu.switchH2 = false;
            await cpu.go();
            expect(cpu.nextInstructionRegister).toBe(15);
            expect(cpu.currentCommand).toBe(CurrentCommand.Left);
        });
    });
    describe("H2R", () => {
        it("Halts right if switch is set", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.H2R, 5, OP.HTL, 10));

            const cpu = new CPU(memory, new CardReader(), new Drums());
            cpu.switchH2 = true;
            await cpu.go();
            expect(cpu.nextInstructionRegister).toBe(5);
            expect(cpu.currentCommand).toBe(CurrentCommand.Right);
        });
        it("Does not halt if switch is not set", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.H2R, 5, OP.HTL, 10));
            memory.set(5, buildWord(OP.BLANK, 0, OP.HTR, 15));

            const cpu = new CPU(memory, new CardReader(), new Drums());
            cpu.switchH2 = false;
            await cpu.go();
            expect(cpu.nextInstructionRegister).toBe(15);
            expect(cpu.currentCommand).toBe(CurrentCommand.Right);
        });
    });
    describe("H3L", () => {
        it("Halts left if switch is set", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.H3L, 5, OP.HTR, 10));

            const cpu = new CPU(memory, new CardReader(), new Drums());
            cpu.switchH3 = true;
            await cpu.go();
            expect(cpu.nextInstructionRegister).toBe(5);
            expect(cpu.currentCommand).toBe(CurrentCommand.Left);
        });
        it("Does not halt if switch is not set", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.H3L, 5, OP.HTR, 10));
            memory.set(5, buildWord(OP.HTL, 15, OP.BLANK, 0));

            const cpu = new CPU(memory, new CardReader(), new Drums());
            cpu.switchH3 = false;
            await cpu.go();
            expect(cpu.nextInstructionRegister).toBe(15);
            expect(cpu.currentCommand).toBe(CurrentCommand.Left);
        });
    });
    describe("H3R", () => {
        it("Halts right if switch is set", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.H3R, 5, OP.HTL, 10));

            const cpu = new CPU(memory, new CardReader(), new Drums());
            cpu.switchH3 = true;
            await cpu.go();
            expect(cpu.nextInstructionRegister).toBe(5);
            expect(cpu.currentCommand).toBe(CurrentCommand.Right);
        });
        it("Does not halt if switch is not set", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.H3R, 5, OP.HTL, 10));
            memory.set(5, buildWord(OP.BLANK, 0, OP.HTR, 15));

            const cpu = new CPU(memory, new CardReader(), new Drums());
            cpu.switchH3 = false;
            await cpu.go();
            expect(cpu.nextInstructionRegister).toBe(15);
            expect(cpu.currentCommand).toBe(CurrentCommand.Right);
        });
    });
    describe("RD", () => {
        it("Reads drum into memory", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.LM, 2, OP.RD, 3));
            memory.set(1, buildWord(OP.HTL, 1, OP.BLANK, 0));
            memory.set(2, buildWord(0o000, 5, 0o012, 8));

            const drums = new Drums();
            drums.setWord(0, 1, 2, 5, 3n);
            drums.setWord(0, 1, 2, 6, 1n);
            drums.setWord(0, 1, 2, 7, 4n);
            drums.setWord(0, 1, 2, 8, 1n);

            const cpu = new CPU(memory, new CardReader(), drums);
            await cpu.go();

            expect(memory.get(3)).toBe(3n);
            expect(memory.get(4)).toBe(1n);
            expect(memory.get(5)).toBe(4n);
            expect(memory.get(6)).toBe(1n);
        });
    });
    describe("WD", () => {
        it("Writes memory into drum", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.LM, 2, OP.WD, 3));
            memory.set(1, buildWord(OP.HTL, 1, OP.BLANK, 0));
            memory.set(2, buildWord(0o000, 5, 0o12, 8));
            memory.set(3, 3n);
            memory.set(4, 1n);
            memory.set(5, 4n);
            memory.set(6, 1n);

            const drums = new Drums();

            const cpu = new CPU(memory, new CardReader(), drums);
            await cpu.go();

            expect(drums.getWord(0, 1, 2, 5)).toBe(3n);
            expect(drums.getWord(0, 1, 2, 6)).toBe(1n);
            expect(drums.getWord(0, 1, 2, 7)).toBe(4n);
            expect(drums.getWord(0, 1, 2, 8)).toBe(1n);
        });
    });
    describe("SRC", () => {
        it("Clears MQ", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.LM, 1, OP.SRC, 1));
            memory.set(1, buildWord(OP.HTL, 1, OP.BLANK, 0));

            const cpu = new CPU(memory, new CardReader(), new Drums());
            await cpu.go();

            expect(cpu.multipliedQuotientRegister).toBe(0n);
        });
        it("Shifts accumulator right", async () => {
            const memory = new Memory();
            memory.set(0, buildWord(OP.RA, 2, OP.SRC, 2));
            memory.set(1, buildWord(OP.HTL, 1, OP.BLANK, 0));
            memory.set(2, 8n);

            const cpu = new CPU(memory, new CardReader(), new Drums());
            await cpu.go();

            expect(cpu.accumulator).toBe(2n);
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