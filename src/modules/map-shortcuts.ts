import { declareModule, IShortcut } from '@collboard/modules-sdk';
import { ITransformData, Transform } from 'xyzt';
import { contributors, license, repository, version } from '../../package.json';

/**
 * TODO: Import from some ConfigSystem
 */
const WHEEL_SCALE_FACTOR_STEP = 1.1;

declareModule({
    manifest: {
        name: '@collboard/map-shortcuts',
        title: { en: 'Map shortcuts' },
        description: { en: 'Shortcuts native for the map' },
        categories: ['Geography', 'Education'],
        contributors,
        license,
        repository,
        version,
    },
    async setup(systems) {
        const { controlSystem, appState } = await systems.request('controlSystem', 'appState');
        const defaultShortcuts = new Map<IShortcut, ITransformData>();

        defaultShortcuts.set(['WheelUp'], Transform.scale(WHEEL_SCALE_FACTOR_STEP));
        defaultShortcuts.set(['WheelDown'], Transform.scale(WHEEL_SCALE_FACTOR_STEP).inverse());

        return controlSystem.registerControl({
            defaultShortcuts,
            executor: ({ value }) => {
                const transform = Transform.fromObject(value);
                appState.transform = appState.transform.apply(transform);
            },
        });
    },
});

/**
 * TODO: !!! Make it work
 * TODO: Shortcuts debugger in the collboard
 * TODO: Pitch to zoom
 */
