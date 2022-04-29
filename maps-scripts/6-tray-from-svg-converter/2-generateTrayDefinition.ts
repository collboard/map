import { ITraySimpleDefinition } from '@collboard/modules-sdk';
import { findSvgs } from './3-findSvgs';
import { generateTrayItems } from './3-generateTrayItems';

export async function generateTrayDefinition(path: string): Promise<ITraySimpleDefinition> {
    return [
        {
            title: 'Česká republika',
            icon: 'https://collboard.fra1.cdn.digitaloceanspaces.com/assets/18.42.0/languages/cs.svg',
            groups: [
                {
                    title: `` /* <- Note: No name for (no)group */,
                    items: await generateTrayItems(...(await findSvgs({ path, level: 1, basenamePattern: /.*/ }))),
                },
            ],
        },
        {
            title: 'Kraje České republiky',
            icon: 'https://collboard.fra1.cdn.digitaloceanspaces.com/assets/18.42.0/languages/cs.svg',
            groups: [
                {
                    title: `` /* <- Note: No name for (no)group */,
                    items: await generateTrayItems(
                        ...(await findSvgs({ path, level: 2, basenamePattern: /^((?!aggregated).)*$/ })),
                    ),
                },
            ],
        },
        {
            title: 'Okresy České republiky',
            icon: 'https://collboard.fra1.cdn.digitaloceanspaces.com/assets/18.42.0/languages/cs.svg',
            groups: [
                // Note: Using only one group - make it more semantic
                {
                    title: `` /* <- Note: No name for (no)group */,
                    items: await generateTrayItems(
                        ...(await findSvgs({ path, level: 2, basenamePattern: /\.aggregated2\./ })),
                    ),
                },
            ],
        },
    ];
}
