export type IGeopath = Partial<Record<'region' | 'country' | 'county' | 'district' | 'city', string>>;

export const GEOPATH_KEYS: Array<keyof IGeopath> = ['region', 'country', 'county', 'district', 'city'];
/**
 * TODO: Use CascadePartial not Partial
 */
