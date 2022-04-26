import { declareModule, makeTraySimpleModule } from '@collboard/modules-sdk';
import { contributors, license, repository, version } from '../../../../package.json';
import {
    default as jihoceskyKraj,
    default as jihoceskyKraj1,
} from '../../../4-svgs/world/europe/czechia/jihocesky-kraj/jihocesky-kraj.aggregated2.geojson.lod-5.svg';
import {
    default as jihomoravskyKraj,
    default as jihomoravskyKraj1,
} from '../../../4-svgs/world/europe/czechia/jihomoravsky-kraj/jihomoravsky-kraj.aggregated2.geojson.lod-5.svg';
import {
    default as karlovarskyKraj,
    default as karlovarskyKraj1,
} from '../../../4-svgs/world/europe/czechia/karlovarsky-kraj/karlovarsky-kraj.aggregated2.geojson.lod-5.svg';
import {
    default as krajVysocina,
    default as krajVysocina1,
} from '../../../4-svgs/world/europe/czechia/kraj-vysocina/kraj-vysocina.aggregated2.geojson.lod-5.svg';
import {
    default as kralovehradeckyKraj,
    default as kralovehradeckyKraj1,
} from '../../../4-svgs/world/europe/czechia/kralovehradecky-kraj/kralovehradecky-kraj.aggregated2.geojson.lod-5.svg';
import {
    default as libereckyKraj,
    default as libereckyKraj1,
} from '../../../4-svgs/world/europe/czechia/liberecky-kraj/liberecky-kraj.aggregated2.geojson.lod-5.svg';
import {
    default as moravskoslezskyKraj,
    default as moravskoslezskyKraj1,
} from '../../../4-svgs/world/europe/czechia/moravskoslezsky-kraj/moravskoslezsky-kraj.aggregated2.geojson.lod-5.svg';
import {
    default as olomouckyKraj,
    default as olomouckyKraj1,
} from '../../../4-svgs/world/europe/czechia/olomoucky-kraj/olomoucky-kraj.aggregated2.geojson.lod-5.svg';
import {
    default as pardubickyKraj,
    default as pardubickyKraj1,
} from '../../../4-svgs/world/europe/czechia/pardubicky-kraj/pardubicky-kraj.aggregated2.geojson.lod-5.svg';
import {
    default as plzenskyKraj,
    default as plzenskyKraj1,
} from '../../../4-svgs/world/europe/czechia/plzensky-kraj/plzensky-kraj.aggregated2.geojson.lod-5.svg';
import {
    default as cesko,
    default as cesko1,
} from '../../../4-svgs/world/europe/czechia/praha/praha.aggregated2.geojson.lod-5.svg';
import {
    default as stredniCechy,
    default as stredniCechy1,
} from '../../../4-svgs/world/europe/czechia/stredocesky-kraj/stredocesky-kraj.aggregated2.geojson.lod-5.svg';
import {
    default as usteckyKraj,
    default as usteckyKraj1,
} from '../../../4-svgs/world/europe/czechia/ustecky-kraj/ustecky-kraj.aggregated2.geojson.lod-5.svg';
import {
    default as zlinskyKraj,
    default as zlinskyKraj1,
} from '../../../4-svgs/world/europe/czechia/zlinsky-kraj/zlinsky-kraj.aggregated2.geojson.lod-5.svg';

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
                title: 'Kraje České republiky',
                icon: 'https://collboard.fra1.cdn.digitaloceanspaces.com/assets/18.42.0/languages/cs.svg',
                groups: [
                    {
                        title: '',
                        items: [
                            { title: 'Jihomoravský kraj', imageSrc: jihomoravskyKraj },
                            { title: 'Jihočeský kraj', imageSrc: jihoceskyKraj },
                            { title: 'Karlovarský kraj', imageSrc: karlovarskyKraj },
                            { title: 'Kraj Vysočina', imageSrc: krajVysocina },
                            { title: 'Královéhradecký kraj', imageSrc: kralovehradeckyKraj },
                            { title: 'Liberecký kraj', imageSrc: libereckyKraj },
                            { title: 'Moravskoslezský kraj', imageSrc: moravskoslezskyKraj },
                            { title: 'Olomoucký kraj', imageSrc: olomouckyKraj },
                            { title: 'Pardubický kraj', imageSrc: pardubickyKraj },
                            { title: 'Plzeňský kraj', imageSrc: plzenskyKraj },
                            { title: 'Střední Čechy', imageSrc: stredniCechy },
                            { title: 'Zlínský kraj', imageSrc: zlinskyKraj },
                            { title: 'Ústecký kraj', imageSrc: usteckyKraj },
                            { title: 'Česko', imageSrc: cesko },
                        ],
                    },
                ],
            },
            {
                title: 'Kraje České republiky',
                icon: 'https://collboard.fra1.cdn.digitaloceanspaces.com/assets/18.42.0/languages/cs.svg',
                groups: [
                    {
                        title: '',
                        items: [
                            { title: 'Jihomoravský kraj', imageSrc: jihomoravskyKraj1 },
                            { title: 'Jihočeský kraj', imageSrc: jihoceskyKraj1 },
                            { title: 'Karlovarský kraj', imageSrc: karlovarskyKraj1 },
                            { title: 'Kraj Vysočina', imageSrc: krajVysocina1 },
                            { title: 'Královéhradecký kraj', imageSrc: kralovehradeckyKraj1 },
                            { title: 'Liberecký kraj', imageSrc: libereckyKraj1 },
                            { title: 'Moravskoslezský kraj', imageSrc: moravskoslezskyKraj1 },
                            { title: 'Olomoucký kraj', imageSrc: olomouckyKraj1 },
                            { title: 'Pardubický kraj', imageSrc: pardubickyKraj1 },
                            { title: 'Plzeňský kraj', imageSrc: plzenskyKraj1 },
                            { title: 'Střední Čechy', imageSrc: stredniCechy1 },
                            { title: 'Zlínský kraj', imageSrc: zlinskyKraj1 },
                            { title: 'Ústecký kraj', imageSrc: usteckyKraj1 },
                            { title: 'Česko', imageSrc: cesko1 },
                        ],
                    },
                ],
            },
        ],
    }),
);
