import { ITraySimpleDefinition } from '@collboard/modules-sdk';
import { findSvgs } from './3-findSvgs';
import { generateTrayItems } from './3-generateTrayItems';

export async function generateTrayDefinition(path: string): Promise<ITraySimpleDefinition> {
  return [
    {
      title: 'Kraje',
      icon: 'https://collboard.fra1.cdn.digitaloceanspaces.com/assets/18.42.0/languages/cs.svg',
      groups: [
        // Note: Using only one group - make it more semantic
        {
          title: `` /* <- Note: No name for (no)group */,
          items: await generateTrayItems(
            ...(await findSvgs({ path, level: 2, basenamePattern: /\.aggregated2\./ }))
          ),
        },
      ],
    },
  ];
}
