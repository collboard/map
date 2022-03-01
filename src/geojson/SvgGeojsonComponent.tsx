import { classNames, React } from '@collboard/modules-sdk';
import { ISvgGeojson } from '../interfaces/ISvgGeojson';

interface ISvgGeojsonComponentProps extends ISvgGeojson {
    selected: boolean;
}

export function SvgGeojsonComponent({ svg, padding, boundingBox, selected }: ISvgGeojsonComponentProps) {
    const { minX, maxX, minY, maxY } = boundingBox;

    return (
        <div
            className={classNames('art', selected && 'selected')}
            style={{
                position: 'absolute',
                left: minX - padding,
                top: minY - padding,
            }}
        >
            {svg}
        </div>
    );
}
