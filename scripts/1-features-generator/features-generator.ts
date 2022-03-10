#!/usr/bin/env ts-node

import { readFile, writeFile } from 'fs/promises';
import glob from 'glob-promise';
import papaparse from 'papaparse';
import { join } from 'path';
import spaceTrim from 'spacetrim';
import { OsmGeojson } from '../../src/geojson/OsmGeojson';
import { isNumeric } from '../../src/utils/isNumeric';
import { GoogleAutomaticTranslator } from '../utils/automatic-translators/GoogleAutomaticTranslator';

const GENERATOR_WARNING = spaceTrim(`
  /**
   * 🏭 GENERATED WITH features-generator
   * ⚠️ Warning: Do not edit by hand, all changes will be lost on next execution
   */
`);

/**/
runFeaturesGenerator();
/**/

async function runFeaturesGenerator() {
    console.info(`🎹 Genetaing features`);

    const translators = {
        en: new GoogleAutomaticTranslator('auto', 'en'),
        cs: new GoogleAutomaticTranslator('auto', 'cs'),
    };
    const features: any[] = [];

    for (const csvPath of await glob(join(__dirname, '../../maps/features/countries/**/*.csv'))) {
        const country = /countries\/(?<country>.*?)\//.exec(csvPath)?.groups?.country;

        const csvString = await readFile(csvPath, 'utf8');

        const { data } = papaparse.parse(csvString.trim(), {
            header: true,
        });

        // Note: Picking first non-numeric value as name
        const featureNameKey = Object.keys(data[0] as any)[isNumeric(Object.values(data[0] as any)[0] as any) ? 1 : 0];
        const featureNames = data
            .map((row: any) => row[featureNameKey])
            .map((name) => name.split(/\[[a-zA-Z0-9]\]/g).join(''));

        for (const featureName of featureNames) {
            console.info(`🏭 Processing ${featureName}`);

            const search: Record<string, string> = !country
                ? {
                      country: featureName,
                  }
                : {
                      // TODO: Maybe in future more semantic { country: 'czechia', city: cityName }
                      country,
                      q: featureName,
                  };
            const feature = {
                // TODO: !!! Propper translate to other languages name
                en: await translators.en.translate(featureName),
                cs: await translators.cs.translate(featureName),
                search,
                searchUrl: OsmGeojson.createSearchUrl(search),
            };

            features.push(feature);
        }
    }

    await writeFile(
        join(__dirname, '../../maps/1-features/features.ts'),
        spaceTrim(
            (block) => `
              ${block(GENERATOR_WARNING)}

              export const FEATURES: Array<{ en: string; cs: string; search: any }> = [
                ${block(features.map((feature) => JSON.stringify(feature)).join(',\n'))}
              ];


            `,
        ),
        'utf8',
    );
}

/**
 * !!! TODO: Automatical translations
 */
