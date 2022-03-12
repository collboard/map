#!/usr/bin/env ts-node
/// <reference path="../../src/geojson/simplify-geojson.d.ts" />

import glob from 'glob-promise';
import { dirname, join } from 'path';

/**/
runGeojsonAggregator();
/**/

async function runGeojsonAggregator() {
    console.info(`🏭🔗 Aggregating geojsons`);

    for (const geojsonPath of await glob(join(__dirname, '../../maps/2-geojsons/**/*.geojson'))) {
        try {

         const subGeojsonPaths = await glob( dirname(geojsonPath)+'/**/*.geojson'));

         console.log([geojsonPath,...subGeojsonPaths]);

        } catch (error) {
            console.error(error);
        }
    }

    console.info(`[ Done ]`);
}

/**
 * TODO: !!! Make aggregated parts like "Czech republic with rivers" OR "Czech republic with lakes"OR "Czech republic + administrative borders"
 */
