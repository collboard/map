#!/usr/bin/env ts-node
/// <reference path="../../src/geojson/simplify-geojson.d.ts" />

import del from 'del';
import { mkdir, readFile, writeFile } from 'fs/promises';
import glob from 'glob-promise';
import { basename, dirname, join } from 'path';
import { IGeojsonFeatureCollection } from '../../src/interfaces/IGeojson';
import { geojsonStringify } from '../2-geojson-downloader/utils/geojsonStringify';
import { commit } from '../utils/autocommit/commit';

/**/
runGeojsonAggregator({ isCleanupPerformed: true });
/**/

async function runGeojsonAggregator({ isCleanupPerformed }: { isCleanupPerformed: boolean }) {
    const geojsonsAggregatedPath = join(__dirname, `../../maps/3-geojsons-aggregated`);

    if (isCleanupPerformed) {
        console.info(`🧹 Making cleenup for 🧩 Aggregating geojsons`);
        await del(geojsonsAggregatedPath);
    }

    console.info(`🧩  Aggregating geojsons`);

    for (const geojsonPath of Array.from(
        new Set((await glob(join(__dirname, '../../maps/2-geojsons/**/*'))).map((path) => dirname(path))),
    )) {
        for (const level of [1, 2, 3, 4]) {
            try {
                const subGeojsonsPaths = (await glob(geojsonPath + '/**/*.geojson')).filter(
                    (subGeojsonPath) =>
                        subGeojsonPath.split(/[\/\\]/g).length - geojsonPath.split(/[\/\\]/g).length <= level,
                );
                // TODO: If there are multiple levels the same, just keep lower one

                if (subGeojsonsPaths.length === 0 || subGeojsonsPaths.length === 1) {
                    // console.info(`🈳 Nothing to aggregate ${basename(geojsonPath)} on level ${level}`);
                } else if (subGeojsonsPaths.length > 100) {
                    console.info(
                        `🤯 Too big set of ${subGeojsonsPaths.length} geojsons to agregate ${basename(
                            geojsonPath,
                        )} on level ${level}`,
                    );
                } else {
                    console.info(
                        `🧩 Aggregating ${subGeojsonsPaths.length} geojsons ${basename(geojsonPath)} on level ${level}`,
                    );

                    const subGeojsons = (await Promise.all(subGeojsonsPaths.map((path) => readFile(path, 'utf8')))).map(
                        (geojson) => JSON.parse(geojson) as IGeojsonFeatureCollection,
                    );

                    const geojson: IGeojsonFeatureCollection = {
                        ...subGeojsons[0],
                        features: subGeojsons.flatMap((subGeojson) => subGeojson.features),
                        collboard: subGeojsons.map((subGeojson) => subGeojson.collboard),
                    };

                    const aggregatedGeojsonPath = join(
                        geojsonPath.replace('/2-geojsons/', '/3-geojsons-aggregated/'),
                        `${basename(geojsonPath)}.aggregated${level}.geojson`,
                    );

                    await mkdir(dirname(aggregatedGeojsonPath), { recursive: true });
                    await writeFile(aggregatedGeojsonPath, geojsonStringify(geojson), 'utf8');
                }
            } catch (error) {
                console.error(error);
            }
        }
    }

    await commit(geojsonsAggregatedPath, `🧩 Aggregate geojsons`);

    console.info(`[ Done 🧩  Aggregating geojsons ]`);
    process.exit(0);
}

/**
 * TODO: !!! Filter out duplicates like "Praha" and "Hlavní město Praha"
 * TODO: !!! Make aggregated parts like "Czech republic with rivers" OR "Czech republic with lakes"OR "Czech republic + administrative borders"
 */
