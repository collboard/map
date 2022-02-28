import React from 'react';
import { Vector } from 'xyzt';
import { MAP_BASE, TILE_SIZE } from '../config';
import { IGeojson } from '../interfaces/IGeojson';
import { TileAbsolute } from '../semantic/TileAbsolute';
import { Wgs84 } from '../semantic/Wgs84';
import { getAllPointsOf } from '../utils/getAllPointsOf';
import { SimplifiedGeojson } from './SimplifiedGeojson';

export class SvgGeojsonConverter {
    private pointsOnBoard: Vector[] = [];
    private minX: number = 0;
    private maxX: number = 0;
    private minY: number = 0;
    private maxY: number = 0;

    private readonly simplifiedGeojson: SimplifiedGeojson;

    public constructor(geojson: IGeojson) {
        this.simplifiedGeojson = new SimplifiedGeojson(geojson);
    }

    private calculateBoundingBox() {
        // TODO: Use here BoundingBox.fromPoints
        this.pointsOnBoard = this.simplifiedGeojson.points.map((pointAsWgs84) => this.wgs84ToBoard(pointAsWgs84));

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

    public async makeSvg(z: number) {
        this.calculateBoundingBox();

        const svgPadding = 5 / z;

        const degradation = 0.001 / z; // Math.pow(2, z * 5);

        // TODO: !!! Use simplifyForTransform
        const simplifiedGeojson = this.simplifiedGeojson.simplify(degradation);

        return (
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
                        // !!! Dynamic size in SVG
                        strokeWidth={(3 + Math.random()) / z}
                        fill="none"
                        strokeLinejoin="round"
                        vectorEffect="non-scaling-stroke"
                        // filter="url(#dilate-and-xor)"
                    />
                ))}
            </svg>
        );
    }
}

/**
 * TODO: !!! DRY+Use this in GeojsonArt
 */
