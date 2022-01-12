import { declareModule, ImageArt } from '@collboard/modules-sdk';
import { Registration } from 'destroyable';
import { Vector } from 'xyzt';
import helloWorldIcon from '../../assets/hello-world-icon.png';
import { contributors, description, license, repository, version } from '../../package.json';
import { observeByHeartbeat } from '../utils/observeByHeartbeat';
import { tileXyToWgs84, wgs84ToTileXy } from '../utils/wgs84ToTileXy';
import { MapPolygonArt } from './map-polygon-art';

declareModule({
    manifest: {
        name: '@collboard/map',
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
    async setup(systems) {
        const {
            // TODO: Pick only the needed systems
            virtualArtVersioningSystem,
            appState,
            touchController,
            materialArtVersioningSystem,
            collSpace,
            notificationSystem,
        } = await systems.request(
            'virtualArtVersioningSystem',
            'appState',
            'touchController',
            'virtualArtVersioningSystem',
            'materialArtVersioningSystem',
            'collSpace',
            'notificationSystem',
        );

        // TODO: If constants to UPPERCASE and config

        const tilePixelSize = Vector.square(256 /* TODO: Make some seam-padding */);
        const tileCount = new Vector(6, 4 /* TODO: Count based on screen size (appState.windowSize) and tileSize */);

        //const mapProvider = new URL('https://tile-a.openstreetmap.fr/hot');
        const mapProvider = new URL('https://tile-c.openstreetmap.fr/cyclosm');
        const mapZoom = 17;
        const mapCenterWgs84 = new Vector(14.4378005 /* Longitude  */, 50.0755381 /* Latitude  */);

        const { position: mapCenterTileXy, remainder: mapCenterTileXyRemainder } = wgs84ToTileXy({
            coordinatesWgs84: mapCenterWgs84,
            zoom: mapZoom,
        }); // new Vector(133, 83 /* Reverse */);

        const registration = Registration.void();

        for (let y = 0; y < tileCount.y; y++) {
            for (let x = 0; x < tileCount.x; x++) {
                const tileCoords = new Vector(x, y);
                const tileArt = new ImageArt(
                    // TODO: Map server and type provider
                    `${mapProvider.href}/${mapZoom}/${tileCoords
                        .add(mapCenterTileXy)
                        .subtract(tileCount.half())
                        .toArray2D()

                        .join('/')}.png`,
                    'Map tile',
                );

                tileArt.defaultZIndex = -1;
                tileArt.setShift(
                    tileCoords.subtract(tileCount.half()).add(mapCenterTileXyRemainder).multiply(tilePixelSize),
                );

                registration.addSubdestroyable(
                    virtualArtVersioningSystem.createPrimaryOperation().newArts(tileArt).persist(),
                );
            }
        }

        observeByHeartbeat({ getValue: () => appState.transform }).subscribe(() => {
            const polygonArt = new MapPolygonArt(
                [appState.transform.translate.negate(), appState.transform.translate.negate().add({ x: 10 })],
                'blue',
                20,
            );

            registration.addSubdestroyable(
                virtualArtVersioningSystem.createPrimaryOperation().newArts(polygonArt).persist(),
            );
        });

        registration.addSubdestroyable(
            Registration.fromSubscription((registerAdditionalSubscription) =>
                touchController.touches.subscribe((touch) => {
                    const pointOnScreen = touch.firstFrame.position;
                    const pointOnBoard = collSpace.pickPoint(pointOnScreen).point;
                    const pointAsTileXy = pointOnBoard.divide(tilePixelSize).add(mapCenterTileXy);
                    const { coordinatesWgs84: pointAsWgs84 } = tileXyToWgs84({
                        tilePosition: pointAsTileXy,
                        zoom: mapZoom,
                    });

                    console.log({ pointOnScreen, pointOnBoard, pointAsTileXy, pointAsWgs84 });

                    notificationSystem.publish({
                        type: 'info',
                        tag: `picked-point-${touch.firstFrame.position}`,
                        title: 'Picked point on map!',
                        body: `You have picked point ${pointAsWgs84.toString2D()} on the map.`,
                        canBeClosed: true,
                        href: `https://en.mapy.cz/zakladni?x=${pointAsWgs84.x}&y=${pointAsWgs84.y}&z=${mapZoom}&source=coor&id=${pointAsWgs84.x}%2C${pointAsWgs84.y}`,
                    });

                    const polygonArt = new MapPolygonArt([pointOnBoard, pointOnBoard.add({ x: 10 })], 'blue', 20);

                    materialArtVersioningSystem.createPrimaryOperation().newArts(polygonArt).persist();
                }),
            ),
        );

        return registration;
    },
});
