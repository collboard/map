/// <reference path="./elements.d.ts" />
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { Vector } from 'xyzt';
import { version } from '../../package.json';
import { MAP_BASE, TILE_SIZE } from '../config';
import { IGeojsonFeatureCollection, IGeojsonSimplePolygon } from '../interfaces/IGeojson';
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

        // TODO: !!! Better name and move into config
        const GEOJSON_SVG_SCALE = 0.1;
        const GEOJSON_SVG_PADDING = 5;

        const degradation = 0.001 / z; // Math.pow(2, z * 5);

        // console.log({ degradation });

        // TODO: !!! Use simplifyForTransform
        const simplifiedGeojson = this.simplifiedGeojson.simplify(degradation);

        const boundingBox = { minX: this.minX, maxX: this.maxX, minY: this.minY, maxY: this.maxY };
        const size = new Vector(
            (this.maxX - this.minX) * GEOJSON_SVG_SCALE + 2 * GEOJSON_SVG_PADDING,
            (this.maxY - this.minY) * GEOJSON_SVG_SCALE + 2 * GEOJSON_SVG_PADDING,
        );

        const element = (
            <svg
                viewBox={`0 0 ${size.x} ${size.y}`}
                width={size.x}
                height={size.y}
                /*  width="1000" /* <- TODO: Maybe use + Some configurable ratio */
                /* TODO: Prevent width="NaN" height="NaN" */
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

                {simplifiedGeojson.simplePolygons.map((feature, i) => (
                    <polygon
                        key={i}
                        points={getAllPointsOf(feature)
                            .map((pointAsWgs84) => {
                                return this.wgs84ToBoard(pointAsWgs84)
                                    .subtract(
                                        new Vector(
                                            this.minX - GEOJSON_SVG_PADDING / z,
                                            this.minY - GEOJSON_SVG_PADDING / z,
                                        ),
                                    )
                                    .scale(GEOJSON_SVG_SCALE)
                                    .toArray2D();
                                // TODO: Optimize numbers as in https://www.svgviewer.dev/svg-to-png
                            })
                            .join(' ')}
                        onClick={() => {
                            // TODO: Tell the region that the user clicked on it
                        }}
                        onMouseEnter={(event) => {
                            // TODO: Tell the region that the user hoovered on it
                            // + add  onMouseLeave={(event) => {
                        }}
                        {...SvgGeojsonConverter.getSvgPropsFromPolygon(feature)}
                    />
                ))}
            </svg>
        );

        if (!isAsUrl) {
            return {
                padding: GEOJSON_SVG_PADDING / z,
                boundingBox,
                element,
            };
        } else {
            const svgString = ReactDOMServer.renderToStaticMarkup(element);
            const src = await blobToDataUrl(new Blob([svgString], { type: 'image/svg+xml' }));

            return {
                padding: GEOJSON_SVG_PADDING / z,
                boundingBox,
                src,
            };
        }
    }

    private static getSvgPropsFromPolygon(feature: IGeojsonSimplePolygon): Partial<JSX.IntrinsicElements['polygon']> {
        let stroke = '#009edd';

    
        if (feature.properties?.category === 'waterway') {
            stroke = '#4455ff';
        }

        return {
            stroke,
            fill: 'none',
            strokeWidth: (5 * 6) / (feature.properties?.place_rank || 5),
            vectorEffect: 'non-scaling-stroke',
            strokeLinejoin: 'round',

            // filter="url(#dilate-and-xor)"
            /*
            <filter id="dilate-and-xor">
                {/* TODO: Filters can be used also for special effects/texturing for FreehandArt * /}
                <feMorphology in="SourceGraphic" result="dilate-result" operator="dilate" radius={2 / z} />
                <feComposite in="SourceGraphic" in2="dilate-result" result="xor-result" operator="xor" />
            </filter>
            */
        };
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
