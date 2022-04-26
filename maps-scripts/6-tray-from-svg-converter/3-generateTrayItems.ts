import { ITraySimpleDefinition } from '@collboard/modules-sdk';
import { getTitleOfSvg } from './getTitleOfSvg';

export async function generateTrayItems(
    ...svgsPaths: string[]
): Promise<ITraySimpleDefinition[0]['groups'][0]['items']> {
    const items: ITraySimpleDefinition[0]['groups'][0]['items'] = [];

    for (const svgPath of svgsPaths) {
        items.push({
            title: await getTitleOfSvg(svgPath),
            imageSrc: `import(${svgPath})`,
            // Note: Using only imageSrc not artSrc
        });
    }

    items.sort((a, b) => (a.title! > b.title! ? 1 : -1));

    return items;
}
