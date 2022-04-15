import { declareModule, makeTraySimpleModule } from '@collboard/modules-sdk';
import { contributors, license, repository, version } from '../../../../package.json';
import xdbb42zz5q from '../../../4-svgs/world/europe/czechia/jihocesky-kraj/jihocesky-kraj.aggregated2.geojson.lod-5.svg';
import xxrt0szpbs from '../../../4-svgs/world/europe/czechia/jihomoravsky-kraj/jihomoravsky-kraj.aggregated2.geojson.lod-5.svg';
import xsj57hghl9 from '../../../4-svgs/world/europe/czechia/karlovarsky-kraj/karlovarsky-kraj.aggregated2.geojson.lod-5.svg';
import x5wck0elo0 from '../../../4-svgs/world/europe/czechia/kraj-vysocina/kraj-vysocina.aggregated2.geojson.lod-5.svg';
import xgj4qmzi6r from '../../../4-svgs/world/europe/czechia/kralovehradecky-kraj/kralovehradecky-kraj.aggregated2.geojson.lod-5.svg';
import xx61fi6t5n from '../../../4-svgs/world/europe/czechia/liberecky-kraj/liberecky-kraj.aggregated2.geojson.lod-5.svg';
import xdd774ukp8 from '../../../4-svgs/world/europe/czechia/moravskoslezsky-kraj/moravskoslezsky-kraj.aggregated2.geojson.lod-5.svg';
import xpyjxh175w from '../../../4-svgs/world/europe/czechia/olomoucky-kraj/olomoucky-kraj.aggregated2.geojson.lod-5.svg';
import xmotltsuhp from '../../../4-svgs/world/europe/czechia/pardubicky-kraj/pardubicky-kraj.aggregated2.geojson.lod-5.svg';
import xdp4ipk0h1 from '../../../4-svgs/world/europe/czechia/plzensky-kraj/plzensky-kraj.aggregated2.geojson.lod-5.svg';
import xdj7x3wejz from '../../../4-svgs/world/europe/czechia/praha/praha.aggregated2.geojson.lod-5.svg';
import x5ypvp024m from '../../../4-svgs/world/europe/czechia/stredocesky-kraj/stredocesky-kraj.aggregated2.geojson.lod-5.svg';
import xlh1ycysew from '../../../4-svgs/world/europe/czechia/ustecky-kraj/ustecky-kraj.aggregated2.geojson.lod-5.svg';
import x56atmz3z9 from '../../../4-svgs/world/europe/czechia/zlinsky-kraj/zlinsky-kraj.aggregated2.geojson.lod-5.svg';

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
                            { title: 'Jihočeský kraj', imageSrc: xdbb42zz5q },
                            { title: 'Jihomoravský kraj', imageSrc: xxrt0szpbs },
                            { title: 'Karlovarský kraj', imageSrc: xsj57hghl9 },
                            { title: 'Kraj Vysočina', imageSrc: x5wck0elo0 },
                            { title: 'Královéhradecký kraj', imageSrc: xgj4qmzi6r },
                            { title: 'Liberecký kraj', imageSrc: xx61fi6t5n },
                            { title: 'Moravskoslezský kraj', imageSrc: xdd774ukp8 },
                            { title: 'Olomoucký kraj', imageSrc: xpyjxh175w },
                            { title: 'Pardubický kraj', imageSrc: xmotltsuhp },
                            { title: 'Plzeňský kraj', imageSrc: xdp4ipk0h1 },
                            { title: 'Česko', imageSrc: xdj7x3wejz },
                            { title: 'Střední Čechy', imageSrc: x5ypvp024m },
                            { title: 'Ústecký kraj', imageSrc: xlh1ycysew },
                            { title: 'Zlínský kraj', imageSrc: x56atmz3z9 },
                        ],
                    },
                ],
            },
        ],
    }),
);
