import { AppState, CollSpace, Queue, VirtualArtVersioningSystem } from '@collboard/modules-sdk';
import { Operation } from '@collboard/modules-sdk/types/50-systems/ArtVersionSystem/Operation';
import { Destroyable, IDestroyable } from 'destroyable';
import { forAllImagesInElement, forTime } from 'waitasecond';
import { Transform, Vector } from 'xyzt';
import { MAP_BASE, TILE_SIZE } from '../config';
import { TileAbsolute } from '../semantic/TileAbsolute';
import { Wgs84 } from '../semantic/Wgs84';
import { iterateTiles } from '../utils/iterateTiles';
import { observeByHeartbeat } from '../utils/observeByHeartbeat';
import { TileProvider } from './TileProvider';

export class MapManager extends Destroyable implements IDestroyable {
    private primaryTiles: Record<symbol, Operation> = {};
    private renderedTiles: Record<symbol, Operation> = {};

    constructor(
        // TODO: !!! Reorder parameters - maybe full options
        private readonly tileProvider: TileProvider,
        private readonly appState: AppState,
        private readonly collSpace: CollSpace,
        private readonly virtualArtVersioningSystem: VirtualArtVersioningSystem,
    ) {
        super();

        observeByHeartbeat({ getValue: () => appState.transform })
            // TODO: Debounce by some distance value
            .subscribe((transform) => {
                this.render(transform, appState.windowSize);
            });

        // TODO: Observe appState.windowSize

        /*
        (async () => {
            await forEver();
            while (true) {
                await forTime(1000);
                console.log(
                    'Currently rendered tiles',
                    Array.from(document.querySelectorAll(`img[src^='https://tile-']`)).length,
                );
            }
        })();
        */
    }

    private pickTile(pointOnScreen: Vector /* TODO: Pixels*/): TileAbsolute {
        // TODO: !!! Optimize this

        const zoom = Math.ceil(Math.log2(this.appState.transform.scale.x) + MAP_BASE.z);

        const mapCenterTile = TileAbsolute.fromWgs84(new Wgs84(MAP_BASE.x, MAP_BASE.y, zoom));

        const pointOnBoard = this.collSpace.pickPoint(pointOnScreen).point;
        const pointAsTile = new TileAbsolute(
            pointOnBoard
                .divide(TILE_SIZE.scale(Math.pow(2, MAP_BASE.z - zoom)))
                .add(mapCenterTile)
                .rearrangeAxis(([x, y, z]) => [x, y, zoom]),
        );

        //console.log('pointOnScreen', pointOnScreen);
        //console.log('pointOnBoard', pointOnBoard);
        console.log('pointAsTile', pointAsTile);
        //console.log({ pointOnScreen, zoom, mapCenterTile, pointOnBoard, pointAsTile });

        return pointAsTile;
    }

    private render(transform: Transform, windowSize: Vector) {
        console.log(`________________________`);
        // console.log('render');

        // TODO: !!! Variabile sizeOfScreenInTiles
        // TODO: !!! Where is the exact center of the screen in tiles?

        /*
        const { tile } = TileUnique.fromAbsolute(new TileRelative(0, 0, 0).toTile(transform));
        const tileSize = TILE_SIZE.scale(Math.pow(2, MAP_BASE.z - tile.z));

        console.log(tileSize, TILE_SIZE);

        const sizeOfScreenInTiles = new TileRelative(
            windowSize.divide(TILE_SIZE).scale(TILE_COUNT_PADDING).map(Math.ceil),
        );
        */

        const corners = [Vector.zero(), windowSize].map((corner) => this.pickTile(corner));
        // TODO: !!! Use instead of TILE_COUNT_PADDING
        //const p = 0.6;
        //const corners = [windowSize.scale(1 - p), windowSize.scale(p)].map((corner) => this.pickTile(corner));

        /*
        !!! Remove
        console.log(Array.from(iterateTiles(...corners)).length);
        */

        /*
        !!! Remove
        for (const tile of iterateTilesCorners(...corners)) {
            console.log(tile);
            this.virtualArtVersioningSystem
                .createPrimaryOperation()
                .newArts(this.tileProvider.createTileArt(tile))
                .persist();
        }
        */

        /*
        !!! Remove
        for (const tile of [
            new TileUnique(this.pickTile(Vector.zero()).map(Math.round)),
            new TileUnique(this.pickTile(windowSize.scale(0.6)).map(Math.round)),
        ]) {
            this.virtualArtVersioningSystem
                .createPrimaryOperation()
                .newArts(this.tileProvider.createTileArt(tile))
                .persist();
        }
        */

        let createdTiles = 0;
        this.primaryTiles = {};
        for (const tile of iterateTiles(...corners)) {
            if (!this.renderedTiles[tile.uniqueKey]) {
                createdTiles++;
                this.renderedTiles[tile.uniqueKey] = this.virtualArtVersioningSystem
                    .createPrimaryOperation()
                    .newArts(this.tileProvider.createTileArt(tile))
                    .persist();
            }

            this.primaryTiles[tile.uniqueKey] = this.renderedTiles[tile.uniqueKey];
        }

        // console.log('createdTiles', createdTiles);

        if (createdTiles) {
            this.cleanup();
        }
    }

    private cleanupQueue = new Queue();
    private cleanup() {
        this.cleanupQueue.task(async () => {
            // console.log('cleanup');
            await Promise.all(
                // TODO: Filter here only primaryTiles
                Array.from(document.querySelectorAll(`img[src^='https://tile-']`)).map(async (imageElement) => {
                    // TODO: Better loaded detection - seems forAllImagesInElement not working perfectly for one image element
                    await forAllImagesInElement(imageElement as HTMLImageElement);
                    await forTime(1000);
                }),
            );

            // console.log('cleanup performing');

            for (const tileUniqueKey of Object.getOwnPropertySymbols(this.renderedTiles)) {
                if (this.primaryTiles[tileUniqueKey]) {
                    continue;
                }

                // console.log('removing', tileUrl);
                await this.renderedTiles[tileUniqueKey].destroy();
                delete this.renderedTiles[tileUniqueKey];
            }
        });
    }

    public async destroy() {
        await super.destroy();

        for (const tileUniqueKey of Object.getOwnPropertySymbols(this.renderedTiles)) {
            await this.renderedTiles[tileUniqueKey].destroy();
        }
    }
}

/**
 * TODO: !!! Fillup the screen by tiles (translate+zoom)
 * TODO: !!! Import MAP_BASE_CENTER only from one place
 * TODO: Some calculations are made inefficiently in a 2D loop instead of once before it
 */
