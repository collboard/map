import glob from 'glob-promise';
import { basename, join } from 'path';

interface IFindSvgsOptions {
  path: string;
  level: number;
  basenamePattern: RegExp;
}
export async function findSvgs({ path, level, basenamePattern }: IFindSvgsOptions): Promise<string[]> {
  const svgsPaths: string[] = [];

  for (const svgPath of await glob(join(path, '/**/*.svg'))) {
    const svgLevel = svgPath.split(/[\/\\]/g).length - path.split(/[\/\\]/g).length;

    if (svgLevel !== level) {
      continue;
    }

    if (!basename(svgPath).match(basenamePattern)) {
      continue;
    }

    svgsPaths.push(svgPath);
  }

  return svgsPaths;
}
