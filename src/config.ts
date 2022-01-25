import { Pixels } from './semantic/Pixels';
import { Wgs84 } from './semantic/Wgs84';

// TODO: !!! to UPPERCASE

export const TILE_SIZE = Pixels.square(256 /* TODO: Make some seam-padding */);
// export const mapProvider = new URL('https://tile-a.openstreetmap.fr/hot');
export const MAP_PROVIDER = new URL('https://tile-c.openstreetmap.fr/cyclosm');
// export const mapZoom = 17;
export const MAP_BASE_ZOOM = 7;
export const MAP_BASE_CENTER = new Wgs84(14.5 /* Longitude  */, 50 /* Latitude  */);

/**
 * TODO: !!! mapProvider cycle between tile-a tile-b tile-c
 */
