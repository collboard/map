import FormData from 'form-data';
import fetch from 'node-fetch';
import { IAutomaticTranslator } from './IAutomaticTranslator';

export class LindatAutomaticTranslator implements IAutomaticTranslator {
    public constructor(public readonly from: string, public readonly to: string) {}
    public async translate(message: string): Promise<string> {
        const formData = new FormData();
        formData.append('input_text', message);
        formData.append('src', this.from);
        formData.append('tgt', this.to);

        const response = await fetch(`https://lindat.mff.cuni.cz/services/translation/api/v2/languages/`, {
            method: 'POST',
            body: formData,
        });

        const translation = await response.text();

        // TODO: Handle errors
        return translation;
    }
}
