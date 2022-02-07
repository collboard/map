import simplifyGeojson from 'simplify-geojson';

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
    const geojsonSimplified = simplifyGeojson(geojson, 0.001 /* <- TODO: To some global config */);

    return geojsonSimplified;
}

/**
 * TODO: Cache this simplified in localstorage
 */
