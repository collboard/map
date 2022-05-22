import puppeteer from 'puppeteer';
import { forTime } from 'waitasecond';
import { IAutomaticTranslator } from './IAutomaticTranslator';
import { ITranslatorOptions } from './ITranslatorOptions';
import { extractMultiplicatedOccurrence } from './utils/extractMultiplicatedOccurrence';

interface IGoogleAutomaticTranslatorOptions extends ITranslatorOptions {
    headless?: boolean;
}
export class GoogleAutomaticTranslator implements IAutomaticTranslator {
    private readonly isReady: Promise<void>;
    private browser: puppeteer.Browser;
    private page: puppeteer.Page;

    public constructor(private readonly options: IGoogleAutomaticTranslatorOptions) {
        this.isReady = this.init();
    }

    private async init() {
        const url = new URL(`https://translate.google.cz`);
        url.searchParams.set('op', 'translate');
        url.searchParams.set('sl', this.options.from);
        url.searchParams.set('tl', this.options.to);

        this.browser = await puppeteer.launch({ headless: this.options.headless ?? true });
        this.page = await this.browser.newPage();
        await this.page.setExtraHTTPHeaders({
            'Accept-Language': 'en',
        });
        await this.page.goto(url.href);

        // TODO: Make this in english
        await (await this.page.$x(`//button[contains(., 'Souhlasím')]`))[0]?.click();
        await this.page.waitForSelector(`textarea`);
    }

    public async translate(message: string): Promise<string> {
        message = message.trim();

        if (message === '') {
            return '';
        }

        // TODO: Here must be queue
        await this.isReady;

        try {
            const inputElement = (await this.page.$x(`//textarea[contains(@aria-label, 'Zdrojový text')]`))[0];
            await inputElement.focus();

            await this.page.keyboard.down('Control');
            await this.page.keyboard.press('A');
            await this.page.keyboard.up('Control');
            await this.page.keyboard.press('Backspace');
            await this.page.keyboard.type(message);

            // await forEver();

            // TODO: Instead of while-loop use forValueDefined
            let translatedElement: puppeteer.ElementHandle | undefined;

            let i = 0;
            while (!translatedElement) {
                await forTime(500 /* !!! */);
                translatedElement = (await this.page.$x(`//*[@data-result-index]`))[0];
                //console.log(translatedElement);

                if (i++ > 100) {
                    throw new Error('Can not find data-result-index on the page.');
                }
            }

            let translatedMessage = await this.page.evaluate((el) => el.textContent, translatedElement);

            translatedMessage = translatedMessage.split(`Úplné výsledky`)[0];

            //console.log(`(${translatedMessage})`);
            //await forEver();

            try {
                return extractMultiplicatedOccurrence(translatedMessage);
            } catch (error) {
                // console.error(error);
                return translatedMessage;
            }
        } catch (error) {
            console.error(error);
            return message;
        }
    }
}

/**
 * TODO: implement IDestroyable
 *       >  await browser.close();
 */
