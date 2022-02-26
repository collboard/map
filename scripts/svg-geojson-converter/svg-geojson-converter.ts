#!/usr/bin/env ts-node

import del from 'del';
import { mkdir, readFile, writeFile } from 'fs/promises';
import glob from 'glob-promise';
import { basename, dirname, join } from 'path';
import ReactDOMServer from 'react-dom/server';
import { SvgGeojsonConverter } from '../../src/geojson/SvgGeojsonConverter';
import { IGeojsonFeatureCollection } from '../../src/interfaces/IGeojson';

// TODO: Logaritmic scale
const LODS = [0.01, 0.1, 1, 10, 100];

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

            const svgJsx = await svgGeojsonConverter.makeSvg(1);
            const svgString = ReactDOMServer.renderToStaticMarkup(svgJsx);
            // TODO: !!! Prettify SVG
            // TODO: !!! Add collboard branding
            // TODO: !!! Add metadata of geo

            const svgPath = geojsonPath.replace('/geojsons/', '/svgs/') + '.lod1.svg';

            await mkdir(dirname(svgPath), { recursive: true });
            await writeFile(svgPath, svgString, 'utf8');
        } catch (error) {
            console.error(error);
        }
    }
}
