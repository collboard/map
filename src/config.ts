import { Vector } from 'xyzt';
import { wgs84ToTileXy } from './utils/wgs84ToTileXy';

// TODO: !!! to UPPERCASE

export const tilePixelSize = Vector.square(256 /* TODO: Make some seam-padding */);
// export const mapProvider = new URL('https://tile-a.openstreetmap.fr/hot');
export const mapProvider = new URL('https://tile-c.openstreetmap.fr/cyclosm');
// export const mapZoom = 17;
export const mapZoom = 7;
export const mapCenterWgs84 = new Vector(14.5 /* Longitude  */, 50 /* Latitude  */);

// TODO: How to mark counted confiuration
export const mapCenterTileXy = wgs84ToTileXy(mapCenterWgs84);
export const mapCenterTileXyRound = mapCenterTileXy.map(Math.floor /* TODO: Floor OR round? */);
export const mapCenterTileXyRoundRemainder = mapCenterTileXy.subtract(mapCenterTileXyRound);

/**
 * TODO: !!! mapProvider cycle between tile-a tile-b tile-c
 */
