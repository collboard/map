import { Abstract2dArt, classNames, declareModule, ISystems, makeArtModule, React } from '@collboard/modules-sdk';
import { Vector } from 'xyzt';
import { contributors, description, license, repository, version } from '../../package.json';
import { OsmGeojson } from '../geojson/OsmGeojson';
import { SvgGeojsonConverter } from '../geojson/SvgGeojsonConverter';
import { IGeojson } from '../interfaces/IGeojson';

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
    private __svg: JSX.Element;

    public constructor(geojson: OsmGeojson | IGeojson) {
        super();

        if (geojson instanceof OsmGeojson) {
            this.geojson = geojson.geojson;
        } else {
            this.geojson = geojson;
        }

        new SvgGeojsonConverter(this.geojson).makeSvg(1).then((svg) => (this.__svg = svg));
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

    async render(selected: boolean, systems: ISystems) {
        return (
            <div
                className={classNames('art', selected && 'selected')}
                style={{
                    position: 'absolute',
                    left: this.minX - /* !!! svgPadding + */ (this.shift.x || 0),
                    top: this.minY - /* !!! svgPadding + */ (this.shift.y || 0),
                }}
            >
                {this.__svg}
            </div>
        );
    }
}

declareModule(makeArtModule(GeojsonArt));

/**
 * TODO: !!! Optimize rendering probbably by rendering .svg from predetermined URL with pregenerated LODs
 * TODO: !!! Copy XYZT here and back
 * TODO: !!! XYZT Transformation should allow recieve convert/revert pair
 * TODO: On low-zoom level show as dot instead of polygon
 */
