import { Abstract2dArt, classNames, declareModule, makeArtModule } from '@collboard/modules-sdk';
import * as React from 'react';
import { IVectorData, Vector } from 'xyzt';
import { contributors, description, license, repository, version } from '../../package.json';
import { mapCenterTileXy, tilePixelSize } from '../config';
import { IGeojson } from '../interfaces/IGeojson';
import { getAllPointsOf } from '../utils/getAllPointsOf';
import { getAllSimplePolygonsOf } from '../utils/getAllSimplePolygonsOf';
import { wgs84ToTileXy } from '../utils/wgs84ToTileXy';

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

    public constructor(public readonly geojson: IGeojson /* TODO: TODO: Should it be readonly */) {
        super();
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
        //return ['color', 'weight', 'size'];
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
        this.pointsOnBoard = getAllPointsOf(this.geojson).map((pointAsWgs84) => this.wgs84ToBoard(pointAsWgs84));
        const xVals = this.pointsOnBoard.map((point) => point.x || 0);
        const yVals = this.pointsOnBoard.map((point) => point.y || 0);
        this.minX = Math.min.apply(null, xVals);
        this.maxX = Math.max.apply(null, xVals);
        this.minY = Math.min.apply(null, yVals);
        this.maxY = Math.max.apply(null, yVals);
    }

    private wgs84ToBoard(pointAsWgs84: Vector): Vector {
        // TODO: More direct way how to convert pointAsWgs84 to pointOnBoard / pointOnScreen - probably use CoordinateSystems
        // TODO: !!! To global utils
        const pointAsTileXy = wgs84ToTileXy(pointAsWgs84);
        const pointOnBoard = pointAsTileXy.subtract(mapCenterTileXy).multiply(tilePixelSize);

        return pointOnBoard;
    }

    render(selected: boolean) {
        this.calculateBoundingBox();

        return (
            <div
                className={classNames('art', selected && 'selected')}
                style={{
                    position: 'absolute',
                    left: this.minX - SVG_PADDING + (this.shift.x || 0),
                    top: this.minY - SVG_PADDING + (this.shift.y || 0),
                }}
            >
                <svg
                    // TODO: Maybe use viewBox instead of width+height
                    width={this.maxX - this.minX + 2 * SVG_PADDING}
                    height={this.maxY - this.minY + 2 * SVG_PADDING}
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {getAllSimplePolygonsOf(this.geojson).map((feature, i) => (
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
                                fill: '#009edd22' /* TODO: As Geojson param /+ additional config */,

                                stroke: 'black',
                                strokeWidth: 1,
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
