import { declareModule, ImageArt } from '@collboard/modules-sdk';
import { Registration } from 'destroyable';
import { Vector } from 'xyzt';
import helloWorldIcon from '../../assets/hello-world-icon.png';
import { contributors, description, license, repository, version } from '../../package.json';
import { mapCenterTileXyRound, mapCenterTileXyRoundRemainder, mapProvider, mapZoom, tilePixelSize } from '../config';

declareModule({
    manifest: {
        name: '@collboard/map',
        version,
        description,
        contributors,
        license,
        repository,
        title: { en: 'Sample button' },
        categories: ['Geography', 'Productivity', 'Template'],
        icon: helloWorldIcon,
        flags: {
            isTemplate: true,
        },
    },
    async setup(systems) {
        const {
            // TODO: Pick only the needed systems
            virtualArtVersioningSystem,
            appState,
            touchController,
            materialArtVersioningSystem,
            collSpace,
            notificationSystem,
        } = await systems.request(
            'virtualArtVersioningSystem',
            'appState',
            'touchController',
            'virtualArtVersioningSystem',
            'materialArtVersioningSystem',
            'collSpace',
            'notificationSystem',
        );

        const tileCount = new Vector(6, 4 /* TODO: Count based on screen size (appState.windowSize) and tileSize */);

        const registration = Registration.void();

        for (let y = 0; y < tileCount.y; y++) {
            for (let x = 0; x < tileCount.x; x++) {
                const tileCoords = new Vector(x, y);
                const tileArt = new ImageArt(
                    // TODO: Map server and type provider
                    `${mapProvider.href}/${mapZoom}/${tileCoords
                        .add(mapCenterTileXyRound)
                        .subtract(tileCount.half())
                        .toArray2D()

                        .join('/')}.png`,
                    'Map tile',
                );

                tileArt.defaultZIndex = -1;
                tileArt.setShift(
                    tileCoords
                        .subtract(tileCount.half())
                        .subtract(mapCenterTileXyRoundRemainder)
                        .multiply(tilePixelSize),
                );

                registration.addSubdestroyable(
                    virtualArtVersioningSystem.createPrimaryOperation().newArts(tileArt).persist(),
                );
            }
        }

        /*/
        observeByHeartbeat({ getValue: () => appState.transform }).subscribe(() => {
            const polygonArt = new MapPolygonArt(
                [appState.transform.translate.negate(), appState.transform.translate.negate().add({ x: 10 })],
                'blue',
                20,
            );

            registration.addSubdestroyable(
                virtualArtVersioningSystem.createPrimaryOperation().newArts(polygonArt).persist(),
            );
        });
        /**/

        return registration;
    },
});

/**
 *
 */
