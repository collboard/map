import { join } from 'path';
import { IGeopath } from '../../maps/1-features/geopath';
import { removeDiacritics } from '../utils/removeDiacritics';

export function geopathToDirpath(geopath: IGeopath, category: string): string {
    const geopathNormalized = Object.entries(geopath)
        .map(([key, value]) => {
            if (key === 'river') {
                return `River ${value}`;
            } else {
                return value;
            }
        })
        .map((geopart) =>
            // TODO: Make one normalizeGeoname function
            //       "Wallis and futuna (france)" -> "wallis-and-futuna-france"
            removeDiacritics(geopart).split(/\s+/).join('-').toLowerCase(),
        );
    return join(...geopathNormalized, `${geopathNormalized[geopathNormalized.length - 1]}.${category}.geojson`);
}
