import { AbstractTrayArt, declareModule, ITrayDefinition, makeArtModule, makeTrayModule } from '@collboard/modules-sdk';
import { contributors, license, repository, version } from '../../../package.json';
import { TrayMapArt } from './map-tray-art.module';
import { MontessoriItemsGenerator } from './MontessoriItems';

const trayDefinition: ITrayDefinition = {
    className: 'MontessoriModule',
    imageFolder: 'http://localhost:9980/modules/Montessori' /* <- !!! Assets */,
    getItems: MontessoriItemsGenerator.items,
    getToolbarItems: MontessoriItemsGenerator.toolbar,
};

declareModule(
    makeTrayModule({
        manifest: {
            name: '@collboard/map-tray-tool',
            title: { en: 'Map tray tool' },
            description: { en: 'Tray tool for the map' },
            contributors,
            license,
            repository,
            version,
        },

        icon: {
            order: 60,

            icon: 'abacus',
            boardCursor: 'default',
        },
        trayDefinition,
        newArtMaker: (...args) => new TrayMapArt(...args),
    }),
);
