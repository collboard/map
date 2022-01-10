import { declareModule, ImageArt } from '@collboard/modules-sdk';
import { Registration } from 'destroyable';
import { Vector } from 'xyzt';
import helloWorldIcon from '../assets/hello-world-icon.png';
import { contributors, description, license, repository, version } from '../package.json';

declareModule({
    manifest: {
        name: '@collboard/map',
        version,
        description,
        contributors,
        license,
        repository,
        title: { en: 'Sample button' },
        categories: ['Productivity', 'Buttons', 'Template'],
        icon: helloWorldIcon,
        flags: {
            isTemplate: true,
        },
    },
    async setup(systems) {
        const { virtualArtVersioningSystem } = await systems.request('virtualArtVersioningSystem');

        // TODO: If constants to UPPERCASE and config
        const centerCoords = new Vector(133, 83 /* Reverse */);
        const tileSize = Vector.square(256);
        const tileCount = new Vector(12, 8);

        for (let y = 0; y < tileCount.y; y++) {
            for (let x = 0; x < tileCount.x; x++) {
                const tileCoords = new Vector(x, y);
                const tileArt = new ImageArt(
                    `https://tile-a.openstreetmap.fr/hot/8/${tileCoords
                        .add(centerCoords)
                        .toArray2D()

                        .join('/')}.png`,
                    'Map tile',
                );

                tileArt.defaultZIndex = -1;
                tileArt.setShift(tileCoords.subtract(tileCount.half()).multiply(tileSize));

                virtualArtVersioningSystem.createPrimaryOperation().newArts(tileArt).persist();
            }
        }

        return Registration.join();
    },
});

/**
 * TODO: Should be here explicitelly installed `destroyable`  library
 * TODO: XYZT 2D forEach
 */
