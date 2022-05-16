import del from 'del';
import { mkdir, stat, writeFile } from 'fs/promises';
import glob from 'glob-promise';
import { basename, dirname, join, relative } from 'path';
import spaceTrim from 'spacetrim';
import { commit } from '../utils/autocommit/commit';
import { forPlay } from '../utils/forPlay';
import { prettify } from '../utils/prettify';
import { generateTrayDefinition } from './2-generateTrayDefinition';
import { replaceInlineImports } from './replaceInlineImports';

/**/
export async function convertSvgsToTrayDefinitions({
    isCleanupPerformed,
    isCommited,
}: {
    isCleanupPerformed: boolean;
    isCommited: boolean;
}) {
    //console.info(chalk.bgGrey(` Scraping Czech names`));
    const trayModulesPath = join(__dirname, `../../maps/6-tray-modules/`);

    if (isCleanupPerformed) {
        console.info(`🧹 Making cleenup for 🚡  Tray from svg converter`);
        await del(trayModulesPath);
    }

    console.info(`🚡  Tray from svg converter`);

    const modulesPaths: string[] = [];

    for (const pathForTrayDefinition of await glob(join(__dirname, '../../maps/4-svgs/**/*'))) {
        if (!(await stat(pathForTrayDefinition).then((stat) => stat.isDirectory()))) {
            continue;
        }

        if (pathForTrayDefinition !== 'C:/Users/me/work/collboard/map/maps/4-svgs/world/europe/czechia') {
            // Note+TODO: Temporary only for czechia
            continue;
        }

        await forPlay();
        const modulePath = join(
            trayModulesPath,
            relative(join(__dirname, '../../maps/4-svgs/'), pathForTrayDefinition) + '-tray.module.tsx',
        );
        console.info(
            `📦  ${basename(pathForTrayDefinition)} 📦  ${relative(process.cwd(), modulePath).split('\\').join('/')}`,
        );

        const trayDefinition = await generateTrayDefinition(pathForTrayDefinition);
        const trayDefinitionJson = JSON.stringify(trayDefinition);

        let moduleContent = `

              import { declareModule, makeTraySimpleModule } from '@collboard/modules-sdk';
              import { contributors, license, repository, version } from '${relative(
                  dirname(modulePath),
                  join(__dirname, '../../package.json'),
              )
                  .split('\\')
                  .join('/')}';



              declareModule(
                makeTraySimpleModule({
                      manifest: {
                        name: '@collboard/map-tray-tool-czechia-counties-and-districts',
                        icon: 'https://collboard.fra1.cdn.digitaloceanspaces.com/assets/18.42.0/languages/cs.svg',
                        title: { cs: 'Kraje a okresy České republiky', en: 'Czechia counties and districts' },
                        description: { cs: 'Lišta s kraji České republiky', en: 'Tray with Czechia counties and districts' },
                        contributors,
                        license,
                        repository,
                        version,
                    },

                    icon: {
                        order: 60,
                        // icon: 'earth' /* <- TODO: Better, Czechia borders */,
                        icon: "import(/assets/icons/cs.svg)",
                        // TODO: !!! Custom icon OR make flag images from UTF-8 country codes like "🇨🇿"
                        boardCursor: 'default',
                    },
                    trayDefinition: ${trayDefinitionJson}
                }),
              );
            `;
        moduleContent = await replaceInlineImports(moduleContent, modulePath);
        moduleContent = spaceTrim(
            (block) => `


                ${block(`/**
                 * 🏭 GENERATED WITH 🚡 Tray from svg converter
                 * ⚠️ Warning: Do not edit by hand, all changes will be lost on next execution!
                 */`)}


                ${block(moduleContent)}
        `,
        );

        await mkdir(dirname(modulePath), { recursive: true });
        await writeFile(modulePath, await prettify(/* TODO: Also organize imports */ moduleContent), 'utf8');

        modulesPaths.push(modulePath);
    }

    // TODO: Not spaceTrim but prettify OR block
    const indexContent = await prettify(`

/**
 * 🏭 GENERATED WITH 🚡 Tray from svg converter
 * ⚠️ Warning: Do not edit by hand, all changes will be lost on next execution!
 */

      ${modulesPaths
          .map((modulePath) => `import './${relative(trayModulesPath, modulePath).split('\\').join('/')}';`)
          .join('\n')}
    `);

    await mkdir(dirname(trayModulesPath), { recursive: true });
    await writeFile(join(trayModulesPath, 'index.ts'), indexContent, 'utf8');

    if (isCommited) {
        await commit(trayModulesPath, `🚡 Make tray module from svgs`);
    }

    console.info(`[ Done 🚡 Tray from svg converter ]`);
}
