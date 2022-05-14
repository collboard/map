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

        case 'LineString':
        case 'MultiLineString':
            // Note: Polygons and MultiPolygons will be separated by contained data

            return parseCoordinates(geojson.coordinates).map((coordinates) => ({
                type: 'Polygon',
                coordinates: [...coordinates, ...[...coordinates].reverse(/* TODO: Make this in optimal way */)],
            }));

        case 'Point':
            // Note: Polygons and MultiPolygons will be separated by contained data
            return [
                /* TODO: Probbably better - make some circle or sth like that */
            ];

        default:
            throw Error(`Unknown geojson entity type: ${(geojson as any).type}`);

        // TODO: [🎽] Add support for all entity types @see https://www.ibm.com/docs/en/db2/11.5?topic=formats-geojson-format
    }
}
