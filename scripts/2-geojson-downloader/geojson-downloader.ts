#!/usr/bin/env ts-node
/// <reference path="../../src/geojson/simplify-geojson.d.ts" />

//import chalk from 'chalk';
import del from 'del';
import { mkdir, writeFile } from 'fs/promises';
import { dirname, join } from 'path';
import { FEATURES } from '../../maps/1-features/features';
import { OsmGeojson } from '../../src/geojson/OsmGeojson';
import { IGeojsonFeatureCollection } from '../../src/interfaces/IGeojson';
import { isNumeric } from '../../src/utils/isNumeric';
import { GoogleAutomaticTranslator } from '../utils/automatic-translators/GoogleAutomaticTranslator';
import { geojsonStringify } from './utils/geojsonStringify';

/**/
runGeojsonDownloader(true);
/**/

async function runGeojsonDownloader(override: boolean) {
    //console.info(chalk.bgGrey(` Scraping Czech names`));

    console.info(`🧹 Making cleenup`);
    const geojsonsPath = join(__dirname, `../../maps/2-geojsons/`);

    if (override) {
        await del(geojsonsPath);
    }

    console.info(`🗺️ Downloading geojsons`);

    const translator = new GoogleAutomaticTranslator('auto', 'en');

    //await translator.translate('India');

    for (const feature of FEATURES) {
        console.info(`⬇️ Downloading ${feature.en}`);

        let geojson: IGeojsonFeatureCollection;

        try {
            geojson = (await OsmGeojson.search(feature.search)).geojson;

            // Note: There can be more features in geojson - like Praha, capital of the Czech Republic vs. Praha, small village in Slovakia
            for (const geojsonFeature of geojson.features) {
                const geopathAsEndonym = geojsonFeature
                    .properties!.display_name!.split(',')
                    .map((part) => part.trim())
                    .filter(
                        // Note: Filtering out postcodes
                        (part) => !isNumeric(part.split(/\s+/).join('')),
                    )
                    .reverse();

                // TODO: Maybe Czech places in Czech language (without diacritics)
                const geopathInEnglish = await Promise.all(geopathAsEndonym.map((name) => translator.translate(name)));
                const geopathNormalized = geopathInEnglish.map((name) =>
                    name.trim().toLowerCase().split(/\s+/).join('-'),
                );

                // console.log({ geopathAsEndonym, geopathInEnglish });

                // TODO: !!! Translate all parts of path to lowercase, without diacritics English
                const geojsonPath = join(
                    geojsonsPath,
                    ...geopathNormalized,
                    `${geopathNormalized[geopathNormalized.length - 1]}.geojson`,
                );
                await mkdir(dirname(geojsonPath), { recursive: true });

                await writeFile(
                    geojsonPath,
                    geojsonStringify({
                        ...geojson,
                        features: [geojsonFeature],
                        collboard: {
                            feature,
                        },
                    }),
                    'utf8',
                );
            }
        } catch (error) {
            console.info(feature);
            console.info(geojson!);
            console.error(error);
        }
    }
}

/**
 * TODO: !!! Full SVG with Collboard button
 * TODO: !!! Do not download bullshit like parks, points...
 * TODO: !!! Create modules from geojson files
 */
