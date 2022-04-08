import { declareModule, ImageArt, makeTrayModule, React } from '@collboard/modules-sdk';
import { Vector } from 'xyzt';
import { contributors, license, repository, version } from '../../../package.json';
import { SVG_LIST } from './svgList';

declareModule(() => {
    const items = Object.fromEntries(
        SVG_LIST.map((src) => [
            `map-${src}`,
            {
                src,
                content: (
                    <g>
                        <image href={src} height="200" width="200" />
                        {/* TODO: [lib] Som way how to add text nativelly */}
                        <text x="0" y="0" style={{ font: 'bold 13px comenia-sans-web, sans-serif' }}>
                            Prague !!!
                        </text>
                    </g>
                ),
                defaultColor: 'rgba(78, 78, 78, 0.5)' /* <- [lib] Weird, change API */,

                // TODO: Allow custom params NOT hardcoded color
            },
        ]),
    );

    return makeTrayModule({
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
            getItems: () => /* TODO: [lib] Not function */ items,
            getToolbarItems: () => [
                {
                    name: <>Česká republika</>,
                    icon: 'https://collboard.fra1.cdn.digitaloceanspaces.com/assets/18.42.0/languages/cs.svg',
                    scale: 0.6,
                    items: [
                        {
                            title: <>Kraje</>,
                            itemIds: Object.keys(items),
                        },
                    ],
                },
                {
                    name: <>Slovenská republika</>,
                    icon: 'https://collboard.fra1.cdn.digitaloceanspaces.com/assets/18.42.0/languages/sk.svg',
                    scale: 0.6,
                    items: [
                        {
                            title: <>Kraje</>,
                            itemIds: Object.keys(items),
                        },
                    ],
                },
            ],
        },
        newArtMaker(itemId) {
            const { src } = items[itemId];

            const imageArt = new ImageArt(src, 'Prague!!!');
            imageArt.size = new Vector(600, 300 /* !!! */);
            return imageArt;
        },
    })(/* TODO: [lib] Multiple levels of factorable */);
});

/**
 * TODO: Maybe in future create directly GeoJsonArts
 * TODO: Tile map under GeoJsonArts
 * TODO: !!! Translations in modules
 * TODO: !!! Fulltext replace of Montessori/montessori
 * TODO: Touch only inside the polygon
 */
