import { declareModule, makeTraySimpleModule } from '@collboard/modules-sdk';
import { contributors, license, repository, version } from '../../../../package.json';
import x06th49fjc from '../../../4-svgs/world/europe/czechia/jihocesky-kraj/jihocesky-kraj.aggregated2.geojson.lod-5.svg';
import x9x2v1dy4i from '../../../4-svgs/world/europe/czechia/jihomoravsky-kraj/jihomoravsky-kraj.aggregated2.geojson.lod-5.svg';
import xjkw6iuj96 from '../../../4-svgs/world/europe/czechia/karlovarsky-kraj/karlovarsky-kraj.aggregated2.geojson.lod-5.svg';
import xnn1l9w9rx from '../../../4-svgs/world/europe/czechia/kraj-vysocina/kraj-vysocina.aggregated2.geojson.lod-5.svg';
import xa3oohkxfx from '../../../4-svgs/world/europe/czechia/kralovehradecky-kraj/kralovehradecky-kraj.aggregated2.geojson.lod-5.svg';
import x1o1n5cksc from '../../../4-svgs/world/europe/czechia/liberecky-kraj/liberecky-kraj.aggregated2.geojson.lod-5.svg';
import x2qz7jxjjf from '../../../4-svgs/world/europe/czechia/moravskoslezsky-kraj/moravskoslezsky-kraj.aggregated2.geojson.lod-5.svg';
import xtlz8bv8ql from '../../../4-svgs/world/europe/czechia/olomoucky-kraj/olomoucky-kraj.aggregated2.geojson.lod-5.svg';
import xhpflp9z1i from '../../../4-svgs/world/europe/czechia/pardubicky-kraj/pardubicky-kraj.aggregated2.geojson.lod-5.svg';
import xc2uru2p2n from '../../../4-svgs/world/europe/czechia/plzensky-kraj/plzensky-kraj.aggregated2.geojson.lod-5.svg';
import xn60ger8pm from '../../../4-svgs/world/europe/czechia/praha/praha.aggregated2.geojson.lod-5.svg';
import x3ymduydtd from '../../../4-svgs/world/europe/czechia/stredocesky-kraj/stredocesky-kraj.aggregated2.geojson.lod-5.svg';
import x1boygbw89 from '../../../4-svgs/world/europe/czechia/ustecky-kraj/ustecky-kraj.aggregated2.geojson.lod-5.svg';
import xtszqdn4n3 from '../../../4-svgs/world/europe/czechia/zlinsky-kraj/zlinsky-kraj.aggregated2.geojson.lod-5.svg';

// TODO: !!! Generator warning

declareModule(
    makeTraySimpleModule({
        manifest: {
            name: '@collboard/map-tray-tool-czechia-counties-and-districts',
            title: { cs: 'Kraje a okresy České republiky' },
            description: { cs: 'Lišta s kraji České republiky' },
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
                            { title: 'Praha', imageSrc: xn60ger8pm },
                            { title: 'Střední Čechy', imageSrc: x3ymduydtd },
                            { title: 'Jihočeský kraj', imageSrc: x06th49fjc },
                            { title: 'Jihomoravský kraj', imageSrc: x9x2v1dy4i },
                            { title: 'Kraj Vysočina', imageSrc: xnn1l9w9rx },
                            { title: 'Královéhradecký kraj', imageSrc: xa3oohkxfx },
                            { title: 'Liberecký kraj', imageSrc: x1o1n5cksc },
                            { title: 'Moravskoslezský kraj', imageSrc: x2qz7jxjjf },
                            { title: 'Olomoucký kraj', imageSrc: xtlz8bv8ql },
                            { title: 'Pardubický kraj', imageSrc: xhpflp9z1i },
                            { title: 'Plzeňský kraj', imageSrc: xc2uru2p2n },
                            { title: 'Ústecký kraj', imageSrc: x1boygbw89 },
                            { title: 'Zlínský kraj', imageSrc: xtszqdn4n3 },
                            { title: 'Karlovarský kraj', imageSrc: xjkw6iuj96 },
                        ],
                    },
                ],
            },
        ],
    }),
);
