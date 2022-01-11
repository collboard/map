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

        const tilePixelSize = Vector.square(256);
        const tileCount = new Vector(2, 2 /* TODO: Count based on screen size (with some system) and tileSize */);

        const mapZoom = 8;
        const mapCenterWgs84 = new Vector(14.4378005 /* Longitude  */, 50.0755381 /* Latitude  */);

        const mapCenterTileXy = wgs84ToTileXy(mapCenterWgs84, mapZoom); // new Vector(133, 83 /* Reverse */);

        const registration = Registration.void();

        for (let y = 0; y < tileCount.y; y++) {
            for (let x = 0; x < tileCount.x; x++) {
                const tileCoords = new Vector(x, y);
                const tileArt = new ImageArt(
                    `https://tile-a.openstreetmap.fr/hot/${mapZoom}/${tileCoords
                        .add(mapCenterTileXy)
                        .toArray2D()

                        .join('/')}.png`,
                    'Map tile',
                );

                tileArt.defaultZIndex = -1;
                tileArt.setShift(tileCoords.subtract(tileCount.half()).multiply(tilePixelSize));

                registration.addSubdestroyable(
                    virtualArtVersioningSystem.createPrimaryOperation().newArts(tileArt).persist(),
                );
            }
        }

        return registration;
    },
});

function wgs84ToTileXy(coordinatesWgs84: Vector, zoom: number) {
    return new Vector(
        Math.floor(((coordinatesWgs84.x + 180) / 360) * Math.pow(2, zoom)),
        Math.floor(
            ((1 -
                Math.log(
                    Math.tan((coordinatesWgs84.y * Math.PI) / 180) + 1 / Math.cos((coordinatesWgs84.y * Math.PI) / 180),
                ) /
                    Math.PI) /
                2) *
                Math.pow(2, zoom),
        ),
    );
}

/**
 * TODO: Should be here explicitelly installed `destroyable`  library
 * TODO: XYZT 2D forEach
 * TODO: XYZT semantic coordinates (latitude, longitude) with conversion
 */
