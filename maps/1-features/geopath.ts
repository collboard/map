export type IGeopath = Partial<Record<'region' | 'country' | 'river' | 'county' | 'district' | 'city', string>>;

export const GEOPATH_KEYS: Array<keyof IGeopath> = [
    'region',
    'country',
    /* NOT 'river', */ 'county',
    'district',
    'city',
];
/**
 * TODO: Use CascadePartial not Partial
 */
