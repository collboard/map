import { AbstractArt, ImageArt, string_url_image } from '@collboard/modules-sdk';
import { MAP_BASE, TILE_SIZE } from '../config';
import { TileAbsolute } from '../semantic/TileAbsolute';
import { TileUnique } from '../semantic/TileUnique';

export class MapProvider {
    // configurabe
    // export const mapProvider = new URL('https://tile-a.openstreetmap.fr/hot');
    private service = new URL('https://tile-c.openstreetmap.fr/cyclosm');

    private getTileUrl(tile: TileUnique): string_url_image {
        const { x, y, z } = tile;
        return `${this.service.href}/${z}/${x}/${y}.png`;
    }

    public createTileArt(tile: TileUnique): AbstractArt /* TODO: Maybe return AbstractArt[] OR TileArt */ {
        const tileUrl = this.getTileUrl(tile);

        const tileArt = new ImageArt(tileUrl, 'Map tile');

        tileArt.defaultZIndex = -1;
        tileArt.size = TILE_SIZE.scale(Math.pow(2, MAP_BASE.z - tile.z));

        tileArt.setShift(tile.subtract(TileAbsolute.fromWgs84(MAP_BASE)).multiply(tileArt.size));

        // console.log('size', tileArt.size);
        // console.log('remainder', tile.remainder);

        return tileArt;
    }
}

/**
 * TODO: Configurable map provider, extends OSM map provider
 * TODO: TileArt
 * TODO: Optimize tile creation
 */
