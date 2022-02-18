import { Abstract2dArt, classNames, declareModule, ISystems, makeArtModule, React } from '@collboard/modules-sdk';
import { IVectorData, Vector } from 'xyzt';
import { contributors, description, license, repository, version } from '../../package.json';
import { SimplifiedGeojson } from '../classes/SimplifiedGeojson';
import { MAP_BASE, TILE_SIZE } from '../config';
import { IGeojson } from '../interfaces/IGeojson';
import { TileAbsolute } from '../semantic/TileAbsolute';
import { Wgs84 } from '../semantic/Wgs84';
import { getAllPointsOf } from '../utils/getAllPointsOf';

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
        return false;
        /* TODO:
        // TODO: Also check if point is inside the polygon
        return (
            this.pointsOnBoard.filter((point) => Vector.add(point, this.shift).distance(point2) <= IS_NEAR_DISTANCE)
                .length > 0
        );
        */
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
        const svgPadding = 5 / z;

        const degradation = 0.001 / z; //Math.pow(2, z * 5);

        // TODO: !!! Use simplifyForTransform
        const simplifiedGeojson = this.__simplifiedGeojson.simplify(degradation);

        return (
            <div
                className={classNames('art', selected && 'selected')}
                style={{
                    position: 'absolute',
                    left: this.minX - svgPadding + (this.shift.x || 0),
                    top: this.minY - svgPadding + (this.shift.y || 0),
                }}
            >
                <svg
                    // TODO: Maybe use viewBox instead of width+height
                    width={this.maxX - this.minX + 2 * svgPadding}
                    height={this.maxY - this.minY + 2 * svgPadding}
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {/*
                    <filter id="dilate-and-xor">
                        {/* TODO: Filters can be used also for special effects/texturing for FreehandArt * /}
                        <feMorphology in="SourceGraphic" result="dilate-result" operator="dilate" radius={2 / z} />
                        <feComposite in="SourceGraphic" in2="dilate-result" result="xor-result" operator="xor" />
                    </filter>
                    */}
                    {simplifiedGeojson.simplePolygons.map((feature, i) => (
                        <polygon
                            key={i}
                            points={getAllPointsOf(feature)
                                .map((pointAsWgs84) => {
                                    return this.wgs84ToBoard(pointAsWgs84)
                                        .subtract(new Vector(this.minX - svgPadding, this.minY - svgPadding))
                                        .toArray2D();
                                })
                                .join(' ')}
                            onClick={() => {
                                // TODO: Tell the region that the user clicked on it
                            }}
                            onMouseEnter={(event) => {
                                // TODO: Tell the region that the user hoovered on it
                                // + add  onMouseLeave={(event) => {
                            }}
                            stroke="red"
                            strokeWidth={3 / z}
                            fill="none"
                            strokeLinejoin="round"
                            // filter="url(#dilate-and-xor)"
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
 * TODO: On low-zoom level show as dot instead of polygon
 */
