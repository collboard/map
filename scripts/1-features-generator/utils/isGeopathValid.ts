import { GEOPATH_KEYS, IGeopath } from '../../../maps/1-features/geopath';

/**
 * Check there is no gap in geopath
 */
export function isGeopathValid(geopath: IGeopath): boolean {
    let isForwardGeoDetailsEmpty = false;
    for (const geoKey of GEOPATH_KEYS) {
        if (geopath[geoKey] === undefined) {
            isForwardGeoDetailsEmpty = true;
        } else if (isForwardGeoDetailsEmpty) {
            return false;
        }
    }

    return true;
}
