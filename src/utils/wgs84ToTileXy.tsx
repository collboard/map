import { Vector } from 'xyzt';

export function wgs84ToTileXy({ coordinatesWgs84, zoom }: { coordinatesWgs84: Vector; zoom: number; }): {
  position: Vector;
  remainder: Vector;
} {
  const tileXy = new Vector(
    ((coordinatesWgs84.x + 180) / 360) * Math.pow(2, zoom),
    ((1 -
      Math.log(
        Math.tan((coordinatesWgs84.y * Math.PI) / 180) + 1 / Math.cos((coordinatesWgs84.y * Math.PI) / 180)
      ) /
      Math.PI) /
      2) *
    Math.pow(2, zoom)
  );

  const position = tileXy.map(Math.floor);
  return { position, remainder: position.subtract(tileXy) };
}
