import { readFile } from 'fs/promises';
import { basename } from 'path';

export async function getTitleOfSvg(svgPath: string): Promise<string> {
    try {
        return await readFile(svgPath, 'utf-8').then(
            (data) => /<title>(?<title>.*)<\/title>/.exec(data)!.groups!.title,
        );
    } catch (e) {
        return basename(svgPath);
    }
}
