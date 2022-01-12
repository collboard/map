import { Vector } from 'xyzt';

export function wgs84ToTileXy({ coordinatesWgs84, zoom }: { coordinatesWgs84: Vector; zoom: number }): {
    position: Vector;
    remainder: Vector;
} {
    const tileXy = new Vector(
        ((coordinatesWgs84.x + 180) / 360) * Math.pow(2, zoom),
        ((1 -
            Math.log(
                Math.tan((coordinatesWgs84.y * Math.PI) / 180) + 1 / Math.cos((coordinatesWgs84.y * Math.PI) / 180),
            ) /
                Math.PI) /
            2) *
            Math.pow(2, zoom),
    );

    const position = tileXy.map(Math.floor);
    return { position, remainder: position.subtract(tileXy) };
}

// TODO: !!! Standartize naming of coords wgs84ToTileXy should return tilePosition and tileRemainder + position vs. point

export function tileXyToWgs84({ tilePosition, zoom }: { tilePosition: Vector; zoom: number }): {
    coordinatesWgs84: Vector;
} {
    const n = Math.PI - (2 * Math.PI * tilePosition.y) / Math.pow(2, zoom);

    return {
        coordinatesWgs84: new Vector(
            (tilePosition.x / Math.pow(2, zoom)) * 360 - 180,
            (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n))),
        ),
    };
}
