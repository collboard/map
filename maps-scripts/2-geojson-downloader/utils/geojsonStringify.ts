import { IGeojson } from '../../../src/interfaces/IGeojson';

export function geojsonStringify(geojsonContentObject: IGeojson) {
    const formattedGeojsonContentObject = formatGeojson(geojsonContentObject);
    const formattedGeojsonContentString = replacerPostprocessForGeojson(
        JSON.stringify(formattedGeojsonContentObject, replacerForGeojson, 4),
    );

    // TODO: Allow to choose in args if save or output
    //console.log(formattedGeojsonContentString);
    //await writeFile(geojsonPath, formattedGeojsonContentString);

    return formattedGeojsonContentString;
}

function formatGeojson(geojson: IGeojson): any {
    if (typeof geojson !== 'object' || geojson === null) {
        return geojson;
    }
    if (Array.isArray(geojson)) {
        return geojson.map(formatGeojson);
    }

    const begining = {};
    const middle = {};
    const end = {};

    for (const [key, value] of Object.entries(geojson)) {
        const formattedValue = formatGeojson(value);

        if (['type', 'properties', 'collboard'].includes(key)) {
            begining[key] = formattedValue;
        } else if (['coordinates'].includes(key)) {
            end[key] = formattedValue;
        } else {
            middle[key] = formattedValue;
        }
    }

    return { ...begining, ...middle, ...end };
}

function replacerForGeojson(key: string, value: string) {
    if (key === 'coordinates') {
        return `<<<${JSON.stringify(value)}>>>`;
    }
    return value;
}

function replacerPostprocessForGeojson(geojsonString: string) {
    return geojsonString.split(`"<<<`).join('').split(`>>>"`).join('');
}

/**
 * TODO: Probbably put to some indipendent lib published on NPM
 */
