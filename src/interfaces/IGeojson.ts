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
    category?:
        | 'boundary'
        | 'waterway'
        | string /* TODO: constraint here all cathegories @see https://www.google.com/search?q=geojson+properties+category+waterway&sxsrf=ALiCzsZC6aqTLzF_xUCl8qszYyIGBOFxZg%3A1652542964605&ei=9M1_YpTVJITnkgWrvbyQDA&ved=0ahUKEwiUn4ajqt_3AhWEs6QKHaseD8IQ4dUDCA4&uact=5&oq=geojson+properties+category+waterway&gs_lcp=Cgdnd3Mtd2l6EAMyBQghEKABOgcIIxCwAxAnOgcIABBHELADOggIIRAWEB0QHjoHCCEQChCgAUoECEEYAEoECEYYAFB-WJYcYM4eaAFwAXgAgAGbAYgBvAaSAQM4LjGYAQCgAQHIAQnAAQE&sclient=gws-wiz */;

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
