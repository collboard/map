export function isNumeric(str: string): boolean {
    return /^-?\d+(\.\d+)?$/.test(str);
}
