import { AppState, Queue, VirtualArtVersioningSystem } from '@collboard/modules-sdk';
import { Operation } from '@collboard/modules-sdk/types/50-systems/ArtVersionSystem/Operation';
import { Destroyable, IDestroyable } from 'destroyable';
import { forAllImagesInElement, forTime } from 'waitasecond';
import { Transform, Vector } from 'xyzt';
import { TILE_COUNT_PADDING, TILE_SIZE } from '../config';
import { TileRelative } from '../semantic/TileRelative';
import { TileUnique } from '../semantic/TileUnique';
import { observeByHeartbeat } from '../utils/observeByHeartbeat';
import { TileProvider } from './TileProvider';

export class MapManager extends Destroyable implements IDestroyable {
    private primaryTiles: Record<symbol, Operation> = {};
    private renderedTiles: Record<symbol, Operation> = {};
    private sizeOfScreenInTiles: TileRelative;

    constructor(
        private readonly tileProvider: TileProvider,
        appState: AppState,
        private readonly virtualArtVersioningSystem: VirtualArtVersioningSystem,
    ) {
        super();

        // TODO: Observe appState.windowSize
        this.sizeOfScreenInTiles = new TileRelative(
            appState.windowSize.divide(TILE_SIZE).scale(TILE_COUNT_PADDING).map(Math.ceil),
        ); // new Vector(2, 2);

        // const mapCenterTile = Tile.fromWgs84(MAP_BASE_CENTER);
        // const mapCenterTileRound = mapCenterTile.map(Math.floor /* TODO: Floor OR round? */);
        // const mapCenterTileRoundRemainder = mapCenterTile.subtract(mapCenterTileRound);

        observeByHeartbeat({ getValue: () => appState.transform })
            // TODO: Debounce by some distance value
            .subscribe((transform) => {
                this.render(transform);
            });

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

    private render(transform: Transform) {
        // console.log('render');

        let createdTiles = 0;
        this.primaryTiles = {};
        for (let y = 0; y < this.sizeOfScreenInTiles.y; y++) {
            for (let x = 0; x < this.sizeOfScreenInTiles.x; x++) {
                const tileOnScreen = new TileRelative(new Vector(x, y).subtract(this.sizeOfScreenInTiles.half()));
                const { tile } = TileUnique.fromAbsolute(tileOnScreen.toTile(transform));
                if (!this.renderedTiles[tile.uniqueKey]) {
                    createdTiles++;
                    this.renderedTiles[tile.uniqueKey] = this.virtualArtVersioningSystem
                        .createPrimaryOperation()
                        .newArts(this.tileProvider.createTileArt(tile))
                        .persist();
                }

                this.primaryTiles[tile.uniqueKey] = this.renderedTiles[tile.uniqueKey];
            }
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
