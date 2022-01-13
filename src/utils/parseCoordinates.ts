import { IGeojsonCoords } from '../interfaces/IGeojson';
import { IDeepmultiArray } from './unwrapDeepsingleArray';

/**
 * ...
 */
export function parseCoordinates(
    array: IDeepmultiArray<IGeojsonCoords>,
    _coordinates: Array<Array<IGeojsonCoords>> = [],
): Array<Array<IGeojsonCoords>> {
    // Note: testing o if it matches following patter [[1, 1], [2, 2], ...]
    if (
        (array as Array<IGeojsonCoords>).every(
            (arrayItem) =>
                Array.isArray(arrayItem) &&
                arrayItem.length === 2 &&
                arrayItem.every((arrayItemItem) => typeof arrayItemItem === 'number'),
        )
    ) {
        _coordinates.push(array as Array<IGeojsonCoords>);
        return _coordinates;
    }

    for (const item of array) {
        if (Array.isArray(item)) {
            parseCoordinates(item, _coordinates);
        } else {
            throw new Error(`Can not parse coordinates`);
        }
    }

    return _coordinates;
}
