import chalk from 'chalk';
import { mkdir, writeFile } from 'fs/promises';
import { dirname, join } from 'path';
import spaceTrim from 'spacetrim';
import { execCommand } from '../execCommand/execCommand';
import { isWorkingTreeClean } from './isWorkingTreeClean';

export async function commit(addPath: string, message: string): Promise<void> {
    const projectPath = process.cwd();
    // const addPath = '.';

    if (await isWorkingTreeClean(projectPath)) {
        console.info(chalk.gray(`⏩ Not commiting because nothings changed`));
        return;
    }

    await execCommand({
        cwd: projectPath,
        crashOnError: false,
        command: `git add ${addPath}`,
    });

    const commitMessageFilePath = join(process.cwd(), '.tmp', 'COMMIT_MESSAGE');
    const commitMessage = spaceTrim(
        (block) => `
        ${block(message)}

        🔼 This commit was automatically generated by map scripts
      `,
    );

    await mkdir(dirname(commitMessageFilePath), { recursive: true });
    await writeFile(commitMessageFilePath, commitMessage, 'utf8');

    await execCommand({
        cwd: projectPath,
        crashOnError: false,
        command: `git commit --file ${commitMessageFilePath}`,
    });

    await execCommand({
        cwd: projectPath,
        crashOnError: false,
        command: `git push --quiet`,
    });
}
