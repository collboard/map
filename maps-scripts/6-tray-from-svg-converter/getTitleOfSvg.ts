import { readFile } from 'fs/promises';


export async function getTitleOfSvg(svgPath: string): Promise<string> {
  return await readFile(svgPath, 'utf-8').then((data) => /<title>(?<title>.*)<\/title>/.exec(data)!.groups!.title);
}
