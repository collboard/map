#!/usr/bin/env ts-node

import { ITraySimpleDefinition } from '@collboard/modules-sdk';
import { mkdir, stat, writeFile } from 'fs/promises';
import glob from 'glob-promise';
import { basename, dirname, join, relative } from 'path';
import { spaceTrim } from 'spacetrim';

/**/
convertSvgsToTrayDefinitions();
/**/

async function convertSvgsToTrayDefinitions() {
    //console.info(chalk.bgGrey(` Scraping Czech names`));

    const geojsonsPath = join(__dirname, `../../maps/5-pdfs/`);

    console.info(`🚡 Tray from svg converter`);

    const modulesPaths: string[] = [];

    for (const svgDirPath of await glob(join(__dirname, '../../maps/4-svgs/**/*'))) {
        if (!(await stat(svgDirPath).then((stat) => stat.isDirectory()))) {
            continue;
        }

        if (svgDirPath !== 'C:/Users/me/work/collboard/map/maps/4-svgs/world/europe/czechia') {
            // Note: Temporary only for czechia
            continue;
        }

        console.info(`📦 Making module from ${basename(svgDirPath)}`);

        const trayDefinition: ITraySimpleDefinition = [];
        for (const svgPath of await glob(join(svgDirPath, '/**/*/.svg'))) {
            trayDefinition.push({
                title: 'Czechia',
                icon: 'https://collboard.fra1.cdn.digitaloceanspaces.com/assets/18.42.0/languages/cs.svg',
                groups: [
                    {
                        title: 'Kraje',
                        items: [
                            {
                                title: 'Moravskoslezsky kraj',
                                imageSrc: svgPath,
                                artSrc: svgPath,
                            },
                            {
                                title: 'Moravskoslezsky kraj',
                                imageSrc: svgPath,
                                artSrc: svgPath,
                            },
                            {
                                title: 'Moravskoslezsky kraj',
                                imageSrc: svgPath,
                                artSrc: svgPath,
                            },
                        ],
                    },
                    {
                        title: 'Kraje 2',
                        items: [
                            {
                                title: 'Moravskoslezsky kraj',
                                imageSrc: svgPath,
                                artSrc: svgPath,
                            },
                            {
                                title: 'Moravskoslezsky kraj',
                                imageSrc: svgPath,
                                artSrc: svgPath,
                            },
                            {
                                title: 'Moravskoslezsky kraj',
                                imageSrc: svgPath,
                                artSrc: svgPath,
                            },
                        ],
                    },
                ],
            });
        }

        // TODO: Not spaceTrim but prettify
        const moduleContent = spaceTrim(`

        import { declareModule, makeTraySimpleModule } from '@collboard/modules-sdk';
        import { contributors, license, repository, version } from '../../../package.json';
        // !!! Imports of SVGs

        // TODO: !!! Generator warning

        declareModule(() => {


            return makeTraySimpleModule({
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
                    icon: 'https://collboard.fra1.cdn.digitaloceanspaces.com/assets/18.42.0/languages/cs.svg',
                    boardCursor: 'default',
                },
                trayDefinition:${JSON.stringify(trayDefinition)},



        });
      `);

        const modulePath = join(
            __dirname,
            '../../maps/6-tray-modules/',
            relative(join(__dirname, '../../maps/4-svgs/**/*'), svgDirPath),
            'xxx.tsx',
        );
        await mkdir(dirname(modulePath), { recursive: true });
        await writeFile(modulePath, moduleContent, 'utf8');

        modulesPaths.push(modulePath);
    }

    // TODO: Not spaceTrim but prettify OR block
    const indexContent = spaceTrim(`

      // TODO: !!! Generator warning
      ${modulesPaths.map((modulePath) => `import '${modulePath}';`).join('\n')}
    `);

    await writeFile(join(__dirname, '../../maps/6-tray-modules/index.ts'), indexContent, 'utf8');

    console.info(`[ Done 🚡 Tray from svg converter ]`);
    process.exit(0);
}
