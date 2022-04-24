import { classNames, React } from '@collboard/modules-sdk';
import { ISvgGeojson } from '../interfaces/ISvgGeojson';

type ISvgGeojsonComponentProps = ISvgGeojson & {
    selected: boolean;
};

export function SvgGeojsonComponent(props: ISvgGeojsonComponentProps) {
    const { padding, boundingBox, selected } = props;
    const { minX, maxX, minY, maxY } = boundingBox;

    // TODO:!!! Use only element or src
    // console.log(props);

    return (
        <div
            className={classNames('art', selected && 'selected')}
            style={{
                position: 'absolute',
                left: minX - padding,
                top: minY - padding,
                // backgroundColor: '#ff000050',
            }}
        >
            {(props as any).element}
            {(props as any).src && <img width={maxX - minX} height={maxY - minY} src={(props as any).src} />}
        </div>
    );
}
