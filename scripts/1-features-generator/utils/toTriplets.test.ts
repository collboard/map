import { toTriplets } from './toTriplets';

describe(`toTriplets`, () => {
    it(`makes triplets`, () => {
        expect(toTriplets([1, 2, 3])).toEqual([[1, 2, 3]]);
        expect(toTriplets([1, 2, 3, 4])).toEqual([
            [1, 2, 3],
            [2, 3, 4],
        ]);
        expect(toTriplets([1, 2, 3, 4, 5])).toEqual([
            [1, 2, 3],
            [2, 3, 4],
            [3, 4, 5],
        ]);
    });
});
