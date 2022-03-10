import puppeteer from 'puppeteer';
import { forTime } from 'waitasecond';
import { IAutomaticTranslator } from './IAutomaticTranslator';
import { extractMultiplicatedOccurrence } from './utils/extractMultiplicatedOccurrence';

export class GoogleAutomaticTranslator implements IAutomaticTranslator {
    public constructor(public readonly from: string, public readonly to: string) {}
    public async translate(message: string): Promise<string> {
        const url = new URL(`https://translate.google.cz`);
        url.searchParams.set('op', 'translate');
        url.searchParams.set('sl', this.from);
        url.searchParams.set('tl', this.to);
        url.searchParams.set('text', message);

        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.setExtraHTTPHeaders({
            'Accept-Language': 'en',
        });
        await page.goto(url.href);

        // TODO: Make this in english
        await (await page.$x(`//button[contains(., 'Souhlasím')]`))[0].click();

        // TODO: Instead of while-loop use forValueDefined
        let translatedElement: puppeteer.ElementHandle | undefined;
        while (!translatedElement) {
            await forTime(500);
            translatedElement = (await page.$x(`//*[@data-result-index]`))[0];
            //console.log(translatedElement);
        }

        let translatedMessage = await page.evaluate((el) => el.textContent, translatedElement);

        translatedMessage = translatedMessage.split(`Úplné výsledky`)[0];

        //console.log(`(${translatedMessage})`);
        //await forEver();

        await browser.close();

        try {
            return extractMultiplicatedOccurrence(translatedMessage);
        } catch (error) {
            // console.error(error);
            return translatedMessage;
        }
    }
}

/**
 * TODO: Recycle opened browser
 */
