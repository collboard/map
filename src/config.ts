import { Pixels } from './semantic/Pixels';
import { Wgs84 } from './semantic/Wgs84';
import { MapProvider } from './classes/MapProvider';

// TODO: !!! to UPPERCASE

export const TILE_SIZE = Pixels.square(256 /* TODO: Make some seam-padding */);
export const TILE_COUNT_PADDING = 0.8; // TODO: !!! 3;


export const MAP_PROVIDER = new MapProvider(/* TODO: Configure */);
export const MAP_BASE_CENTER = new Wgs84({ longitude: 14.5, latitude: 50, zoom: 7 /* 17 */ });

/**
 * TODO: !!! mapProvider cycle between tile-a tile-b tile-c
 */
