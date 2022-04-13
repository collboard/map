import { declareModule, makeTraySimpleModule } from '@collboard/modules-sdk';
import { contributors, license, repository, version } from '../../../../../package.json';
// !!! Imports of SVGs

// TODO: !!! Generator warning

declareModule(
    makeTraySimpleModule({
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
            icon: 'earth' /* <- TODO: Better, Czechia borders */,
            boardCursor: 'default',
        },
        trayDefinition: [
            {
                title: 'Kraje',
                icon: 'https://collboard.fra1.cdn.digitaloceanspaces.com/assets/18.42.0/languages/cs.svg',
                groups: [
                    {
                        title: '',
                        items: [
                            {
                                title: 'jihocesky-kraj.aggregated2.geojson.lod-5.svg',
                                imageSrc:
                                    'C:/Users/me/work/collboard/map/maps/4-svgs/world/europe/czechia/jihocesky-kraj/jihocesky-kraj.aggregated2.geojson.lod-5.svg',
                            },
                            {
                                title: 'jihomoravsky-kraj.aggregated2.geojson.lod-5.svg',
                                imageSrc:
                                    'C:/Users/me/work/collboard/map/maps/4-svgs/world/europe/czechia/jihomoravsky-kraj/jihomoravsky-kraj.aggregated2.geojson.lod-5.svg',
                            },
                            {
                                title: 'karlovarsky-kraj.aggregated2.geojson.lod-5.svg',
                                imageSrc:
                                    'C:/Users/me/work/collboard/map/maps/4-svgs/world/europe/czechia/karlovarsky-kraj/karlovarsky-kraj.aggregated2.geojson.lod-5.svg',
                            },
                            {
                                title: 'kraj-vysocina.aggregated2.geojson.lod-5.svg',
                                imageSrc:
                                    'C:/Users/me/work/collboard/map/maps/4-svgs/world/europe/czechia/kraj-vysocina/kraj-vysocina.aggregated2.geojson.lod-5.svg',
                            },
                            {
                                title: 'kralovehradecky-kraj.aggregated2.geojson.lod-5.svg',
                                imageSrc:
                                    'C:/Users/me/work/collboard/map/maps/4-svgs/world/europe/czechia/kralovehradecky-kraj/kralovehradecky-kraj.aggregated2.geojson.lod-5.svg',
                            },
                            {
                                title: 'liberecky-kraj.aggregated2.geojson.lod-5.svg',
                                imageSrc:
                                    'C:/Users/me/work/collboard/map/maps/4-svgs/world/europe/czechia/liberecky-kraj/liberecky-kraj.aggregated2.geojson.lod-5.svg',
                            },
                            {
                                title: 'moravskoslezsky-kraj.aggregated2.geojson.lod-5.svg',
                                imageSrc:
                                    'C:/Users/me/work/collboard/map/maps/4-svgs/world/europe/czechia/moravskoslezsky-kraj/moravskoslezsky-kraj.aggregated2.geojson.lod-5.svg',
                            },
                            {
                                title: 'olomoucky-kraj.aggregated2.geojson.lod-5.svg',
                                imageSrc:
                                    'C:/Users/me/work/collboard/map/maps/4-svgs/world/europe/czechia/olomoucky-kraj/olomoucky-kraj.aggregated2.geojson.lod-5.svg',
                            },
                            {
                                title: 'pardubicky-kraj.aggregated2.geojson.lod-5.svg',
                                imageSrc:
                                    'C:/Users/me/work/collboard/map/maps/4-svgs/world/europe/czechia/pardubicky-kraj/pardubicky-kraj.aggregated2.geojson.lod-5.svg',
                            },
                            {
                                title: 'plzensky-kraj.aggregated2.geojson.lod-5.svg',
                                imageSrc:
                                    'C:/Users/me/work/collboard/map/maps/4-svgs/world/europe/czechia/plzensky-kraj/plzensky-kraj.aggregated2.geojson.lod-5.svg',
                            },
                            {
                                title: 'praha.aggregated2.geojson.lod-5.svg',
                                imageSrc:
                                    'C:/Users/me/work/collboard/map/maps/4-svgs/world/europe/czechia/praha/praha.aggregated2.geojson.lod-5.svg',
                            },
                            {
                                title: 'stredocesky-kraj.aggregated2.geojson.lod-5.svg',
                                imageSrc:
                                    'C:/Users/me/work/collboard/map/maps/4-svgs/world/europe/czechia/stredocesky-kraj/stredocesky-kraj.aggregated2.geojson.lod-5.svg',
                            },
                            {
                                title: 'ustecky-kraj.aggregated2.geojson.lod-5.svg',
                                imageSrc:
                                    'C:/Users/me/work/collboard/map/maps/4-svgs/world/europe/czechia/ustecky-kraj/ustecky-kraj.aggregated2.geojson.lod-5.svg',
                            },
                            {
                                title: 'zlinsky-kraj.aggregated2.geojson.lod-5.svg',
                                imageSrc:
                                    'C:/Users/me/work/collboard/map/maps/4-svgs/world/europe/czechia/zlinsky-kraj/zlinsky-kraj.aggregated2.geojson.lod-5.svg',
                            },
                        ],
                    },
                ],
            },
        ],
    }),
);
