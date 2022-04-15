#!/usr/bin/env ts-node

import del from 'del';
import { mkdir, readFile, writeFile } from 'fs/promises';
import glob from 'glob-promise';
import { dirname, join, relative } from 'path';
import ReactDOMServer from 'react-dom/server';
import xmlFormatter from 'xml-formatter';
import { SvgGeojsonConverter } from '../../src/geojson/SvgGeojsonConverter';
import { IGeojsonFeatureCollection } from '../../src/interfaces/IGeojson';

const LODS_EXPONENTS = [-5]; //[/*-1,*/ -30, -10, 0, 5 /*1, 2, 3, 4*/, 10];

/**/
convertGeojsonsToSvgs({ isCleanupPerformed: true });
/**/

async function convertGeojsonsToSvgs({ isCleanupPerformed }: { isCleanupPerformed: true }) {
    //console.info(chalk.bgGrey(` Scraping Czech names`));

    const geojsonsPath = join(__dirname, `../../maps/4-svgs/`);

    if (isCleanupPerformed) {
        console.info(`🧹 Making cleenup for 🖼️  Converting geojsons to svgs`);
        await del(geojsonsPath);
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
                const svgElement = (await svgGeojsonConverter.makeSvg(Math.pow(1.1, exponent), false)) as any;
                const svgString = xmlFormatter(ReactDOMServer.renderToStaticMarkup(svgElement.element), {
                    indentation: '  ',
                    // filter: (node) => node.type !== 'Comment',
                    collapseContent: true,
                    lineSeparator: '\n',
                });

                // TODO: !!! Add collboard branding
                // TODO: !!! Add metadata of geo

                const svgPath =
                    geojsonPath.replace('/2-geojsons/', '/4-svgs/').replace('/3-geojsons-aggregated/', '/4-svgs/') +
                    `.lod${exponent > 0 ? '+' : '-'}${Math.abs(exponent)}.svg`;

                await mkdir(dirname(svgPath), { recursive: true });
                await writeFile(svgPath, svgString, 'utf8');

                // TODO: Messages in every script at end with relative path to generated resource
                console.info(`🗾 ${relative(process.cwd(), svgPath)}`);
            }
        } catch (error) {
            console.error(error);
        }
    }

    // TODO: Cleanup should be here (with comparision of new and old)
    // TODO: Autocommit

    console.info(`[ Done 🖼️  Converting geojsons to svgs ]`);
    process.exit(0);
}

/**
 * TODO: Add metadata of geo
 * TODO: Add collboard branding
 * TODO: !!! Steganographyc information watermarking
 */
