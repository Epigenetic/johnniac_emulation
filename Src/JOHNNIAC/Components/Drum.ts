export class Drums {
    private _drums: Drum[] = [new Drum()];

    public getWord(drum: number, position: number, band: number, address: number): bigint {
        if (drum > 0) {
            throw new Error("Only 1 drum supported");
        }

        const drumToUse = this._drums[drum]!;

        return drumToUse.getWord(position, band, address)
    }

    public setWord(drum: number, position: number, band: number, address: number, value: bigint): void {
        if (drum > 0) {
            throw new Error("Only 1 drum supported");
        }

        const drumToUse = this._drums[drum]!;

        drumToUse.setWord(position, band, address, value);
    }
}

//12_288 word drum
class Drum {
    private _bands: BigUint64Array[]

    constructor() {
        this._bands = new Array(12);
        for (let i = 0; i < 12; i++) {
            this._bands[i] = new BigUint64Array(1024);
        }
    }

    private _getDesiredBand(position: number, band: number) {
        return this._bands[(position * 3) + band]!;
    }

    public getWord(position: number, band: number, address: number): bigint {
        if (position > 2) {
            throw new Error(`Position ${position} exceeds maximum permitted of 2`);
        }
        if (band > 3) {
            throw new Error(`Band ${band} exceeds maximum permitted of 3`);
        }

        const desiredBand = this._getDesiredBand(position, band);
        return desiredBand[address]!;
    }

    public setWord(position: number, band: number, address: number, value: bigint): void {
        if (position > 2) {
            throw new Error(`Position ${position} exceeds maximum permitted of 2`);
        }
        if (band > 3) {
            throw new Error(`Band ${band} exceeds maximum permitted of 3`);
        }

        const desiredBand = this._getDesiredBand(position, band);
        desiredBand[address] = BigInt.asUintN(40, value);
    }
}