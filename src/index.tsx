import { declareModule, ImageArt } from '@collboard/modules-sdk';
import { Registration } from 'destroyable';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Promisable } from 'type-fest';
import { forTime } from 'waitasecond';
import { Vector } from 'xyzt';
import helloWorldIcon from '../assets/hello-world-icon.png';
import { contributors, description, license, repository, version } from '../package.json';
import { MapPolygonArt } from './MapPolygonArt';

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
        const { virtualArtVersioningSystem, appState } = await systems.request(
            'virtualArtVersioningSystem',
            'appState',
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

        return registration;
    },
});

// TODO: Move to separate utils folder / file
// TODO: isEqual
function observeByHeartbeat<T>({
    getValue,
    waiter,
}: {
    getValue: () => T;
    waiter?: () => Promise<void>;
}): BehaviorSubject<T>;

function observeByHeartbeat<T>({
    getValue,
    waiter,
}: {
    getValue: () => Promise<T>;
    waiter?: () => Promise<void>;
}): Observable<T>;
function observeByHeartbeat<T>({
    getValue,
    waiter,
}: {
    getValue: () => Promisable<T>;
    waiter?: () => Promise<void>;
}): Observable<T> {
    waiter = waiter || forTime.bind(null, 100);

    const initialValue = getValue();
    let subject: Subject<T>;
    if (initialValue instanceof Promise) {
        subject = new Subject<T>();
        initialValue.then((initialValueResolved) => subject.next(initialValueResolved));
    } else {
        subject = new BehaviorSubject<T>(initialValue as T);
    }
    (async () => {
        while (true) {
            await waiter();
            subject.next(await getValue());
        }
    })();

    return subject;
}

function wgs84ToTileXy({ coordinatesWgs84, zoom }: { coordinatesWgs84: Vector; zoom: number }): {
    position: Vector;
    remainder: Vector;
} {
    const tileXy = new Vector(
        ((coordinatesWgs84.x + 180) / 360) * Math.pow(2, zoom),
        ((1 -
            Math.log(
                Math.tan((coordinatesWgs84.y * Math.PI) / 180) + 1 / Math.cos((coordinatesWgs84.y * Math.PI) / 180),
            ) /
                Math.PI) /
            2) *
            Math.pow(2, zoom),
    );

    const position = tileXy.map(Math.floor);
    return { position, remainder: position.subtract(tileXy) };
}

/**
 * TODO: Should be here explicitelly installed `destroyable`  library
 * TODO: XYZT 2D forEach
 * TODO: XYZT semantic coordinates (latitude, longitude) with conversion
 * TODO: Provide newer RxJS API from appState
 * TODO: Export basic arts to SDK - like FreehandArt, ImageArt, TextArt,...
 * TODO: All Subscriptions to destroyable
 */
