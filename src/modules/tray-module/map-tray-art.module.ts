import { AbstractTrayArt, declareModule, makeArtModule } from '@collboard/modules-sdk';
import { contributors, license, repository, version } from '../../../package.json';
import { trayDefinition } from './trayDefinition';

declareModule(() => makeArtModule(TrayMapArt));

export class TrayMapArt extends AbstractTrayArt {
    public static serializeName = 'TrayMapArt';
    public static manifest = {
        name: '@collboard/map-tray-art',
        contributors,
        license,
        repository,
        version,
    };

    getDefinition() {
        return trayDefinition;
    }
}
