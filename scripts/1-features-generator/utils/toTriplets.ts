/**
 * Makes all following triplets from arrat
 */
export function toTriplets<T>(array: T[]): T[][] {
    const triplets: T[][] = [];
    for (let i = 0; i < array.length - 2; i++) {
        triplets.push([array[i], array[i + 1], array[i + 2]]);
    }

    return triplets;
}

/**
 * TODO: Make and test more universally with Nths
 */
