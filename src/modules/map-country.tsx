import { declareModule } from '@collboard/modules-sdk';
import helloWorldIcon from '../../assets/hello-world-icon.png';
import { contributors, description, license, repository, version } from '../../package.json';
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

        // @see https://nominatim.org/release-docs/develop/api/Search/
        // TODO: Put Geojsons into assets
        // TODO: Degrade Geojsons
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?country=czechia&format=geojson&polygon_geojson=1`,
        );
        const geojson = await response.json();

        return virtualArtVersioningSystem.createPrimaryOperation().newArts(new GeojsonArt(geojson)).persist();
    },
});
