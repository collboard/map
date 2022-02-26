#!/usr/bin/env ts-node

import { readFile, writeFile } from 'fs/promises';
import glob from 'glob-promise';
import { basename, join } from 'path';
import ReactDOMServer from 'react-dom/server';
import { SvgGeojsonConverter } from '../../src/geojson/SvgGeojsonConverter';
import { IGeojsonFeatureCollection } from '../../src/interfaces/IGeojson';

// TODO: Logaritmic scale
const LODS = [0.01, 0.1, 1, 10, 100];

/**/
download(true);
/**/

async function download(override: boolean) {
    //console.info(chalk.bgGrey(` Scraping Czech names`));

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

            await writeFile(geojsonPath.replace('/geojsons/', '/svgs/') + '.lod1.svg', svgString, 'utf8');
        } catch (error) {
            console.error(error);
        }
    }
}
