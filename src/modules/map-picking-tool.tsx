import { declareModule, makeIconModuleOnModule, ToolbarName } from '@collboard/modules-sdk';
import { Registration } from 'destroyable';
import helloWorldIcon from '../../assets/hello-world-icon.png';
import { contributors, description, license, repository, version } from '../../package.json';
import { MapPolygonArt } from './map-polygon-art';

declareModule(() => {
    return makeIconModuleOnModule({
        manifest: {
            name: `@collboard/map-picking-tool`,
            version,
            description,
            contributors,
            license,
            repository,
            title: { en: 'Sample button' },
            categories: ['Productivity', 'Buttons', 'Template'],
            icon: helloWorldIcon,
            flags: {
                isTemplate: true,
            },
        },
        toolbar: ToolbarName.Tools,
        icon: {
            name: 'functionBuilder',
            autoSelect: true,
            order: 10000,
            char: '🚩',
            boardCursor: 'default',
        },
        moduleActivatedByIcon: {
            async setup(systems) {
                const {
                    touchController,
                    virtualArtVersioningSystem,
                    materialArtVersioningSystem,
                    collSpace,
                    notificationSystem,
                } = await systems.request(
                    'touchController',
                    'virtualArtVersioningSystem',
                    'materialArtVersioningSystem',
                    'collSpace',
                    'notificationSystem',
                );

                return Registration.fromSubscription((registerAdditionalSubscription) =>
                    touchController.touches.subscribe((touch) => {
                        const pointOnScreen = touch.firstFrame.position;
                        const pointOnBoard = collSpace.pickPoint(pointOnScreen).point;

                        notificationSystem.publish({
                            type: 'info',
                            tag: `picked-point-${touch.firstFrame.position}`,
                            title: 'Picked point on map!',
                            body: `You have picked point ${touch.firstFrame.position} on the map.`,
                            canBeClosed: true,
                        });

                        const polygonArt = new MapPolygonArt([pointOnBoard, pointOnBoard.add({ x: 10 })], 'blue', 20);

                        materialArtVersioningSystem.createPrimaryOperation().newArts(polygonArt).persist();
                    }),
                );
            },
        },
    });
});
