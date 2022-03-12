#!/usr/bin/env ts-node

import del from 'del';
import { mkdir, readFile, writeFile } from 'fs/promises';
import glob from 'glob-promise';
import { jsPDF } from 'jspdf';
import { basename, dirname, join } from 'path';

/**/
convertSvgsToPdfs(true);
/**/

async function convertSvgsToPdfs(override: boolean) {
    //console.info(chalk.bgGrey(` Scraping Czech names`));

    console.info(`🧹 Making cleenup`);
    const geojsonsPath = join(__dirname, `../../maps/5-pdfs/`);

    if (override) {
        await del(geojsonsPath);
    }

    console.info(`🖨️ Converting svgs to pdfs`);

    for (const svgPath of await glob(join(__dirname, '../../maps/4-svgs/**/*.svgs'))) {
        try {
            console.info(`🗾 Converting ${basename(svgPath)}`);

            const geojson = await readFile(svgPath, 'utf8');

            const pdf = new jsPDF();

            pdf.addImage(geojson, 'svg', 10, 78, 12, 15);

            const pdfBlob = pdf.output('blob');

            await mkdir(dirname(svgPath), { recursive: true });
            await writeFile(svgPath, pdfBlob, 'binary');
        } catch (error) {
            console.error(error);
        }
    }

    console.info(`[ Done ]`);
}

/**
 * TODO: Add metadata of geo
 * TODO: Add collboard branding
 * TODO: Steganographyc information watermarking
 */
