export const SixBitCharactersLowercase = {
    "1": 0b000_001,
    "2": 0b000_010,
    "3": 0b000_011,
    "4": 0b000_100,
    "5": 0b000_101,
    "6": 0b000_110,
    "7": 0b000_111,

    "8": 0b001_000,
    "9": 0b001_001,

    ";": 0b010_000,
    "a": 0b010_001,
    "b": 0b010_010,
    "c": 0b010_011,
    "d": 0b010_100,
    "e": 0b010_101,
    "f": 0b010_110,
    "g": 0b010_111,

    "h": 0b011_000,
    "i": 0b011_001,
    ".": 0b011_011,
    "⋅": 0b100_000,
    "j": 0b100_001,
    "k": 0b100_010,
    "l": 0b100_011,
    "m": 0b100_100,
    "n": 0b100_101,
    "o": 0b100_110,
    "p": 0b100_111,

    "q": 0b101_000,
    "r": 0b101_001,
    "=": 0b101_011,
    "-": 0b101_100,

    "0": 0b110_000,
    "/": 0b110_001,
    "s": 0b110_010,
    "t": 0b110_011,
    "u": 0b110_100,
    "v": 0b110_101,
    "w": 0b110_110,
    "x": 0b110_111,

    "y": 0b111_000,
    "z": 0b111_001,
    ",": 0b111_011,
    "+": 0b111_100,
};

export const SixBitCharactersLowercaseReverse: Record<number, string> = reverseObject(SixBitCharactersLowercase);

export const ShiftUpperCase = 0b111_110;
export const ShiftLowerCase = 0b111_111;
export const Tab = 0b111_101;
export const EndOfMessage = 0b101_101;
export const CarriageReturn = 0b101_101;
export const Backspace = 0b101_111;
export const CarriageReturnAndEndOfMessage = 0b101_010;
export const EjectCarriageReturnAndEndOfMessage = 0b011_110;
export const EjectAndCarriageReturn = 0b011_111;
export const TakeControlOut = 0b011_010;
export const Space = 0b001_110;

export const SixBitCharactersUppercase = {
    "'": 0b000_001,
    "\"": 0b000_010,
    "#": 0b000_011,
    "$": 0b000_100,
    "≤": 0b000_101,
    "≥": 0b000_110,
    "<": 0b000_111,

    ">": 0b001_000,
    "(": 0b001_001,

    ":": 0b010_000,
    "A": 0b010_001,
    "B": 0b010_010,
    "C": 0b010_011,
    "D": 0b010_100,
    "E": 0b010_101,
    "F": 0b010_110,
    "G": 0b010_111,

    "H": 0b011_000,
    "I": 0b011_001,
    "]": 0b011_011,

    "|": 0b100_000,
    "J": 0b100_001,
    "K": 0b100_010,
    "L": 0b100_011,
    "M": 0b100_100,
    "N": 0b100_101,
    "O": 0b100_110,
    "P": 0b100_111,

    "Q": 0b101_000,
    "R": 0b101_001,
    "≠": 0b101_011,
    "_": 0b101_100,

    ")": 0b110_000,
    "?": 0b110_001,
    "S": 0b110_010,
    "T": 0b110_011,
    "U": 0b110_100,
    "V": 0b110_101,
    "W": 0b110_110,
    "X": 0b110_111,

    "Y": 0b111_000,
    "Z": 0b111_001,
    "[": 0b111_011,
    "*": 0b111_100,
}

export const SixBitCharactersUppercaseReverse: Record<number, string> = reverseObject(SixBitCharactersUppercase);

function reverseObject(object: Object) {
    return Object.fromEntries(
        Object.entries(object)
            .map(([key, value]) => [value, key])
    );
}

export function validateCharacter(character: number) {
    if (character in SixBitCharactersLowercaseReverse)
        return true;
    if (character in SixBitCharactersUppercaseReverse)
        return true;
    return false;
}