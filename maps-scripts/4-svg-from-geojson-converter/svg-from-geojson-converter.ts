#!/usr/bin/env ts-node

import del from 'del';
import { mkdir, readFile, writeFile } from 'fs/promises';
import glob from 'glob-promise';
import { basename, dirname, join } from 'path';
import ReactDOMServer from 'react-dom/server';
import { SvgGeojsonConverter } from '../../src/geojson/SvgGeojsonConverter';
import { IGeojsonFeatureCollection } from '../../src/interfaces/IGeojson';
import { prettify } from '../utils/prettify';

const LODS_EXPONENTS = [-5]; //[/*-1,*/ -30, -10, 0, 5 /*1, 2, 3, 4*/, 10];

/**/
convertGeojsonsToSvgs({ isCleanupPerformed: true });
/**/

async function convertGeojsonsToSvgs({ isCleanupPerformed }: { isCleanupPerformed: true }) {
    //console.info(chalk.bgGrey(` Scraping Czech names`));

    const geojsonsPath = join(__dirname, `../../maps/4-svgs/`);

    if (isCleanupPerformed) {
        console.info(`🧹 Making cleenup for 🖼️ Converting geojsons to svgs`);
        await del(geojsonsPath);
    }

    console.info(`🖼️ Converting geojsons to svgs`);

    for (const geojsonPath of [
        ...(await glob(join(__dirname, '../../maps/2-geojsons/**/*.geojson'))),
        ...(await glob(join(__dirname, '../../maps/3-geojsons-aggregated/**/*.geojson'))),
    ]) {
        try {
            console.info(`🗾 Converting ${basename(geojsonPath)}`);

            const geojson = JSON.parse(await readFile(geojsonPath, 'utf8')) as IGeojsonFeatureCollection;

            const svgGeojsonConverter = new SvgGeojsonConverter(geojson);

            for (const exponent of LODS_EXPONENTS) {
                const svgGeojson = (await svgGeojsonConverter.makeSvg(Math.pow(1.1, exponent), false)) as any;
                const svgString = await prettify(ReactDOMServer.renderToStaticMarkup(svgGeojson.element), 'xml');

                // TODO: !!! Prettify SVG
                // TODO: !!! Add collboard branding
                // TODO: !!! Add metadata of geo

                const svgPath =
                    geojsonPath.replace('/2-geojsons/', '/4-svgs/').replace('/3-geojsons-aggregated/', '/4-svgs/') +
                    `.lod${exponent > 0 ? '+' : '-'}${Math.abs(exponent)}.svg`;

                await mkdir(dirname(svgPath), { recursive: true });
                await writeFile(svgPath, svgString, 'utf8');
            }
        } catch (error) {
            console.error(error);
        }
    }

    console.info(`[ Done 🖼️ Converting geojsons to svgs ]`);
    process.exit(0);
}

/**
 * TODO: Add metadata of geo
 * TODO: Add collboard branding
 * TODO: Steganographyc information watermarking
 */
