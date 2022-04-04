import { ITrayItemList, ITrayToolbarItems, React, Translate } from '@collboard/modules-sdk';
import { itemsArrows, toolbarArrows } from './items/arrows';
import { itemsEvenOdd, toolbarEvenOdd } from './items/evenOdd';

export class MontessoriItemsGenerator {
    static privateItems: ITrayItemList;
    static privateToolbar: ITrayToolbarItems;

    public static items(): ITrayItemList {
        if (!this.privateItems) {
            this.privateItems = MontessoriItemsGenerator.createItems();
        }

        return this.privateItems;
    }

    public static toolbar(): ITrayToolbarItems {
        if (!this.privateToolbar) {
            this.privateToolbar = MontessoriItemsGenerator.createToolbar();
        }

        return this.privateToolbar;
    }

    private static createItems(): ITrayItemList {
        return {
            ...itemsEvenOdd(),
            ...itemsArrows(),
        };
    }

    private static createToolbar(): ITrayToolbarItems {
        return [
            {
                name: <Translate name={`Montessori / even odd`}>Sudá a lichá</Translate>,
                icon: 'evenOdd.svg',
                scale: 0.9,
                items: toolbarEvenOdd(),
            },

            {
                name: <Translate name={`Montessori / arrows`}>Šipky k perlovému materiálu</Translate>,
                icon: 'arrows.svg',
                scale: 0.6,
                items: toolbarArrows(),
            },
        ];
    }
}

/**
 * TODO: !!! Translations in modules
 */
