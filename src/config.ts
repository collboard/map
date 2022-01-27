import { MapProvider } from './classes/MapProvider';
import { Pixels } from './semantic/Pixels';
import { Wgs84 } from './semantic/Wgs84';

export const TILE_SIZE = Pixels.square(256 /* TODO: Make some seam-padding */);
export const TILE_COUNT_PADDING = 1.2;

export const MAP_PROVIDER = new MapProvider(/* TODO: Configure */);
export const MAP_BASE = new Wgs84({ longitude: 14.5, latitude: 50, zoom: 12 /* 17 */ });
