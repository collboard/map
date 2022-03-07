import { string_url_image } from '@collboard/modules-sdk';

export type ISvgGeojson = ({ element: JSX.Element } | { src: string_url_image }) & {
    boundingBox: { minX: number; maxX: number; minY: number; maxY: number } /* TODO: IBoundingBoxData */;
    padding: number;
};
