import {
    Abstract2dArt,
    AsyncContentComponent,
    declareModule,
    ISystems,
    makeArtModule,
    React,
} from '@collboard/modules-sdk';
import { IVectorData, Vector } from 'xyzt';
import { contributors, description, license, repository, version } from '../../package.json';
import { OsmGeojson } from '../geojson/OsmGeojson';
import { SvgGeojsonComponent } from '../geojson/SvgGeojsonComponent';
import { SvgGeojsonConverter } from '../geojson/SvgGeojsonConverter';
import { IGeojson, IGeojsonFeatureCollection } from '../interfaces/IGeojson';
import { ISvgGeojson } from '../interfaces/ISvgGeojson';

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

    // TODO: !!! Probbably delete
    private readonly geojson: IGeojson;

    private __svgGeojson: Promise<ISvgGeojson>;

    public constructor(geojson: OsmGeojson | IGeojsonFeatureCollection) {
        super();

        if (geojson instanceof OsmGeojson) {
            this.geojson = geojson.geojson;
        } else {
            this.geojson = geojson;
        }

        // !!! Remove this.calculateBoundingBox();

        this.__svgGeojson = new SvgGeojsonConverter(this.geojson).makeSvg(1, true);
    }

    /*
    !!! Remove
    private calculateBoundingBox() {
        // TODO: Use here BoundingBox.fromPoints
        this.pointsOnBoard = getAllPointsOf(this.geojson).map((pointAsWgs84) => this.wgs84ToBoard(pointAsWgs84));

        const xVals = this.pointsOnBoard.map((point) => point.x || 0);
        const yVals = this.pointsOnBoard.map((point) => point.y || 0);
        this.minX = Math.min(...xVals);
        this.maxX = Math.max(...xVals);
        this.minY = Math.min(...yVals);
        this.maxY = Math.max(...yVals);
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
    */

    public get topLeft() {
        return new Vector(this.minX, this.minY).add(this.shift);
    }
    public get bottomRight() {
        return new Vector(this.maxX, this.maxY).add(this.shift);
    }
    public get size() {
        return this.bottomRight.subtract(this.topLeft);
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

    public async render(selected: boolean, systems: ISystems) {
        // [*] TODO: Do this optimalizations in AsyncContentComponent
        // [*] if (!(this.__svgGeojson instanceof Promise)) {
        // [*]     return <SvgGeojsonComponent {...{ selected, ...(this.__svgGeojson as ISvgGeojson) }} />;
        // [*] } else {
        return (
            <AsyncContentComponent
                alt="Generating SVG map"
                content={this.__svgGeojson.then((geojsonSvg) => {
                    // [*] this.__svgGeojson = geojsonSvg;

                    const { minX, maxX, minY, maxY } = geojsonSvg.boundingBox;
                    Object.assign(this, { minX, maxX, minY, maxY });

                    return <SvgGeojsonComponent {...{ selected, ...geojsonSvg }} />;
                })}
            />
        );
        // [*] }
    }
}

declareModule(makeArtModule(GeojsonArt));

/**
 * TODO: !!! Optimize rendering probbably by rendering .svg from predetermined URL with pregenerated LODs
 * TODO: !!! Copy XYZT here and back
 * TODO: !!! XYZT Transformation should allow recieve convert/revert pair
 * TODO: On low-zoom level show as dot instead of polygon
 */
