export interface IAutomaticTranslator {
    translate(message: string): Promise<string>;
}
