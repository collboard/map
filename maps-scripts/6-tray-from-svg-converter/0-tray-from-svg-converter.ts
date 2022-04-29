#!/usr/bin/env ts-node

import commander from 'commander';
import { convertSvgsToTrayDefinitions } from './1-convertSvgsToTrayDefinitions';

const program = new commander.Command();
program.option('--commit', `Autocommit changes`);
program.parse(process.argv);
const { commit } = program.opts();

/**/
convertSvgsToTrayDefinitions({ isCleanupPerformed: true, isCommited: commit })
    .catch((error) => {
        console.error(error);
    })
    .then(() => {
        process.exit(0);
    });
