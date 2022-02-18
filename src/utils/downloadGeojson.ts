import { ObjectStorage, PrefixStorage } from 'everstorage';

interface IDownloadGeojsonOptions {
    city: string;
}

const storage = new ObjectStorage(/*<IGeojson>*/ new PrefixStorage(localStorage, 'Geojson'));

export async function downloadGeojson(options: IDownloadGeojsonOptions) {
    const { city } = options;

    const cacheKey = `Geojson_${city}`;
    const cacheValue = await storage.getItem(cacheKey);

    if (cacheValue) {
        return cacheValue;
    }

    const url = new URL(`https://nominatim.openstreetmap.org/search`);

    url.searchParams.set('country', 'czechia');
    url.searchParams.set('city', city);
    url.searchParams.set('format', 'geojson');
    url.searchParams.set('polygon_geojson', '1');

    const response = await fetch(url.href);
    const geojson = await response.json();

    // Note: Openstreetmap returns geojson with two features, but strangely theese two features are duplicated
    geojson.features = [geojson.features[1]];

    await storage.setItem(cacheKey, geojson);

    return geojson;
}

/**
 * TODO: Everstorage should have some util for making cached functions
 * TODO: GeojsonProvider
 * TODO: Liberec is smaller than in real life
 * TODO: Brno is not shown
 */
