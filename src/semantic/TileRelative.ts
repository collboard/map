import { Transform, Vector } from 'xyzt';
import { MAP_BASE, TILE_SIZE } from '../config';
import { TileAbsolute } from './TileAbsolute';
import { Wgs84 } from './Wgs84';

export class TileRelative extends Vector {
    public readonly type = 'TileRelative';

    public constructor(tile: { x: number; y: number; z: number } | { x: number; y: number; zoom: number });
    public constructor(x: number, y: number, zoom: number);
    public constructor(...args: any[]) {
        super(...(typeof args[0] === 'number' ? args : [args[0].x, args[0].y, args[0].zoom || args[0].z]));
    }

    public toTile(transform: Transform): TileAbsolute {
        // Note: Using Math.ceil to keep better quality
        const zoom = Math.ceil(Math.log2(transform.scale.x) + MAP_BASE.z);
        const { x, y } = this.add(
            TileAbsolute.fromWgs84(
                new Wgs84({
                    /* TODO: Use compact form */ longitude: MAP_BASE.longitude,
                    latitude: MAP_BASE.latitude,
                    zoom,
                }),
            ),
        ).subtract(transform.translate.divide(TILE_SIZE));

        // console.log(z);
        return new TileAbsolute(x, y, zoom);
    }
}

// TODO: !!! Descriptions

/**
 * TODO: Fluent API should preserve the semantics:
 *       <UGLY> new TileOnScreen(tileSmooth.subtract(tile));
 *       <NICE> tileSmooth.subtract(tile)
 *       <NICE> tileSmooth.subtract(tile).as(TileOnScreen)
 */
