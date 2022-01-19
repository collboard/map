import { IVectorData, Vector } from 'xyzt';
import { mapZoom } from '../config';

export function wgs84ToTileXy(pointAsWgs84: IVectorData): Vector {
    return new Vector(
        ((pointAsWgs84.x! + 180) / 360) * Math.pow(2, mapZoom),
        ((1 -
            Math.log(Math.tan((pointAsWgs84.y! * Math.PI) / 180) + 1 / Math.cos((pointAsWgs84.y! * Math.PI) / 180)) /
                Math.PI) /
            2) *
            Math.pow(2, mapZoom),
    );
}

export function tileXyToWgs84(pointAsTileXy: IVectorData): Vector {
    const n = Math.PI - (2 * Math.PI * pointAsTileXy.y!) / Math.pow(2, mapZoom);

    return new Vector(
        (pointAsTileXy.x! / Math.pow(2, mapZoom)) * 360 - 180,
        (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n))),
    );
}

/**
 * TODO: !!! Standartize naming of coords wgs84ToTileXy
 * TODO: !!! position vs. point
 * TODO: !!! Rename pointAsTileXy to pointAsMapTile (OR just use Coordination system)
 * TODO: Transform functions can recieve IVectorData instead of Vector (OR just use Coordination system)
 * TODO: What is the best way to deal with global module dependencies like mapZoom
 */
