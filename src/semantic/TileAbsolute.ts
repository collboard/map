import { Vector } from 'xyzt';
import { Wgs84 } from './Wgs84';

export class TileAbsolute extends Vector {
    public readonly type = 'TileAbsolute';

    public constructor(tile: { x: number; y: number; z: number });
    public constructor(tile: { x: number; y: number; zoom: number });
    public constructor(x: number, y: number, zoom: number);
    public constructor(...args: any[]) {
        super(...(typeof args[0] === 'number' ? args : [args[0].x, args[0].y, args[0].zoom || args[0].z]));
        this.check();
    }

    protected check(): void {}

    public static fromWgs84({ x, y, z }: Wgs84): InstanceType<typeof this> {
        return new this(
            ((x + 180) / 360) * Math.pow(2, z),
            ((1 - Math.log(Math.tan((y * Math.PI) / 180) + 1 / Math.cos((y * Math.PI) / 180)) / Math.PI) / 2) *
                Math.pow(2, z),
            z,
        );
    }

    public toWgs84(): Wgs84 {
        const { x, y, z } = this;
        const n = Math.PI - (2 * Math.PI * y) / Math.pow(2, z);

        return new Wgs84(
            (x / Math.pow(2, z)) * 360 - 180,
            (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n))),
            z,
        );
    }
}
