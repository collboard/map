import { ITrayItemList, ITrayToolbarGroup, Translate } from '@collboard/modules-sdk';
import React from 'react';
import { montessoriColors } from '../--MontessoriDefaultColors';

const DEFAULT_WIDTH = 20;
const HEIGHT = 100;

function generateFeatures() {
    const result: ITrayItemList = {};

    for (let i = 1; i <= 9; i++) {
        result['features' + i] = {
            content: (
                <g>
                    <image
                        href="https://collboard.com/api/files/collboard/a3221f41-e64b-4ea5-84b1-bf431a72d88f.svg"
                        height="200"
                        width="200"
                    />
                    <text
                        x={DEFAULT_WIDTH * (i + 1) * 0.5}
                        y={HEIGHT / 2 + 5}
                        style={{
                            stroke: 'none',
                            strokeWidth: '0',
                            fontWeight: 'bold',
                            fontSize: '20px',
                            textAnchor: 'middle',
                            lineHeight: '20px',
                            dominantBaseline: 'middle',
                            fill: montessoriColors.black,
                        }}
                    >
                        aaa
                    </text>
                </g>
            ),
            defaultColor: 'red',
        };
    }

    return result;
}

export function itemsFeatures(): ITrayItemList {
    return {
        ...generateFeatures(),
    };
}

export function toolbarFeatures(): ITrayToolbarGroup {
    return [
        {
            title: <Translate name={`Montessori / features / ones features`}>Jednotkové šipky</Translate>,
            itemIds: Object.keys(generateFeatures()),
        },
        /*{
            title: <Translate name={`Montessori / features / tens features`}>Desítkové šipky</Translate>,
            itemIds: Object.keys(generateFeatures(1, montessoriColors.blue)),
        },*/
    ];
}
