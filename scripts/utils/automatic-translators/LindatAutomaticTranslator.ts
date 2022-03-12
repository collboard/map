import FormData from 'form-data';
import fetch from 'node-fetch';
import { IAutomaticTranslator } from './IAutomaticTranslator';
import { ITranslatorOptions } from './ITranslatorOptions';

interface ILindatAutomaticTranslatorOptions extends ITranslatorOptions {}

export class LindatAutomaticTranslator implements IAutomaticTranslator {
    public constructor(private readonly options: ILindatAutomaticTranslatorOptions) {}
    public async translate(message: string): Promise<string> {
        const formData = new FormData();
        formData.append('input_text', message);
        formData.append('src', this.options.from);
        formData.append('tgt', this.options.to);

        const response = await fetch(`https://lindat.mff.cuni.cz/services/translation/api/v2/languages/`, {
            method: 'POST',
            body: formData,
        });

        const translation = await response.text();

        // TODO: Handle errors
        return translation;
    }
}
