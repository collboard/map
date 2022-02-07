import { declareModule } from '@collboard/modules-sdk';
import helloWorldIcon from '../../assets/hello-world-icon.png';
import { contributors, description, license, repository, version } from '../../package.json';
import { MapManager } from '../classes/MapManager';

declareModule({
    manifest: {
        name: '@collboard/map',
        version,
        description,
        contributors,
        license,
        repository,
        title: { en: 'Map' },
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

        return new MapManager(appState, virtualArtVersioningSystem);
    },
});
