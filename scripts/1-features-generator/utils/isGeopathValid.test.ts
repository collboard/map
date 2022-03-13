import { isGeopathValid } from './isGeopathValid';

describe(`isGeopathValid`, () => {
    it(`is valid`, () => {
        expect(
            isGeopathValid({
                region: 'Europe',
                country: 'Czechia',
                county: 'Středočeský kraj',
                district: 'Okres Praha-východ',
                city: 'Dolní břežany',
            }),
        ).toBeTruthy();

        expect(
            isGeopathValid({
                region: 'Europe',
                country: 'Czechia',
                county: 'Středočeský kraj',
                district: undefined,
                city: undefined,
            }),
        ).toBeTruthy();
    });

    it(`is not valid`, () => {
        expect(
            isGeopathValid({
                region: 'Europe',
                country: 'Czechia',
                county: undefined,
                district: 'Okres Praha-východ',
                city: 'Dolní břežany',
            }),
        ).toBeFalsy();

        expect(
            isGeopathValid({
                region: 'Europe',
                country: 'Czechia',
                district: 'Okres Praha-východ',
                city: 'Dolní břežany',
            }),
        ).toBeFalsy();
    });
});
