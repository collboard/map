// !!! Delete this file with generated one

import { declareModule, makeTraySimpleModule } from '@collboard/modules-sdk';
import { contributors, license, repository, version } from '../../../package.json';
import { TRAY_FEATURES_DEFINITION } from './svgList';

declareModule(() => {


    return makeTraySimpleModule({
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
            icon: 'https://collboard.fra1.cdn.digitaloceanspaces.com/assets/18.42.0/languages/cs.svg',
            boardCursor: 'default',
        },
        trayDefinition:TRAY_FEATURES_DEFINITION,



        /*
        !!! Remove
        [
                {
                    name: <>Česká republika</>,
                    icon: 'https://collboard.fra1.cdn.digitaloceanspaces.com/assets/18.42.0/languages/cs.svg',
                    scale: 0.6,
                    items: [
                        {
                            title: <>Kraje</>,
                            itemIds: Object.keys(items),
                        },
                    ],
                },
                {
                    name: <>Slovenská republika</>,
                    icon: 'https://collboard.fra1.cdn.digitaloceanspaces.com/assets/18.42.0/languages/sk.svg',
                    scale: 0.6,
                    items: [
                        {
                            title: <>Kraje</>,
                            itemIds: Object.keys(items),
                        },
                    ],
                },
            ],
        }]
        */



});

/**
 * TODO: Maybe in future create directly GeoJsonArts
 * TODO: Tile map under GeoJsonArts
 * TODO: !!! Translations in modules
 * TODO: !!! Fulltext replace of Montessori/montessori
 * TODO: Touch only inside the polygon
 */
