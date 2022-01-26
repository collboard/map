import { Transform, Vector } from 'xyzt';
import { MAP_BASE_CENTER, TILE_SIZE } from '../config';
import { Tile } from './Tile';

export class TileOnScreen extends Vector {
    public readonly type = 'TileOnScreen';

    public constructor(tile: { x: number; y: number; z: number });
    public constructor(tile: { x: number; y: number; zoom: number });
    public constructor(x: number, y: number, zoom: number);
    public constructor(...args: any[]) {
        super(...(typeof args[0] === 'number' ? args : [args[0].x, args[0].y, args[0].zoom || args[0].z]));
    }

    public toTile(transform: Transform): Tile {
        const { x, y } = this.add(Tile.fromWgs84(MAP_BASE_CENTER)).subtract(transform.translate.divide(TILE_SIZE));
        const z = Math.log2(transform.scale.x) + MAP_BASE_CENTER.z;
        //console.log(z);
        return new Tile(x, y, z);
    }
}

// !!! Descriptions

/**
 * TODO: Fluent API should preserve the semantics:
 *       <UGLY> new TileOnScreen(tileSmooth.subtract(tile));
 *       <NICE> tileSmooth.subtract(tile)
 *       <NICE> tileSmooth.subtract(tile).as(TileOnScreen)
 */
