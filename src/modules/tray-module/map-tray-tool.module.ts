import { declareModule, ImageArt, ITrayDefinition, makeTrayModule } from '@collboard/modules-sdk';
// import pragueGeojson from '../../../maps/2-geojsons/world/europe/czechia/praha/hlavni-mesto-praha/praha.geojson';
import { contributors, license, repository, version } from '../../../package.json';
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
        newArtMaker(...args){

          return new ImageArt('https://collboard.com/api/files/collboard/a3221f41-e64b-4ea5-84b1-bf431a72d88f.svg','Prague!!!');
          //return new GeojsonArt(pragueGeojson);
          //new TrayMapArt(...args)},
    }),
);
