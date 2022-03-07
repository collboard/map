import { IGeojson, IGeojsonSimplePolygon } from '../interfaces/IGeojson';
import { parseCoordinates } from './parseCoordinates';

export function getAllSimplePolygonsOf(geojson: IGeojson): IGeojsonSimplePolygon[] {
    if (!geojson) {
        return [];
    }

    switch (geojson.type) {
        case 'FeatureCollection':
            return geojson.features.flatMap(getAllSimplePolygonsOf);
        case 'Feature':
            return getAllSimplePolygonsOf(geojson.geometry);
        case 'Polygon':
        case 'MultiPolygon':
            // Note: Polygons and MultiPolygons will be separated by contained data
            return parseCoordinates(geojson.coordinates).map((coordinates) => ({
                type: 'Polygon',
                coordinates,
            }));

        default:
            throw Error(`Unknown geojson entity type: ${(geojson as any).type}`);
    }
}
