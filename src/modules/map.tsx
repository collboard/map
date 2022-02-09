import { declareModule } from '@collboard/modules-sdk';
import helloWorldIcon from '../../assets/hello-world-icon.png';
import { contributors, description, license, repository, version } from '../../package.json';
import { MapManager } from '../classes/MapManager';
import { TileProvider } from '../classes/TileProvider';

const MAP_PROVIDERS = {
    // TODO: To some config file
    // TODO: Better names
    // @see https://www.openstreetmap.fr/

    osmfr: new TileProvider(['a', 'b', 'c'].map((x) => new URL(`https://tile-${x}.openstreetmap.fr/osmfr`))),
    hot: new TileProvider(['a', 'b', 'c'].map((x) => new URL(`https://tile-${x}.openstreetmap.fr/hot`))),
    cyclosm: new TileProvider(['a', 'b', 'c'].map((x) => new URL(`https://tile-${x}.openstreetmap.fr/cyclosm`))),
    watercolor: new TileProvider(
        ['a', 'b', 'c', 'd'].map((x) => new URL(`https://stamen-tiles-${x}.a.ssl.fastly.net/watercolor`)),
    ),
    br: new TileProvider([new URL(`https://tile.openstreetmap.bzh/br`)]),
    light_all: new TileProvider(
        ['a', 'b', 'c', 'd'].map((x) => new URL(`https://cartodb-basemaps-${x}.global.ssl.fastly.net/light_all`)),
    ),
    dark_all: new TileProvider(
        ['a', 'b', 'c', 'd'].map((x) => new URL(`https://cartodb-basemaps-${x}.global.ssl.fastly.net/dark_all`)),
    ),
};

for (const [name, provider] of Object.entries({ hot: MAP_PROVIDERS.hot /*  TODO: !!! Every provider */ })) {
    declareModule({
        manifest: {
            name: `@collboard/map-layer-${name}`,
            version,
            description,
            contributors,
            license,
            repository,
            // title: { en: 'Map' },
            categories: ['Geography', 'Productivity', 'Template'],
            icon: helloWorldIcon,
            flags: {
                isTemplate: true,
            },
        },
        async setup(systems) {
            const { virtualArtVersioningSystem, appState, collSpace } = await systems.request(
                'virtualArtVersioningSystem',
                'appState',
                'collSpace',
            );

            return new MapManager(provider, appState, collSpace, virtualArtVersioningSystem);
        },
    });
}
