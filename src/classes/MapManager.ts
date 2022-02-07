import { AppState, VirtualArtVersioningSystem } from '@collboard/modules-sdk';
import { Operation } from '@collboard/modules-sdk/types/50-systems/ArtVersionSystem/Operation';
import { Destroyable, IDestroyable } from 'destroyable';
import { Transform, Vector } from 'xyzt';
import { TILE_COUNT_PADDING, TILE_SIZE } from '../config';
import { TileRelative } from '../semantic/TileRelative';
import { TileUnique } from '../semantic/TileUnique';
import { observeByHeartbeat } from '../utils/observeByHeartbeat';
import { TileProvider } from './TileProvider';

export class MapManager extends Destroyable implements IDestroyable {
    private readonly tileProvider = new TileProvider();
    private renderedTiles: Record<symbol, Operation> = {};
    private sizeOfScreenInTiles: TileRelative;

    constructor(appState: AppState, private readonly virtualArtVersioningSystem: VirtualArtVersioningSystem) {
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
    }

    private render(transform: Transform) {
        console.log('render');
        const newRenderedTiles: Record<symbol, Operation> = {};

        // console.log('______________________');
        for (let y = 0; y < this.sizeOfScreenInTiles.y; y++) {
            for (let x = 0; x < this.sizeOfScreenInTiles.x; x++) {
                const tileOnScreen = new TileRelative(new Vector(x, y).subtract(this.sizeOfScreenInTiles.half()));

                // console.log({ tileOnScreen });

                const { tile } = TileUnique.fromAbsolute(tileOnScreen.toTile(transform));

                // console.log(tile.uniqueKey);

                if (this.renderedTiles[tile.uniqueKey]) {
                    newRenderedTiles[tile.uniqueKey] = this.renderedTiles[tile.uniqueKey];
                } else {
                    newRenderedTiles[tile.uniqueKey] = this.virtualArtVersioningSystem
                        .createPrimaryOperation()
                        .newArts(this.tileProvider.createTileArt(tile))
                        .persist();
                }
            }
        }
        // console.log('______________________');

        // console.log(Object.keys(lastRenderedTiles).length, Object.keys(newRenderedTiles).length);
        // console.log({ lastRenderedTiles, newRenderedTiles });

        for (const tileUniqueKey of Object.getOwnPropertySymbols(this.renderedTiles)) {
            if (newRenderedTiles[tileUniqueKey]) {
                continue;
            }


            this.renderedTiles[tileUniqueKey].arts
            const imageElement = document.querySelector(`img[src='${tileArt.src}']`);

            // console.log('removing', tileUrl);
            /* not await to keep consistency */ this.renderedTiles[tileUniqueKey].destroy();
            delete this.renderedTiles[tileUniqueKey];
        }

        this.renderedTiles = newRenderedTiles;
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
