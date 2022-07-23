import { declareModule, ToolbarName } from '@collboard/modules-sdk';
import { Registration } from 'destroyable';
import { forTime } from 'waitasecond';
import { contributors, license, repository, version } from '../../package.json';

declareModule({
    manifest: {
        name: '@collboard/map-toolbar-persisting',
        title: { en: 'Map toolbar' },
        description: { en: 'Modify behaviour of toolbar and tools for the map' },
        categories: ['Geography', 'Education'],
        contributors,
        license,
        repository,
        version,
    },
    async setup(systems) {
        const { toolbarSystem } = await systems.request('toolbarSystem');

        // await forTime(850 + 600);
        // alert(123);

        for (let i = 0; i < 20; i++) {
            await forTime(100);
            /* not await */ toolbarSystem.getToolbar(ToolbarName.Navigation).clickOnIcon('move');
        }
        // TODO: !!! Better

        /*
          TODO: Make this module work and then use code bellow

          const toolbar = this.toolbarSystem.getToolbar(ToolbarName.Tools);
          // TODO: Iterate through all toolbars

          const toolbarQueryParam = this.routingSystem.registerQuery<{
              // TODO:  This should identify toolbar not no-meaning key icon
              icon: string | null;
          }>({ icon: 'freehand' }, { debounceInterval: 50, saveToHistory: false });

          observe(toolbar, () => {
              toolbarQueryParam.value = ({ icon: toolbar.activeIconName });
          });

          toolbarQueryParam.values.subscribe(({ icon }) => {
              toolbar.setActive(icon);
          });
        */

        return Registration.void();
    },
});

/**
 * TODO: Supress/Inhibe module ToolbarsPersisting
 */
