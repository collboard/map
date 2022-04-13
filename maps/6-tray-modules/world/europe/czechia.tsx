import { declareModule, makeTraySimpleModule } from '@collboard/modules-sdk';
import { contributors, license, repository, version } from '../../../../package.json';
import xmkf5nzfjc from 'C:/Users/me/work/collboard/map/maps/4-svgs/world/europe/czechia/jihocesky-kraj/jihocesky-kraj.aggregated2.geojson.lod-5.svg';
import xac6deybty from 'C:/Users/me/work/collboard/map/maps/4-svgs/world/europe/czechia/jihomoravsky-kraj/jihomoravsky-kraj.aggregated2.geojson.lod-5.svg';
import x0grswe99c from 'C:/Users/me/work/collboard/map/maps/4-svgs/world/europe/czechia/karlovarsky-kraj/karlovarsky-kraj.aggregated2.geojson.lod-5.svg';
import xznikp0pc8 from 'C:/Users/me/work/collboard/map/maps/4-svgs/world/europe/czechia/kraj-vysocina/kraj-vysocina.aggregated2.geojson.lod-5.svg';
import xkuondp06s from 'C:/Users/me/work/collboard/map/maps/4-svgs/world/europe/czechia/kralovehradecky-kraj/kralovehradecky-kraj.aggregated2.geojson.lod-5.svg';
import xao50qfjgj from 'C:/Users/me/work/collboard/map/maps/4-svgs/world/europe/czechia/liberecky-kraj/liberecky-kraj.aggregated2.geojson.lod-5.svg';
import xm18gjoayp from 'C:/Users/me/work/collboard/map/maps/4-svgs/world/europe/czechia/moravskoslezsky-kraj/moravskoslezsky-kraj.aggregated2.geojson.lod-5.svg';
import x2c86h1ooz from 'C:/Users/me/work/collboard/map/maps/4-svgs/world/europe/czechia/olomoucky-kraj/olomoucky-kraj.aggregated2.geojson.lod-5.svg';
import x2uke8rhks from 'C:/Users/me/work/collboard/map/maps/4-svgs/world/europe/czechia/pardubicky-kraj/pardubicky-kraj.aggregated2.geojson.lod-5.svg';
import xh1eex8akv from 'C:/Users/me/work/collboard/map/maps/4-svgs/world/europe/czechia/plzensky-kraj/plzensky-kraj.aggregated2.geojson.lod-5.svg';
import x2czh4geq8 from 'C:/Users/me/work/collboard/map/maps/4-svgs/world/europe/czechia/praha/praha.aggregated2.geojson.lod-5.svg';
import xx59646iej from 'C:/Users/me/work/collboard/map/maps/4-svgs/world/europe/czechia/stredocesky-kraj/stredocesky-kraj.aggregated2.geojson.lod-5.svg';
import xq7cerj16d from 'C:/Users/me/work/collboard/map/maps/4-svgs/world/europe/czechia/ustecky-kraj/ustecky-kraj.aggregated2.geojson.lod-5.svg';
import x7qw051yhk from 'C:/Users/me/work/collboard/map/maps/4-svgs/world/europe/czechia/zlinsky-kraj/zlinsky-kraj.aggregated2.geojson.lod-5.svg';

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
                            { title: 'jihocesky-kraj.aggregated2.geojson.lod-5.svg', imageSrc: xmkf5nzfjc },
                            { title: 'jihomoravsky-kraj.aggregated2.geojson.lod-5.svg', imageSrc: xac6deybty },
                            { title: 'karlovarsky-kraj.aggregated2.geojson.lod-5.svg', imageSrc: x0grswe99c },
                            { title: 'kraj-vysocina.aggregated2.geojson.lod-5.svg', imageSrc: xznikp0pc8 },
                            { title: 'kralovehradecky-kraj.aggregated2.geojson.lod-5.svg', imageSrc: xkuondp06s },
                            { title: 'liberecky-kraj.aggregated2.geojson.lod-5.svg', imageSrc: xao50qfjgj },
                            { title: 'moravskoslezsky-kraj.aggregated2.geojson.lod-5.svg', imageSrc: xm18gjoayp },
                            { title: 'olomoucky-kraj.aggregated2.geojson.lod-5.svg', imageSrc: x2c86h1ooz },
                            { title: 'pardubicky-kraj.aggregated2.geojson.lod-5.svg', imageSrc: x2uke8rhks },
                            { title: 'plzensky-kraj.aggregated2.geojson.lod-5.svg', imageSrc: xh1eex8akv },
                            { title: 'praha.aggregated2.geojson.lod-5.svg', imageSrc: x2czh4geq8 },
                            { title: 'stredocesky-kraj.aggregated2.geojson.lod-5.svg', imageSrc: xx59646iej },
                            { title: 'ustecky-kraj.aggregated2.geojson.lod-5.svg', imageSrc: xq7cerj16d },
                            { title: 'zlinsky-kraj.aggregated2.geojson.lod-5.svg', imageSrc: x7qw051yhk },
                        ],
                    },
                ],
            },
        ],
    }),
);
