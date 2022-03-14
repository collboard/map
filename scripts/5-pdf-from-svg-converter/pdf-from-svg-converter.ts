#!/usr/bin/env ts-node

import del from 'del';
import { mkdir, readFile, writeFile } from 'fs/promises';
import glob from 'glob-promise';
import { jsPDF } from 'jspdf';
import { basename, dirname, join } from 'path';
import sharp from 'sharp';

/**/
convertSvgsToPdfs(true);
/**/

async function convertSvgsToPdfs(override: boolean) {
    //console.info(chalk.bgGrey(` Scraping Czech names`));

    const geojsonsPath = join(__dirname, `../../maps/5-pdfs/`);

    if (override) {
        console.info(`🧹 Making cleenup`);
        await del(geojsonsPath);
    }

    console.info(`🖨️ Converting svgs to pdfs`);

    for (const svgPath of await glob(join(__dirname, '../../maps/4-svgs/**/*.svg'))) {
        try {
            console.info(`🗾 Converting ${basename(svgPath)}`);

            const geojsonSvg = await readFile(svgPath, 'utf8');
            const geojsonPng = await sharp(Buffer.from(geojsonSvg)).png().toBuffer();

            const pngPath = svgPath.replace('/4-svgs/', '/5-pdfs/') + `.png`;
            await mkdir(dirname(pngPath), { recursive: true });
            await writeFile(pngPath, geojsonPng, 'binary');

            // !!! Use pupeeteer to convert svg to png
            const pdf = new jsPDF();

            pdf.addImage(geojsonPng, 'svg', 0, 0, 12, 15);

            const pdfData = pdf.output(
                'arraybuffer' /* Note: Cannot use 'blob' because Blob is not defined in Node context */,
            );


            const pdfPath = svgPath.replace('/4-svgs/', '/5-pdfs/') + `.pdf`;
            await mkdir(dirname(pdfPath), { recursive: true });
            await writeFile(pdfPath, new Buffer(pdfData), 'binary');
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
