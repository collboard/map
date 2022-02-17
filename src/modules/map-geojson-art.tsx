import { Abstract2dArt, classNames, declareModule, ISystems, makeArtModule, React } from '@collboard/modules-sdk';
import { IVectorData, Vector } from 'xyzt';
import { contributors, description, license, repository, version } from '../../package.json';
import { SimplifiedGeojson } from '../classes/SimplifiedGeojson';
import { MAP_BASE, TILE_SIZE } from '../config';
import { IGeojson } from '../interfaces/IGeojson';
import { TileAbsolute } from '../semantic/TileAbsolute';
import { Wgs84 } from '../semantic/Wgs84';
import { getAllPointsOf } from '../utils/getAllPointsOf';

export const SVG_PADDING = 10;
export const IS_NEAR_DISTANCE = 20;

export class GeojsonArt extends Abstract2dArt {
    public static serializeName = 'GeojsonArt';
    public static manifest = {
        name: '@collboard/geojson-art',
        contributors,
        description,
        license,
        repository,
        version,
    };

    private pointsOnBoard: Vector[] = [];
    private minX: number = 0;
    private maxX: number = 0;
    private minY: number = 0;
    private maxY: number = 0;

    private readonly __simplifiedGeojson: SimplifiedGeojson;

    public constructor(public readonly geojson: IGeojson /* TODO: TODO: Should it be readonly */) {
        super();
        // TODO: !!! Predegrade to 0.001
        this.__simplifiedGeojson = new SimplifiedGeojson(geojson);
    }

    public get topLeftCorner() {
        return new Vector(this.minX, this.minY).add(this.shift);
    }
    public get bottomRightCorner() {
        return new Vector(this.maxX, this.maxY).add(this.shift);
    }
    public get size() {
        return this.bottomRightCorner.subtract(this.topLeftCorner);
    }

    public get acceptedAttributes() {
        return [];
        // return ['color', 'weight', 'size'];
    }

    /*
    TODO: Maybe implement

    public set size(newSize: Vector) {
        try {
            const scaleX = (newSize.x || 0) / (this.maxX - this.minX);
            const scaleY = (newSize.y || 0) / (this.maxY - this.minY);

            this.pointsOnBoard.forEach((point) => {
                point.x = (point.x || 0) * scaleX;
                point.y = (point.y || 0) * scaleY;
            });
            this.calculateBoundingBox();
        } catch (e) {
            this.calculateBoundingBox();
        }
    }
    */

    public isNear(point2: IVectorData) {
        // TODO: Also check if point is inside the polygon
        return (
            this.pointsOnBoard.filter((point) => Vector.add(point, this.shift).distance(point2) <= IS_NEAR_DISTANCE)
                .length > 0
        );
    }

    private calculateBoundingBox() {
        // TODO: Use here SimplifiedGeojson.boundingBox
        this.pointsOnBoard = this.__simplifiedGeojson.points.map((pointAsWgs84) => this.wgs84ToBoard(pointAsWgs84));
        const xVals = this.pointsOnBoard.map((point) => point.x || 0);
        const yVals = this.pointsOnBoard.map((point) => point.y || 0);
        this.minX = Math.min.apply(null, xVals);
        this.maxX = Math.max.apply(null, xVals);
        this.minY = Math.min.apply(null, yVals);
        this.maxY = Math.max.apply(null, yVals);
    }

    private wgs84ToBoard(pointAsWgs84: Wgs84): Vector {
        // TODO: !!! To global utils
        const mapCenterTile = TileAbsolute.fromWgs84(MAP_BASE);
        const pointAsTile = TileAbsolute.fromWgs84(
            new Wgs84({ longitude: pointAsWgs84.longitude, latitude: pointAsWgs84.latitude, zoom: MAP_BASE.zoom }),
        );
        const pointOnBoard = pointAsTile.subtract(mapCenterTile).multiply(TILE_SIZE);
        return pointOnBoard;
    }

    async render(selected: boolean, systems: ISystems) {
        this.calculateBoundingBox();

        const { appState } = await systems.request('appState');
        const z = appState.transform.scale.x;

        const degradation = 0.001 / z; //Math.pow(2, z * 5);

        // TODO: !!! Use simplifyForTransform
        const simplifiedGeojson = this.__simplifiedGeojson.simplify(degradation);

        return (
            <div
                className={classNames('art', selected && 'selected')}
                style={{
                    position: 'absolute',
                    left: this.minX - SVG_PADDING + (this.shift.x || 0),
                    top: this.minY - SVG_PADDING + (this.shift.y || 0),
                }}
            >
                {' '}
                {Math.random()}
                <svg
                    // TODO: Maybe use viewBox instead of width+height
                    width={this.maxX - this.minX + 2 * SVG_PADDING}
                    height={this.maxY - this.minY + 2 * SVG_PADDING}
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {simplifiedGeojson.simplePolygons.map((feature, i) => (
                        <polygon
                            key={i}
                            points={getAllPointsOf(feature)
                                .map((pointAsWgs84) => {
                                    return this.wgs84ToBoard(pointAsWgs84)
                                        .subtract(new Vector(this.minX - SVG_PADDING, this.minY - SVG_PADDING))
                                        .toArray2D();
                                })
                                .join(' ')}
                            style={{
                                fill: '#ffcc0022' /* TODO: As Geojson param /+ additional config */,

                                stroke: '#ff4411',
                                strokeWidth: 3 / z /* !!! Make this work */,
                            }}
                            onClick={() => {
                                // TODO: Tell the region that the user clicked on it
                            }}
                            onMouseEnter={(event) => {
                                // TODO: Tell the region that the user hoovered on it
                                // + add  onMouseLeave={(event) => {
                            }}
                        />
                    ))}
                </svg>
            </div>
        );
    }
}

declareModule(makeArtModule(GeojsonArt));

/**
 * TODO: !!! Copy XYZT here and back
 * TODO: !!! XYZT Transformation should allow recieve convert/revert pair
 */
