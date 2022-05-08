/**
 * 🏭 GENERATED WITH 🚡 Tray from svg converter
 * ⚠️ Warning: Do not edit by hand, all changes will be lost on next execution!
 */

import { declareModule, makeTraySimpleModule } from '@collboard/modules-sdk';
import czechiaIcon from '../../../../assets/icons/cs.svg';
import countiesIcon from '../../../../assets/icons/czechia-counties.png';
import districtsIcon from '../../../../assets/icons/czechia-districts.png';
import mapComapss from '../../../../assets/map-tools/map-compass.svg';
import mapScale from '../../../../assets/map-tools/map-scale.svg';
import { contributors, license, repository, version } from '../../../../package.json';
import hlavniMestoPrahaPrahaCesko1 from '../../../4-svgs/world/europe/czechia/czechia.aggregated2.geojson.lodn13.svg';
import hlavniMestoPrahaPrahaCesko from '../../../4-svgs/world/europe/czechia/czechia.aggregated3.geojson.lodn13.svg';
import untitled from '../../../4-svgs/world/europe/czechia/czechia.geojson.lodn13.svg';
import hlavniMestoPrahaPrahaCesko2 from '../../../4-svgs/world/europe/czechia/hlavni-mesto-praha/hlavni-mesto-praha.geojson.lodn13.svg';
import jihoceskyKraj1 from '../../../4-svgs/world/europe/czechia/jihocesky-kraj/jihocesky-kraj.aggregated2.geojson.lodn13.svg';
import jihoceskyKraj from '../../../4-svgs/world/europe/czechia/jihocesky-kraj/jihocesky-kraj.geojson.lodn13.svg';
import jihomoravskyKraj1 from '../../../4-svgs/world/europe/czechia/jihomoravsky-kraj/jihomoravsky-kraj.aggregated2.geojson.lodn13.svg';
import jihomoravskyKraj from '../../../4-svgs/world/europe/czechia/jihomoravsky-kraj/jihomoravsky-kraj.geojson.lodn13.svg';
import karlovarskyKraj1 from '../../../4-svgs/world/europe/czechia/karlovarsky-kraj/karlovarsky-kraj.aggregated2.geojson.lodn13.svg';
import karlovarskyKraj from '../../../4-svgs/world/europe/czechia/karlovarsky-kraj/karlovarsky-kraj.geojson.lodn13.svg';
import krajVysocinaJihovychodCesko1 from '../../../4-svgs/world/europe/czechia/kraj-vysocina/kraj-vysocina.aggregated2.geojson.lodn13.svg';
import krajVysocinaJihovychodCesko from '../../../4-svgs/world/europe/czechia/kraj-vysocina/kraj-vysocina.geojson.lodn13.svg';
import kralovehradeckyKraj1 from '../../../4-svgs/world/europe/czechia/kralovehradecky-kraj/kralovehradecky-kraj.aggregated2.geojson.lodn13.svg';
import kralovehradeckyKraj from '../../../4-svgs/world/europe/czechia/kralovehradecky-kraj/kralovehradecky-kraj.geojson.lodn13.svg';
import libereckyKraj1 from '../../../4-svgs/world/europe/czechia/liberecky-kraj/liberecky-kraj.aggregated2.geojson.lodn13.svg';
import libereckyKraj from '../../../4-svgs/world/europe/czechia/liberecky-kraj/liberecky-kraj.geojson.lodn13.svg';
import moravskoslezskyKraj1 from '../../../4-svgs/world/europe/czechia/moravskoslezsky-kraj/moravskoslezsky-kraj.aggregated2.geojson.lodn13.svg';
import moravskoslezskyKraj from '../../../4-svgs/world/europe/czechia/moravskoslezsky-kraj/moravskoslezsky-kraj.geojson.lodn13.svg';
import olomouckyKraj1 from '../../../4-svgs/world/europe/czechia/olomoucky-kraj/olomoucky-kraj.aggregated2.geojson.lodn13.svg';
import olomouckyKraj from '../../../4-svgs/world/europe/czechia/olomoucky-kraj/olomoucky-kraj.geojson.lodn13.svg';
import pardubickyKraj1 from '../../../4-svgs/world/europe/czechia/pardubicky-kraj/pardubicky-kraj.aggregated2.geojson.lodn13.svg';
import pardubickyKraj from '../../../4-svgs/world/europe/czechia/pardubicky-kraj/pardubicky-kraj.geojson.lodn13.svg';
import plzenskyKraj1 from '../../../4-svgs/world/europe/czechia/plzensky-kraj/plzensky-kraj.aggregated2.geojson.lodn13.svg';
import plzenskyKraj from '../../../4-svgs/world/europe/czechia/plzensky-kraj/plzensky-kraj.geojson.lodn13.svg';
import okresBenesovStredniCechyCesko from '../../../4-svgs/world/europe/czechia/stredocesky-kraj/stredocesky-kraj.aggregated2.geojson.lodn13.svg';
import stredoceskyKraj from '../../../4-svgs/world/europe/czechia/stredocesky-kraj/stredocesky-kraj.geojson.lodn13.svg';
import usteckyKraj1 from '../../../4-svgs/world/europe/czechia/ustecky-kraj/ustecky-kraj.aggregated2.geojson.lodn13.svg';
import usteckyKraj from '../../../4-svgs/world/europe/czechia/ustecky-kraj/ustecky-kraj.geojson.lodn13.svg';
import zlinskyKraj1 from '../../../4-svgs/world/europe/czechia/zlinsky-kraj/zlinsky-kraj.aggregated2.geojson.lodn13.svg';
import zlinskyKraj from '../../../4-svgs/world/europe/czechia/zlinsky-kraj/zlinsky-kraj.geojson.lodn13.svg';

