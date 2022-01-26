import { declareModule } from '@collboard/modules-sdk';
import { Operation } from '@collboard/modules-sdk/types/50-systems/ArtVersionSystem/Operation';
import { Registration } from 'destroyable';
import { Vector } from 'xyzt';
import helloWorldIcon from '../../assets/hello-world-icon.png';
import { contributors, description, license, repository, version } from '../../package.json';
import { MAP_PROVIDER } from '../config';
import { TileRelative } from '../semantic/TileRelative';
import { TileUnique } from '../semantic/TileUnique';
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
        const sizeOfScreenInTiles = new Vector(1, 1);

        /* !!! new TileRelative(
            appState.windowSize.divide(TILE_SIZE).scale(TILE_COUNT_PADDING).map(Math.ceil),
        );*/

        let lastRenderedTiles: Record<symbol, Operation> = {};

        //const mapCenterTile = Tile.fromWgs84(MAP_BASE_CENTER);
        //const mapCenterTileRound = mapCenterTile.map(Math.floor /* TODO: Floor OR round? */);
        //const mapCenterTileRoundRemainder = mapCenterTile.subtract(mapCenterTileRound);

        observeByHeartbeat({ getValue: () => appState.transform })
            // TODO: Debounce by some distance value
            .subscribe((transform) => {
                const newRenderedTiles: Record<symbol, Operation> = {};

                console.log('______________________');
                for (let y = 0; y < sizeOfScreenInTiles.y; y++) {
                    for (let x = 0; x < sizeOfScreenInTiles.x; x++) {
                        const tileOnScreen = new TileRelative(new Vector(x, y).subtract(sizeOfScreenInTiles.half()));

                        // console.log({ tileOnScreen });

                        const { tile } = TileUnique.fromAbsolute(tileOnScreen.toTile(transform));

                        console.log(tile.uniqueKey);

                        if (lastRenderedTiles[tile.uniqueKey]) {
                            newRenderedTiles[tile.uniqueKey] = lastRenderedTiles[tile.uniqueKey];
                        } else {
                            newRenderedTiles[tile.uniqueKey] = virtualArtVersioningSystem
                                .createPrimaryOperation()
                                .newArts(MAP_PROVIDER.createTileArt(tile))
                                .persist();
                        }
                    }
                }
                console.log('______________________');

                // console.log(Object.keys(lastRenderedTiles).length, Object.keys(newRenderedTiles).length);
                // console.log({ lastRenderedTiles, newRenderedTiles });

                for (const tileUniqueKey of Object.getOwnPropertySymbols(lastRenderedTiles)) {
                    if (newRenderedTiles[tileUniqueKey]) {
                        continue;
                    }

                    // console.log('removing', tileUrl);
                    /* not await to keep consistency */ lastRenderedTiles[tileUniqueKey].destroy();
                    delete lastRenderedTiles[tileUniqueKey];
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
            for (const tileUniqueKey of Object.getOwnPropertySymbols(lastRenderedTiles)) {
                await lastRenderedTiles[tileUniqueKey].destroy();
            }
        });
    },
});

/**
 * TODO: !!! Fillup the screen by tiles (translate+zoom)
 * TODO: !!! Import MAP_BASE_CENTER only from one place
 * TODO: Some calculations are made inefficiently in a 2D loop instead of once before it
 */
