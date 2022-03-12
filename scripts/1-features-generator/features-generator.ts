#!/usr/bin/env ts-node

import { readFile, writeFile } from 'fs/promises';
import glob from 'glob-promise';
import papaparse from 'papaparse';
import { join } from 'path';
import spaceTrim from 'spacetrim';
import { OsmGeojson } from '../../src/geojson/OsmGeojson';
import { isNumeric } from '../../src/utils/isNumeric';
import { DebugAutomaticTranslator } from '../utils/automatic-translators/DebugAutomaticTranslator';
import { FakeAutomaticTranslator } from '../utils/automatic-translators/FakeAutomaticTranslator';
import { GoogleAutomaticTranslator } from '../utils/automatic-translators/GoogleAutomaticTranslator';
import { MultiAutomaticTranslator } from '../utils/automatic-translators/MultiAutomaticTranslator';
import { prettify } from '../utils/prettify';

const GENERATOR_WARNING = spaceTrim(`
  /**
   * 🏭 GENERATED WITH features-generator
   * ⚠️ Warning: Do not edit by hand, all changes will be lost on next execution
   */
`);

/**/
runFeaturesGenerator(true);
/**/

async function runFeaturesGenerator(isDebug = false) {
    console.info(`🎹 Genetaing features`);

    const translator = new MultiAutomaticTranslator({
        createAutomaticTranslator(options) {
            if (isDebug) {
                return new FakeAutomaticTranslator();
            } else {
                const translator = new GoogleAutomaticTranslator({ ...options, headless: true });
                return new DebugAutomaticTranslator({
                    async translate(message: string) {
                        let translated = await translator.translate(message);
                        translated = translated.replace(/\.$/, '');
                        return translated;
                    },
                });
            }
        },
    });

    async function save() {
        console.info(`💾 Saving`);
        await writeFile(
            join(__dirname, '../../maps/1-features/features.ts'),
            await prettify(
                spaceTrim(
                    (block) => `
                      ${block(GENERATOR_WARNING)}

                      export const FEATURES: Array<{ en?: string; cs?: string; search: any, searchUrl: string, geoPath: Array<string|null> }> = [
                        ${block(features.map((feature) => JSON.stringify(feature)).join(',\n'))}
                      ];

                    `,
                ),
            ),
            'utf8',
        );
    }

    const features: any[] = [];

    for (const csvPath of await glob(join(__dirname, '../../maps/0-features-lists/**/*.csv'))) {
        const csvCountry = /0-features-lists\/(?<country>.*?)\//.exec(csvPath)?.groups?.country;

        const csvString = await readFile(csvPath, 'utf8');

        const { data } = papaparse.parse(csvString.trim(), {
            header: true,
        });

        // "World", Region, Country, County, District, City
        // Note: Picking first non-numeric value as name
        const featureNameKey = Object.keys(data[0] as any)[isNumeric(Object.values(data[0] as any)[0] as any) ? 1 : 0];
        const featureLanguage = csvCountry === 'czechia' ? 'cs' : 'en';

        for (const row of data as any) {
            const geoRegion: string | null = row['Region'] || 'Europe';
            const geoCountry: string | null = csvCountry || row['Country'] || null;
            const geoCounty: string | null = row['County'] || null;
            const geoDistrict: string | null = row['District'] || null;
            const geoCity: string | null = row['City'] || null;

            const featureName: string = row[featureNameKey].split(/\[[a-zA-Z0-9]\]/g).join('');

            console.info(`🏭 Processing ${featureName}`);

            const search: Record<string, string> = !csvCountry
                ? {
                      country: featureName,
                  }
                : {
                      // TODO: Maybe in future more semantic { country: 'czechia', city: cityName }
                      country: csvCountry,
                      q: featureName,
                  };
            let feature: Record<string, any> = {
                cs: await translator.translate({ from: featureLanguage, to: 'cs', message: featureName }),
                search,
                searchUrl: OsmGeojson.createSearchUrl(search),
                geoPath: ['World', geoRegion, geoCountry, geoCounty, geoDistrict, geoCity] /*.filter(
                    (geoPart) => geoPart !== null,
                )*/,
            };

            if (csvCountry !== 'czechia') {
                feature = {
                    en: await translator.translate({ from: featureLanguage, to: 'en', message: featureName }),
                    ...feature,
                };
            }

            features.push(feature);

            if (!isDebug && features.length % 64 === 0) {
                await save();
            }
        }

        await save();
        console.info(`[ Done ]`);
    }
}

/**
 * TODO: Also translate to sk, pl and uk
 */
