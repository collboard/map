#!/usr/bin/env ts-node

import { readFile, writeFile } from 'fs/promises';
import glob from 'glob-promise';
import papaparse from 'papaparse';
import { basename, join } from 'path';
import spaceTrim from 'spacetrim';
import { forEver } from 'waitasecond';
import { OsmGeojson } from '../../src/geojson/OsmGeojson';
import { isNumeric } from '../../src/utils/isNumeric';
import { DebugAutomaticTranslator } from '../utils/automatic-translators/DebugAutomaticTranslator';
import { FakeAutomaticTranslator } from '../utils/automatic-translators/FakeAutomaticTranslator';
import { GoogleAutomaticTranslator } from '../utils/automatic-translators/GoogleAutomaticTranslator';
import { IAutomaticTranslator } from '../utils/automatic-translators/IAutomaticTranslator';
import { MultiAutomaticTranslator } from '../utils/automatic-translators/MultiAutomaticTranslator';
import { capitalizeFirstLetter } from '../utils/capitalizeFirstLetter';
import { prettify } from '../utils/prettify';
import { completeGeopath } from './utils/completeGeopath';
import { isGeopathValid } from './utils/isGeopathValid';

const GENERATOR_WARNING = spaceTrim(`
  /**
   * 🏭 GENERATED WITH features-generator
   * ⚠️ Warning: Do not edit by hand, all changes will be lost on next execution
   */
`);

/**/
runFeaturesGenerator({ isDebug: true });
/**/

async function runFeaturesGenerator({ isDebug }: { isDebug: boolean }) {
    console.info(`🎹 Genetaing features`);

    const translator = new MultiAutomaticTranslator({
        createAutomaticTranslator(options) {
            if (isDebug) {
                return new FakeAutomaticTranslator();
            } else {
                const translator = new GoogleAutomaticTranslator({ ...options, headless: true });
                const geoTranslator: IAutomaticTranslator = {
                    async translate(message: string) {
                        let translated = await translator.translate(message);
                        translated = translated.replace(/\.$/, '');
                        return translated;
                    },
                };
                return geoTranslator;
                return new DebugAutomaticTranslator(geoTranslator);
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
                      import { IGeopath } from './geopath';

                      ${block(GENERATOR_WARNING)}

                      export const FEATURES: Array<{ en?: string; cs?: string; search: any, searchUrl: string, geopath: IGeopath }> = [
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
        console.info(`🗄️ Processing file ${basename(csvPath)}`);
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
            const region: string | null = capitalizeFirstLetter(row['Region'] || 'Europe');
            const country: string | null = capitalizeFirstLetter(csvCountry || row['Country'] || null);
            const county: string | null = capitalizeFirstLetter(row['County'] || null);
            const district: string | null = capitalizeFirstLetter(row['District'] || null);
            const city: string | null = capitalizeFirstLetter(row['City'] || null);

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
                geopath: Object.fromEntries(
                    Object.entries({ region, country, county, district, city }).filter(
                        ([key, value]) => value !== null,
                    ),
                ),
            };

            if (csvCountry !== 'czechia') {
                feature = {
                    en: await translator.translate({ from: featureLanguage, to: 'en', message: featureName }),
                    ...feature,
                };
            }

            for (const checkedFeature of features) {
                checkedFeature.geopath = completeGeopath({ model: feature.geopath, reciever: checkedFeature.geopath });
            }

            features.push(feature);

            if (!isDebug && features.length % 64 === 0) {
                await save();
            }
        }
    }

    for (const checkedFeature of features) {
        if (!isGeopathValid(checkedFeature.geopath)) {
            console.warn(`🚨 Gap in geopath of ${checkedFeature.cs}`);
        }
    }

    await save();
    console.info(`[ Done 🎹 Genetaing features ]`);
    process.exit(0);
}

/**
 * TODO: Also translate to sk, pl and uk
 */
