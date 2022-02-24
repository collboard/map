#!/usr/bin/env ts-node
/// <reference path="../../src/simplify-geojson.d.ts" />

//import chalk from 'chalk';
import del from 'del';
import { mkdir, writeFile } from 'fs/promises';
import { dirname, join } from 'path';
import { FEATURES } from '../../maps/features';
import { OsmGeojson } from '../../src/geojson/OsmGeojson';
import { geojsonStringify } from './utils/geojsonStringify';

/**/
download();
/**/

async function download() {
    //console.info(chalk.bgGrey(` Scraping Czech names`));

    console.info(`🧹 Making cleenup`);
    const geojsonsPath = join(__dirname, `../../maps/geojsons/`);
    // TODO: !!! Probbably switch overriting
    await del(geojsonsPath);

    console.info(`🗺️ Downloading geojsons`);

    for (const feature of FEATURES) {
        console.info(`⬇️ Downloading ${feature.en}`);

        const geojson = (await OsmGeojson.search(feature.search)).geojson;

        const [type, name] = Object.entries(feature.search)[0];

        const geojsonPath = join(
            geojsonsPath,
            `/czechia/${feature.en.toLowerCase()}/${feature.en.toLowerCase()}.${type}.geojson`,
        );
        await mkdir(dirname(geojsonPath), { recursive: true });
        await writeFile(geojsonPath, geojsonStringify(geojson), 'utf8');
    }
}
