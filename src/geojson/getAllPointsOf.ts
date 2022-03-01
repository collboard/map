import { IGeojson } from '../interfaces/IGeojson';
import { Wgs84 } from '../semantic/Wgs84';
import { getAllSimplePolygonsOf } from './getAllSimplePolygonsOf';

export function getAllPointsOf(geojson: IGeojson): Wgs84[] {
    return getAllSimplePolygonsOf(geojson).flatMap(({ coordinates }) =>
        coordinates.map(([longitude, latitude]) => new Wgs84({ latitude, longitude })),
    );
}

/**
 * TODO: XYZT get to work Wgs84.fromArray() and keep semantics
 */
