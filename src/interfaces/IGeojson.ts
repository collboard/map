import { IDeepmultiArray } from './IDeepmultiArray';

export type IGeojson = IGeojsonFeatureCollection | IGeojsonFeature | IGeojsonPolygon | IGeojsonSimplePolygon;

export interface IGeojsonFeatureCollection extends IGeojsonEntity<'FeatureCollection'> {
    features: IGeojsonFeature[];

    /**
     * Additional information from Collboard
     */
    collboard?: any;
}

export interface IGeojsonFeature extends IGeojsonEntity<'Feature'> {
    bbox?: number[];
    geometry: IGeojsonSimplePolygon | IGeojsonPolygon;
}

export interface IGeojsonPolygon
    extends IGeojsonEntity<
        | 'Point'
        | 'Polygon'
        | 'MultiPolygon'
        | 'LineString'
        | 'MultiLineString' /*  TODO: [🎽] Add support for all entity types @see https://www.ibm.com/docs/en/db2/11.5?topic=formats-geojson-format */
    > {
    coordinates: IDeepmultiArray<IGeojsonCoords>;
}

/**
 * Note: ...
 *
 * Every IGeojsonSimplePolygon is also IGeojsonPolygon.
 */
export interface IGeojsonSimplePolygon extends IGeojsonEntity<'Polygon'> {
    coordinates: IGeojsonCoords[];
}

export interface IGeojsonEntity<TType extends string> {
    type: TType;
    properties?: IGeojsonProperties;
    // TODO: Originally here was "name: string;" but it was removed in favor of "properties.name: string;"
}

export interface IGeojsonProperties {
    [key: string]: number | string | null | undefined;
    id?: number | string | null;
    type?: string;
    value?: number | null;
    name?: string;

    // From OpenStreetMap
    place_id?: number;
    osm_type?: 'node' | 'way' | 'relation';
    osm_id?: number;
    display_name?: string;
    place_rank?: number;
    category?: string;

    /**
     * Range <0;1>
     */
    importance?: number;
    icon?: string /*_url*/;
}

export type latitude = number;
export type longitude = number;
export type IGeojsonCoords = [latitude, longitude];

/**
 * TODO: Try to find some more complete interface of GeoJSON
 */
