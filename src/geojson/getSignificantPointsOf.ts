import { IGeojson } from '../interfaces/IGeojson';
import { Wgs84 } from '../semantic/Wgs84';
import { getAllSimplePolygonsOf } from './getAllSimplePolygonsOf';

/**
 * Get only the significant points of this geojson
 * For example if there is mixed boundaries with water this will return only the points of the boundaries
 */
export function getSignificantPointsOf(geojson: IGeojson): Wgs84[] {
    let polygons = getAllSimplePolygonsOf(geojson);

    const categories = new Set(polygons.map((polygon) => polygon.properties?.category));

    if (categories.has('boundary')) {
        polygons = polygons.filter((polygon) => polygon.properties?.category === 'boundary');
    }

    return polygons.flatMap(({ coordinates }) =>
        coordinates.map(([longitude, latitude]) => new Wgs84({ latitude, longitude })),
    );
}

/**
 * TODO: XYZT get to work Wgs84.fromArray() and keep semantics
 */
