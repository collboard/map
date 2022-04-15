import { ITraySimpleDefinition } from '@collboard/modules-sdk';
import { readFile } from 'fs/promises';

export async function generateTrayItems(
    ...svgsPaths: string[]
): Promise<ITraySimpleDefinition[0]['groups'][0]['items']> {
    const items: ITraySimpleDefinition[0]['groups'][0]['items'] = [];

    for (const svgPath of svgsPaths) {
        items.push({
            title: await readFile(svgPath, 'utf-8').then(
                (data) => /<title>(?<title>.*)<\/title>/.exec(data)!.groups!.title,
            ),
            imageSrc: `import(${svgPath})`,
            // Note: Using only imageSrc not artSrc
        });
    }

    return items;
}
