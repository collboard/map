import { declareModule } from '@collboard/modules-sdk';
import helloWorldIcon from '../../assets/hello-world-icon.png';
import czechiaGeojson from '../../maps/czechia.min1.geojson.json';
import slovakiaGeojson from '../../maps/slovakia.min1.geojson.json';
import { contributors, description, license, repository, version } from '../../package.json';
import { IGeojson } from '../interfaces/IGeojson';
import { GeojsonArt } from './map-geojson-art';

declareModule({
    manifest: {
        name: '@collboard/map-country',
        version,
        description,
        contributors,
        license,
        repository,
        title: { en: 'Czechia' },
        categories: ['Geography', 'Template'],
        icon: helloWorldIcon,
        flags: {
            isTemplate: true,
        },
    },
    async setup(systems) {
        const { virtualArtVersioningSystem } = await systems.request('virtualArtVersioningSystem');
        return virtualArtVersioningSystem
            .createPrimaryOperation()
            .newArts(new GeojsonArt(czechiaGeojson as IGeojson), new GeojsonArt(slovakiaGeojson as IGeojson))
            .persist();
    },
});

/*
// @see https://nominatim.org/release-docs/develop/api/Search/
// TODO: Put Geojsons into assets
// TODO: Degrade Geojsons @see https://www.npmjs.com/package/simplify-geojson @see https://mapshaper.org/
const response = await fetch(
    `https://nominatim.openstreetmap.org/search?country=czechia&format=geojson&polygon_geojson=1`,
);
const geojson = await response.json();

// TODO: Geojson server + caching
*/