declareModule(
    makeTraySimpleModule({
        manifest: {
            name: '@collboard/map-tray-tool-czechia-counties-and-districts',
            icon: 'https://collboard.fra1.cdn.digitaloceanspaces.com/assets/18.42.0/languages/cs.svg',
            title: { cs: 'Kraje a okresy České republiky', en: 'Czechia counties and districts' },
            description: { cs: 'Lišta s kraji České republiky', en: 'Tray with Czechia counties and districts' },
            contributors,
            license,
            repository,
            version,
        },

        icon: {
            order: 60,
            // icon: 'earth' /* <- TODO: Better, Czechia borders */,
            icon: czechiaIcon,
            // TODO: !!! Custom icon OR make flag images from UTF-8 country codes like "🇨🇿"
            boardCursor: 'default',
        },
        trayDefinition: [
            {
                title: 'Česká republika',
                icon: czechiaIcon,
                groups: [
                    {
                        title: 'Česká republika',
                        items: [
                            { title: 'Česká republika', imageSrc: untitled },
                            { title: 'Kraje České republiky', imageSrc: hlavniMestoPrahaPrahaCesko1 },
                            { title: 'Okresy České republiky', imageSrc: hlavniMestoPrahaPrahaCesko },
                        ],
                    },
                    {
                        title: 'Nástroje',
                        items: [
                            { title: 'Měřítko' /* TODO: { cs: 'Měřítko', en: 'Scale' }*/, imageSrc: mapScale },
                            { title: 'Kompas' /* TODO: { cs: 'Kompas', en: 'Comapss' }*/, imageSrc: mapComapss },
                        ],
                    },
                ],
            },
            {
                title: 'Kraje České republiky',
                icon: countiesIcon,
                groups: [
                    {
                        title: '',
                        items: [
                            { title: 'Kraje České republiky', imageSrc: hlavniMestoPrahaPrahaCesko1 },
                            { title: 'Praha', imageSrc: hlavniMestoPrahaPrahaCesko2 },
                            { title: 'Jihomoravský kraj', imageSrc: jihomoravskyKraj },
                            { title: 'Jihočeský kraj', imageSrc: jihoceskyKraj },
                            { title: 'Karlovarský kraj', imageSrc: karlovarskyKraj },
                            { title: 'Vysočina', imageSrc: krajVysocinaJihovychodCesko },
                            { title: 'Královéhradecký kraj', imageSrc: kralovehradeckyKraj },
                            { title: 'Liberecký kraj', imageSrc: libereckyKraj },
                            { title: 'Moravskoslezský kraj', imageSrc: moravskoslezskyKraj },
                            { title: 'Olomoucký kraj', imageSrc: olomouckyKraj },
                            { title: 'Pardubický kraj', imageSrc: pardubickyKraj },
                            { title: 'Plzeňský kraj', imageSrc: plzenskyKraj },
                            { title: 'Středočeský kraj', imageSrc: stredoceskyKraj },
                            { title: 'Zlínský kraj', imageSrc: zlinskyKraj },
                            { title: 'Ústecký kraj', imageSrc: usteckyKraj },
                        ],
                    },
                ],
            },
            {
                title: 'Okresy České republiky',
                icon: districtsIcon,
                groups: [
                    {
                        title: '',
                        items: [
                            { title: 'Okresy České republiky', imageSrc: hlavniMestoPrahaPrahaCesko },
                            { title: 'Praha', imageSrc: hlavniMestoPrahaPrahaCesko2 },
                            { title: 'Jihomoravský kraj', imageSrc: jihomoravskyKraj1 },
                            { title: 'Jihočeský kraj', imageSrc: jihoceskyKraj1 },
                            { title: 'Karlovarský kraj', imageSrc: karlovarskyKraj1 },
                            { title: 'Vysočina', imageSrc: krajVysocinaJihovychodCesko1 },
                            { title: 'Královéhradecký kraj', imageSrc: kralovehradeckyKraj1 },
                            { title: 'Liberecký kraj', imageSrc: libereckyKraj1 },
                            { title: 'Moravskoslezský kraj', imageSrc: moravskoslezskyKraj1 },
                            { title: 'Olomoucký kraj', imageSrc: olomouckyKraj1 },
                            { title: 'Pardubický kraj', imageSrc: pardubickyKraj1 },
                            { title: 'Plzeňský kraj', imageSrc: plzenskyKraj1 },
                            { title: 'Středočeský kraj', imageSrc: okresBenesovStredniCechyCesko },
                            { title: 'Zlínský kraj', imageSrc: zlinskyKraj1 },
                            { title: 'Ústecký kraj', imageSrc: usteckyKraj1 },
                        ],
                    },
                ],
            },
        ],
    }),
);
