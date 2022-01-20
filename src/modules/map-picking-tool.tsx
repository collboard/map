import { declareModule, makeIconModuleOnModule, ToolbarName } from '@collboard/modules-sdk';
import { Registration } from 'destroyable';
import { forTime } from 'waitasecond';
import helloWorldIcon from '../../assets/hello-world-icon.png';
import { contributors, description, license, repository, version } from '../../package.json';
import { mapCenterTileXy, tilePixelSize } from '../config';
import { tileXyToWgs84 } from '../utils/wgs84ToTileXy';
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
            title: { en: 'Map picking tool' },
            categories: ['Geography', 'Productivity'],
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
                    // TODO: Pick only the needed systems
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
                    touchController.touches.subscribe(async (touch) => {
                        const pointOnScreen = touch.firstFrame.position;
                        const pointOnBoard = collSpace.pickPoint(pointOnScreen).point;
                        const pointAsTileXy = pointOnBoard.divide(tilePixelSize).add(mapCenterTileXy);
                        const pointAsWgs84 = tileXyToWgs84(pointAsTileXy);

                        // TODO: !!! Remove all console.logs
                        // console.log({ pointOnScreen, pointOnBoard, pointAsTileXy, pointAsWgs84 });

                        const notification = notificationSystem.publish({
                            type: 'info',
                            tag: `picked-point-${touch.firstFrame.position}`,
                            title: 'Picked point on map!',
                            body: `You have picked point ${touch.firstFrame.position} on the map.`,
                            canBeClosed: true,
                        });

                        const polygonArt = new MapPolygonArt([pointOnBoard, pointOnBoard.add({ x: 10 })], 'blue', 20);
                        const operation = materialArtVersioningSystem
                            .createPrimaryOperation()
                            .newArts(polygonArt)
                            .persist();

                        await forTime(1000);

                        notification.destroy();
                        operation.destroy();
                    }),
                );
            },
        },
    });
});
