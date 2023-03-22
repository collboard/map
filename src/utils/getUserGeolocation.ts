import { Wgs84 } from '../semantic/Wgs84';

export function getUserGeolocation(): Promise<Wgs84> {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;

                    resolve(new Wgs84(longitude, latitude));
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
