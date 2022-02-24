#!/usr/bin/env ts-node

import { readFile, writeFile } from 'fs/promises';
import glob from 'glob-promise';
import papaparse from 'papaparse';
import { join } from 'path';
import spaceTrim from 'spacetrim';
import { isNumeric } from '../../src/utils/isNumeric';

const GENERATOR_WARNING = spaceTrim(`
  /**
   * 🏭 GENERATED WITH features-generator
   * ⚠️ Warning: Do not edit by hand, all changes will be lost on next execution
   */
`);

/**/
generateFeatures();
/**/

async function generateFeatures() {
    console.info(`🎹 Generating features from CSVs`);

    const features: any[] = [];

    for (const csvPath of await glob(join(__dirname, '../../maps/features/countries/**/*.csv'))) {
        const country = /countries\/(?<country>.*?)\//.exec(csvPath)?.groups?.country;
        console.log({ country });

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
            const feature = {
                cs: featureName,
                search: {
                    // TODO: Maybe in future more semantic { country: 'czechia', city: cityName }
                    country,
                    q: featureName,
                },
            };

            if (country === null) {
                delete feature.search.country;
            }
            
            features.push(feature);
        }
    }

    await writeFile(
        join(__dirname, '../../maps/features/features.ts'),
        spaceTrim(
            (block) => `
              ${block(GENERATOR_WARNING)}

              export const FEATURES: any = [
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
