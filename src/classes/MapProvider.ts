import { AbstractArt, ImageArt, randomItem } from '@collboard/modules-sdk';
import { MAP_BASE, TILE_SIZE } from '../config';
import { TileAbsolute } from '../semantic/TileAbsolute';
import { TileUnique } from '../semantic/TileUnique';
import { Wgs84 } from '../semantic/Wgs84';

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

    public createTileArt(tile: TileUnique): AbstractArt /* TODO: Maybe return AbstractArt[] OR TileArt */ {
        const tileAbsolute = tile.subtract(
            TileAbsolute.fromWgs84(
                new Wgs84({
                    ...MAP_BASE,
                    z: tile.z,
                }),
            ),
        );

        const tileUrl = this.getTileUrl(tile);

        const tileArt = new ImageArt(tileUrl.href, 'Map tile');

        tileArt.defaultZIndex = -1;
        tileArt.size = TILE_SIZE.scale(Math.pow(2, MAP_BASE.z - tile.z));

        tileArt.shift = tileAbsolute.multiply(tileArt.size);


        // console.log('tileAbsolute', tileAbsolute);
        // console.log('shift', tileArt.shift);
        // console.log('size', tileArt.size);
        // console.log('remainder', tile.remainder);

        return tileArt;
    }
}

/**
 * TODO: Configurable map provider, extends OSM map provider
 * TODO: TileArt
 * TODO: Optimize tile creation
 * TODO: TileManager with memory management
 */
