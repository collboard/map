import { declareModule } from '@collboard/modules-sdk';
import helloWorldIcon from '../../assets/hello-world-icon.png';
import { contributors, description, license, repository, version } from '../../package.json';
import { MapManager } from '../classes/MapManager';
import { TileProvider } from '../classes/TileProvider';

for (const provider of [
    // @see https://www.openstreetmap.fr/

    new TileProvider(['a', 'b', 'c'].map((x) => new URL(`https://tile-${x}.openstreetmap.fr/osmfr`))),
    new TileProvider(['a', 'b', 'c'].map((x) => new URL(`https://tile-${x}.openstreetmap.fr/hot`))),
    new TileProvider(['a', 'b', 'c'].map((x) => new URL(`https://tile-${x}.openstreetmap.fr/cyclosm`))),
    new TileProvider(['a', 'b', 'c', 'd'].map((x) => new URL(`https://stamen-tiles-${x}.a.ssl.fastly.net/watercolor`))),
    new TileProvider([new URL(`https://tile.openstreetmap.bzh/br`)]),
    new TileProvider(
        ['a', 'b', 'c', 'd'].map((x) => new URL(`https://cartodb-basemaps-${x}.global.ssl.fastly.net/light_all`)),
    ),
    new TileProvider(
        ['a', 'b', 'c', 'd'].map((x) => new URL(`https://cartodb-basemaps-${x}.global.ssl.fastly.net/dark_all`)),
    ),
]) {
    declareModule({
        manifest: {
            name: `@collboard/map-layer-${provider.serviceDomains[0].pathname.replace(/^\//, '')}`,
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
            const { virtualArtVersioningSystem, appState } = await systems.request(
                'virtualArtVersioningSystem',
                'appState',
            );

            return new MapManager(provider, appState, virtualArtVersioningSystem);
        },
    });
}
