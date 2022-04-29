#!/usr/bin/env ts-node
/// <reference path="../../src/geojson/simplify-geojson.d.ts" />

//import chalk from 'chalk';
import commander from 'commander';
import del from 'del';
import { mkdir, writeFile } from 'fs/promises';
import { dirname, join } from 'path';
import { FEATURES } from '../../maps/1-features/features';
import { OsmGeojson } from '../../src/geojson/OsmGeojson';
import { IGeojsonFeatureCollection } from '../../src/interfaces/IGeojson';
import { commit } from '../utils/autocommit/commit';
import { DebugAutomaticTranslator } from '../utils/automatic-translators/DebugAutomaticTranslator';
import { GoogleAutomaticTranslator } from '../utils/automatic-translators/GoogleAutomaticTranslator';
import { forPlay } from '../utils/forPlay';
import { removeDiacritics } from '../utils/removeDiacritics';
import { geojsonStringify } from './utils/geojsonStringify';

/**/

const program = new commander.Command();
program.option('--commit', `Autocommit changes`);
program.parse(process.argv);
const { commit: isCommited } = program.opts();

runGeojsonDownloader({ isCleanupPerformed: true, isCommited })
    .catch((error) => {
        console.error(error);
    })
    .then(() => {
        process.exit(0);
    });
/**/

async function runGeojsonDownloader({
    isCleanupPerformed,
    isCommited,
}: {
    isCleanupPerformed: boolean;
    isCommited: boolean;
}) {
    const geojsonsPath = join(__dirname, `../../maps/2-geojsons/world`);

    if (isCleanupPerformed) {
        console.info(`🧹 Making cleenup for 🗺️ Downloading geojsons`);
        await del(geojsonsPath);
    }

    console.info(`🗺️ Downloading geojsons`);

    const translator = new DebugAutomaticTranslator(new GoogleAutomaticTranslator({ from: 'auto', to: 'en' }));

    //await translator.translate('India');

    for (const feature of FEATURES) {
        await forPlay();
        console.info(`⬇️ Downloading ${feature.en || feature.cs}`);

        let geojson: IGeojsonFeatureCollection;

        try {
            geojson = (await OsmGeojson.search(feature.search)).geojson;

            /*
              TODO: Check that feature.geopath corresponds to geojsonFeature.properties!.display_name!.split(',')

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

              // TODO: In future only use geopath and compare to properties.display_name from OSM
              geopathInEnglish.unshift(...feature.geopath);

              const geopathNormalized = geopathInEnglish.map((name) =>
                  name.trim().toLowerCase().split(/\s+/).join('-'),
              );

              // console.log({ geopathAsEndonym, geopathInEnglish });
              */

            const geopathNormalized = Object.values(feature.geopath).map((geopart) =>
                // TODO: Make one normalizeGeoname function
                //       "Wallis and futuna (france)" -> "wallis-and-futuna-france"
                removeDiacritics(geopart).split(/\s+/).join('-').toLowerCase(),
            );
            const geojsonPath = join(
                geojsonsPath,
                ...geopathNormalized,
                `${geopathNormalized[geopathNormalized.length - 1]}.geojson`,
            );
            await mkdir(dirname(geojsonPath), { recursive: true });

            if (geojsonPath.includes('maps/4-svgs/world/europe/czechia/praha')) {
                // TODO: !!! Is this working?
                continue;
            }

            await writeFile(
                geojsonPath,
                geojsonStringify({
                    ...geojson,

                    collboard: {
                        feature,
                    },
                }),
                'utf8',
            );
        } catch (error) {
            console.info(feature);
            console.info(geojson!);
            console.error(error);
        }
    }

    if (isCommited) {
        await commit(geojsonsPath, `🗺️ Download geojsons`);
    }

    console.info(`[ Done 🗺️ Downloading geojsons ]`);
    process.exit(0);
}

/**
 * TODO: !!! Full SVG with Collboard button
 * TODO: !!! Do not download bullshit like parks, points...
 * TODO: !!! Create modules from geojson files
 */
