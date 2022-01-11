import { Vector } from 'xyzt';

export function getUserGeolocation(): Promise<Vector> {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;

                    resolve(new Vector(longitude, latitude));
                },
                () => {
                    reject(new Error(`Unable to retrieve your location`));
                },
            );
        } else {
            reject(new Error(`Browser does not support "navigator.geolocation".`));
        }
    });
}
