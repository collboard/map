#!/usr/bin/env ts-node

import { ITraySimpleDefinition } from '@collboard/modules-sdk';
import del from 'del';
import { mkdir, stat, writeFile } from 'fs/promises';
import glob from 'glob-promise';
import { basename, dirname, join, relative } from 'path';
import { prettify } from '../utils/prettify';

/**/
convertSvgsToTrayDefinitions({ isCleanupPerformed: true });
/**/

async function convertSvgsToTrayDefinitions({ isCleanupPerformed }: { isCleanupPerformed: true }) {
    //console.info(chalk.bgGrey(` Scraping Czech names`));

    const trayModulesPath = join(__dirname, `../../maps/6-tray-modules/`);

    if (isCleanupPerformed) {
        console.info(`🧹 Making cleenup for 🖨️ Converting svgs to pdfs`);
        await del(trayModulesPath);
    }

    console.info(`🚡 Tray from svg converter`);

    const modulesPaths: string[] = [];

    for (const pathForTrayDefinition of await glob(join(__dirname, '../../maps/4-svgs/**/*'))) {
        if (!(await stat(pathForTrayDefinition).then((stat) => stat.isDirectory()))) {
            continue;
        }

        if (pathForTrayDefinition !== 'C:/Users/me/work/collboard/map/maps/4-svgs/world/europe/czechia') {
            // Note+TODO: Temporary only for czechia
            continue;
        }

        console.info(`📦 Making module from ${basename(pathForTrayDefinition)}`);

        const modulePath = join(
            trayModulesPath,
            relative(join(__dirname, '../../maps/4-svgs/'), pathForTrayDefinition) + '.tsx',
        );
        const trayDefinition = await generateTrayDefinition(pathForTrayDefinition);
        let trayDefinitionJson = JSON.stringify(trayDefinition);
        const importAliases: { alias: string; path: string }[] = [];
        for (const match of trayDefinitionJson.matchAll(/import\((?<path>.*?)\)/g)) {
            const path = match.groups!.path;
            const alias = `x${Math.random().toString(36).substr(2, 9)}`; // <- Better foe example> jihoceskyKrajAggregated2Geojson
            importAliases.push({ alias, path });
            trayDefinitionJson = trayDefinitionJson.replace(`"import(${path})"`, alias);
        }

        const moduleContent = await prettify(
            // TODO: Also organize imports
            `
              import { declareModule, makeTraySimpleModule } from '@collboard/modules-sdk';
              import { contributors, license, repository, version } from '${relative(
                  dirname(modulePath),
                  join(__dirname, '../../package.json'),
              )
                  .split('\\')
                  .join('/')}';
              ${importAliases.map(({ alias, path }) => `import ${alias} from "${path}";`).join('\n')}


              // TODO: !!! Generator warning

              declareModule(
                makeTraySimpleModule({
                    manifest: {
                        name: '@collboard/map-tray-tool',
                        title: { en: 'Map tray tool' },
                        description: { en: 'Tray tool for the map' },
                        contributors,
                        license,
                        repository,
                        version,
                    },

                    icon: {
                        order: 60,
                        icon: 'earth' /* <- TODO: Better, Czechia borders */,
                        boardCursor: 'default',
                    },
                    trayDefinition: ${trayDefinitionJson}
                }),
              );
            `,
        );

        await mkdir(dirname(modulePath), { recursive: true });
        await writeFile(modulePath, moduleContent, 'utf8');

        modulesPaths.push(modulePath);
    }

    // TODO: Not spaceTrim but prettify OR block
    const indexContent = await prettify(`

      // TODO: !!! Generator warning
      ${modulesPaths
          .map((modulePath) => `import './${relative(trayModulesPath, modulePath).split('\\').join('/')}';`)
          .join('\n')}
    `);

    await writeFile(join(trayModulesPath, 'index.ts'), indexContent, 'utf8');

    console.info(`[ Done 🚡 Tray from svg converter ]`);
    process.exit(0);
}

async function generateTrayDefinition(path: string): Promise<ITraySimpleDefinition> {
    return [
        {
            title: 'Kraje',
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

async function generateTrayItems(...svgsPaths: string[]): Promise<ITraySimpleDefinition[0]['groups'][0]['items']> {
    const items: ITraySimpleDefinition[0]['groups'][0]['items'] = [];

    for (const svgPath of svgsPaths) {
        items.push({
            title: basename(svgPath) /* <- TODO: Make title from title inside metadata of SVG - like getTitleOfSvg */,
            imageSrc: `import(${svgPath})`,
            // Note: Using only imageSrc not artSrc
        });
    }

    return items;
}

interface IFindSvgsOptions {
    path: string;
    level: number;
    basenamePattern: RegExp;
}

async function findSvgs({ path, level, basenamePattern }: IFindSvgsOptions): Promise<string[]> {
    const svgsPaths: string[] = [];

    for (const svgPath of await glob(join(path, '/**/*.svg'))) {
        const svgLevel = svgPath.split(/[\/\\]/g).length - path.split(/[\/\\]/g).length;

        if (svgLevel !== level) {
            continue;
        }

        if (!basename(svgPath).match(basenamePattern)) {
            continue;
        }

        svgsPaths.push(svgPath);
    }

    return svgsPaths;
}

// !!! to files
// console.info(`➕ Making adding ${basename(pathForTrayGroup)} to ${basename(pathForTrayDefinition)}`);
