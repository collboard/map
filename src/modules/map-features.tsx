import { declareModule } from '@collboard/modules-sdk';
import helloWorldIcon from '../../assets/hello-world-icon.png';
import { contributors, description, license, repository, version } from '../../package.json';
import { OpenstreetmapGeojson } from '../geojson/OpenstreetmapGeojson';
import { GeojsonArt } from './map-geojson-art';

const FEATURES = {
    prague: OpenstreetmapGeojson.fromCity('Praha'),
    /*
    TODO: !!! Uncomment
    { name: 'prague', city: 'Praha' },
    { name: 'brno', city: 'Brno' },
    { name: 'pilsen', city: 'Plzeň' },
    { name: 'olomouc', city: 'Olomouc' },
    { name: 'liberec', city: 'Liberec' },*/
};

// TODO: Countries, counties, districts

Object.entries(FEATURES).forEach(async ([name, geojsonPromise]) => {
    const geojson = await geojsonPromise;
    declareModule({
        manifest: {
            name: `@collboard/map-feature-${name}`,
            version,
            description,
            contributors,
            license,
            repository,
            title: { cs: `${geojson.title} na mapě`, en: `${geojson.title} on map` },
            categories: ['Geography', 'Template'],
            keywords: ['map', 'geojson', 'country', 'county', 'district', 'czechia'],
            icon: helloWorldIcon,
            flags: {
                isTemplate: true,
            },
        },
        async setup(systems) {
            const { virtualArtVersioningSystem } = await systems.request('virtualArtVersioningSystem');

            return virtualArtVersioningSystem
                .createPrimaryOperation()
                .newArts(
                    new GeojsonArt(geojson),
                    // new GeojsonArt(pragueGeojson as any as IGeojson),
                    // new GeojsonArt(czechiaGeojson as IGeojson),
                    // new GeojsonArt(slovakiaGeojson as IGeojson),
                )
                .persist();
        },
    });
});

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
