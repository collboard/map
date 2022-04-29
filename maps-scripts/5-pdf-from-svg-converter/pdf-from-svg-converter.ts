#!/usr/bin/env ts-node

import commander from 'commander';
import del from 'del';
import { mkdir, readFile, unlink, writeFile } from 'fs/promises';
import glob from 'glob-promise';
import { basename, dirname, join, relative } from 'path';
import puppeteer from 'puppeteer';
import { commit } from '../utils/autocommit/commit';
import { forPlay } from '../utils/forPlay';

const program = new commander.Command();
program.option('--commit', `Autocommit changes`);
program.parse(process.argv);
const { commit: isCommited } = program.opts();

convertSvgsToPdfs({ isCleanupPerformed: true, isCommited })
    .catch((error) => {
        console.error(error);
    })
    .then(() => {
        process.exit(0);
    });

async function convertSvgsToPdfs({
    isCleanupPerformed,
    isCommited,
}: {
    isCleanupPerformed: true;
    isCommited: boolean;
}) {
    //console.info(chalk.bgGrey(` Scraping Czech names`));

    // TODO: !!! Temporary blocked - not doing anything with PDFs now
    return;

    const pdfsPath = join(__dirname, `../../maps/5-pdfs/`);

    if (isCleanupPerformed) {
        console.info(`🧹 Making cleenup for 🖨️  Converting svgs to pdfs`);
        await del(pdfsPath);
    }

    console.info(`🖨️  Converting svgs to pdfs`);

    const template = await readFile(join(__dirname, './sample.svg'), 'utf8');

    for (const svgPath of await glob(join(__dirname, '../../maps/4-svgs/**/*.svg'))) {
        try {
            await forPlay();
            console.info(`🗾  Converting ${basename(svgPath)}`);

            const svgTmpPath = svgPath.replace('/4-svgs/', '/5-pdfs/') + `.tmp.svg`;

            const svgTmpData = template.replace(
                '"../../maps/4-svgs/world/africa/africa.aggregated2.geojson.lod-5.svg"',
                '"' +
                    join(relative(svgTmpPath, svgPath))
                        .split('\\')
                        .join('/')
                        .replace(/^\.\.\//, '') +
                    '"',
            );

            const pdfPath = svgPath.replace('/4-svgs/', '/5-pdfs/') + `.pdf`;
            await mkdir(dirname(pdfPath /* Note: This path is shared with svgTmpPath */), { recursive: true });
            await writeFile(svgTmpPath, svgTmpData, 'utf8');

            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto(svgTmpPath);
            await page.pdf({
                path: pdfPath,
                margin: { left: 0, right: 0, top: 0, bottom: 0 },
                printBackground: true,
                pageRanges: '1',
            });

            await unlink(svgTmpPath);

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

    await commit(pdfsPath, `🖨️ Create pdfs from svgs `);

    console.info(`[ Done 🖨️  Converting svgs to pdfs ]`);
    process.exit(0);
}

/**
 * TODO: Add metadata of geo
 * TODO: Add collboard branding
 * TODO: Steganographyc information watermarking
 */
