import { string_url_image } from '@collboard/modules-sdk';
import { Tile } from '../semantic/Tile';

export class MapProvider {
    // configurabe
    // export const mapProvider = new URL('https://tile-a.openstreetmap.fr/hot');
    private service = new URL('https://tile-c.openstreetmap.fr/cyclosm');

    public getTileUrl(tile: Tile): string_url_image {
        const { x, y, z } = tile.round;
        return `${this.service.href}/${z}/${x}/${y}.png`;
    }
}

/**
 * TODO: Configurable map provider, extends OSM map provider
 */
