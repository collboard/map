import { ObjectStorage, PrefixStorage } from 'everstorage';
import { IGeojson } from '../interfaces/IGeojson';
import { OsmGeojson } from './OsmGeojson';

export class OsmGeojsonCached extends OsmGeojson {
    private static storage = new ObjectStorage<any /*IGeojson*/>(new PrefixStorage(localStorage, 'Geojson'));

    protected static async downloadFromNominatim(params: Record<string, string>): Promise<IGeojson> {
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
            return cacheValue;
        }

        const geojson = await super.downloadFromNominatim(params);

        await this.storage.setItem(cacheKey, geojson);

        return geojson;
    }
}

/**
 * !!! Is cache working
 */