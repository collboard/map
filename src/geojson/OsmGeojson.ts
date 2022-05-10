// !!!! Not working in Colldev> import fetch from 'isomorphic-fetch';
import { IGeojsonFeatureCollection } from '../interfaces/IGeojson';

export class OsmGeojson {
    protected constructor(public readonly geojson: IGeojsonFeatureCollection) {}

    public static createSearchUrl(params: Record<string, string>): URL {
        const url = new URL(`https://nominatim.openstreetmap.org/search`);

        url.searchParams.set('format', 'geojson');
        url.searchParams.set('polygon_geojson', '1');

        for (const [key, value] of Object.entries(params)) {
            url.searchParams.set(key, value);
        }

        return url;
    }

    public static async search(params: Record<string, string>): Promise<OsmGeojson> {
        const url = this.createSearchUrl(params);

        const response = await fetch(url.href);
        const geojson = (await response.json()) as IGeojsonFeatureCollection;

        // ------
        // Note: Picking only features of geometry type Polygon
        geojson.features = geojson.features.filter(
            (feature) => feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon',
        );
        // ------

        // ------
        // Problem: Openstreetmap returns geojson with two features, but strangely theese two features are duplicated
        //          OR There can be more features in geojson - like Praha, capital of the Czech Republic vs. Praha, small village in Slovakia
        // Solution: Picking the best one (vs. picking the first one) (vs. picking all)
        geojson.features = geojson.features.splice(0, 1);

        /*
        // Solution: Remove duplicated features by comparing its bounding boxes and choose only first of each unique
        // TODO: Maybe to separate util
        geojson.features = geojson.features.reduce((uniqueFeatures, feature) => {
            const uniqueFeature = uniqueFeatures.find(
                (uniqueFeature2) =>
                    uniqueFeature2.geometry.type === feature.geometry.type &&
                    uniqueFeature2.bbox?.join(',') === feature.bbox?.join(','),
            );

            if (!uniqueFeature) {
                uniqueFeatures.push(feature);
            }

            return uniqueFeatures;
        }, [] as IGeojsonFeatureCollection['features']);
        */
        // -------

        return new OsmGeojson(geojson);
    }

    /*
    Note: using more universal search
    public static async fromCity(city: string): Promise<OsmGeojson> {
        return new OsmGeojson(await this.search({ city }));
    }
    */

    /*
    TODO: !!! Remove
    public static fromData(geojson: IGeojson): OsmGeojson {
        return new OsmGeojson(geojson);
    }
    */

    public get title() {
        return '!!! TODO';
    }
}

/**
 * TODO: Probbably better name than OsmGeojson because data can be also from other sources than OpenStreetMap
 * TODO: Everstorage should have some util for making cached functions
 * TODO: Liberec is smaller than in real life
 * TODO: Brno is not shown
 */
