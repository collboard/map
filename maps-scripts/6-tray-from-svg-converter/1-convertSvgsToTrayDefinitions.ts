import del from 'del';
import { mkdir, stat, writeFile } from 'fs/promises';
import glob from 'glob-promise';
import { basename, dirname, join, relative } from 'path';
import { commit } from '../utils/autocommit/commit';
import { forPlay } from '../utils/forPlay';
import { prettify } from '../utils/prettify';
import { generateTrayDefinition } from './2-generateTrayDefinition';

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
        console.log(1, pathForTrayDefinition);
        if (!(await stat(pathForTrayDefinition).then((stat) => stat.isDirectory()))) {
            continue;
        }
        console.log(2);

        if (pathForTrayDefinition !== 'C:/Users/me/work/collboard/map/maps/4-svgs/world/europe/czechia') {
            // Note+TODO: Temporary only for czechia
            continue;
        }

        await forPlay();
        console.info(`📦 Making module from ${basename(pathForTrayDefinition)}`);

        const modulePath = join(
            trayModulesPath,
            relative(join(__dirname, '../../maps/4-svgs/'), pathForTrayDefinition) + '-tray.module.tsx',
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
              ${importAliases
                  .map(
                      ({ alias, path }) =>
                          `import ${alias} from "${relative(dirname(modulePath), path).split('\\').join('/')}";`,
                  )
                  .join('\n')}


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

    await mkdir(dirname(trayModulesPath), { recursive: true });
    await writeFile(join(trayModulesPath, 'index.ts'), indexContent, 'utf8');

    if (isCommited) {
        await commit(trayModulesPath, `🚡 Make tray module from svgs`);
    }

    console.info(`[ Done 🚡 Tray from svg converter ]`);
}
