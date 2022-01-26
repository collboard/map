import { Transform, Vector } from 'xyzt';
import { MAP_BASE, TILE_SIZE } from '../config';
import { TileAbsolute } from './TileAbsolute';

export class TileRelative extends Vector {
    public readonly type = 'TileRelative';

    public constructor(tile: { x: number; y: number; z: number });
    public constructor(tile: { x: number; y: number; zoom: number });
    public constructor(x: number, y: number, zoom: number);
    public constructor(...args: any[]) {
        super(...(typeof args[0] === 'number' ? args : [args[0].x, args[0].y, args[0].zoom || args[0].z]));
    }

    public toTile(transform: Transform): TileAbsolute {
        const { x, y } = this.add(TileAbsolute.fromWgs84(MAP_BASE)).subtract(transform.translate.divide(TILE_SIZE));
        const z = Math.log2(transform.scale.x) + MAP_BASE.z;
        //console.log(z);
        return new TileAbsolute(x, y, z);
    }
}

// !!! Descriptions

/**
 * TODO: Fluent API should preserve the semantics:
 *       <UGLY> new TileOnScreen(tileSmooth.subtract(tile));
 *       <NICE> tileSmooth.subtract(tile)
 *       <NICE> tileSmooth.subtract(tile).as(TileOnScreen)
 */
