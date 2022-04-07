import {
    declareModule,
    ImageArt,
    ITrayItemList,
    ITrayToolbarGroup,
    makeTrayModule,
    React,
} from '@collboard/modules-sdk';
import { Vector } from 'xyzt';
import { contributors, license, repository, version } from '../../../package.json';

function generateFeatures() {
    const result: ITrayItemList = {};

    for (let i = 1; i <= 9; i++) {
        result['features' + i] = {
            content: (
                <g>
                    <image
                        href="https://collboard.com/api/files/collboard/a3221f41-e64b-4ea5-84b1-bf431a72d88f.svg"
                        height="200"
                        width="200"
                    />
                </g>
            ),
            defaultColor: 'red',
        };
    }

    return result;
}

export function itemsFeatures(): ITrayItemList {
    return {
        ...generateFeatures(),
    };
}

export function toolbarFeatures(): ITrayToolbarGroup {
    return [
        {
            title: <>bbb!!!</> /*<Translate name={`Montessori / features / ones features`}>Jednotkové šipky</Translate>*/,
            itemIds: Object.keys(generateFeatures()),
        },
    ];
}

declareModule(
    makeTrayModule({
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
            icon: 'earth',
            boardCursor: 'default',
        },
        trayDefinition: {
            className: 'REMOVE_MontessoriModule',
            getItems: itemsFeatures,
            getToolbarItems: () => [
                {
                    name: <>aaa</> /*<Translate name={`Montessori / arrows`}>Šipky k perlovému materiálu</Translate>*/,
                    icon: 'https://collboard.com/api/files/collboard/a3221f41-e64b-4ea5-84b1-bf431a72d88f.svg',
                    scale: 0.6,
                    items: toolbarFeatures(),
                },
            ],
        },
        newArtMaker(...args) {
            console.log('newArtMaker', args);
            const imageArt = new ImageArt(
                'https://collboard.com/api/files/collboard/a3221f41-e64b-4ea5-84b1-bf431a72d88f.svg',
                'Prague!!!',
            );
            imageArt.size = new Vector(100, 200);
            return imageArt;
        },
    }),
);

/**
 * TODO: Maybe in future create directly GeoJsonArts
 * TODO: Tile map under GeoJsonArts
 * TODO: !!! Translations in modules
 * TODO: !!! Fulltext replace of Montessori/montessori
 */
