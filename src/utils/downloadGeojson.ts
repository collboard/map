interface IDownloadGeojsonOptions {
    city: string;
}

export async function downloadGeojson(options: IDownloadGeojsonOptions) {
    const { city } = options;

    const url = new URL(`https://nominatim.openstreetmap.org/search`);

    url.searchParams.set('country', 'czechia');
    url.searchParams.set('city', city);
    url.searchParams.set('format', 'geojson');
    url.searchParams.set('polygon_geojson', '1');

    const response = await fetch(url.href);
    const geojson = await response.json();

    // Note: Openstreetmap returns geojson with two features, but strangely theese two features are duplicated
    geojson.features = [geojson.features[1]];

    return geojson;
}

/**
 * TODO: Cache in localstorage
 * TODO: GeojsonProvider
 */
