import { Abstract2dArt, classNames, declareModule, React, string_url } from '@collboard/modules-sdk';
import { Vector } from 'xyzt';
import { contributors, description, license, repository, version } from '../../package.json';
import { MAP_BASE, TILE_SIZE } from '../config';
import { Pixels } from '../semantic/Pixels';
import { TileAbsolute } from '../semantic/TileAbsolute';
import { TileUnique } from '../semantic/TileUnique';
import { Wgs84 } from '../semantic/Wgs84';

export const SVG_PADDING = 10;
export const IS_NEAR_DISTANCE = 20;

export class MapTileArt extends Abstract2dArt {
    public static serializeName = 'MapTileArt';
    public static manifest = {
        name: '@collboard/map-tile-art',
        contributors,
        description,
        license,
        repository,
        version,
    };

    public get size(): Pixels {
        return this._tileSize;
    }
    public set size(size: Pixels) {
        throw new Error(`Can not set size of MapTileArt.`);
    }

    public get topLeftCorner(): Vector {
        return this._topLeftCorner;
    }
    public set topLeftCorner(topLeftCorner: Vector) {
        throw new Error(`Can not set topLeftCorner of MapTileArt.`);
    }

    public get bottomRightCorner(): Vector {
        return this._bottomRightCorner;
    }
    public set bottomRightCorner(bottomRightCorner: Vector) {
        throw new Error(`Can not set bottomRightCorner of MapTileArt.`);
    }

    public readonly _tileSize: Pixels;
    public readonly _tileAbsolute: TileAbsolute;
    public readonly _topLeftCorner: Vector;
    public readonly _bottomRightCorner: Vector;

    public constructor(tile: TileUnique, private readonly _tileUrl: string_url) {
        super();

        console.log('Constructor of MapTileArt');
        console.log('tile', tile);

        this._tileAbsolute = new TileAbsolute(
            tile.subtract(
                TileAbsolute.fromWgs84(
                    new Wgs84({
                        ...MAP_BASE,
                        z: tile.z,
                    }),
                ),
            ),
        );

        console.log('this.tileAbsolute', this._tileAbsolute);

        this._tileSize = new Pixels(TILE_SIZE.scale(Math.pow(2, MAP_BASE.z - tile.z)));
        this._shift = this._tileAbsolute.multiply(this._tileSize);

        this._topLeftCorner = this._shift.add(this._tileSize.half());
        this._bottomRightCorner = this._shift.subtract(this._tileSize.half());

        console.log('this.shift', this._shift);
    }

    public get acceptedAttributes(): never[] {
        return [];
    }

    public isNear() {
        return false;
    }

    render() {
        console.log('Render of MapTileArt');

        /* !!!
        return (
            <div
                className={classNames('art')}
                style={{
                    position: 'absolute',
                    zIndex: 1,

                    left: 500,
                    top: 500,
                }}
            >
                aaa
            </div>
        );
        */

        return (
            <div
                className={classNames('art')}
                style={{
                    position: 'absolute',
                    zIndex: -1,

                    left: this._shift.x,
                    top: this._shift.y,
                }}
            >
                <img src={this._tileUrl} width={this._tileSize.x} height={this._tileSize.y} />

                {/* TODO: Just img with shared css class */}
            </div>
        );
    }
}
declareModule({
    manifest: {
        ...MapTileArt.manifest,
        supports: {
            art: MapTileArt.serializeName,
        },
    },
    async setup(systems) {
        const { artSerializer } = await systems.request('artSerializer');
        // @deprecated DO not need to pass artSerializeRule,
        return artSerializer.registerRule({
            name: MapTileArt.serializeName,
            // class: MapTileArt,
            serialize: () => {
                throw new Error('MapTileArt can not be serialized');
                // return new MapTileArt(tile)
            },
        });
    },
});

/*
declareModule(
    makeMultiModule({
        modules: [
            makeArtModule(MapTileArt),
            {
                async setup(systems) {
                    const { artSerializer } = await systems.request('artSerializer');

                    return Registration.void();
                    // TODO: !!!

                    return Registration.join(
                        artSerializer.registerRule({
                            name: 'Pixels',
                            class: Pixels,
                            deserialize: (data: any) => new Pixels(data.x, data.y, data.z),
                        }),
                        artSerializer.registerRule({
                            name: 'TileAbsolute',
                            class: TileAbsolute,
                            deserialize: (data: any) => new TileAbsolute(data.x, data.y, data.z),
                        }),
                        artSerializer.registerRule({
                            name: 'TileRelative',
                            class: TileRelative,
                            deserialize: (data: any) => new TileRelative(data.x, data.y, data.z),
                        }),
                        artSerializer.registerRule({
                            name: 'TileUnique',
                            class: TileUnique,
                            deserialize: (data: any) => new TileUnique(data.x, data.y, data.z),
                        }),
                        artSerializer.registerRule({
                            name: 'Wgs84',
                            class: Wgs84,
                            deserialize: (data: any) => new Wgs84(data.x, data.y, data.z),
                            // TODO: For Wgs84 Maybe serialize with latitude, longitude, zoom
                        }),
                    );
                },
            },
        ],
    }),
);

*/
