import { Vector } from 'xyzt';
import { IGeojson, IGeojsonCoords, IGeojsonSimplePolygon } from '../interfaces/IGeojson';
import { IDeepsingleArray } from './unwrapDeepsingleArray';

export function getAllCoordinatesOf(geojson: IGeojson): Vector[] {
    return getAllSimplePolygonsOf(geojson).flatMap(({ coordinates }) =>
        coordinates.map(([latitude, longitude]) => Vector.fromArray(latitude, longitude)),
    );
}

export function getAllSimplePolygonsOf(geojson: IGeojson): IGeojsonSimplePolygon[] {
    switch (geojson.type) {
        case 'FeatureCollection':
            return geojson.features.flatMap(getAllSimplePolygonsOf);
        case 'Feature':
            return getAllSimplePolygonsOf(geojson.geometry);
        case 'Polygon':
        case 'MultiPolygon':
            // Note: Polygons and MultiPolygons will be separated by contained data

            return coordinatesToPointGroups(geojson.coordinates).map((coordinates) => ({
                type: 'Polygon',
                coordinates,
            }));

        default:
            throw Error(`Unknown geojson entity type: ${(geojson as any).type}`);
    }
}

export function coordinatesToPointGroups(coordinates: IDeepsingleArray<IGeojsonCoords>): Array<Array<Vector>> {
    if (coordinates.length === 2 && coordinates.every((item) => typeof item === 'number')) {
        return Vector.fromArray(...coordinates);
    } else {
        return deepsingleArray as T;
    }
}

/**
 * TODO: To multiple files
 * TODO: Tests expecially for coordinatesToPointGroups
 */
