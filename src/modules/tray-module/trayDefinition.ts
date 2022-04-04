import { ITrayDefinition } from '@collboard/modules-sdk';
import { MontessoriItemsGenerator } from './MontessoriItems';

export const trayDefinition: ITrayDefinition = {
  className: 'MontessoriModule',
  imageFolder: 'http://localhost:9980/modules/Montessori' /* <- !!! Assets */,
  getItems: MontessoriItemsGenerator.items,
  getToolbarItems: MontessoriItemsGenerator.toolbar,
};
