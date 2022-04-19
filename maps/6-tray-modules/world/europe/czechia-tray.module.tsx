import { declareModule, makeTraySimpleModule } from '@collboard/modules-sdk';
import { contributors, license, repository, version } from '../../../../package.json';
import xgb7f5h4k9 from '../../../4-svgs/world/europe/czechia/jihocesky-kraj/jihocesky-kraj.aggregated2.geojson.lod-5.svg';
import xqaz4kr8uu from '../../../4-svgs/world/europe/czechia/jihomoravsky-kraj/jihomoravsky-kraj.aggregated2.geojson.lod-5.svg';
import xl6fqy7irb from '../../../4-svgs/world/europe/czechia/karlovarsky-kraj/karlovarsky-kraj.aggregated2.geojson.lod-5.svg';
import xz3ex4u7my from '../../../4-svgs/world/europe/czechia/kraj-vysocina/kraj-vysocina.aggregated2.geojson.lod-5.svg';
import x56tfxpert from '../../../4-svgs/world/europe/czechia/kralovehradecky-kraj/kralovehradecky-kraj.aggregated2.geojson.lod-5.svg';
import x9dr78cblv from '../../../4-svgs/world/europe/czechia/liberecky-kraj/liberecky-kraj.aggregated2.geojson.lod-5.svg';
import x2sw361cl0 from '../../../4-svgs/world/europe/czechia/moravskoslezsky-kraj/moravskoslezsky-kraj.aggregated2.geojson.lod-5.svg';
import xw1848pliw from '../../../4-svgs/world/europe/czechia/olomoucky-kraj/olomoucky-kraj.aggregated2.geojson.lod-5.svg';
import xsb8phzmmm from '../../../4-svgs/world/europe/czechia/pardubicky-kraj/pardubicky-kraj.aggregated2.geojson.lod-5.svg';
import x09pnfilnb from '../../../4-svgs/world/europe/czechia/plzensky-kraj/plzensky-kraj.aggregated2.geojson.lod-5.svg';
import x70ud6lk5h from '../../../4-svgs/world/europe/czechia/praha/praha.aggregated2.geojson.lod-5.svg';
import xnucr78c8j from '../../../4-svgs/world/europe/czechia/stredocesky-kraj/stredocesky-kraj.aggregated2.geojson.lod-5.svg';
import x487adt8ii from '../../../4-svgs/world/europe/czechia/ustecky-kraj/ustecky-kraj.aggregated2.geojson.lod-5.svg';
import xsgx79886r from '../../../4-svgs/world/europe/czechia/zlinsky-kraj/zlinsky-kraj.aggregated2.geojson.lod-5.svg';

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
                            { title: 'Jihočeský kraj', imageSrc: xgb7f5h4k9 },
                            { title: 'Jihomoravský kraj', imageSrc: xqaz4kr8uu },
                            { title: 'Karlovarský kraj', imageSrc: xl6fqy7irb },
                            { title: 'Kraj Vysočina', imageSrc: xz3ex4u7my },
                            { title: 'Královéhradecký kraj', imageSrc: x56tfxpert },
                            { title: 'Liberecký kraj', imageSrc: x9dr78cblv },
                            { title: 'Moravskoslezský kraj', imageSrc: x2sw361cl0 },
                            { title: 'Olomoucký kraj', imageSrc: xw1848pliw },
                            { title: 'Pardubický kraj', imageSrc: xsb8phzmmm },
                            { title: 'Plzeňský kraj', imageSrc: x09pnfilnb },
                            { title: 'Česko', imageSrc: x70ud6lk5h },
                            { title: 'Střední Čechy', imageSrc: xnucr78c8j },
                            { title: 'Ústecký kraj', imageSrc: x487adt8ii },
                            { title: 'Zlínský kraj', imageSrc: xsgx79886r },
                        ],
                    },
                ],
            },
        ],
    }),
);
