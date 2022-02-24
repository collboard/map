#!/usr/bin/env ts-node
/// <reference path="../../src/simplify-geojson.d.ts" />

//import chalk from 'chalk';
import del from 'del';
import { mkdir, writeFile } from 'fs/promises';
import { dirname, join } from 'path';
import { FEATURES } from '../../maps/features/features';
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
        console.info(`⬇️ Downloading ${feature.search.q /* TODO: Better */}`);

        try {
            const geojson = (await OsmGeojson.search(feature.search)).geojson;

            // TODO: Maybe use const [type, name] = Object.entries(feature.search)[0]; >.${type}.geojson

            const geopath = geojson.features[0]
                .properties!.display_name!.split(',')
                .map((part) => part.trim())
                .reverse();

            // TODO: !!! Translate all parts of path to lowercase, without diacritics English
            const geojsonPath = join(geojsonsPath, ...geopath, `${geopath[geopath.length - 1]}.geojson`);
            await mkdir(dirname(geojsonPath), { recursive: true });
            await writeFile(geojsonPath, geojsonStringify(geojson), 'utf8');
        } catch (error) {
            console.error(error);
        }
    }
}
