#!/usr/bin/env ts-node

import commander from 'commander';
import del from 'del';
import { mkdir, readFile, writeFile } from 'fs/promises';
import glob from 'glob-promise';
import { dirname, join, relative } from 'path';
import ReactDOMServer from 'react-dom/server';
import xmlFormatter from 'xml-formatter';
import { SvgGeojsonConverter } from '../../src/geojson/SvgGeojsonConverter';
import { IGeojsonFeatureCollection } from '../../src/interfaces/IGeojson';
import { getTitleOfSvg } from '../6-tray-from-svg-converter/getTitleOfSvg';
import { commit } from '../utils/autocommit/commit';
import { forPlay } from '../utils/forPlay';

const LODS_EXPONENTS = [
    -13, //!!!!
    // Note: 10 is best ballance between quality and pefrormance for the web
    // Other LODs> -50, -30, -10, 0, 5, 1, 2, 3, 4, 10, 30
];

/**/
const program = new commander.Command();
program.option('--commit', `Autocommit changes`);
program.parse(process.argv);
const { commit: isCommited } = program.opts();

convertGeojsonsToSvgs({ isCleanupPerformed: true, isCommited })
    .catch((error) => {
        console.error(error);
    })
    .then(() => {
        process.exit(0);
    });
/**/

async function convertGeojsonsToSvgs({
    isCleanupPerformed,
    isCommited,
}: {
    isCleanupPerformed: true;
    isCommited: boolean;
}) {
    //console.info(chalk.bgGrey(` Scraping Czech names`));

    const svgsPath = join(__dirname, `../../maps/4-svgs/`);

    if (isCleanupPerformed) {
        console.info(`🧹 Making cleenup for 🖼️  Converting geojsons to svgs`);
        await del(svgsPath);
    }

    console.info(`🖼️  Converting geojsons to svgs`);

    for (const geojsonPath of [
        ...(await glob(join(__dirname, '../../maps/2-geojsons/**/*.geojson'))),
        ...(await glob(join(__dirname, '../../maps/3-geojsons-aggregated/**/*.geojson'))),
    ]) {
        try {
            const geojson = JSON.parse(await readFile(geojsonPath, 'utf8')) as IGeojsonFeatureCollection;

            const svgGeojsonConverter = new SvgGeojsonConverter(geojson);

            for (const exponent of LODS_EXPONENTS) {
                await forPlay();
                const svgElement = (await svgGeojsonConverter.makeSvg(Math.pow(1.1, exponent), false)) as any;
                let svgString = ReactDOMServer.renderToStaticMarkup(svgElement.element);
                svgString = svgString
                    .split('</desc>')
                    .join(
                        `</desc>\n<!-- Generated from ${relative(process.cwd(), geojsonPath)
                            .split('\\')
                            .join('/')} -->`,
                    );
                svgString = xmlFormatter(svgString, {
                    indentation: '  ',
                    // filter: (node) => node.type !== 'Comment',
                    collapseContent: true,
                    lineSeparator: '\n',
                });

                // TODO: !!! Add collboard branding
                // TODO: !!! Add metadata of geo

                const svgPath =
                    geojsonPath.replace('/2-geojsons/', '/4-svgs/').replace('/3-geojsons-aggregated/', '/4-svgs/') +
                    `.lod${exponent === 0 ? '' : exponent > 0 ? 'p' : 'n'}${Math.abs(exponent)}.svg`;

                await mkdir(dirname(svgPath), { recursive: true });
                await writeFile(svgPath, svgString, 'utf8');

                // TODO: Messages in every script at end with relative path to generated resource
                console.info(
                    `🗾  ${(await getTitleOfSvg(svgPath)) + '🗾  '} ${relative(process.cwd(), svgPath)
                        .split('\\')
                        .join('/')}`,
                );
            }
        } catch (error) {
            console.error(error);
        }
    }

    // TODO: Cleanup should be here (with comparision of new and old)

    if (isCommited) {
        await commit(svgsPath, `🖼️ Create svgs from geojsons`);
    }

    console.info(`[ Done 🖼️  Converting geojsons to svgs ]`);
    process.exit(0);
}

/**
 * TODO: Add metadata of geo
 * TODO: Add collboard branding
 * TODO: !!! Steganographyc information watermarking
 */
