import { IDeepmultiArray } from '../utils/unwrapDeepsingleArray';

export type IGeojson = IGeojsonFeatureCollection | IGeojsonFeature | IGeojsonPolygon | IGeojsonSimplePolygon;

export interface IGeojsonFeatureCollection extends IGeojsonEntity<'FeatureCollection'> {
    features: IGeojsonFeature[];
}

export interface IGeojsonFeature extends IGeojsonEntity<'Feature'> {
    geometry: IGeojsonSimplePolygon | IGeojsonPolygon;
}

export interface IGeojsonPolygon extends IGeojsonEntity<'Polygon' | 'MultiPolygon'> {
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
}

export type latitude = number;
export type longitude = number;
export type IGeojsonCoords = [latitude, longitude];

/**
 * TODO: Try to find some more complete interface of GeoJSON
 */
