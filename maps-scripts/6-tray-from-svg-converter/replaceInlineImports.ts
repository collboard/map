import { dirname, join, relative } from 'path';
import spaceTrim from 'spacetrim';
import { normalizeToCamelCase } from '../utils/normalizeToCamelCase';
import { removeDiacritics } from '../utils/removeDiacritics';
import { getTitleOfSvg } from './getTitleOfSvg';

export async function replaceInlineImports(tsfile: string, modulePath: string): Promise<string> {
    const importAliases: { alias: string; path: string }[] = [];

    for (const match of tsfile.matchAll(/import\((?<path>.*?)\)/g)) {
        const path = match.groups!.path;

        const baseAlias = await getTitleOfSvg(path).then(removeDiacritics).then(normalizeToCamelCase);

        let alias = baseAlias;
        let i = 0;
        while (importAliases.some(({ alias: alias2 }) => alias === alias2)) {
            i++;
            alias = `${baseAlias}${i}`;
        }

        importAliases.push({ alias, path });
        tsfile = tsfile.replace(`"import(${path})"`, alias);
    }

    return spaceTrim(
        (block) => `

          ${block(
              importAliases
                  .map(
                      ({ alias, path }) =>
                          `import ${alias} from "${relative(dirname(modulePath), join(process.cwd(), path))
                              .split('\\')
                              .join('/')}";`,
                  )
                  .join('\n'),
          )}


          ${block(tsfile)}

    `,
    );
}
