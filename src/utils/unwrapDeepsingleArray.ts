export type IDeepsingleArray<T> = T | [IDeepsingleArray<T>];

export function unwrapDeepsingleArray<T>(deepsingleArray: IDeepsingleArray<T>): T {
    if (Array.isArray(deepsingleArray) && deepsingleArray.length === 1) {
        return unwrapDeepsingleArray(deepsingleArray[0]);
    } else {
        return deepsingleArray as T;
    }
}

/*
Some samples what is IDeepsingleArray

const a: IDeepsingleArray<number> = [1];
const b: IDeepsingleArray<number> = [[1]];
const c: IDeepsingleArray<number> = [[[[[[[[[[[[[[[1]]]]]]]]]]]]]]];
const d: IDeepsingleArray<[number, number]> = [[[[[[[[[[[[[[[1, 1]]]]]]]]]]]]]]];

*/

/**
 *
 * TODO: !!! Probbably remove the file
 */
