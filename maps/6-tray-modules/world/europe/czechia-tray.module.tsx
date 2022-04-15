import { declareModule, makeTraySimpleModule } from '@collboard/modules-sdk';
import { contributors, license, repository, version } from '../../../../package.json';
import xmguwbou9e from '../../../4-svgs/world/europe/czechia/jihocesky-kraj/jihocesky-kraj.aggregated2.geojson.lod-5.svg';
import x2dzs4bn10 from '../../../4-svgs/world/europe/czechia/jihomoravsky-kraj/jihomoravsky-kraj.aggregated2.geojson.lod-5.svg';
import xqemp7dsas from '../../../4-svgs/world/europe/czechia/karlovarsky-kraj/karlovarsky-kraj.aggregated2.geojson.lod-5.svg';
import xegcts3ir3 from '../../../4-svgs/world/europe/czechia/kraj-vysocina/kraj-vysocina.aggregated2.geojson.lod-5.svg';
import xxgdtiqd2c from '../../../4-svgs/world/europe/czechia/kralovehradecky-kraj/kralovehradecky-kraj.aggregated2.geojson.lod-5.svg';
import xfs569nazm from '../../../4-svgs/world/europe/czechia/liberecky-kraj/liberecky-kraj.aggregated2.geojson.lod-5.svg';
import xp67nvgb9z from '../../../4-svgs/world/europe/czechia/moravskoslezsky-kraj/moravskoslezsky-kraj.aggregated2.geojson.lod-5.svg';
import xdsenjdjog from '../../../4-svgs/world/europe/czechia/olomoucky-kraj/olomoucky-kraj.aggregated2.geojson.lod-5.svg';
import x1bnkml62y from '../../../4-svgs/world/europe/czechia/pardubicky-kraj/pardubicky-kraj.aggregated2.geojson.lod-5.svg';
import xr8ksve0qp from '../../../4-svgs/world/europe/czechia/plzensky-kraj/plzensky-kraj.aggregated2.geojson.lod-5.svg';
import xl05xkwhkw from '../../../4-svgs/world/europe/czechia/praha/praha.aggregated2.geojson.lod-5.svg';
import xki6rzgccc from '../../../4-svgs/world/europe/czechia/stredocesky-kraj/stredocesky-kraj.aggregated2.geojson.lod-5.svg';
import xvfg3u9gz7 from '../../../4-svgs/world/europe/czechia/ustecky-kraj/ustecky-kraj.aggregated2.geojson.lod-5.svg';
import xlzyhlbgmr from '../../../4-svgs/world/europe/czechia/zlinsky-kraj/zlinsky-kraj.aggregated2.geojson.lod-5.svg';

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
                            { title: 'jihocesky-kraj.aggregated2.geojson.lod-5.svg', imageSrc: xmguwbou9e },
                            { title: 'jihomoravsky-kraj.aggregated2.geojson.lod-5.svg', imageSrc: x2dzs4bn10 },
                            { title: 'karlovarsky-kraj.aggregated2.geojson.lod-5.svg', imageSrc: xqemp7dsas },
                            { title: 'kraj-vysocina.aggregated2.geojson.lod-5.svg', imageSrc: xegcts3ir3 },
                            { title: 'kralovehradecky-kraj.aggregated2.geojson.lod-5.svg', imageSrc: xxgdtiqd2c },
                            { title: 'liberecky-kraj.aggregated2.geojson.lod-5.svg', imageSrc: xfs569nazm },
                            { title: 'moravskoslezsky-kraj.aggregated2.geojson.lod-5.svg', imageSrc: xp67nvgb9z },
                            { title: 'olomoucky-kraj.aggregated2.geojson.lod-5.svg', imageSrc: xdsenjdjog },
                            { title: 'pardubicky-kraj.aggregated2.geojson.lod-5.svg', imageSrc: x1bnkml62y },
                            { title: 'plzensky-kraj.aggregated2.geojson.lod-5.svg', imageSrc: xr8ksve0qp },
                            { title: 'praha.aggregated2.geojson.lod-5.svg', imageSrc: xl05xkwhkw },
                            { title: 'stredocesky-kraj.aggregated2.geojson.lod-5.svg', imageSrc: xki6rzgccc },
                            { title: 'ustecky-kraj.aggregated2.geojson.lod-5.svg', imageSrc: xvfg3u9gz7 },
                            { title: 'zlinsky-kraj.aggregated2.geojson.lod-5.svg', imageSrc: xlzyhlbgmr },
                        ],
                    },
                ],
            },
        ],
    }),
);
