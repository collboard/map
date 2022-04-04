import { AbstractTrayArt, declareModule, ITrayDefinition, makeArtModule, makeTrayModule } from '@collboard/modules-sdk';
import { MontessoriItemsGenerator } from './MontessoriItems';

/**
 * Note: In future this file will we in independent repository as external module.
 */

const trayDefinition: ITrayDefinition = {
    className: 'MontessoriModule',
    imageFolder: 'http://localhost:9980/modules/Montessori' /* <- !!! Assets */,
    getItems: MontessoriItemsGenerator.items,
    getToolbarItems: MontessoriItemsGenerator.toolbar,
};

declareModule(
    makeTrayModule({
        manifest: {
            name: 'MontessoriTool',
            title: { en: 'Montessori environments', cs: 'Montessori prostředí' },
            description: {
                en: 'Materiál for teaching mathematics using montessori method of education',
                cs: 'Materiál pro výuku matematiky podle montessori pedagogiky',
            },

            categories: ['Math', 'Education'],
            icon: 'http://localhost:9980/icons/abacus.svg',

            author: Authors.hedu,
            contributors: [Authors.rosecky],
        },
        icon: {
            order: 60,

            icon: 'abacus',
            boardCursor: 'default',
        },
        trayDefinition,
        newArtMaker: (...args) => new MontessoriArt(...args),
    }),
);

declareModule(() => makeArtModule(MontessoriArt));

class MontessoriArt extends AbstractTrayArt {
    public static serializeName = 'Montessori';
    public static manifest = {
        // Note+TODO: All modules should be in format @collboard/module-name but we started with art modules
        name: '@collboard/montessori-art',
    };

    getDefinition() {
        return trayDefinition;
    }
}

/**
 * !!! Split into module files + module names + propper module manifest + import in index
 */
