import { Transform, Vector } from 'xyzt';
import { MAP_BASE_CENTER, TILE_SIZE } from '../config';
import { Tile } from './Tile';

export class TileOnScreen extends Vector {
    public readonly type = 'TileOnScreen';

    public toTile(transform: Transform): { tile: Tile; remainder: TileOnScreen } {
        const mapCenterTileOffset = new TileOnScreen(transform.translate.divide(TILE_SIZE));

        const tileSmooth = this.add(Tile.fromWgs84(MAP_BASE_CENTER)).subtract(mapCenterTileOffset);

        const tile = new Tile(tileSmooth.map(Math.round /* TODO: Floor OR round? */));
        const remainder = new TileOnScreen(tileSmooth.subtract(tile));

        return { tile, remainder };
    }
}

// !!! Descriptions

/**
 * TODO: Fluent API should preserve the semantics:
 *       <UGLY> new TileOnScreen(tileSmooth.subtract(tile));
 *       <NICE> tileSmooth.subtract(tile)
 *       <NICE> tileSmooth.subtract(tile).as(TileOnScreen)
 */
