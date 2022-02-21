import fetch from 'isomorphic-fetch';
import { IGeojson, IGeojsonFeatureCollection } from '../interfaces/IGeojson';

export class OsmGeojson {
    protected constructor(public readonly geojson: IGeojson) {}

    protected static async downloadFromNominatim(params: Record<string, string>): Promise<IGeojson> {
        const url = new URL(`https://nominatim.openstreetmap.org/search`);

        url.searchParams.set('country', 'czechia');
        url.searchParams.set('format', 'geojson');
        url.searchParams.set('polygon_geojson', '1');

        for (const [key, value] of Object.entries(params)) {
            url.searchParams.set(key, value);
        }

        const response = await fetch(url.href);
        const geojson = (await response.json()) as IGeojsonFeatureCollection;

        //------
        // Problem: Openstreetmap returns geojson with two features, but strangely theese two features are duplicated
        // Solution: Remove duplicated features by comparing its bounding boxes and choose only first of each unique
        // TODO: Maybe to separate util
        geojson.features = geojson.features.reduce((uniqueFeatures, feature) => {
            const uniqueFeature = uniqueFeatures.find(
                (uniqueFeature) =>
                    uniqueFeature.geometry.type === feature.geometry.type &&
                    uniqueFeature.bbox?.join(',') === feature.bbox?.join(','),
            );

            if (!uniqueFeature) {
                uniqueFeatures.push(feature);
            }

            return uniqueFeatures;
        }, [] as IGeojsonFeatureCollection['features']);
        //-------

        return geojson;
    }

    public static async fromCity(city: string): Promise<OsmGeojson> {
        return new OsmGeojson(await this.downloadFromNominatim({ city }));
    }

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
