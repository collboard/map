import glob from 'glob-promise';
import { basename, join, relative } from 'path';

interface IFindSvgsOptions {
    path: string;
    level: number;
    //basenamePattern: RegExp;

    filter?: {
        aggregated?: number | null;
        categories?: string[];
    };
}
export async function findSvgs({ path, level, filter }: IFindSvgsOptions): Promise<string[]> {
    const svgsPaths: string[] = [];

    svg: for (const svgPath of await glob(join(path, '/**/*.svg'))) {
        const svgLevel = svgPath.split(/[\/\\]/g).length - path.split(/[\/\\]/g).length;

        if (svgLevel !== level) {
            continue svg;
        }

        const { aggregatedRaw, categoriesRaw, lodRaw } =
            // @see https://regex101.com/r/RWAe43/1
            /^(?<normalizedName>[a-z-]*)(\.aggregated(?<aggregatedRaw>\d+))?(\.(?<categoriesRaw>(waterway|boundary|\+)+))?(\.geojson)(\.lod(?<lodRaw>(p|n)\d+))?\.svg$/.exec(
                basename(svgPath),
            )?.groups!;

        const aggregated = parseInt(aggregatedRaw);
        const categories = categoriesRaw.split('+');
        // const lod = (lodRaw.substring(0, 1) === 'p' ? 1 : -1) * parseInt(lodRaw.substring(1));

        if (filter && filter.aggregated) {
            if (aggregated !== filter.aggregated) {
                continue svg;
            }
        }

        if (filter && filter.aggregated === null) {
            if (aggregated) {
                continue svg;
            }
        }

        if (filter && filter.categories) {
            const a = new Set(categories);
            const b = new Set(filter.categories);
            if (a.size !== b.size) continue svg;
            for (const aItem of a) {
                if (!b.has(aItem)) {
                    continue svg;
                }
            }
        }

        svgsPaths.push(relative(process.cwd(), svgPath));
    }

    return svgsPaths;
}
