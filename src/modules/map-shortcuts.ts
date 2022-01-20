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
        contributors,
        license,
        repository,
        version,
    },
    async setup(systems) {
        const { shortcutsSystem, appState } = await systems.request('shortcutsSystem', 'appState');
        const shortcuts = new Map<IShortcut, ITransformData>();

        shortcuts.set(['WheelUp'], Transform.scale(WHEEL_SCALE_FACTOR_STEP));
        shortcuts.set(['WheelDown'], Transform.scale(WHEEL_SCALE_FACTOR_STEP).inverse());

        return shortcutsSystem.registerShortcut({
            shortcuts,
            executor: ({ value }) => {
                const transform = Transform.fromObject(value);
                appState.transform = appState.transform.apply(transform);
            },
        });
    },
});
