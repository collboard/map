#!/usr/bin/env ts-node

import { readFile, writeFile } from 'fs/promises';
import papaparse from 'papaparse';
import { join } from 'path';
import spaceTrim from 'spacetrim';

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

    const csvString = await readFile(join(__dirname, '../../maps/features/countries/czechia/cities.csv'), 'utf8');

    const { data } = papaparse.parse(csvString.trim(), {
        header: true,
    });

    const cityNameKey = Object.keys(data[0] as any)[1];
    const cityNames = data.map((row: any) => row[cityNameKey]);

    await writeFile(
        join(__dirname, '../../maps/features/features.ts'),
        spaceTrim(
            (block) => `
              ${block(GENERATOR_WARNING)}

              export const FEATURES: any = [
                ${block(
                    cityNames
                        .map(
                            (cityName) =>
                                `// { cs: '${cityName}', search: { country: 'czechia', city: '${cityName}' } }`,
                        )
                        .join(',\n'),
                )}
              ];


            `,
        ),
        'utf8',
    );
}

/**
 * !!! TODO: Automatical translations
 */
