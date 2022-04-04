import { ITrayItemList, ITrayToolbarItems, React, Translate } from '@collboard/modules-sdk';
import { itemsArrows } from './items/arrows';
import { itemsEvenOdd } from './items/evenOdd';

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
                name: <Translate name={`Montessori / red blue bars`}>Červeno-modré tyče</Translate>,
                icon: 'redBlueBars.svg',
                scale: 0.5,
                items: toolbarRedBlueBars(),
            },
            {
                name: <Translate name={`Montessori / pearls`}>Perlový materiál</Translate>,
                icon: 'pearls.svg',
                scale: 0.6,
                items: toolbarPearls(),
            },
            {
                name: <Translate name={`Montessori / arrows`}>Šipky k perlovému materiálu</Translate>,
                icon: 'arrows.svg',
                scale: 0.6,
                items: toolbarArrows(),
            },
            {
                name: <Translate name={`Montessori / number cards`}>Karty s čísly</Translate>,
                icon: 'numberCards.svg',
                scale: 0.5,
                items: toolbarNumberCards(),
            },
            {
                name: <Translate name={`Montessori / even odd`}>Sudá a lichá</Translate>,
                icon: 'evenOdd.svg',
                scale: 0.9,
                items: toolbarEvenOdd(),
            },
            {
                name: <Translate name={`Montessori / strip sum`}>Sčítací proužková tabulka</Translate>,
                icon: 'stripSum.svg',
                scale: 0.5,
                items: toolbarStripSum(),
            },
            {
                name: <Translate name={`Montessori / hundred board`}>Stovková tabulka</Translate>,
                icon: 'hundredTable.svg',
                scale: 0.6,
                items: toolbarHundredBoard(),
            },
            {
                name: <Translate name={`Montessori / seguin board`}>Seguinova tabulka</Translate>,
                icon: 'seguinTable.svg',
                scale: 0.5,
                items: toolbarSeguinBoard(),
            },
            {
                name: <Translate name={`Montessori / mark game`}>Známková hra</Translate>,
                icon: 'markGame.svg',
                scale: 0.9,
                items: toolbarMarkGame(),
            } /*
            {
                name: <Translate name={`Montessori / abacus`}>Počítadlo</Translate>,
                icon: 'abacus.svg',
                scale: 1,
                items: [],
            },*/,
            {
                name: <Translate name={`Montessori / fractions`}>Zlomky</Translate>,
                icon: 'fractions.svg',
                scale: 0.35,
                items: toolbarFractions(),
            },
        ];
    }
}
