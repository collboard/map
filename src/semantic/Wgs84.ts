import { Vector } from 'xyzt';

export class Wgs84 extends Vector {
    public readonly type = 'Wgs84';

    public constructor(coordinates: { longitude: number; latitude: number; zoom?: number });
    public constructor(longitude: number, latitude: number, zoom?: number);

    public constructor(...args: any[]) {
        super(...(typeof args[0] === 'number' ? args : [args[0].longitude, args[0].latitude, args[0].zoom]));
    }
}

/**
 * TODO: Maybe work with zoom or altitude
 * TODO: Some equvalent to IVectorData like IWgs84Data
 */
