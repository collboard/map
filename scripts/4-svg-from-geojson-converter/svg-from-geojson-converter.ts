#!/usr/bin/env ts-node

import del from 'del';
import { mkdir, readFile, writeFile } from 'fs/promises';
import glob from 'glob-promise';
import { basename, dirname, join } from 'path';
import ReactDOMServer from 'react-dom/server';
import { SvgGeojsonConverter } from '../../src/geojson/SvgGeojsonConverter';
import { IGeojsonFeatureCollection } from '../../src/interfaces/IGeojson';

const LODS_EXPONENTS = [/*-1, 0, 1, 2, 3, 4, 5*/ 0];

/**/
convertGeojsonsToSvgs(true);
/**/

async function convertGeojsonsToSvgs(override: boolean) {
    //console.info(chalk.bgGrey(` Scraping Czech names`));

    console.info(`🧹 Making cleenup`);
    const geojsonsPath = join(__dirname, `../../maps/4-svgs/`);

    if (override) {
        await del(geojsonsPath);
    }

    console.info(`🖼️ Converting geojsons to svgs`);

    for (const geojsonPath of await glob(join(__dirname, '../../maps/2-geojsons/**/*.geojson'))) {
        try {
            console.info(`🗾 Converting ${basename(geojsonPath)}`);

            const geojson = JSON.parse(await readFile(geojsonPath, 'utf8')) as IGeojsonFeatureCollection;

            const svgGeojsonConverter = new SvgGeojsonConverter(geojson);

            for (const exponent of LODS_EXPONENTS) {
                const svgGeojson = (await svgGeojsonConverter.makeSvg(Math.pow(1.1, exponent), false)) as any;
                const svgString = ReactDOMServer.renderToStaticMarkup(svgGeojson.element);

                // TODO: !!! Prettify SVG
                // TODO: !!! Add collboard branding
                // TODO: !!! Add metadata of geo

                const svgPath = geojsonPath.replace('/2-geojsons/', '/4-svgs/') + `.lod${exponent}.svg`;

                await mkdir(dirname(svgPath), { recursive: true });
                await writeFile(svgPath, svgString, 'utf8');
            }
        } catch (error) {
            console.error(error);
        }
    }

    console.info(`[ Done ]`);
}

/**
 * TODO: Add metadata of geo
 * TODO: Add collboard branding
 * TODO: Steganographyc information watermarking
 */
