import { declareModule, ImageArt } from '@collboard/modules-sdk';
import { Operation } from '@collboard/modules-sdk/types/50-systems/ArtVersionSystem/Operation';
import { Registration } from 'destroyable';
import { Vector } from 'xyzt';
import helloWorldIcon from '../../assets/hello-world-icon.png';
import { contributors, description, license, repository, version } from '../../package.json';
import { MAP_BASE_CENTER, MAP_PROVIDER, TILE_COUNT_PADDING, TILE_SIZE } from '../config';
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

                console.log('______________________');
                for (let y = 0; y < sizeOfScreenInTiles.y; y++) {
                    for (let x = 0; x < sizeOfScreenInTiles.x; x++) {
                        const tileOnScreen = new TileOnScreen(new Vector(x, y).subtract(sizeOfScreenInTiles.half()));

                        // console.log({ tileOnScreen });

                        const tile = tileOnScreen.toTile(transform);
                        const tileUrl = MAP_PROVIDER.getTileUrl(tile);

                        if (lastRenderedTiles[tileUrl]) {
                            newRenderedTiles[tileUrl] = lastRenderedTiles[tileUrl];
                        } else {
                            const tileArt = new ImageArt(tileUrl, 'Map tile');

                            tileArt.defaultZIndex = -1;
                            tileArt.size = TILE_SIZE.scale(Math.pow(2, MAP_BASE_CENTER.z - tile.z));

                            console.log('size', tileArt.size);
                            console.log('remainder', tile.remainder);

                            tileArt.setShift(
                                tileOnScreen
                                    .subtract(tile.remainder)
                                    .multiply(tileArt.size)
                                    .subtract(transform.translate),
                            );

                            newRenderedTiles[tileUrl] = virtualArtVersioningSystem
                                .createPrimaryOperation()
                                .newArts(tileArt)
                                .persist();
                        }
                    }
                }
                console.log('______________________');

                // console.log(Object.keys(lastRenderedTiles).length, Object.keys(newRenderedTiles).length);
                // console.log({ lastRenderedTiles, newRenderedTiles });

                for (const [tileUrl, mapTile] of Object.entries(lastRenderedTiles).filter(
                    ([tileUrl]) => !newRenderedTiles[tileUrl],
                )) {
                    // console.log('removing', tileUrl);
                    /* not await to keep consistency */ mapTile.destroy();
                    delete lastRenderedTiles[tileUrl];
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
 * TODO: !!! Import MAP_BASE_CENTER only from one place
 * TODO: Some calculations are made inefficiently in a 2D loop instead of once before it
 */
