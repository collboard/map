#!/usr/bin/env ts-node
/// <reference path="../../src/geojson/simplify-geojson.d.ts" />

import del from 'del';
import { mkdir, readFile, writeFile } from 'fs/promises';
import glob from 'glob-promise';
import { basename, dirname, join } from 'path';
import { IGeojsonFeatureCollection } from '../../src/interfaces/IGeojson';
import { geojsonStringify } from '../2-geojson-downloader/utils/geojsonStringify';

/**/
runGeojsonAggregator({ isCleanupPerformed: true });
/**/

async function runGeojsonAggregator({ isCleanupPerformed }: { isCleanupPerformed: boolean }) {
    if (isCleanupPerformed) {
        console.info(`🧹 Making cleenup for 🧩 Aggregating geojsons`);
        await del(join(__dirname, `../../maps/3-geojsons-aggregated`));
    }

    console.info(`🧩 Aggregating geojsons`);

    for (const geojsonPath of await glob(join(__dirname, '../../maps/2-geojsons/**/*.geojson'))) {
        try {
            const subGeojsonsPaths = await glob(dirname(geojsonPath) + '/**/*.geojson');

            if (subGeojsonsPaths.length > 1) {
                console.info(`🧩 Aggregating ${basename(geojsonPath)}`);

                const subGeojsons = (await Promise.all(subGeojsonsPaths.map((path) => readFile(path, 'utf8')))).map(
                    (geojson) => JSON.parse(geojson) as IGeojsonFeatureCollection,
                );

                const geojson: IGeojsonFeatureCollection = {
                    ...subGeojsons[0],
                    features: subGeojsons.flatMap((subGeojson) => subGeojson.features),
                    collboard: subGeojsons.map((subGeojson) => subGeojson.collboard),
                };

                const aggregatedGeojsonPath = geojsonPath.replace('/2-geojsons/', '/3-geojsons-aggregated/');

                await mkdir(dirname(aggregatedGeojsonPath), { recursive: true });
                await writeFile(aggregatedGeojsonPath, geojsonStringify(geojson), 'utf8');
            }
        } catch (error) {
            console.error(error);
        }
    }

    console.info(`[ Done 🧩 Aggregating geojsons ]`);
    process.exit(0);
}

/**
 * TODO: !!! Filter out duplicates like "Praha" and "Hlavní město Praha"
 * TODO: !!! Make aggregated parts like "Czech republic with rivers" OR "Czech republic with lakes"OR "Czech republic + administrative borders"
 */
