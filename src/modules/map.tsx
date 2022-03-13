import { declareModule } from '@collboard/modules-sdk';
import helloWorldIcon from '../../assets/hello-world-icon.png';
import { contributors, description, license, repository, version } from '../../package.json';
import { MapManager } from '../classes/MapManager';
import { TileProvider } from '../classes/TileProvider';
import { MAP_PROVIDERS } from "../config.mapProviders";

const pickedMapProviders: Record<string, TileProvider> = { hot: MAP_PROVIDERS.hot };

// TODO: !!! When developing pick here one, when releasing pick all

for (const [name, provider] of Object.entries(pickedMapProviders)) {
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
