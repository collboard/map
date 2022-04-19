import { declareModule, makeTraySimpleModule } from '@collboard/modules-sdk';
import { contributors, license, repository, version } from '../../../../package.json';
import xe5cztgz3b from '../../../4-svgs/world/europe/czechia/jihocesky-kraj/jihocesky-kraj.aggregated2.geojson.lod-5.svg';
import x3pkghid8y from '../../../4-svgs/world/europe/czechia/jihomoravsky-kraj/jihomoravsky-kraj.aggregated2.geojson.lod-5.svg';
import xno3pb6mlk from '../../../4-svgs/world/europe/czechia/karlovarsky-kraj/karlovarsky-kraj.aggregated2.geojson.lod-5.svg';
import xfpx9lmiqc from '../../../4-svgs/world/europe/czechia/kraj-vysocina/kraj-vysocina.aggregated2.geojson.lod-5.svg';
import xuwpip7kk5 from '../../../4-svgs/world/europe/czechia/kralovehradecky-kraj/kralovehradecky-kraj.aggregated2.geojson.lod-5.svg';
import x0ms3fpxwc from '../../../4-svgs/world/europe/czechia/liberecky-kraj/liberecky-kraj.aggregated2.geojson.lod-5.svg';
import x88w1y9wbf from '../../../4-svgs/world/europe/czechia/moravskoslezsky-kraj/moravskoslezsky-kraj.aggregated2.geojson.lod-5.svg';
import xsahfc9nm8 from '../../../4-svgs/world/europe/czechia/olomoucky-kraj/olomoucky-kraj.aggregated2.geojson.lod-5.svg';
import xhhm1fn0of from '../../../4-svgs/world/europe/czechia/pardubicky-kraj/pardubicky-kraj.aggregated2.geojson.lod-5.svg';
import xqsy0wajb1 from '../../../4-svgs/world/europe/czechia/plzensky-kraj/plzensky-kraj.aggregated2.geojson.lod-5.svg';
import x1qsdc9c6e from '../../../4-svgs/world/europe/czechia/praha/praha.aggregated2.geojson.lod-5.svg';
import x1rysnezfl from '../../../4-svgs/world/europe/czechia/stredocesky-kraj/stredocesky-kraj.aggregated2.geojson.lod-5.svg';
import x48t8zsw8i from '../../../4-svgs/world/europe/czechia/ustecky-kraj/ustecky-kraj.aggregated2.geojson.lod-5.svg';
import x1fallirtw from '../../../4-svgs/world/europe/czechia/zlinsky-kraj/zlinsky-kraj.aggregated2.geojson.lod-5.svg';

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
                            { title: 'Jihočeský kraj', imageSrc: xe5cztgz3b },
                            { title: 'Jihomoravský kraj', imageSrc: x3pkghid8y },
                            { title: 'Karlovarský kraj', imageSrc: xno3pb6mlk },
                            { title: 'Kraj Vysočina', imageSrc: xfpx9lmiqc },
                            { title: 'Královéhradecký kraj', imageSrc: xuwpip7kk5 },
                            { title: 'Liberecký kraj', imageSrc: x0ms3fpxwc },
                            { title: 'Moravskoslezský kraj', imageSrc: x88w1y9wbf },
                            { title: 'Olomoucký kraj', imageSrc: xsahfc9nm8 },
                            { title: 'Pardubický kraj', imageSrc: xhhm1fn0of },
                            { title: 'Plzeňský kraj', imageSrc: xqsy0wajb1 },
                            { title: 'Česko', imageSrc: x1qsdc9c6e },
                            { title: 'Střední Čechy', imageSrc: x1rysnezfl },
                            { title: 'Ústecký kraj', imageSrc: x48t8zsw8i },
                            { title: 'Zlínský kraj', imageSrc: x1fallirtw },
                        ],
                    },
                ],
            },
        ],
    }),
);
