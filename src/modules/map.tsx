import { declareModule, ImageArt } from '@collboard/modules-sdk';
import { Registration } from 'destroyable';
import { Vector } from 'xyzt';
import helloWorldIcon from '../../assets/hello-world-icon.png';
import { contributors, description, license, repository, version } from '../../package.json';
import { mapCenterTileXyRound, mapCenterTileXyRoundRemainder, mapProvider, mapZoom, tilePixelSize } from '../config';
import { observeByHeartbeat } from '../utils/observeByHeartbeat';

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

        // TODO: Count based on screen size (appState.windowSize) and tileSize + observe
        const tileCount = new Vector(6, 4);

        const registration = Registration.void();

        observeByHeartbeat({ getValue: () => appState.transform }).subscribe((transform) => {
            for (let y = 0; y < tileCount.y; y++) {
                for (let x = 0; x < tileCount.x; x++) {
                    const mapCenterTileOffset = transform.translate
                        .divide(tilePixelSize)
                        .map(Math.floor /* TODO: Floor OR round? */);

                    const tileCoords = new Vector(x, y);
                    const tileArt = new ImageArt(
                        // TODO: Map server and type provider
                        `${mapProvider.href}/${mapZoom}/${tileCoords
                            .add(mapCenterTileXyRound)
                            .subtract(mapCenterTileOffset)
                            .subtract(tileCount.half())
                            .toArray2D()

                            .join('/')}.png`,
                        'Map tile',
                    );

                    // TODO: Cache tiles and do not rerender them
                    // TODO: Free tiles from memory
                    // TODO: Fillup the screen by tiles (translate+zoom)

                    tileArt.defaultZIndex = -1;
                    tileArt.setShift(
                        tileCoords
                            .subtract(tileCount.half())
                            .subtract(mapCenterTileXyRoundRemainder)
                            .subtract(mapCenterTileOffset)
                            .multiply(tilePixelSize),
                    );

                    registration.addSubdestroyable(
                        virtualArtVersioningSystem.createPrimaryOperation().newArts(tileArt).persist(),
                    );
                }
            }
        });

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
 * TODO: TileXy -> Tile
 */
