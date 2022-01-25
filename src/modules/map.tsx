import { declareModule, ImageArt } from '@collboard/modules-sdk';
import { Operation } from '@collboard/modules-sdk/types/50-systems/ArtVersionSystem/Operation';
import { Registration } from 'destroyable';
import { Vector } from 'xyzt';
import helloWorldIcon from '../../assets/hello-world-icon.png';
import { contributors, description, license, repository, version } from '../../package.json';
import { MAP_BASE_ZOOM, MAP_PROVIDER, TILE_COUNT_PADDING, TILE_SIZE } from '../config';
import { TileOnScreen } from '../semantic/TileOnScreen';
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

        // TODO: Observe appState.windowSize
        const sizeOfScreenInTiles = new TileOnScreen(
            appState.windowSize.divide(TILE_SIZE).scale(TILE_COUNT_PADDING).map(Math.ceil),
        );

        let lastRenderedTiles: Record<string, Operation> = {};

        //const mapCenterTile = Tile.fromWgs84(MAP_BASE_CENTER);
        //const mapCenterTileRound = mapCenterTile.map(Math.floor /* TODO: Floor OR round? */);
        //const mapCenterTileRoundRemainder = mapCenterTile.subtract(mapCenterTileRound);

        observeByHeartbeat({ getValue: () => appState.transform })
            // TODO: Debounce by some distance value
            .subscribe((transform) => {
                const newRenderedTiles: Record<string, Operation> = {};

                for (let y = 0; y < sizeOfScreenInTiles.y; y++) {
                    for (let x = 0; x < sizeOfScreenInTiles.x; x++) {
                        const tileOnScreen = new TileOnScreen(new Vector(x, y).subtract(sizeOfScreenInTiles.half()));

                        const { tile, remainder: tileRemainder } = tileOnScreen.toTile(transform);

                        const tileUri =
                            // TODO: Map server and type provider
                            `${MAP_BASE_ZOOM}/${tile.toArray2D().join('/')}.png`;

                        if (lastRenderedTiles[tileUri]) {
                            newRenderedTiles[tileUri] = lastRenderedTiles[tileUri];
                        } else {
                            const tileArt = new ImageArt(
                                // TODO: Map server and type provider
                                `${MAP_PROVIDER.href}/${tileUri}`,
                                'Map tile',
                            );

                            tileArt.defaultZIndex = -1;
                            tileArt.setShift(
                                tileOnScreen.subtract(tileRemainder).multiply(TILE_SIZE).subtract(transform.translate),
                            );

                            newRenderedTiles[tileUri] = virtualArtVersioningSystem
                                .createPrimaryOperation()
                                .newArts(tileArt)
                                .persist();
                        }
                    }
                }
                // console.log(Object.keys(lastRenderedTiles).length, Object.keys(newRenderedTiles).length);
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
 * TODO: !!! Fillup the screen by tiles (translate+zoom)
 */
