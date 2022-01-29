import { randomItem } from '@collboard/modules-sdk';
import { MapTileArt } from '../modules/map-tile-art';
import { TileUnique } from '../semantic/TileUnique';

export class MapProvider {
    private getServiceUrl(): URL {
        return new URL(`https://tile-${randomItem('a', 'b', 'c')}.openstreetmap.fr/cyclosm`);
    }

    private getTileUrl(tile: TileUnique): URL {
        const { x, y, z } = tile;

        const url = this.getServiceUrl();
        url.pathname = `cyclosm/${z}/${x}/${y}.png`;

        return url;
    }

    public createTileArt(tile: TileUnique): MapTileArt {
        console.log('createTileArt', tile);
        return new MapTileArt(tile, this.getTileUrl(tile).href);
    }
}

/**
 * TODO: Configurable map provider, extends OSM map provider
 * TODO: TileManager with memory management
 */
