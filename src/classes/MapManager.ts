import { AppState, CollSpace, ImageArt, Queue, VirtualArtVersioningSystem } from '@collboard/modules-sdk';
import { Operation } from '@collboard/modules-sdk/types/50-systems/ArtVersionSystem/Operation';
import { Destroyable, IDestroyable } from 'destroyable';
import { forImage, forValueDefined } from 'waitasecond';
import { Transform, Vector } from 'xyzt';
import { MAP_BASE, TILE_COUNT_PADDING, TILE_SIZE } from '../config';
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

        // console.log('pointOnScreen', pointOnScreen);
        // console.log('pointOnBoard', pointOnBoard);
        // console.log('pointAsTile', pointAsTile);
        // console.log({ pointOnScreen, zoom, mapCenterTile, pointOnBoard, pointAsTile });

        return pointAsTile;
    }

    private render(transform: Transform, windowSize: Vector) {
        // console.log(`________________________`);
        // console.log('render');

        const corners = [windowSize.scale(1 - TILE_COUNT_PADDING), windowSize.scale(TILE_COUNT_PADDING)].map((corner) =>
            this.pickTile(corner),
        );

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

        if (createdTiles) {
            this.cleanup();
        }
    }

    private cleanupQueue = new Queue();
    private cleanup() {
        this.cleanupQueue.task(async () => {
            // TODO: !!! Make this work
            await Promise.all(
                Object.getOwnPropertySymbols(this.renderedTiles)
                    .map((s) => this.renderedTiles[s])
                    .map((tileOperation) =>
                        forValueDefined(() => (tileOperation.arts[0 /* TODO: For each */] as ImageArt).element).then(
                            (imageElement) => forImage(imageElement),
                        ),
                    ),
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
 * TODO: !!! Some little shifting on changing tiles in deep zoom level
 * TODO: !!! UX and precision of drawing in all zoom levels
 * TODO: Import MAP_BASE_CENTER only from one place
 * TODO: Some calculations are made inefficiently in a 2D loop instead of once before it
 */
