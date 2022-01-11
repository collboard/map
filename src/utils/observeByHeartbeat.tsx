import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Promisable } from 'type-fest';
import { forTime } from 'waitasecond';

// TODO: !!! isEqual
export function observeByHeartbeat<T>({
    getValue,
    waiter,
}: {
    getValue: () => T;
    waiter?: () => Promise<void>;
}): BehaviorSubject<T>;

export function observeByHeartbeat<T>({
    getValue,
    waiter,
}: {
    getValue: () => Promise<T>;
    waiter?: () => Promise<void>;
}): Observable<T>;
export function observeByHeartbeat<T>({
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
