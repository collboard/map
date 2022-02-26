#!/usr/bin/env ts-node

import { readFile } from 'fs/promises';
import glob from 'glob-promise';
import { join } from 'path';
import { SvgGeojsonConverter } from '../../src/geojson/SvgGeojsonConverter';
import { IGeojsonFeatureCollection } from '../../src/interfaces/IGeojson';

/**/
download(true);
/**/

async function download(override: boolean) {
    //console.info(chalk.bgGrey(` Scraping Czech names`));

    console.info(`🖼️ Converting GeoJSONs to SVGs`);

    for (const geojsonPath of await glob(join(__dirname, '../../maps/features/geojsons/**/*.geojson'))) {
        const geojson = JSON.parse(await readFile(geojsonPath, 'utf8')) as IGeojsonFeatureCollection;

        const svgGeojsonConverter = new SvgGeojsonConverter(geojson);

        svgGeojsonConverter.makeSvg(1);

        // !!! And save SVG to file
    }
}
