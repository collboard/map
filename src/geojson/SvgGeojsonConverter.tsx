/// <reference path="./elements.d.ts" />
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { Vector } from 'xyzt';
import { version } from '../../package.json';
import { MAP_BASE, TILE_SIZE } from '../config';
import { IGeojsonFeatureCollection } from '../interfaces/IGeojson';
import { ISvgGeojson } from '../interfaces/ISvgGeojson';
import { TileAbsolute } from '../semantic/TileAbsolute';
import { Wgs84 } from '../semantic/Wgs84';
import { blobToDataUrl } from '../utils/blobToDataUrl';
import { minmax } from '../utils/minmax';
import { getAllPointsOf } from './getAllPointsOf';
import { SimplifiedGeojson } from './SimplifiedGeojson';
export class SvgGeojsonConverter {
    private pointsOnBoard: Vector[] = [];
    private minX: number = 0;
    private maxX: number = 0;
    private minY: number = 0;
    private maxY: number = 0;

    private readonly simplifiedGeojson: SimplifiedGeojson;

    public constructor(geojson: IGeojsonFeatureCollection) {
        this.simplifiedGeojson = new SimplifiedGeojson(geojson);
    }

    private calculateBoundingBox() {
        // TODO: Use here BoundingBox.fromPoints
        this.pointsOnBoard = this.simplifiedGeojson.points.map((pointAsWgs84) => this.wgs84ToBoard(pointAsWgs84));

        const xVals = this.pointsOnBoard.map((point) => point.x || 0);
        const yVals = this.pointsOnBoard.map((point) => point.y || 0);

        const { min: minX, max: maxX } = minmax(xVals);
        const { min: minY, max: maxY } = minmax(yVals);
        this.minX = minX;
        this.maxX = maxX;
        this.minY = minY;
        this.maxY = maxY;
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

    // !!! Maybe not async
    public async makeSvg(z: number, isAsUrl: boolean): Promise<ISvgGeojson> {
        this.calculateBoundingBox();

        const padding = 5 / z;

        const degradation = 0.001 / z; // Math.pow(2, z * 5);

        // console.log({ degradation });

        // TODO: !!! Use simplifyForTransform
        const simplifiedGeojson = this.simplifiedGeojson.simplify(degradation);

        const boundingBox = { minX: this.minX, maxX: this.maxX, minY: this.minY, maxY: this.maxY };
        const element = (
            <svg
                viewBox={`0 0 ${this.maxX - this.minX + 2 * padding} ${this.maxY - this.minY + 2 * padding}`}
                width="1000" /* <- TODO: !!! Some configurable ratio */
                /* TODO: Also height according to ratio + some smart count of reasonable width+height */
                xmlns="http://www.w3.org/2000/svg"
            >
                <>
                    <title>{this.simplifiedGeojson.title}</title>
                    <desc>{this.simplifiedGeojson.description}</desc>
                    <metadata>
                        {/*
                    TODO: How to put metadata into SVG propperly?
                    TODO: What is the best structure for metadata? (maybe just 1:1 with some json structure)
                    TODO: Probbably use collboard:module xml scope
                    TODO: Probbably define xmlns
                    */}
                        <collboard>
                            <support-module name="@collboard/map-svg-geojson-import" {...{ version }} />
                            {/* TODO: !!! <scale from="1px" to="10km" />*/}
                        </collboard>
                    </metadata>
                </>
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
                                    .subtract(new Vector(this.minX - padding, this.minY - padding))
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
                        stroke="#009edd"
                        // !!! Dynamic size in SVG
                        strokeWidth={(3 + Math.random()) / z + 'px'}
                        fill="none"
                        strokeLinejoin="round"
                        vectorEffect="non-scaling-stroke"
                        // filter="url(#dilate-and-xor)"
                    />
                ))}
            </svg>
        );

        if (!isAsUrl) {
            return {
                padding,
                boundingBox,
                element,
            };
        } else {
            const svgString = ReactDOMServer.renderToStaticMarkup(element);
            const src = await blobToDataUrl(new Blob([svgString], { type: 'image/svg+xml' }));

            return {
                padding,
                boundingBox,
                src,
            };
        }
    }
}

/**
 * TODO: !!! DRY+Use this in GeojsonArt
 * TODO: In makeSvg just return element of recieve format: 'JSX'|'STRING'|'URL'
 * TODO: In makeSvg write overloaded typing
 * TODO: Strip decimal places
 * TODO: Remove OSM specific stuff
 * TODO: Add steganography CLBRD data
 */
