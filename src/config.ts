import { TileProvider } from './classes/TileProvider';
import { Pixels } from './semantic/Pixels';
import { Wgs84 } from './semantic/Wgs84';

export const TILE_SIZE = Pixels.square(256 /* TODO: Make some seam-padding */);
export const TILE_COUNT_PADDING = 1.2;

export const MAP_BASE = new Wgs84({ longitude: 14.5, latitude: 50, zoom: 12 /* 17 */ });

export const MAP_PROVIDERS: Record<string, TileProvider> = {
    // TODO: To some config file
    // TODO: Better names
    // @see https://www.openstreetmap.fr/

    osmfr: new TileProvider(['a', 'b', 'c'].map((x) => new URL(`https://tile-${x}.openstreetmap.fr/osmfr`))),
    hot: new TileProvider(['a', 'b', 'c'].map((x) => new URL(`https://tile-${x}.openstreetmap.fr/hot`))),
    cyclosm: new TileProvider(['a', 'b', 'c'].map((x) => new URL(`https://tile-${x}.openstreetmap.fr/cyclosm`))),
    watercolor: new TileProvider(
        ['a', 'b', 'c', 'd'].map((x) => new URL(`https://stamen-tiles-${x}.a.ssl.fastly.net/watercolor`)),
    ),
    br: new TileProvider([new URL(`https://tile.openstreetmap.bzh/br`)]),
    light_all: new TileProvider(
        ['a', 'b', 'c', 'd'].map((x) => new URL(`https://cartodb-basemaps-${x}.global.ssl.fastly.net/light_all`)),
    ),
    dark_all: new TileProvider(
        ['a', 'b', 'c', 'd'].map((x) => new URL(`https://cartodb-basemaps-${x}.global.ssl.fastly.net/dark_all`)),
    ),
};
