import { declareModule } from '@collboard/modules-sdk';
import { contributors, description, license, repository, version } from '../../package.json';
import { OsmGeojsonCached } from '../geojson/OsmGeojsonCached';
import { GeojsonArt } from './map-geojson-art';

const FEATURES_CITIES: any = [
    { en: 'Prague', cs: 'Praha', search: 'Prague' },
    { en: 'Brno', cs: 'Brno', search: 'Brno' },
    { en: 'Pilsen', cs: 'Plzeň', search: 'Plzeň' },
    { en: 'Olomouc', cs: 'Olomouc', search: 'Olomouc' },
    { en: 'Liberec', cs: 'Liberec', search: 'Liberec' },
];

// TODO: Countries, counties, districts

for (const city of FEATURES_CITIES) {
    declareModule({
        manifest: {
            name: `@collboard/map-feature-${city.en.toLowerCase()}`,
            version,
            description,
            contributors,
            license,
            repository,
            title: { cs: `${city.cs} na mapě`, en: `${city.en} on map` },
            categories: ['Geography', 'Template'],
            keywords: ['map', 'geojson', 'country', 'county', 'district', 'czechia', 'city'],
            icon: '🌆',
        },
        async setup(systems) {
            const { virtualArtVersioningSystem } = await systems.request('virtualArtVersioningSystem');

            return virtualArtVersioningSystem
                .createPrimaryOperation()
                .newArts(new GeojsonArt(await OsmGeojsonCached.fromCity(city.search)))
                .persist();
        },
    });
}

/*
// @see https://nominatim.org/release-docs/develop/api/Search/
// TODO: Put Geojsons into assets
// TODO: Degrade Geojsons @see https://www.npmjs.com/package/simplify-geojson @see https://mapshaper.org/
const response = await fetch(
    `https://nominatim.openstreetmap.org/search?country=czechia&format=geojson&polygon_geojson=1`,
);
const geojson = await response.json();
*/

/**
 * TODO: Colldev working on loooot of modules (and the broken dev table)
 * TODO: Geojson server + caching
 */
