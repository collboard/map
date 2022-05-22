#!/usr/bin/env ts-node
/// <reference path="../../src/geojson/simplify-geojson.d.ts" />

import commander from 'commander';
import del from 'del';
import { mkdir, readFile, writeFile } from 'fs/promises';
import glob from 'glob-promise';
import { basename, dirname, join } from 'path';
import { IGeojsonFeatureCollection } from '../../src/interfaces/IGeojson';
import { geojsonStringify } from '../2-geojson-downloader/utils/geojsonStringify';
import { commit } from '../utils/autocommit/commit';
import { forPlay } from '../utils/forPlay';

/**/

const program = new commander.Command();
program.option('--commit', `Autocommit changes`);
program.parse(process.argv);
const { commit: isCommited } = program.opts();

runGeojsonAggregator({ isCleanupPerformed: true, isCommited })
    .catch((error) => {
        console.error(error);
    })
    .then(() => {
        process.exit(0);
    });
/**/

async function runGeojsonAggregator({
    isCleanupPerformed,
    isCommited,
}: {
    isCleanupPerformed: boolean;
    isCommited: boolean;
}) {
    const geojsonsAggregatedPath = join(__dirname, `../../maps/3-geojsons-aggregated`);

    if (isCleanupPerformed) {
        console.info(`🧹 Making cleenup for 🧩 Aggregating geojsons`);
        await del(geojsonsAggregatedPath);
    }

    console.info(`🧩  Aggregating geojsons`);

    for (const geojsonPath of Array.from(
        new Set((await glob(join(__dirname, `../../maps/2-geojsons/**/*`))).map((path) => dirname(path))),
    )) {
        for (const level of [1, 2, 3 /* Note: For Czechia makes most sence to have 3 aggregation levels */]) {
            for (const categories of [
                ['waterway', 'boundary'],
                // Note: It probbably does not make sence to aggregate only waterways ['waterway'],
                ['boundary'],
            ] /* <- TODO: Make and combine this dynamically */) {
                try {
                    await forPlay();
                    const subGeojsonsPaths = (
                        await Promise.all(categories.map((category) => glob(geojsonPath + `/**/*.${category}.geojson`)))
                    )
                        .flat()
                        // TODO: Can be used some glob pattern instead of mapping of multiple globs and flattening them
                        //     > await glob(geojsonPath + `/**/*.(${categories.join('|')}).geojson`)
                        .filter(
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
                            `🧩 Aggregating ${subGeojsonsPaths.length} geojsons ${basename(
                                geojsonPath,
                            )} on level ${level} categories ${categories.join(', ')}`,
                        );

                        const subGeojsons = (
                            await Promise.all(subGeojsonsPaths.map((path) => readFile(path, 'utf8')))
                        ).map((geojson) => JSON.parse(geojson) as IGeojsonFeatureCollection);

                        const geojson: IGeojsonFeatureCollection = {
                            ...subGeojsons[0],
                            features: subGeojsons.flatMap((subGeojson) => subGeojson.features),
                            collboard: subGeojsons.map((subGeojson) => subGeojson.collboard),
                        };

                        const aggregatedGeojsonPath = join(
                            geojsonPath.replace('/2-geojsons/', '/3-geojsons-aggregated/'),
                            `${basename(geojsonPath)}.aggregated${level}.${categories.join('+')}.geojson`,
                        );

                        await mkdir(dirname(aggregatedGeojsonPath), { recursive: true });
                        await writeFile(aggregatedGeojsonPath, geojsonStringify(geojson), 'utf8');
                    }
                } catch (error) {
                    console.error(error);
                }
            }
        }
    }

    if (isCommited) {
        await commit(geojsonsAggregatedPath, `🧩 Aggregate geojsons`);
    }

    console.info(`[ Done 🧩  Aggregating geojsons ]`);
    process.exit(0);
}

/**
 * TODO: !!! Filter out duplicates like "Praha" and "Hlavní město Praha"
 * TODO: !!! Make aggregated parts like "Czech republic with rivers" OR "Czech republic with lakes"OR "Czech republic + administrative borders"
 */
