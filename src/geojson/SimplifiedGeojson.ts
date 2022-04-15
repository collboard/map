/// <reference path="./simplify-geojson.d.ts" />

import simplifyGeojson from 'simplify-geojson';
import { IGeojson, IGeojsonFeatureCollection, IGeojsonSimplePolygon } from '../interfaces/IGeojson';
import { Wgs84 } from '../semantic/Wgs84';
import { pickTitle } from '../utils/pickTitle';
import { getAllPointsOf } from './getAllPointsOf';
import { getAllSimplePolygonsOf } from './getAllSimplePolygonsOf';
import { OsmGeojson } from './OsmGeojson';

/**
 * Note: This class is wrapper around @see https://www.npmjs.com/package/simplify-geojson
 */
export class SimplifiedGeojson {
    private cache: Record<number, SimplifiedGeojson>;

    public readonly originalGeojson: IGeojson;

    public constructor(geojson: OsmGeojson | IGeojsonFeatureCollection, cache?: Record<number, SimplifiedGeojson>) {
        if (geojson instanceof OsmGeojson) {
            this.originalGeojson = geojson.geojson;
        } else {
            this.originalGeojson = geojson;
        }

        if (!cache) {
            // console.log(`SimplifiedGeojson created with fresh cache`);
            this.cache = {};
        } else {
            this.cache = cache;
        }
    }

    /**
     * Simplify geojson by given tolerance and return new SimplifiedGeojson
     * This object will not be modified; only cache is shared between both objects
     *
     * @param tolerance is number in degrees (e.g. lat/lon distance). 1 degree is roughly equivalent to 69 miles. the default is 0.001, which is around a city block long.
     */
    public simplify(tolerance: number): SimplifiedGeojson {
        // TODO: Minimal tolerance should be 0.001
        // TODO: Round tolerance to some level across deep zooms
        if (!this.cache[tolerance]) {
            this.cache[tolerance] = new SimplifiedGeojson(
                // TODO: !!! Share cache
                simplifyGeojson(this.originalGeojson, tolerance),
                this.cache,
            );
        }

        return this.cache[tolerance];
    }

    public get title(): string {
        return pickTitle(
            ...((this.originalGeojson as IGeojsonFeatureCollection).features
                .map((feature) => feature?.properties?.display_name)
                .filter((title) => title) as string[]),
        );
    }

    public get description(): string {
        // TODO: !!! Better description
        return `Geojson of ${this.title}`;
    }

    get simplePolygons(): IGeojsonSimplePolygon[] {
        // TODO: Cache
        return getAllSimplePolygonsOf(this.originalGeojson);
    }

    get points(): Wgs84[] {
        // TODO: Cache
        return getAllPointsOf(this.originalGeojson);
    }

    /*
    TODO
    get boundingBox(): IBoundingBox {
        // TODO: Cache
        // TODO: Use here internal materialized this.geojson`s information about bounding box
        // TODO: getBoundingBoxOf
        this.pointsOnBoard = getAllPointsOf(this.geojson).map((pointAsWgs84) => this.wgs84ToBoard(pointAsWgs84));
        const xVals = this.pointsOnBoard.map((point) => point.x || 0);
        const yVals = this.pointsOnBoard.map((point) => point.y || 0);
        this.minX = Math.min.apply(null, xVals);
        this.maxX = Math.max.apply(null, xVals);
        this.minY = Math.min.apply(null, yVals);
        this.maxY = Math.max.apply(null, yVals);
    }
    */

    /*
    TODO
    public simplifyForTransform(): IGeojson{
      // Note: Not caching here but in simplify method
    }
    */
}

/**
 * TODO: Pre-cache zoom levels
 */
