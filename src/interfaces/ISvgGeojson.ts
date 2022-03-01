export interface ISvgGeojson {
    // TODO: !!! Allow to pass here URL of external SVG file
    svg: JSX.Element;
    boundingBox: { minX: number; maxX: number; minY: number; maxY: number } /* TODO: IBoundingBoxData */;
    padding: number;
}
