import { declareModule, makeIconModuleOnModule, React, ToolbarName } from '@collboard/modules-sdk';
import { Registration } from 'destroyable';
import helloWorldIcon from '../../assets/hello-world-icon.png';
import { contributors, description, license, repository, version } from '../../package.json';
import { MAP_BASE, TILE_SIZE } from '../config';
import { TileAbsolute } from '../semantic/TileAbsolute';

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
                isHidden: true,
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

                const mapCenterTile = TileAbsolute.fromWgs84(MAP_BASE);

                return Registration.fromSubscription((registerAdditionalSubscription) =>
                    touchController.touches.subscribe(async (touch) => {
                        const pointOnScreen = touch.firstFrame.position;
                        const pointOnBoard = collSpace.pickPoint(pointOnScreen).point;
                        const pointAsTile = new TileAbsolute(pointOnBoard.divide(TILE_SIZE).add(mapCenterTile));
                        const pointAsWgs84 = pointAsTile.toWgs84();

                        // TODO: !!! pointAsTile is incorrect according to the zoom level

                        const notification = notificationSystem.publish({
                            type: 'info',
                            tag: `picked-point-${touch.firstFrame.position}`,
                            title: 'Picked point on map!',
                            body: (
                                <>
                                    <b>You have picked:</b>
                                    <ul>
                                        <li>point {pointOnScreen.toString()} on the screen</li>
                                        <li>point {pointOnBoard.toString()} on the board</li>
                                        <li>tile {pointAsTile.toString()}</li>
                                        <li>coordinate {pointAsWgs84.toString()} on the map</li>
                                    </ul>
                                </>
                            ),

                            canBeClosed: true,
                        });

                        /*
                        const polygonArt = new MapPolygonArt([pointOnBoard, pointOnBoard.add({ x: 10 })], 'blue', 20);
                        const operation = materialArtVersioningSystem
                            .createPrimaryOperation()
                            .newArts(polygonArt)
                            .persist();

                        await forEver();
                        await forTime(10000);

                        notification.destroy();
                        operation.destroy();

                        */
                    }),
                );
            },
        },
    });
});

/**
 * TODO: !!! Remove all console.logs
 */
