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
convert(true);
/**/

async function convert(override: boolean) {
    //console.info(chalk.bgGrey(` Scraping Czech names`));

    console.info(`🧹 Making cleenup`);
    const geojsonsPath = join(__dirname, `../../maps/svgs/`);

    if (override) {
        await del(geojsonsPath);
    }

    console.info(`🖼️ Converting GeoJSONs to SVGs`);

    for (const geojsonPath of await glob(join(__dirname, '../../maps/geojsons/**/*.geojson'))) {
        try {
            console.info(`🗾 Converting ${basename(geojsonPath)}`);

            const geojson = JSON.parse(await readFile(geojsonPath, 'utf8')) as IGeojsonFeatureCollection;

            const svgGeojsonConverter = new SvgGeojsonConverter(geojson);

            for (const exponent of LODS_EXPONENTS) {
                const svgJsx = await svgGeojsonConverter.makeSvg(Math.pow(1.1, exponent));
                const svgString = ReactDOMServer.renderToStaticMarkup(svgJsx);
                // TODO: !!! Prettify SVG
                // TODO: !!! Add collboard branding
                // TODO: !!! Add metadata of geo

                const svgPath = geojsonPath.replace('/geojsons/', '/svgs/') + `.lod${exponent}.svg`;

                await mkdir(dirname(svgPath), { recursive: true });
                await writeFile(svgPath, svgString, 'utf8');
            }
        } catch (error) {
            console.error(error);
        }
    }
}
