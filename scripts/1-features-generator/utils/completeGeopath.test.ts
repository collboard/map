import { completeGeopath } from './completeGeopath';

describe(`completeGeopath`, () => {
    it(`completing`, () => {
        expect(
            completeGeopath({
                model: {
                    region: 'Europe',
                    country: 'Czechia',
                    county: 'Středočeský kraj',
                    district: 'Okres Praha-západ',
                    city: 'Dolní Břežany',
                },
                reciever: {
                    region: 'Europe',
                    country: 'Czechia',
                    county: undefined,
                    district: 'Okres Praha-západ',
                    city: 'Dolní Břežany',
                },
            }),
        ).toEqual({
            region: 'Europe',
            country: 'Czechia',
            county: 'Středočeský kraj',
            district: 'Okres Praha-západ',
            city: 'Dolní Břežany',
        });

        expect(
            completeGeopath({
                model: {
                    region: 'Europe',
                    country: 'Czechia',
                    county: 'Středočeský kraj',
                    district: 'Okres Praha-západ',
                    city: 'Dolní Břežany',
                },
                reciever: {
                    region: 'Europe',
                    country: undefined,
                    county: 'Středočeský kraj',
                    district: 'Okres Praha-východ',
                    city: 'Průhonice',
                },
            }),
        ).toEqual({
            region: 'Europe',
            country: 'Czechia',
            county: 'Středočeský kraj',
            district: 'Okres Praha-východ',
            city: 'Průhonice',
        });
    });

    it(`not completing`, () => {
        expect(
            completeGeopath({
                model: {
                    region: 'Europe',
                    country: 'Czechia',
                    county: 'Středočeský kraj',
                    district: 'Okres Praha-západ',
                    city: 'Dolní Břežany',
                },
                reciever: {
                    region: 'Asia',
                    country: undefined,
                    county: 'Středočeský kraj',
                    district: 'Okres Praha-východ',
                    city: 'Průhonice',
                },
            }),
        ).toEqual({
            region: 'Asia',
            country: undefined,
            county: 'Středočeský kraj',
            district: 'Okres Praha-východ',
            city: 'Průhonice',
        });
    });
});
