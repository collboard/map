import { IJson, ObjectStorage, PrefixStorage } from 'everstorage';
import { IGeojsonFeatureCollection } from '../interfaces/IGeojson';
import { OsmGeojson } from './OsmGeojson';

export class OsmGeojsonCached extends OsmGeojson {
    private static storage = new ObjectStorage<IGeojsonFeatureCollection & IJson>(
        new PrefixStorage(localStorage, 'Geojson'),
    );

    public static async search(params: Record<string, string>): Promise<OsmGeojson> {
        /*console.log(
            { params },
            Object.entries(params),
            `Geojson_${Object.entries(params)
                .map(([key, value]) => `${key}-${value}`)
                .join('_')}`,
        );*/

        const cacheKey = `Geojson_${Object.entries(params)
            .map((key, value) => `${key}-${value}`)
            .join('_')}`;
        const cacheValue = await this.storage.getItem(cacheKey);

        if (cacheValue) {
            return new OsmGeojson(cacheValue);
        }

        const geojson = await super.search(params);

        await this.storage.setItem(cacheKey, geojson.geojson as IGeojsonFeatureCollection & IJson);

        return geojson;
    }
}

/**
 * TODO: !!! Is cache working
 */
