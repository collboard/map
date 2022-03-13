export type ISvgGeojson = ({ element: JSX.Element } | { src: string /*_url_image*/ }) & {
    boundingBox: { minX: number; maxX: number; minY: number; maxY: number } /* TODO: IBoundingBoxData */;
    padding: number;
};
