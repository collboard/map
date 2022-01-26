import { TileAbsolute } from './TileAbsolute';
import { TileRelative } from './TileRelative';

export class TileUnique extends TileAbsolute {
    public static fromAbsolute(tileAbsolute: TileAbsolute): { tile: TileUnique; remainder: TileRelative } {
        console.log({ tileAbsolute });
        const tile = new TileUnique(tileAbsolute.map(Math.round));
        const remainder = new TileRelative(tileAbsolute.subtract(tile));
        return { tile, remainder };
    }

    protected check() {
        if (Math.floor(this.x) !== this.x || Math.floor(this.y) !== this.y || Math.floor(this.z) !== this.z) {
            throw new Error(`TileUnique coordinates must be integers, got [${this.x},${this.y},${this.z}]`);
        }
    }

    public get uniqueKey(): symbol {
        // TODO: What is the best name .symbol, .key, .id?
        // TODO: Maybe more elegant way how to generate symbol
        // TODO: Optimize
        return Symbol.for(`[${this.x},${this.y},${this.z}]`);
    }
}
