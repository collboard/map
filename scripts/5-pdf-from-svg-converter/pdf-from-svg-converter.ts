#!/usr/bin/env ts-node

import del from 'del';
import { mkdir, writeFile } from 'fs/promises';
import glob from 'glob-promise';
import { basename, dirname, join, relative } from 'path';
import puppeteer from 'puppeteer';
import { spaceTrim } from 'spacetrim';

/**/
convertSvgsToPdfs({ isCleanupPerformed: true });
/**/

async function convertSvgsToPdfs({ isCleanupPerformed }: { isCleanupPerformed: true }) {
    //console.info(chalk.bgGrey(` Scraping Czech names`));

    const geojsonsPath = join(__dirname, `../../maps/5-pdfs/`);

    if (isCleanupPerformed) {
        console.info(`🧹 Making cleenup for 🖨️ Converting svgs to pdfs`);
        await del(geojsonsPath);
    }

    console.info(`🖨️ Converting svgs to pdfs`);

    for (const svgPath of await glob(join(__dirname, '../../maps/4-svgs/**/*.svg'))) {
        try {
            console.info(`🗾 Converting ${basename(svgPath)}`);

            const htmlPath = svgPath.replace('/4-svgs/', '/5-pdfs/') + `.html`;

            const geojsonHtml = spaceTrim(`
                <!DOCTYPE html>
                <html lang="cs" dir="ltr">
                  <head>
                    <meta charset="UTF-8">
                    <title>Titulek stránky</title>
                  </head>
                  <body>
                    <img src="${relative(dirname(htmlPath), svgPath)}"/>
                  </body>
                </html>
            `);

            await mkdir(dirname(htmlPath), { recursive: true });
            await writeFile(htmlPath, geojsonHtml, 'utf8');

            const pdfPath = svgPath.replace('/4-svgs/', '/5-pdfs/') + `.pdf`;
            await mkdir(dirname(pdfPath), { recursive: true });

            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto(htmlPath);
            await page.pdf({
                path: pdfPath,
            });

            /*
            !!! Remove
            const geojsonSvg = await readFile(svgPath, 'utf8');
            const geojsonPng = await sharp(Buffer.from(geojsonSvg)).png().toBuffer();

            const pngPath = svgPath.replace('/4-svgs/', '/5-pdfs/') + `.png`;
            await mkdir(dirname(pngPath), { recursive: true });
            await writeFile(pngPath, geojsonPng, 'binary');

            // !!! Use pupeeteer to convert svg to png
            const pdf = new jsPDF();

            pdf.addImage(geojsonPng, 'svg', 0, 0, 12, 15);

            const pdfData = pdf.output(
                'arraybuffer' /* Note: Cannot use 'blob' because Blob is not defined in Node context * /,
            );


            const pdfPath = svgPath.replace('/4-svgs/', '/5-pdfs/') + `.pdf`;
            await mkdir(dirname(pdfPath), { recursive: true });
            await writeFile(pdfPath, new Buffer(pdfData), 'binary');
            */
        } catch (error) {
            console.error(error);
        }
    }

    console.info(`[ Done 🖨️ Converting svgs to pdfs ]`);
    process.exit(0);
}

/**
 * TODO: Add metadata of geo
 * TODO: Add collboard branding
 * TODO: Steganographyc information watermarking
 */
