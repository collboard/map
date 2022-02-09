import { TileAbsolute } from '../semantic/TileAbsolute';
import { TileUnique } from '../semantic/TileUnique';

/**
 * Helper for 2D nested loop from top left to bottom right corner of the map defined by from and to tiles.
 * It rounds gently to the nearest integer tile to include all tiles in the borders.
 *
 * @param from
 * @param to
 * @return itarable of TileUnique
 */
export function* iterateTiles(...corners: TileAbsolute[]): IterableIterator<TileUnique> {
    // console.log({corners});
    const xs = corners.map(({ x }) => x);
    const ys = corners.map(({ y }) => y);
    const z = corners[0].z;

    const fromX = Math.floor(Math.min(...xs));
    const fromY = Math.floor(Math.min(...ys));
    const toX = Math.ceil(Math.max(...xs));
    const toY = Math.ceil(Math.max(...ys));

    // console.log({ fromX, fromY, toX, toY });

    for (let y = fromY; y <= toY; y++) {
        for (let x = fromX; x <= toX; x++) {
            yield new TileUnique(x, y, z);
        }
    }
}

/**
 * TODO: Check that z is the same
 */
