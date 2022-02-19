import { ObjectStorage, PrefixStorage } from 'everstorage';
import { IGeojson } from '../interfaces/IGeojson';
import { SimplifiedGeojson } from './SimplifiedGeojson';

export class OpenstreetmapGeojson extends SimplifiedGeojson {
    private static storage = new ObjectStorage(/*<IGeojson>*/ new PrefixStorage(localStorage, 'Geojson'));

    private static async downloadFromNominatim(params: Record<string, string>): Promise<IGeojson> {
        console.log(
            { params },
            Object.entries(params),
            `Geojson_${Object.entries(params)
                .map(([key, value]) => `${key}-${value}`)
                .join('_')}`,
        );

        const cacheKey = `Geojson_${Object.entries(params)
            .map((key, value) => `${key}-${value}`)
            .join('_')}`;
        const cacheValue = await this.storage.getItem(cacheKey);

        if (cacheValue) {
            return cacheValue as any as IGeojson;
        }

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

        await this.storage.setItem(cacheKey, geojson);

        return geojson;
    }

    public static async fromCity(city: string): Promise<OpenstreetmapGeojson> {
        return new OpenstreetmapGeojson(await this.downloadFromNominatim({ city }));
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
