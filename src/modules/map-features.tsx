import { declareModule } from '@collboard/modules-sdk';
import helloWorldIcon from '../../assets/hello-world-icon.png';
import { contributors, description, license, repository, version } from '../../package.json';
import { downloadGeojson } from '../utils/downloadGeojson';
import { GeojsonArt } from './map-geojson-art';

// TODO: Countries, counties, districts
for (const city of ['Praha', 'Brno', 'Plzeň', 'Olomouc', 'Liberec']) {
    declareModule({
        manifest: {
            name: `@collboard/map-feature-${city}`,
            version,
            description,
            contributors,
            license,
            repository,
            title: { cs: `${city} na mapě`, en: `${city} on map` },
            categories: ['Geography', 'Template'],
            keywords: ['map', 'geojson', 'country', 'county', 'district', 'czechia', city],
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
                    new GeojsonArt(await downloadGeojson({ city })),
                    // new GeojsonArt(pragueGeojson as any as IGeojson),
                    // new GeojsonArt(czechiaGeojson as IGeojson),
                    // new GeojsonArt(slovakiaGeojson as IGeojson),
                )
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
