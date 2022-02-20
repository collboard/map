import fetch from 'isomorphic-fetch';
import { IGeojson } from '../interfaces/IGeojson';

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
        const geojson = await response.json();

        // Note: Openstreetmap returns geojson with two features, but strangely theese two features are duplicated
        // !!!geojson.features = [geojson.features[1]];

        return geojson;
    }

    public static async fromCity(city: string): Promise<OsmGeojson> {
        return new OsmGeojson(await this.downloadFromNominatim({ city }));
    }

    public get title() {
        return '!!! TODO';
    }
}

/**
 * TODO: Everstorage should have some util for making cached functions
 * TODO: Liberec is smaller than in real life
 * TODO: Brno is not shown
 */
