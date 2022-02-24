import { declareModule } from '@collboard/modules-sdk';
import { FEATURES } from '../../maps/features/features';
import { contributors, description, license, repository, version } from '../../package.json';
import { OsmGeojsonCached } from '../geojson/OsmGeojsonCached';
import { GeojsonArt } from './map-geojson-art';

// TODO: Countries, counties, districts

for (const feature of FEATURES) {
    declareModule({
        manifest: {
            name: `@collboard/map-feature-${feature.en.toLowerCase()}`,
            version,
            description,
            contributors,
            license,
            repository,
            title: { cs: `${feature.cs} na mapě`, en: `${feature.en} on map` },
            categories: ['Geography', 'Template'],
            keywords: ['map', 'geojson', 'country', 'county', 'district', 'czechia', 'city'],
            icon: '🌆' /* <- TODO: Determine icon + other stuff in manifest from search */,
        },
        async setup(systems) {
            const { virtualArtVersioningSystem } = await systems.request('virtualArtVersioningSystem');

            return virtualArtVersioningSystem
                .createPrimaryOperation()
                .newArts(new GeojsonArt(await OsmGeojsonCached.search(feature.search)))
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
