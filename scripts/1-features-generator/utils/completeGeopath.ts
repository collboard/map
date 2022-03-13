import { GEOPATH_KEYS, IGeopath } from '../../../maps/1-features/geopath';
import { toTriplets } from './toTriplets';

interface ICompleteGeopathOptions {
    model: IGeopath;
    reciever: IGeopath;
}

/**
 * Fill up gaps in geopath of each feature and check the consistency
 * Note: It does not mutate reciever but returns new object
 */
export function completeGeopath({ model, reciever }: ICompleteGeopathOptions): IGeopath {
    const result = { ...reciever };
    for (const [a, b, c] of toTriplets(GEOPATH_KEYS)) {
        if (model[a] === reciever[a] && result[b] === undefined && model[c] === reciever[c]) {
            result[b] = model[b];
        }
    }

    return result;
}
