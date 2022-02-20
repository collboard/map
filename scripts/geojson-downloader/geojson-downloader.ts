#!/usr/bin/env ts-node
/// <reference path="../../src/simplify-geojson.d.ts" />

//import chalk from 'chalk';
import { mkdir, writeFile } from 'fs/promises';
import { dirname, join } from 'path';
import { OsmGeojson } from '../../src/geojson/OsmGeojson';
import { geojsonStringify } from './utils/geojsonStringify';

/**/
download();
/**/

async function download() {
    //console.info(chalk.bgGrey(` Scraping Czech names`));
    console.info(`🗺️ Downloading geojsons`);

    const geojson = (await OsmGeojson.fromCity('Prague')).geojson;

    const geojsonPath = join(__dirname, `../../maps/downloaded/cities/prague.geojson`);
    await mkdir(dirname(geojsonPath), { recursive: true });
    await writeFile(geojsonPath, geojsonStringify(geojson), 'utf8');
}
