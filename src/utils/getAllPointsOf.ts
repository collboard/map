import { Vector } from 'xyzt';
import { IGeojson } from '../interfaces/IGeojson';
import { getAllSimplePolygonsOf } from './getAllSimplePolygonsOf';

export function getAllPointsOf(geojson: IGeojson): Vector[] {
    return getAllSimplePolygonsOf(geojson).flatMap(({ coordinates }) =>
        coordinates.map(([latitude, longitude]) => Vector.fromArray(latitude, longitude)),
    );
}


