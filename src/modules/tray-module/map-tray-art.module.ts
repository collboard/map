import { AbstractTrayArt, declareModule, ITrayDefinition, makeArtModule, makeTrayModule } from '@collboard/modules-sdk';
import { contributors, license, repository, version } from '../../../package.json';
import { MontessoriItemsGenerator } from './MontessoriItems';
import { trayDefinition } from './trayDefinition';


declareModule(() => makeArtModule(TrayMapArt));

export class TrayMapArt extends AbstractTrayArt {
    public static serializeName = 'TrayMapArt';
    public static manifest = {
        name: '@collboard/map-tray-art',
    };

    getDefinition() {
        return trayDefinition;
    }
}
