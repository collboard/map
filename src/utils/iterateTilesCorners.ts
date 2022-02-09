import { TileAbsolute } from '../semantic/TileAbsolute';
import { TileUnique } from '../semantic/TileUnique';

/**
 * Debugging complement for iterateTiles
 *
 * iterateTilesCorners function has same interface but iterates only through 4/2/1 corners
 *
 * @debug
 */
export function* iterateTilesCorners(...corners: TileAbsolute[]): IterableIterator<TileUnique> {
    // console.log({corners});
    const xs = corners.map(({ x }) => x);
    const ys = corners.map(({ y }) => y);
    const z = corners[0].z;

    const fromX = Math.floor(Math.min(...xs));
    const fromY = Math.floor(Math.min(...ys));
    const toX = Math.ceil(Math.max(...xs));
    const toY = Math.ceil(Math.max(...ys));

    //console.log({ fromX, fromY, toX, toY });

    // TODO: !!! Only unique tiles
    yield new TileUnique(fromX, fromY, z);
    yield new TileUnique(fromX, toY, z);
    yield new TileUnique(toX, fromY, z);
    yield new TileUnique(toX, toY, z);
}

/**
 * TODO: Check that z is the same
 */
