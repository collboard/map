import { Vector } from 'xyzt';

// TODO: !!! to UPPERCASE

export const tilePixelSize = Vector.square(256 /* TODO: Make some seam-padding */);
//export const mapProvider = new URL('https://tile-a.openstreetmap.fr/hot');
export const mapProvider = new URL('https://tile-c.openstreetmap.fr/cyclosm');
export const mapZoom = 17;
export const mapCenterWgs84 = new Vector(14.4378005 /* Longitude  */, 50.0755381 /* Latitude  */);
