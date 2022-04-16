import { Pixels } from './semantic/Pixels';
import { Wgs84 } from './semantic/Wgs84';

export const TILE_SIZE = Pixels.square(256 /* TODO: Make some seam-padding */);
export const TILE_COUNT_PADDING = 1.2;

/**
 * @see https://wiki.openstreetmap.org/wiki/Zoom_levels
 */
enum MapZoomLevels {
    WORLD = 0,
    SUBCONTINENTAL_AREA = 2,
    LARGEST_COUNTRY = 3,
    LARGE_AFRICAN_COUNTRY = 5,
    LARGE_EUROPEAN_COUNTRY = 6,
    SMALL_COUNTRY = 7,
    LARGE_METROPOLITAN_AREA = 9,
    METROPOLITAN_AREA = 10,
    TOWN_CITY_DISTRICT = 12,
    VILLAGE_OR_SUBURB = 13,
    SMALL_ROAD = 15,
    STREET = 16,
    BLOCK_PARK_ADDRESSES = 17,
    SOME_BUILDINGS_TREES = 18,
    LOCAL_HIGHWAY_AND_CROSSING_DETAILS = 19,
    BUILDING = 20,
}

export const MAP_BASE = new Wgs84({
    longitude: 14.5,
    latitude: 50,
    zoom: MapZoomLevels.METROPOLITAN_AREA /* Originally 17 */,
});
