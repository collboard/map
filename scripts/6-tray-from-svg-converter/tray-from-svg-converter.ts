#!/usr/bin/env ts-node

import { join } from 'path';

/**/
convertSvgsToTrayDefinitions({});
/**/

async function convertSvgsToTrayDefinitions() {
    //console.info(chalk.bgGrey(` Scraping Czech names`));

    const geojsonsPath = join(__dirname, `../../maps/5-pdfs/`);

    console.info(`🚡 Tray from svg converter`);

    console.info(`[ Done 🚡 Tray from svg converter ]`);
    process.exit(0);
}
