import { declareModule, ImageArt } from '@collboard/modules-sdk';
import { Operation } from '@collboard/modules-sdk/types/50-systems/ArtVersionSystem/Operation';
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
        title: { en: 'Map' },
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
        const tileCount = new Vector(2, 2);

        let lastRenderedTiles: Record<string, Operation> = {};

        observeByHeartbeat({ getValue: () => appState.transform }).subscribe((transform) => {
            const newRenderedTiles: Record<string, Operation> = {};

            const mapCenterTileOffset = transform.translate
                .divide(tilePixelSize)
                .map(Math.floor /* TODO: Floor OR round? */);

            for (let y = 0; y < tileCount.y; y++) {
                for (let x = 0; x < tileCount.x; x++) {
                    const tileCoords = new Vector(x, y);
                    const tileUri =
                        // TODO: Map server and type provider
                        `${mapZoom}/${tileCoords
                            .add(mapCenterTileXyRound)
                            .subtract(mapCenterTileOffset)
                            .subtract(tileCount.half())
                            .toArray2D()

                            .join('/')}.png`;

                    if (lastRenderedTiles[tileUri]) {
                        newRenderedTiles[tileUri] = lastRenderedTiles[tileUri];
                    } else {
                        const tileArt = new ImageArt(
                            // TODO: Map server and type provider
                            `${mapProvider.href}/${tileUri}`,
                            'Map tile',
                        );

                        tileArt.defaultZIndex = -1;
                        tileArt.setShift(
                            tileCoords
                                .subtract(tileCount.half())
                                .subtract(mapCenterTileXyRoundRemainder)
                                .subtract(mapCenterTileOffset)
                                .multiply(tilePixelSize),
                        );

                        newRenderedTiles[tileUri] = virtualArtVersioningSystem
                            .createPrimaryOperation()
                            .newArts(tileArt)
                            .persist();
                    }
                }
            }

            // console.log({ lastRenderedTiles, newRenderedTiles });

            for (const [tileUri, mapTile] of Object.entries(lastRenderedTiles).filter(
                ([tileUri]) => !newRenderedTiles[tileUri],
            )) {
                // console.log('removing', tileUri);
                /* not await to keep consistency */ mapTile.destroy();
                delete lastRenderedTiles[tileUri];
            }

            lastRenderedTiles = newRenderedTiles;
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

        return new Registration(async () => {
            for (const mapTile of Object.values(lastRenderedTiles)) {
                await mapTile.destroy();
            }
        });
    },
});

/**
 * TODO: !!! TileXy -> Tile
 * TODO: !!! Free tiles from memory
 * TODO: !!! Fillup the screen by tiles (translate+zoom)
 */
