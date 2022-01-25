import { Vector } from 'xyzt';
import { MAP_BASE_ZOOM } from '../config';
import { Wgs84 } from './Wgs84';

export class Tile extends Vector {
    public readonly type = 'Tile';

    public static fromWgs84(coordinates: Wgs84): InstanceType<typeof this> {
        return new this(
            ((coordinates.x + 180) / 360) * Math.pow(2, MAP_BASE_ZOOM),
            ((1 -
                Math.log(Math.tan((coordinates.y * Math.PI) / 180) + 1 / Math.cos((coordinates.y * Math.PI) / 180)) /
                    Math.PI) /
                2) *
                Math.pow(2, MAP_BASE_ZOOM),
        );
    }

    public toWgs84(): Wgs84 {
        const n = Math.PI - (2 * Math.PI * this.y) / Math.pow(2, MAP_BASE_ZOOM);

        return new Wgs84(
            (this.x / Math.pow(2, MAP_BASE_ZOOM)) * 360 - 180,
            (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n))),
        );
    }
}
