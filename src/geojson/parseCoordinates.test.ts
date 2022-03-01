import { parseCoordinates } from './parseCoordinates';

describe(`parsing of coordinates`, () => {
    it(`parse simple polygon`, () => {
        expect(
            parseCoordinates([
                [1, 2],
                [3, 4],
            ]),
        ).toEqual([
            [
                [1, 2],
                [3, 4],
            ],
        ]);
    });

    it(`parse simple deep polygon`, () => {
        expect(
            parseCoordinates([
                [
                    [
                        [
                            [1, 2],
                            [3, 4],
                        ],
                    ],
                ],
            ]),
        ).toEqual([
            [
                [1, 2],
                [3, 4],
            ],
        ]);
    });

    it(`parse multiple polygons`, () => {
        expect(
            parseCoordinates([
                [
                    [1, 2],
                    [3, 4],
                ],
                [
                    [10, 20],
                    [30, 40],
                ],
            ]),
        ).toEqual([
            [
                [1, 2],
                [3, 4],
            ],
            [
                [10, 20],
                [30, 40],
            ],
        ]);
    });

    it(`parse multiple deep polygons`, () => {
        expect(
            parseCoordinates([
                [
                    [
                        [
                            [1, 2],
                            [3, 4],
                        ],
                        [
                            [10, 20],
                            [30, 40],
                        ],
                    ],
                ],
            ]),
        ).toEqual([
            [
                [1, 2],
                [3, 4],
            ],
            [
                [10, 20],
                [30, 40],
            ],
        ]);
    });

    it(`parse multiple deep polygons in different levels`, () => {
        expect(
            parseCoordinates([
                [
                    [
                        [
                            [1, 2],
                            [3, 4],
                        ],
                    ],
                    [
                        [10, 20],
                        [30, 40],
                    ],
                ],
            ]),
        ).toEqual([
            [
                [1, 2],
                [3, 4],
            ],
            [
                [10, 20],
                [30, 40],
            ],
        ]);
    });

    /*
    Note: This is already tested by TypeScript
    it(`throws on wrong input`, () => {
        expect(() => parseCoordinates([[[[[1], [3]]]]])).toThrowError(`Can not parse coordinates`);
        expect(() => parseCoordinates([[[[[1, 2, [3, 4]]]]]])).toThrowError(`Can not parse coordinates`);
    });
    */
});
